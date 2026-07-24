import type { SkinAIContext, SkinRecommendation, SkinWeeklyReview } from '../types/ai.types';

export interface ISkinAIProvider {
  readonly name: string;

  askCoach(question: string, context: SkinAIContext): Promise<string>;

  streamResponse?(
    question: string,
    context: SkinAIContext,
    onChunk: (chunkText: string) => void,
    signal?: AbortSignal
  ): Promise<string>;

  generateRecommendations(
    context: SkinAIContext,
    ruleRecommendations?: SkinRecommendation[]
  ): Promise<SkinRecommendation[]>;

  generateWeeklyReview(context: SkinAIContext): Promise<SkinWeeklyReview>;
}
