/**
 * Workout AI Provider Interface
 */

import type { WorkoutAIContext } from '../types/workoutAI.types';
import type { AIRecommendation, AIWeeklyReview } from '../../../../shared/types/ai.types';

export interface IWorkoutAIProvider {
  readonly name: string;

  askCoach(question: string, context: WorkoutAIContext): Promise<string>;

  generateRecommendations(context: WorkoutAIContext): Promise<AIRecommendation[]>;

  generateWeeklyReview(context: WorkoutAIContext): Promise<AIWeeklyReview>;
}
