import type { SleepAIContext, SleepRecommendation, SleepWeeklyReview } from '../types/sleepAI.types';

export interface ISleepAIProvider {
  readonly name: string;
  askCoach(question: string, context: SleepAIContext): Promise<string>;
  generateRecommendations(context: SleepAIContext): Promise<SleepRecommendation[]>;
  generateWeeklyReview(context: SleepAIContext): Promise<SleepWeeklyReview>;
}
