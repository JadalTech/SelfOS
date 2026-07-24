"use strict";
/**
 * Nutrition Module Architecture & Domain Verification tests
 */
Object.defineProperty(exports, "__esModule", { value: true });
const nutrition_validation_1 = require("../src/features/nutrition/validation/nutrition.validation");
const nutritionEngine_1 = require("../src/features/nutrition/engine/nutritionEngine");
const nutritionAnalytics_1 = require("../src/features/nutrition/analytics/utils/nutritionAnalytics");
const nutrition_mapper_1 = require("../src/features/nutrition/mappers/nutrition.mapper");
const NutritionContextBuilder_1 = require("../src/features/nutrition/ai/utils/context/NutritionContextBuilder");
const NutritionPrompts_1 = require("../src/features/nutrition/ai/prompts/templates/NutritionPrompts");
const providerFactory_1 = require("../src/features/nutrition/ai/providers/providerFactory");
const FallbackHeuristicNutritionAIProvider_1 = require("../src/features/nutrition/ai/providers/FallbackHeuristicNutritionAIProvider");
function assert(condition, message) {
    if (!condition) {
        throw new Error(`[Assertion Failed] ${message}`);
    }
}
console.log('=== Starting Nutrition Batch 8A Domain & Architecture Verification Tests ===');
// --- Mock Data ---
const mockBaseFacts = {
    calories: 120, // kcal per 100g
    protein: 8.5,
    carbohydrates: 20.0,
    fats: 1.2,
    fiber: 3.0,
    sugar: 4.5,
    sodium: 15,
};
const mockFood = {
    id: 'f1',
    userId: undefined, // Global food
    name: 'Oats',
    brand: 'Quaker',
    category: 'grain',
    servingSize: 100,
    servingUnit: 'g',
    nutritionFacts: mockBaseFacts,
    verified: true,
    createdAt: new Date(),
    updatedAt: new Date(),
};
const mockUserGoal = {
    id: 'g1',
    userId: 'u1',
    calorieTarget: 2200,
    proteinTarget: 160,
    carbTarget: 220,
    fatTarget: 70,
    fiberTarget: 30,
    isActive: true,
    createdAt: new Date(),
    updatedAt: new Date(),
};
const entry1 = {
    id: 'e1',
    foodId: 'f1',
    foodName: 'Oats',
    quantity: 50, // 50g consumed (half serving)
    servingUnit: 'g',
    multiplier: 0.5,
    nutritionSnapshot: (0, nutritionEngine_1.calculateNutritionFactsForEntry)(50, 100, mockBaseFacts),
};
const mockMeal = {
    id: 'm1',
    mealType: 'breakfast',
    date: '2026-07-25',
    foods: [entry1],
    totalNutrition: (0, nutritionEngine_1.calculateMealTotals)([entry1]),
};
const mockLog = {
    id: 'log1',
    userId: 'u1',
    date: '2026-07-25',
    meals: [mockMeal],
    totalNutrition: (0, nutritionEngine_1.calculateDailyNutritionTotals)([mockMeal]),
    isCompleted: true,
    createdAt: new Date(),
    updatedAt: new Date(),
};
// ---------------------------------------------------------------------------
// Test 1: Zod Schema Validation
// ---------------------------------------------------------------------------
console.log('Test 1: Validating Zod Schemas...');
const parsedFood = nutrition_validation_1.foodSchema.parse(mockFood);
assert(parsedFood.name === 'Oats', 'Food Zod schema parsing verified');
const parsedGoal = nutrition_validation_1.nutritionGoalSchema.parse({
    calorieTarget: 2000,
    proteinTarget: 140,
    carbTarget: 200,
    fatTarget: 60,
    fiberTarget: 25,
    isActive: true,
});
assert(parsedGoal.calorieTarget === 2000, 'Goal Zod schema parsing verified');
console.log('✓ Test 1 Passed: Zod schemas validated');
// ---------------------------------------------------------------------------
// Test 2: Domain Nutrition Engine Equations
// ---------------------------------------------------------------------------
console.log('Test 2: Verifying Domain Engine Calculations...');
// Multiplier calculation (50g of 120 calories = 60 calories)
assert(entry1.nutritionSnapshot.calories === 60, 'FoodEntry calories calculation verified');
assert(entry1.nutritionSnapshot.protein === 4.3, 'FoodEntry protein scaling verified (8.5 * 0.5 = 4.25 -> 4.3)');
// BMR (Mifflin-St Jeor) for 80kg, 180cm, 30yo Male
// BMR = 10 * 80 + 6.25 * 180 - 5 * 30 + 5 = 800 + 1125 - 150 + 5 = 1780
const bmr = (0, nutritionEngine_1.calculateBMR)(80, 180, 30, 'male');
assert(bmr === 1780, 'BMR calculation matches expected Mifflin-St Jeor BMR');
// TDEE for Sedentary Male (1780 * 1.2 = 2136)
const tdee = (0, nutritionEngine_1.calculateTDEE)(1780, 'sedentary');
assert(tdee === 2136, 'TDEE calculation correct');
// Recommended protein
const recommendedProt = (0, nutritionEngine_1.calculateRecommendedProtein)(80, 'muscle-gain');
assert(recommendedProt === 144, 'Recommended protein (80 * 1.8 = 144) verified');
// Remaining macros
const remaining = (0, nutritionEngine_1.calculateRemainingMacros)(mockLog, mockUserGoal);
assert(remaining.calories === 2140, 'Remaining calories calculated correctly (2200 - 60 = 2140)');
// Nutrition quality score
const qualityScore = (0, nutritionEngine_1.calculateNutritionQualityScore)(mockLog, mockUserGoal);
assert(qualityScore > 0 && qualityScore <= 10, 'Quality score is bounded between 0 and 10');
console.log('✓ Test 2 Passed: Domain calculations verified');
// ---------------------------------------------------------------------------
// Test 3: Analytics Calculations
// ---------------------------------------------------------------------------
console.log('Test 3: Verifying Analytics Aggregators...');
const calorieTrends = (0, nutritionAnalytics_1.calculateCalorieTrends)([mockLog]);
assert(calorieTrends[0].calories === 60, 'Calorie trend aggregation verified');
const streak = (0, nutritionAnalytics_1.calculateLoggingStreak)([mockLog]);
assert(streak >= 0, 'Streak counter verified');
const analytics = (0, nutritionAnalytics_1.buildFeatureAnalytics)([mockLog], mockUserGoal);
assert(analytics.length === 3, 'FeatureAnalytics records built for cross-module Insights Engine');
console.log('✓ Test 3 Passed: Analytics engine verified');
// ---------------------------------------------------------------------------
// Test 4: Presentation Mappers
// ---------------------------------------------------------------------------
console.log('Test 4: Verifying Presentation Mappers...');
const foodVM = (0, nutrition_mapper_1.mapToFoodVM)(mockFood);
assert(foodVM.caloriesLabel === '120 kcal', 'Food VM mapped labels verified');
const logVM = (0, nutrition_mapper_1.mapToDailyNutritionVM)(mockLog);
assert(logVM.meals[0].totalCaloriesLabel === '60 kcal', 'Daily Log VM mapped totals verified');
console.log('✓ Test 4 Passed: ViewModels & Mappers verified');
// ---------------------------------------------------------------------------
// Test 5: AI Providers, Prompts & Context Builder
// ---------------------------------------------------------------------------
console.log('Test 5: Verifying AI Providers, Contexts & Prompt Templates...');
// Context Builder
const aiContext = NutritionContextBuilder_1.NutritionContextBuilder.buildAIContext(mockLog, mockUserGoal, 4, // streak
1850, // weekly average
6, // consistency adherence
[] // favorites
);
assert(aiContext.feature === 'nutrition', 'AI Context feature tag verified');
assert(aiContext.loggingStreak === 4, 'AI Context Logging Streak verified');
assert(aiContext.weeklyAverageCalories === 1850, 'AI Context weekly average calories verified');
assert(aiContext.dailyGoals.calories === 2200, 'AI Context daily goals calorie budget verified');
// Prompt Builder
const chatPrompt = NutritionPrompts_1.NutritionPromptBuilder.buildChatPrompt('What should I eat for dinner?', aiContext);
assert(chatPrompt.includes('What should I eat for dinner?'), 'Chat prompt includes user query');
assert(chatPrompt.includes('2200 kcal'), 'Chat prompt compiles goals correctly');
const systemPrompt = NutritionPrompts_1.NutritionPromptBuilder.buildSystemPrompt();
assert(systemPrompt.includes('Dietitian Disclaimer:'), 'System prompt enforces dietitian disclaimer');
// Heuristic Provider Recommendations
const heuristicProvider = new FallbackHeuristicNutritionAIProvider_1.FallbackHeuristicNutritionAIProvider();
const recommendationsPromise = heuristicProvider.generateRecommendations(aiContext);
recommendationsPromise.then(async (recs) => {
    assert(recs.length > 0, 'Heuristic provider generated at least one recommendation');
    assert(recs[0].confidenceScore > 0, 'Heuristic recommendation has confidence score');
    assert(recs[0].actionableSteps.length > 0, 'Heuristic recommendation lists actionable steps');
    // Verify Provider Factory
    const mockProvider = providerFactory_1.NutritionAIProviderFactory.getProvider('mock');
    assert(mockProvider.name === 'mock', 'Provider factory returns Mock provider');
    const geminiProvider = providerFactory_1.NutritionAIProviderFactory.getProvider('gemini');
    assert(geminiProvider.name === 'gemini', 'Provider factory returns Gemini provider');
    const fallbackProvider = providerFactory_1.NutritionAIProviderFactory.getProvider('heuristic');
    assert(fallbackProvider.name === 'heuristic', 'Provider factory returns Fallback Heuristic provider');
    console.log('✓ Test 5 Passed: AI Providers, Contexts & Prompt Templates verified');
    console.log('=== ALL NUTRITION BATCH 8C AI ARCHITECTURE TESTS PASSED SUCCESSFULLY! ===');
}).catch((err) => {
    console.error('Test 5 failed with error:', err);
    process.exit(1);
});
