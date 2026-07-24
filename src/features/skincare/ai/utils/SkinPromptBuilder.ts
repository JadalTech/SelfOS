import type { SkinAIContext, SkinRecommendation } from '../types/ai.types';
import { getSystemPrompt } from './PromptTemplates/SystemPrompt';
import { getChatPrompt } from './PromptTemplates/ChatPrompt';
import { getRecommendationPrompt } from './PromptTemplates/RecommendationPrompt';
import { getWeeklyReviewPrompt } from './PromptTemplates/WeeklyReviewPrompt';

export class SkinPromptBuilder {
  static buildSystemPrompt(): string {
    return getSystemPrompt();
  }

  static buildChatPrompt(question: string, context: SkinAIContext): string {
    return getChatPrompt(question, context);
  }

  static buildRecommendationPrompt(context: SkinAIContext, ruleRecommendations?: SkinRecommendation[]): string {
    return getRecommendationPrompt(context, ruleRecommendations);
  }

  static buildWeeklyReviewPrompt(context: SkinAIContext): string {
    return getWeeklyReviewPrompt(context);
  }
}
