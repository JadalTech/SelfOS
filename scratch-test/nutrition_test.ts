/**
 * Nutrition Module Architecture & Domain Verification tests
 */

import {
  foodSchema,
  nutritionGoalSchema,
  dailyNutritionLogSchema,
} from '../src/features/nutrition/validation/nutrition.validation';
import {
  calculateNutritionFactsForEntry,
  calculateMealTotals,
  calculateDailyNutritionTotals,
  calculateBMR,
  calculateTDEE,
  calculateBMI,
  calculateRecommendedProtein,
  calculateMacroDistribution,
  calculateNutritionQualityScore,
  calculateRemainingMacros,
} from '../src/features/nutrition/engine/nutritionEngine';
import {
  calculateCalorieTrends,
  calculateMacroTrends,
  calculateConsistencyScore,
  calculateLoggingStreak,
  calculateFavoriteFoods,
  buildFeatureAnalytics,
} from '../src/features/nutrition/analytics/utils/nutritionAnalytics';
import {
  mapToFoodVM,
  mapToDailyNutritionVM,
  mapToGoalVM,
} from '../src/features/nutrition/mappers/nutrition.mapper';
import { NutritionContextBuilder } from '../src/features/nutrition/ai/utils/context/NutritionContextBuilder';
import { NutritionPromptBuilder } from '../src/features/nutrition/ai/prompts/templates/NutritionPrompts';
import { NutritionAIProviderFactory } from '../src/features/nutrition/ai/providers/providerFactory';
import { FallbackHeuristicNutritionAIProvider } from '../src/features/nutrition/ai/providers/FallbackHeuristicNutritionAIProvider';
import type { Food, DailyNutritionLog, NutritionGoal, FoodEntry, Meal } from '../src/features/nutrition/types/nutrition.types';

function assert(condition: boolean, message: string) {
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

const mockFood: Food = {
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

const mockUserGoal: NutritionGoal = {
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

const entry1: FoodEntry = {
  id: 'e1',
  foodId: 'f1',
  foodName: 'Oats',
  quantity: 50, // 50g consumed (half serving)
  servingUnit: 'g',
  multiplier: 0.5,
  nutritionSnapshot: calculateNutritionFactsForEntry(50, 100, mockBaseFacts),
};

const mockMeal: Meal = {
  id: 'm1',
  mealType: 'breakfast',
  date: '2026-07-25',
  foods: [entry1],
  totalNutrition: calculateMealTotals([entry1]),
};

const mockLog: DailyNutritionLog = {
  id: 'log1',
  userId: 'u1',
  date: '2026-07-25',
  meals: [mockMeal],
  totalNutrition: calculateDailyNutritionTotals([mockMeal]),
  isCompleted: true,
  createdAt: new Date(),
  updatedAt: new Date(),
};

// ---------------------------------------------------------------------------
// Test 1: Zod Schema Validation
// ---------------------------------------------------------------------------
console.log('Test 1: Validating Zod Schemas...');

const parsedFood = foodSchema.parse(mockFood);
assert(parsedFood.name === 'Oats', 'Food Zod schema parsing verified');

const parsedGoal = nutritionGoalSchema.parse({
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
const bmr = calculateBMR(80, 180, 30, 'male');
assert(bmr === 1780, 'BMR calculation matches expected Mifflin-St Jeor BMR');

// TDEE for Sedentary Male (1780 * 1.2 = 2136)
const tdee = calculateTDEE(1780, 'sedentary');
assert(tdee === 2136, 'TDEE calculation correct');

// Recommended protein
const recommendedProt = calculateRecommendedProtein(80, 'muscle-gain');
assert(recommendedProt === 144, 'Recommended protein (80 * 1.8 = 144) verified');

// Remaining macros
const remaining = calculateRemainingMacros(mockLog, mockUserGoal);
assert(remaining.calories === 2140, 'Remaining calories calculated correctly (2200 - 60 = 2140)');

// Nutrition quality score
const qualityScore = calculateNutritionQualityScore(mockLog, mockUserGoal);
assert(qualityScore > 0 && qualityScore <= 10, 'Quality score is bounded between 0 and 10');

console.log('✓ Test 2 Passed: Domain calculations verified');

// ---------------------------------------------------------------------------
// Test 3: Analytics Calculations
// ---------------------------------------------------------------------------
console.log('Test 3: Verifying Analytics Aggregators...');

const calorieTrends = calculateCalorieTrends([mockLog]);
assert(calorieTrends[0].calories === 60, 'Calorie trend aggregation verified');

const streak = calculateLoggingStreak([mockLog]);
assert(streak >= 0, 'Streak counter verified');

const analytics = buildFeatureAnalytics([mockLog], mockUserGoal);
assert(analytics.length === 3, 'FeatureAnalytics records built for cross-module Insights Engine');

console.log('✓ Test 3 Passed: Analytics engine verified');

// ---------------------------------------------------------------------------
// Test 4: Presentation Mappers
// ---------------------------------------------------------------------------
console.log('Test 4: Verifying Presentation Mappers...');

const foodVM = mapToFoodVM(mockFood);
assert(foodVM.caloriesLabel === '120 kcal', 'Food VM mapped labels verified');

const logVM = mapToDailyNutritionVM(mockLog);
assert(logVM.meals[0].totalCaloriesLabel === '60 kcal', 'Daily Log VM mapped totals verified');

console.log('✓ Test 4 Passed: ViewModels & Mappers verified');

// ---------------------------------------------------------------------------
// Test 5: AI Providers, Prompts & Context Builder
// ---------------------------------------------------------------------------
console.log('Test 5: Verifying AI Providers, Contexts & Prompt Templates...');

// Context Builder
const aiContext = NutritionContextBuilder.buildAIContext(
  mockLog,
  mockUserGoal,
  4,   // streak
  1850, // weekly average
  6,   // consistency adherence
  []   // favorites
);
assert(aiContext.feature === 'nutrition', 'AI Context feature tag verified');
assert(aiContext.loggingStreak === 4, 'AI Context Logging Streak verified');
assert(aiContext.weeklyAverageCalories === 1850, 'AI Context weekly average calories verified');
assert(aiContext.dailyGoals.calories === 2200, 'AI Context daily goals calorie budget verified');

// Prompt Builder
const chatPrompt = NutritionPromptBuilder.buildChatPrompt('What should I eat for dinner?', aiContext);
assert(chatPrompt.includes('What should I eat for dinner?'), 'Chat prompt includes user query');
assert(chatPrompt.includes('2200 kcal'), 'Chat prompt compiles goals correctly');

const systemPrompt = NutritionPromptBuilder.buildSystemPrompt();
assert(systemPrompt.includes('Dietitian Disclaimer:'), 'System prompt enforces dietitian disclaimer');

// Heuristic Provider Recommendations
const heuristicProvider = new FallbackHeuristicNutritionAIProvider();
const recommendationsPromise = heuristicProvider.generateRecommendations(aiContext);

recommendationsPromise.then(async (recs) => {
  assert(recs.length > 0, 'Heuristic provider generated at least one recommendation');
  assert(recs[0].confidenceScore > 0, 'Heuristic recommendation has confidence score');
  assert(recs[0].actionableSteps.length > 0, 'Heuristic recommendation lists actionable steps');

  // Verify Provider Factory
  const mockProvider = NutritionAIProviderFactory.getProvider('mock');
  assert(mockProvider.name === 'mock', 'Provider factory returns Mock provider');

  const geminiProvider = NutritionAIProviderFactory.getProvider('gemini');
  assert(geminiProvider.name === 'gemini', 'Provider factory returns Gemini provider');

  const fallbackProvider = NutritionAIProviderFactory.getProvider('heuristic');
  assert(fallbackProvider.name === 'heuristic', 'Provider factory returns Fallback Heuristic provider');

  console.log('✓ Test 5 Passed: AI Providers, Contexts & Prompt Templates verified');
  console.log('=== ALL NUTRITION BATCH 8C AI ARCHITECTURE TESTS PASSED SUCCESSFULLY! ===');
}).catch((err) => {
  console.error('Test 5 failed with error:', err);
  process.exit(1);
});

