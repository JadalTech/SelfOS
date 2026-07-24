import { ok, err } from '../../../../shared/types';
import type { Result } from '../../../../shared/types';
import { AppError } from '../../../../shared/errors/AppError';
import type { NutritionAIContext, NutritionChatMessage } from '../types/nutritionAI.types';
import type { AIRecommendation, AIWeeklyReview } from '../../../../shared/types/ai.types';
import { nutritionAIService, NutritionAIService } from '../services/nutritionAIService';
import { NutritionAIProviderFactory, ProviderType } from '../providers/providerFactory';
import { aiRequestManager } from '../utils/requestManager';

export class NutritionAIRepository {
  constructor(private readonly service: NutritionAIService = nutritionAIService) {}

  async fetchConversation(userId: string): Promise<Result<NutritionChatMessage[], AppError>> {
    try {
      const messages = await this.service.fetchConversation(userId);
      return ok(messages);
    } catch (error) {
      return err(new AppError('FIREBASE_ERROR', 'Failed to fetch nutrition coach conversation', { originalError: error }));
    }
  }

  async askCoach(
    userId: string,
    question: string,
    context: NutritionAIContext,
    providerType: ProviderType = 'heuristic'
  ): Promise<Result<NutritionChatMessage, AppError>> {
    try {
      if (!aiRequestManager.checkCooldown(`ask_${userId}`)) {
        return err(new AppError('AI_COOLDOWN', 'Please wait a moment before sending another message'));
      }

      const provider = NutritionAIProviderFactory.getProvider(providerType);

      // Save user question
      const userMessage: NutritionChatMessage = {
        id: `msg_user_${Date.now()}`,
        sender: 'user',
        text: question,
        timestamp: new Date(),
        providerName: provider.name,
      };
      await this.service.saveMessage(userId, userMessage);

      // Generate AI response
      const answerText = await provider.askCoach(question, context);

      const aiMessage: NutritionChatMessage = {
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
    context: NutritionAIContext,
    providerType: ProviderType = 'heuristic'
  ): Promise<Result<AIRecommendation[], AppError>> {
    try {
      const provider = NutritionAIProviderFactory.getProvider(providerType);
      const finalRecs = await provider.generateRecommendations(context);

      await this.service.saveRecommendations(userId, finalRecs);
      return ok(finalRecs);
    } catch (error) {
      return err(new AppError('AI_SERVICE_ERROR', 'Failed to generate nutrition recommendations', { originalError: error }));
    }
  }

  async generateWeeklyReview(
    _userId: string,
    context: NutritionAIContext,
    providerType: ProviderType = 'heuristic'
  ): Promise<Result<AIWeeklyReview, AppError>> {
    try {
      const provider = NutritionAIProviderFactory.getProvider(providerType);
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
      return err(new AppError('FIREBASE_ERROR', 'Failed to clear conversation history', { originalError: error }));
    }
  }
}

export const nutritionAIRepository = new NutritionAIRepository();
