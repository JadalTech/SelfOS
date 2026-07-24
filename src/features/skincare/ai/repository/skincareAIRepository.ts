import { ok, err } from '../../../../shared/types';
import type { Result } from '../../../../shared/types';
import { AppError } from '../../../../shared/errors/AppError';
import type { SkinAIContext, SkinRecommendation, SkinWeeklyReview, SkinChatMessage } from '../types/ai.types';
import { skincareAIService, SkincareAIService } from '../services/skincareAI.service';
import { SkinAIProviderFactory, ProviderType } from '../providers/providerFactory';
import { RuleRecommendationEngine } from '../engine/ruleRecommendationEngine';
import { aiRequestManager } from '../utils/requestManager';

export class SkincareAIRepository {
  constructor(private readonly service: SkincareAIService = skincareAIService) {}

  async fetchConversation(userId: string): Promise<Result<SkinChatMessage[], AppError>> {
    try {
      const messages = await this.service.fetchConversation(userId);
      return ok(messages);
    } catch (error) {
      return err(new AppError('FIREBASE_ERROR', 'Failed to fetch skin coach conversation', { originalError: error }));
    }
  }

  async askCoach(
    userId: string,
    question: string,
    context: SkinAIContext,
    providerType: ProviderType = 'heuristic'
  ): Promise<Result<SkinChatMessage, AppError>> {
    try {
      if (!aiRequestManager.checkCooldown(`ask_${userId}`)) {
        return err(new AppError('AI_COOLDOWN', 'Please wait a moment before sending another message'));
      }

      const provider = SkinAIProviderFactory.getProvider(providerType);

      // Save user question first
      const userMessage: SkinChatMessage = {
        id: `msg_user_${Date.now()}`,
        sender: 'user',
        text: question,
        timestamp: new Date(),
        providerName: provider.name,
      };
      await this.service.saveMessage(userId, userMessage);

      // Generate AI response
      const answerText = await provider.askCoach(question, context);

      const aiMessage: SkinChatMessage = {
        id: `msg_ai_${Date.now()}`,
        sender: 'ai',
        text: answerText,
        timestamp: new Date(),
        providerName: provider.name,
      };
      await this.service.saveMessage(userId, aiMessage);

      return ok(aiMessage);
    } catch (error) {
      return err(new AppError('AI_SERVICE_ERROR', 'Failed to generate AI Coach response', { originalError: error }));
    }
  }

  async generateRecommendations(
    userId: string,
    context: SkinAIContext,
    providerType: ProviderType = 'heuristic'
  ): Promise<Result<SkinRecommendation[], AppError>> {
    try {
      // Stage 1: Objective Rule-Based Detection
      const stage1Recs = RuleRecommendationEngine.detectRecommendations(context);

      // Stage 2: Provider AI Personalization & Prioritization
      const provider = SkinAIProviderFactory.getProvider(providerType);
      const finalRecs = await provider.generateRecommendations(context, stage1Recs);

      await this.service.saveRecommendations(userId, finalRecs);
      return ok(finalRecs);
    } catch (error) {
      return err(new AppError('AI_SERVICE_ERROR', 'Failed to generate skin recommendations', { originalError: error }));
    }
  }

  async generateWeeklyReview(
    _userId: string,
    context: SkinAIContext,
    providerType: ProviderType = 'heuristic'
  ): Promise<Result<SkinWeeklyReview, AppError>> {
    try {
      const provider = SkinAIProviderFactory.getProvider(providerType);
      const review = await provider.generateWeeklyReview(context);
      return ok(review);
    } catch (error) {
      return err(new AppError('AI_SERVICE_ERROR', 'Failed to generate weekly review', { originalError: error }));
    }
  }

  async clearConversation(userId: string): Promise<Result<void, AppError>> {
    try {
      await this.service.clearConversation(userId);
      return ok(undefined);
    } catch (error) {
      return err(new AppError('FIREBASE_ERROR', 'Failed to clear conversation', { originalError: error }));
    }
  }
}

export const skincareAIRepository = new SkincareAIRepository();
