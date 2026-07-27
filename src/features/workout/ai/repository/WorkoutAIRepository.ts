/**
 * Workout AI Repository Facade
 */

import { ok, err } from '../../../../shared/types';
import type { Result } from '../../../../shared/types';
import { AppError } from '../../../../shared/errors/AppError';
import type { WorkoutAIContext, WorkoutChatMessage } from '../types/workoutAI.types';
import type { AIRecommendation, AIWeeklyReview } from '../../../../shared/types/ai.types';
import { workoutAIService, WorkoutAIService } from '../services/workoutAIService';
import { WorkoutAIProviderFactory, ProviderType } from '../providers/providerFactory';
import { aiRequestManager } from '../utils/requestManager';

export class WorkoutAIRepository {
  constructor(private readonly service: WorkoutAIService = workoutAIService) {}

  async fetchConversation(userId: string): Promise<Result<WorkoutChatMessage[], AppError>> {
    try {
      const messages = await this.service.fetchConversation(userId);
      return ok(messages);
    } catch (error) {
      return err(new AppError('FIREBASE_ERROR', 'Failed to fetch workout coach conversation', { originalError: error }));
    }
  }

  async askCoach(
    userId: string,
    question: string,
    context: WorkoutAIContext,
    providerType: ProviderType = 'heuristic'
  ): Promise<Result<WorkoutChatMessage, AppError>> {
    try {
      // 1. Enforce cooldown and duplicate prevention
      if (!aiRequestManager.checkCooldown(`ask_${userId}`)) {
        return err(new AppError('AI_COOLDOWN', 'Please wait a moment before sending another message'));
      }

      const provider = WorkoutAIProviderFactory.getProvider(providerType);

      // 2. Save user message
      const userMessage: WorkoutChatMessage = {
        id: `msg_user_${Date.now()}`,
        sender: 'user',
        text: question,
        timestamp: new Date(),
        providerName: provider.name,
      };
      await this.service.saveMessage(userId, userMessage);

      // 3. Generate response with timeout safety
      const startTime = Date.now();
      const answerText = await aiRequestManager.withTimeout(
        provider.askCoach(question, context)
      );
      const latencyMs = Date.now() - startTime;

      // 4. Save AI response
      const aiMessage: WorkoutChatMessage = {
        id: `msg_ai_${Date.now()}`,
        sender: 'ai',
        text: answerText,
        timestamp: new Date(),
        providerName: provider.name,
        latencyMs,
      };
      await this.service.saveMessage(userId, aiMessage);

      return ok(aiMessage);
    } catch (error: any) {
      return err(new AppError('AI_SERVICE_ERROR', error?.message || 'Failed to generate AI Coach response', { originalError: error }));
    }
  }

  async generateRecommendations(
    userId: string,
    context: WorkoutAIContext,
    providerType: ProviderType = 'heuristic'
  ): Promise<Result<AIRecommendation[], AppError>> {
    try {
      const provider = WorkoutAIProviderFactory.getProvider(providerType);
      
      const recs = await aiRequestManager.withTimeout(
        provider.generateRecommendations(context)
      );

      await this.service.saveRecommendations(userId, recs);
      return ok(recs);
    } catch (error: any) {
      return err(new AppError('AI_SERVICE_ERROR', error?.message || 'Failed to generate workout recommendations', { originalError: error }));
    }
  }

  async generateWeeklyReview(
    _userId: string,
    context: WorkoutAIContext,
    providerType: ProviderType = 'heuristic'
  ): Promise<Result<AIWeeklyReview, AppError>> {
    try {
      const provider = WorkoutAIProviderFactory.getProvider(providerType);
      
      const review = await aiRequestManager.withTimeout(
        provider.generateWeeklyReview(context)
      );
      return ok(review);
    } catch (error: any) {
      return err(new AppError('AI_SERVICE_ERROR', error?.message || 'Failed to generate weekly training review', { originalError: error }));
    }
  }

  async clearConversation(userId: string): Promise<Result<void, AppError>> {
    try {
      await this.service.clearConversation(userId);
      return ok(undefined);
    } catch (error) {
      return err(new AppError('FIREBASE_ERROR', 'Failed to clear conversation history', { originalError: error }));
    }
  }
}

export const workoutAIRepository = new WorkoutAIRepository();
