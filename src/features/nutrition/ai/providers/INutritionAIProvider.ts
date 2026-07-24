import type { NutritionAIContext } from '../types/nutritionAI.types';
import type { AIRecommendation, AIWeeklyReview } from '../../../../shared/types/ai.types';

export interface INutritionAIProvider {
  readonly name: string;

  askCoach(question: string, context: NutritionAIContext): Promise<string>;

  streamResponse?(
    question: string,
    context: NutritionAIContext,
    onChunk: (chunkText: string) => void,
    signal?: AbortSignal
  ): Promise<string>;

  generateRecommendations(context: NutritionAIContext): Promise<AIRecommendation[]>;

  generateWeeklyReview(context: NutritionAIContext): Promise<AIWeeklyReview>;
}
