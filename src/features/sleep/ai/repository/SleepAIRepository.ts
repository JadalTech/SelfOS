import { ok, err } from '@/shared/types';
import type { Result } from '@/shared/types';
import { AppError } from '@/shared/errors/AppError';
import type { SleepChatMessage, SleepRecommendation, SleepWeeklyReview, SleepAIContext } from '../types/sleepAI.types';
import { SleepContextBuilder } from '../utils/SleepContextBuilder';
import { SleepAIProviderFactory, ProviderType } from '../providers/providerFactory';
import { sleepAIService } from '../services/sleepAI.service';
import { sleepAIRequestManager } from '../utils/requestManager';
import {
  sleepRepository,
  sleepScheduleRepository,
  sleepGoalRepository,
} from '../../repository/sleep.repository';
import { sleepAnalyticsService } from '../../services/sleepAnalytics.service';

export class SleepAIRepository {
  constructor(
    private readonly service = sleepAIService,
    private readonly requestManager = sleepAIRequestManager
  ) {}

  /**
   * Compiles the sleep context by loading all dependencies in parallel.
   * Resilient to individual repository failures by falling back to empty/null values.
   */
  async compileContext(userId: string): Promise<SleepAIContext> {
    const end = new Date();
    const start = new Date();
    start.setDate(end.getDate() - 6);

    const formatDate = (d: Date) => d.toISOString().split('T')[0];
    const weekStart = formatDate(start);
    const weekEnd = formatDate(end);
    const year = end.getFullYear();
    const month = end.getMonth() + 1;

    const [
      entriesRes,
      schedulesRes,
      goalsRes,
    ] = await Promise.all([
      sleepRepository.fetchEntries(userId, 30),
      sleepScheduleRepository.fetchSchedules(userId),
      sleepGoalRepository.fetchGoals(userId),
    ]);

    const entries = entriesRes.success ? entriesRes.data : [];
    const schedules = schedulesRes.success ? schedulesRes.data : [];
    const activeSchedule = schedules.find((s) => s.isActive) || null;
    const goals = goalsRes.success ? goalsRes.data : [];

    // Calculate weekly and monthly summaries from loaded raw database entries
    const weeklySummary = activeSchedule
      ? sleepAnalyticsService.calculateWeeklySummary(userId, entries, activeSchedule, goals, weekStart, weekEnd)
      : null;

    const monthlySummary = activeSchedule
      ? sleepAnalyticsService.calculateMonthlySummary(userId, entries, activeSchedule, goals, year, month)
      : null;

    // Resolve sleep debt and recovery from latest values
    const sleepDebt = weeklySummary
      ? { userId, date: weekEnd, sleepDebtMinutes: weeklySummary.averageSleepDebtMinutes, dailyDeficitMinutes: 0, calculatedAt: new Date() }
      : null;
    const recovery = weeklySummary
      ? { userId, date: weekEnd, recoveryScore: weeklySummary.averageRecoveryScore, status: 'good' as const, components: { durationScore: 0, qualityScore: 0, consistencyScore: 0, debtPenalty: 0 }, calculatedAt: new Date() }
      : null;

    return SleepContextBuilder.buildContext({
      entries,
      schedule: activeSchedule,
      goals,
      recovery,
      sleepDebt,
      weeklySummary,
      monthlySummary,
    });
  }

  /**
   * Sends a message to the AI coach.
   */
  async askCoach(
    userId: string,
    conversationId: string,
    question: string,
    providerType: ProviderType = 'heuristic'
  ): Promise<Result<SleepChatMessage, AppError>> {
    const requestKey = `chat_${userId}_${conversationId}`;

    try {
      // 1. Compile context
      const context = await this.compileContext(userId);

      // 2. Save the user's message to Firestore
      const userMessage: SleepChatMessage = {
        id: `msg_user_${Date.now()}`,
        conversationId,
        sender: 'user',
        text: question,
        timestamp: new Date(),
      };
      await this.service.saveMessage(userId, conversationId, userMessage);

      // 3. Resolve AI provider and execute request via manager (with Fallback Coordination)
      let provider = SleepAIProviderFactory.getProvider(providerType);
      let aiText = '';
      let latencyMs = 0;
      const startTime = Date.now();

      try {
        aiText = await this.requestManager.execute(
          requestKey,
          async () => {
            return await provider.askCoach(question, context);
          },
          { cooldownMs: 1500, timeoutMs: 15000 }
        );
        latencyMs = Date.now() - startTime;
      } catch (error) {
        if (providerType === 'gemini') {
          // Coordinate fallback to heuristic
          provider = SleepAIProviderFactory.getProvider('heuristic');
          aiText = await this.requestManager.execute(
            requestKey,
            async () => {
              return await provider.askCoach(question, context);
            },
            { cooldownMs: 0, timeoutMs: 15000 }
          );
          latencyMs = Date.now() - startTime;
        } else {
          throw error;
        }
      }

      // 4. Save and return the AI's response message
      const aiMessage: SleepChatMessage = {
        id: `msg_ai_${Date.now()}`,
        conversationId,
        sender: 'ai',
        text: aiText,
        timestamp: new Date(),
        providerName: provider.name,
        latencyMs,
      };

      await this.service.saveMessage(userId, conversationId, aiMessage);
      return ok(aiMessage);
    } catch (error: any) {
      const normalized = error instanceof AppError
        ? error
        : new AppError('AI_SERVICE_ERROR', error.message || 'Failed to get response from AI Coach', { originalError: error });
      return err(normalized);
    }
  }

  /**
   * Generates sleep recommendations based on context.
   */
  async generateRecommendations(
    userId: string,
    providerType: ProviderType = 'heuristic'
  ): Promise<Result<SleepRecommendation[], AppError>> {
    const requestKey = `recs_${userId}`;

    try {
      const context = await this.compileContext(userId);
      let provider = SleepAIProviderFactory.getProvider(providerType);
      let recommendations: SleepRecommendation[] = [];

      try {
        recommendations = await this.requestManager.execute(
          requestKey,
          async () => {
            return await provider.generateRecommendations(context);
          },
          { cooldownMs: 3000, timeoutMs: 15000 }
        );
      } catch (error) {
        if (providerType === 'gemini') {
          // Coordinate fallback to heuristic
          provider = SleepAIProviderFactory.getProvider('heuristic');
          recommendations = await this.requestManager.execute(
            requestKey,
            async () => {
              return await provider.generateRecommendations(context);
            },
            { cooldownMs: 0, timeoutMs: 15000 }
          );
        } else {
          throw error;
        }
      }

      // Save mapped provider name to recommendations
      const mappedRecs = recommendations.map((r) => ({
        ...r,
        providerName: provider.name,
      }));

      await this.service.saveRecommendations(userId, mappedRecs);
      return ok(mappedRecs);
    } catch (error: any) {
      const normalized = error instanceof AppError
        ? error
        : new AppError('AI_SERVICE_ERROR', error.message || 'Failed to generate sleep recommendations', { originalError: error });
      return err(normalized);
    }
  }

  /**
   * Generates the weekly review.
   */
  async generateWeeklyReview(
    userId: string,
    providerType: ProviderType = 'heuristic'
  ): Promise<Result<SleepWeeklyReview, AppError>> {
    const requestKey = `review_${userId}`;

    try {
      const context = await this.compileContext(userId);
      let provider = SleepAIProviderFactory.getProvider(providerType);
      let review: SleepWeeklyReview;

      try {
        review = await this.requestManager.execute(
          requestKey,
          async () => {
            return await provider.generateWeeklyReview(context);
          },
          { cooldownMs: 5000, timeoutMs: 15000 }
        );
      } catch (error) {
        if (providerType === 'gemini') {
          // Coordinate fallback to heuristic
          provider = SleepAIProviderFactory.getProvider('heuristic');
          review = await this.requestManager.execute(
            requestKey,
            async () => {
              return await provider.generateWeeklyReview(context);
            },
            { cooldownMs: 0, timeoutMs: 15000 }
          );
        } else {
          throw error;
        }
      }

      const mappedReview = {
        ...review,
        providerName: provider.name,
      };

      await this.service.saveWeeklyReview(userId, mappedReview);
      return ok(mappedReview);
    } catch (error: any) {
      const normalized = error instanceof AppError
        ? error
        : new AppError('AI_SERVICE_ERROR', error.message || 'Failed to generate weekly sleep review', { originalError: error });
      return err(normalized);
    }
  }
}

export const sleepAIRepository = new SleepAIRepository();
