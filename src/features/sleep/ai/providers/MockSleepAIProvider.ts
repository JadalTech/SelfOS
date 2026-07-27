import type { ISleepAIProvider } from './ISleepAIProvider';
import type { SleepAIContext, SleepRecommendation, SleepWeeklyReview } from '../types/sleepAI.types';

export class MockSleepAIProvider implements ISleepAIProvider {
  readonly name = 'mock';

  async askCoach(question: string, context: SleepAIContext): Promise<string> {
    return `[Mock response to: "${question}"] As your mock coach, I notice your sleep debt is ${context.sleepDebt}m. Continue tracking daily!`;
  }

  async generateRecommendations(context: SleepAIContext): Promise<SleepRecommendation[]> {
    return [
      {
        id: 'rec_mock_1',
        title: 'Mock Sleep Recommendation',
        summary: 'This is a mock sleep advice card. Continue consistency tracking.',
        targetConcern: 'Mock Concern',
        recommendedCategory: 'hygiene',
        category: 'hygiene',
        priority: 'low',
        actionableSteps: ['Step 1 mock', 'Step 2 mock'],
        confidenceScore: 0.99,
      },
    ];
  }

  async generateWeeklyReview(context: SleepAIContext): Promise<SleepWeeklyReview> {
    return {
      id: 'mock_weekly_review_id',
      dateRange: 'Jul 21 - Jul 27',
      summary: 'Mock weekly summary showing healthy sleep parameters.',
      highlights: ['Mock highlight: average sleep 8 hours.'],
      areasToImprove: ['Mock improvement: go to bed 10m earlier.'],
      scoreChangeLabel: '+2% vs last week',
      healthScore: 8,
    };
  }
}
