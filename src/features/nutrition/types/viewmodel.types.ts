/**
 * Nutrition Module ViewModels & Presentation Interfaces
 */

import type { FoodCategory, ServingUnit, MealType, DietTag, Allergen } from './nutrition.types';

export interface FoodVM {
  readonly id: string;
  readonly name: string;
  readonly brand: string;
  readonly category: FoodCategory;
  readonly categoryLabel: string;
  readonly servingSize: number;
  readonly servingUnit: ServingUnit;
  readonly servingUnitLabel: string;
  
  // Macros
  readonly calories: number;
  readonly caloriesLabel: string;
  readonly protein: number;
  readonly proteinLabel: string;
  readonly carbohydrates: number;
  readonly carbohydratesLabel: string;
  readonly fats: number;
  readonly fatsLabel: string;
  
  // Optional micros / tags
  readonly fiber?: number;
  readonly fiberLabel?: string;
  readonly sugar?: number;
  readonly sugarLabel?: string;
  readonly sodium?: number;
  readonly sodiumLabel?: string;
  
  readonly allergens: Allergen[];
  readonly dietTags: DietTag[];
  
  readonly isCustom: boolean;
  readonly verified: boolean;
  readonly image?: string;
}

export interface FoodEntryVM {
  readonly id: string;
  readonly foodId: string;
  readonly foodName: string;
  readonly foodBrand?: string;
  readonly quantity: number;
  readonly servingUnit: ServingUnit;
  readonly multiplier: number;
  
  // Calculated absolute nutrition based on quantity consumed
  readonly calories: number;
  readonly caloriesLabel: string;
  readonly protein: number;
  readonly proteinLabel: string;
  readonly carbohydrates: number;
  readonly carbohydratesLabel: string;
  readonly fats: number;
  readonly fatsLabel: string;
  readonly fiber?: number;
  readonly sugar?: number;
  readonly sodium?: number;
}

export interface MealVM {
  readonly id: string;
  readonly mealType: MealType;
  readonly mealTypeLabel: string;
  readonly mealTypeIcon: string;
  readonly foods: FoodEntryVM[];
  
  // Accumulated totals
  readonly totalCalories: number;
  readonly totalCaloriesLabel: string;
  readonly totalProtein: number;
  readonly totalProteinLabel: string;
  readonly totalCarbs: number;
  readonly totalCarbsLabel: string;
  readonly totalFats: number;
  readonly totalFatsLabel: string;
}

export interface DailyNutritionVM {
  readonly id: string;
  readonly date: string;
  readonly dateFormatted: string;
  readonly meals: MealVM[];
  readonly isCompleted: boolean;
  
  // Daily totals
  readonly totalCalories: number;
  readonly totalCaloriesLabel: string;
  readonly totalProtein: number;
  readonly totalProteinLabel: string;
  readonly totalCarbs: number;
  readonly totalCarbsLabel: string;
  readonly totalFats: number;
  readonly totalFatsLabel: string;
  
  // Hydration Link
  readonly waterMl: number;
  readonly waterMlLabel: string;
}

export interface NutritionGoalVM {
  readonly id: string;
  readonly calorieTarget: number;
  readonly calorieTargetLabel: string;
  readonly proteinTarget: number;
  readonly proteinTargetLabel: string;
  readonly carbTarget: number;
  readonly carbTargetLabel: string;
  readonly fatTarget: number;
  readonly fatTargetLabel: string;
  readonly fiberTarget?: number;
  readonly fiberTargetLabel?: string;
  readonly isActive: boolean;
}

export interface NutritionTemplateVM {
  readonly id: string;
  readonly title: string;
  readonly mealTypeLabel: string;
  readonly foodsCount: number;
  readonly totalCaloriesLabel: string;
}
