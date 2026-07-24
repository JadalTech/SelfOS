/**
 * Nutrition specific AI Context & Conversation Types
 */

import type { AIMessage, AIModuleSummary } from '../../../../shared/types/ai.types';
import type { NutritionFacts, FoodCategory } from '../../types/nutrition.types';

export type NutritionChatMessage = AIMessage;

export interface NutritionAIContext extends AIModuleSummary {
  readonly feature: 'nutrition';
  
  // Deterministic daily and weekly data compiled by context builders
  readonly dailyTotals: NutritionFacts;
  readonly dailyGoals: {
    readonly calories: number;
    readonly protein: number;
    readonly carbs: number;
    readonly fats: number;
    readonly fiber?: number;
  };
  readonly macroRatios: {
    readonly proteinPercent: number;
    readonly carbPercent: number;
    readonly fatPercent: number;
  };
  
  // Historical trends
  readonly weeklyAverageCalories: number;
  readonly weeklyAdherenceScore: number; // 0-10
  readonly loggingStreak: number;
  readonly favoriteFoods: {
    readonly foodName: string;
    readonly category: FoodCategory;
    readonly count: number;
  }[];
}
