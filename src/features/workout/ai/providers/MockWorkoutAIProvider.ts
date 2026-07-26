/**
 * Mock Workout AI Provider for tests and sandbox environments
 */

import type { IWorkoutAIProvider } from './IWorkoutAIProvider';
import type { WorkoutAIContext } from '../types/workoutAI.types';
import type { AIRecommendation, AIWeeklyReview } from '../../../../shared/types/ai.types';

export class MockWorkoutAIProvider implements IWorkoutAIProvider {
  readonly name = 'mock';

  async askCoach(question: string, context: WorkoutAIContext): Promise<string> {
    return `[Mock response] You asked: "${question}". Current streak: ${context.workoutStreak} days. Keep pushing!\n\nTrainer Disclaimer: Educational coaching advice only. Consult a physician, certified trainer, or physical therapist before starting any new exercise split or training plan.`;
  }

  async generateRecommendations(context: WorkoutAIContext): Promise<AIRecommendation[]> {
    return [
      {
        id: 'mock_rec_overload',
        title: '[Mock] Incremental Overload Progression',
        summary: `Excellent consistency with ${context.workoutStreak} active days. Try increasing weight on compound split splits.`,
        targetConcern: 'Progressive Overload',
        actionableSteps: [
          'Add 2.5kg to your squats and bench press splits.',
          'Focus on completing 8 clean reps at the new weight.'
        ],
        confidenceScore: 0.9,
      },
    ];
  }

  async generateWeeklyReview(context: WorkoutAIContext): Promise<AIWeeklyReview> {
    return {
      id: `mock_review_${Date.now()}`,
      dateRange: 'Past 7 Days',
      summary: `[Mock Review] Solid training week! You completed ${context.weeklyFrequency} workouts.`,
      highlights: ['Logged volume trends successfully.', 'Maintained target splits schedules.'],
      areasToImprove: ['Aim for 48 hours recovery on heavy worked groups.'],
      scoreChangeLabel: '+250kg volume vs last week',
    };
  }
}
