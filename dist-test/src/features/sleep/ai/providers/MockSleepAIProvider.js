"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MockSleepAIProvider = void 0;
class MockSleepAIProvider {
    name = 'mock';
    async askCoach(question, context) {
        return `[Mock response to: "${question}"] As your mock coach, I notice your sleep debt is ${context.sleepDebt}m. Continue tracking daily!`;
    }
    async generateRecommendations(context) {
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
    async generateWeeklyReview(context) {
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
exports.MockSleepAIProvider = MockSleepAIProvider;
