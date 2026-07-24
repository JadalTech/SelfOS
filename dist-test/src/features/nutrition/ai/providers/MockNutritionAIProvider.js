"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MockNutritionAIProvider = void 0;
class MockNutritionAIProvider {
    name = 'mock';
    async askCoach(question, context) {
        return `[Mock Reply] This is a mock response to your question: "${question}". Goals calorie budget: ${context.dailyGoals.calories} kcal.`;
    }
    async generateRecommendations(context) {
        return [
            {
                id: 'mock_rec_1',
                title: 'Include Whole Eggs',
                summary: 'Eggs provide high biological protein and healthy fat profiles.',
                targetConcern: 'Protein Source',
                actionableSteps: ['Eat 2 whole boiled eggs with breakfast.'],
                confidenceScore: 0.95,
            },
        ];
    }
    async generateWeeklyReview(context) {
        return {
            id: 'mock_review_weekly',
            dateRange: 'Past 7 Days',
            summary: 'Weekly averages are mock stable.',
            highlights: ['Logged 100% of days successfully.'],
            areasToImprove: ['Vary raw seed fats.'],
            scoreChangeLabel: 'Consistent',
        };
    }
}
exports.MockNutritionAIProvider = MockNutritionAIProvider;
