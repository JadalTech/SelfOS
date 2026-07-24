/**
 * Pure Nutrition Domain Engine
 *
 * All business logic algorithms remain 100% pure TypeScript:
 * - Framework independent
 * - Zero database imports
 * - Zero React dependencies
 */

import type { FoodEntry, NutritionFacts, Meal, DailyNutritionLog, NutritionGoal } from '../types/nutrition.types';

export function calculateNutritionFactsForEntry(quantity: number, servingSize: number, baseFacts: NutritionFacts): NutritionFacts {
  if (servingSize <= 0 || quantity <= 0) {
    return { calories: 0, protein: 0, carbohydrates: 0, fats: 0 };
  }

  const multiplier = quantity / servingSize;

  return {
    calories: Math.round(baseFacts.calories * multiplier),
    protein: Math.round(baseFacts.protein * multiplier * 10) / 10,
    carbohydrates: Math.round(baseFacts.carbohydrates * multiplier * 10) / 10,
    fats: Math.round(baseFacts.fats * multiplier * 10) / 10,
    fiber: baseFacts.fiber !== undefined ? Math.round(baseFacts.fiber * multiplier * 10) / 10 : undefined,
    sugar: baseFacts.sugar !== undefined ? Math.round(baseFacts.sugar * multiplier * 10) / 10 : undefined,
    sodium: baseFacts.sodium !== undefined ? Math.round(baseFacts.sodium * multiplier) : undefined,
    vitamins: baseFacts.vitamins
      ? {
          vitaminA: baseFacts.vitamins.vitaminA !== undefined ? Math.round(baseFacts.vitamins.vitaminA * multiplier) : undefined,
          vitaminC: baseFacts.vitamins.vitaminC !== undefined ? Math.round(baseFacts.vitamins.vitaminC * multiplier * 10) / 10 : undefined,
          vitaminD: baseFacts.vitamins.vitaminD !== undefined ? Math.round(baseFacts.vitamins.vitaminD * multiplier * 10) / 10 : undefined,
          vitaminE: baseFacts.vitamins.vitaminE !== undefined ? Math.round(baseFacts.vitamins.vitaminE * multiplier * 10) / 10 : undefined,
          vitaminB12: baseFacts.vitamins.vitaminB12 !== undefined ? Math.round(baseFacts.vitamins.vitaminB12 * multiplier * 10) / 10 : undefined,
        }
      : undefined,
    minerals: baseFacts.minerals
      ? {
          iron: baseFacts.minerals.iron !== undefined ? Math.round(baseFacts.minerals.iron * multiplier * 10) / 10 : undefined,
          calcium: baseFacts.minerals.calcium !== undefined ? Math.round(baseFacts.minerals.calcium * multiplier) : undefined,
          magnesium: baseFacts.minerals.magnesium !== undefined ? Math.round(baseFacts.minerals.magnesium * multiplier) : undefined,
          potassium: baseFacts.minerals.potassium !== undefined ? Math.round(baseFacts.minerals.potassium * multiplier) : undefined,
        }
      : undefined,
    allergens: baseFacts.allergens,
    dietTags: baseFacts.dietTags,
  };
}

export function calculateMealTotals(entries: FoodEntry[]): NutritionFacts {
  let calories = 0;
  let protein = 0;
  let carbohydrates = 0;
  let fats = 0;
  let fiber = 0;
  let sugar = 0;
  let sodium = 0;

  let hasFiber = false;
  let hasSugar = false;
  let hasSodium = false;

  for (const entry of entries) {
    const snap = entry.nutritionSnapshot;
    calories += snap.calories;
    protein += snap.protein;
    carbohydrates += snap.carbohydrates;
    fats += snap.fats;
    if (snap.fiber !== undefined) {
      fiber += snap.fiber;
      hasFiber = true;
    }
    if (snap.sugar !== undefined) {
      sugar += snap.sugar;
      hasSugar = true;
    }
    if (snap.sodium !== undefined) {
      sodium += snap.sodium;
      hasSodium = true;
    }
  }

  return {
    calories: Math.round(calories),
    protein: Math.round(protein * 10) / 10,
    carbohydrates: Math.round(carbohydrates * 10) / 10,
    fats: Math.round(fats * 10) / 10,
    fiber: hasFiber ? Math.round(fiber * 10) / 10 : undefined,
    sugar: hasSugar ? Math.round(sugar * 10) / 10 : undefined,
    sodium: hasSodium ? Math.round(sodium) : undefined,
  };
}

export function calculateDailyNutritionTotals(meals: Meal[]): NutritionFacts {
  let calories = 0;
  let protein = 0;
  let carbohydrates = 0;
  let fats = 0;
  let fiber = 0;
  let sugar = 0;
  let sodium = 0;

  let hasFiber = false;
  let hasSugar = false;
  let hasSodium = false;

  for (const meal of meals) {
    const snap = meal.totalNutrition;
    calories += snap.calories;
    protein += snap.protein;
    carbohydrates += snap.carbohydrates;
    fats += snap.fats;
    if (snap.fiber !== undefined) {
      fiber += snap.fiber;
      hasFiber = true;
    }
    if (snap.sugar !== undefined) {
      sugar += snap.sugar;
      hasSugar = true;
    }
    if (snap.sodium !== undefined) {
      sodium += snap.sodium;
      hasSodium = true;
    }
  }

  return {
    calories: Math.round(calories),
    protein: Math.round(protein * 10) / 10,
    carbohydrates: Math.round(carbohydrates * 10) / 10,
    fats: Math.round(fats * 10) / 10,
    fiber: hasFiber ? Math.round(fiber * 10) / 10 : undefined,
    sugar: hasSugar ? Math.round(sugar * 10) / 10 : undefined,
    sodium: hasSodium ? Math.round(sodium) : undefined,
  };
}

/**
 * Calculates Basal Metabolic Rate (BMR) using the Mifflin-St Jeor Equation.
 */
export function calculateBMR(weightKg: number, heightCm: number, age: number, biologicalSex: 'male' | 'female'): number {
  if (weightKg <= 0 || heightCm <= 0 || age <= 0) return 0;
  if (biologicalSex === 'male') {
    return Math.round(10 * weightKg + 6.25 * heightCm - 5 * age + 5);
  } else {
    return Math.round(10 * weightKg + 6.25 * heightCm - 5 * age - 161);
  }
}

/**
 * Calculates Total Daily Energy Expenditure (TDEE).
 */
export function calculateTDEE(
  bmr: number,
  activityLevel: 'sedentary' | 'lightly-active' | 'moderately-active' | 'very-active'
): number {
  const multipliers = {
    sedentary: 1.2,
    'lightly-active': 1.375,
    'moderately-active': 1.55,
    'very-active': 1.725,
  };
  return Math.round(bmr * multipliers[activityLevel]);
}

export function calculateBMI(weightKg: number, heightCm: number): number {
  if (weightKg <= 0 || heightCm <= 0) return 0;
  const heightM = heightCm / 100;
  return Math.round((weightKg / (heightM * heightM)) * 10) / 10;
}

export function calculateRecommendedProtein(weightKg: number, target: 'maintenance' | 'muscle-gain' | 'fat-loss'): number {
  if (weightKg <= 0) return 0;
  const multipliers = {
    maintenance: 1.2,
    'muscle-gain': 1.8,
    'fat-loss': 1.6,
  };
  return Math.round(weightKg * multipliers[target]);
}

export interface MacroPercentages {
  readonly proteinPercent: number;
  readonly carbPercent: number;
  readonly fatPercent: number;
}

export function calculateMacroDistribution(facts: NutritionFacts): MacroPercentages {
  const proteinKcal = facts.protein * 4;
  const carbKcal = facts.carbohydrates * 4;
  const fatKcal = facts.fats * 9;
  const totalKcal = proteinKcal + carbKcal + fatKcal;

  if (totalKcal <= 0) {
    return { proteinPercent: 0, carbPercent: 0, fatPercent: 0 };
  }

  return {
    proteinPercent: Math.round((proteinKcal / totalKcal) * 100),
    carbPercent: Math.round((carbKcal / totalKcal) * 100),
    fatPercent: Math.round((fatKcal / totalKcal) * 100),
  };
}

export interface RemainingNutrients {
  readonly calories: number;
  readonly protein: number;
  readonly carbohydrates: number;
  readonly fats: number;
  readonly fiber?: number;
}

export function calculateRemainingMacros(dailyLog: DailyNutritionLog, goal: NutritionGoal): RemainingNutrients {
  return {
    calories: Math.max(0, goal.calorieTarget - dailyLog.totalNutrition.calories),
    protein: Math.max(0, Math.round((goal.proteinTarget - dailyLog.totalNutrition.protein) * 10) / 10),
    carbohydrates: Math.max(0, Math.round((goal.carbTarget - dailyLog.totalNutrition.carbohydrates) * 10) / 10),
    fats: Math.max(0, Math.round((goal.fatTarget - dailyLog.totalNutrition.fats) * 10) / 10),
    fiber: goal.fiberTarget !== undefined
      ? Math.max(0, Math.round((goal.fiberTarget - (dailyLog.totalNutrition.fiber || 0)) * 10) / 10)
      : undefined,
  };
}

/**
 * Calculates Nutrition Quality Score (1-10 scale) based on goal adherence.
 */
export function calculateNutritionQualityScore(dailyLog: DailyNutritionLog, goal: NutritionGoal): number {
  const caloriesRatio = Math.min(1.0, dailyLog.totalNutrition.calories / goal.calorieTarget);
  // Calorie penalty for overeating: if they exceed target by 20%, score drops
  const calorieAdherence = caloriesRatio > 1.2
    ? Math.max(0, 1.0 - (caloriesRatio - 1.2))
    : caloriesRatio < 0.8
    ? caloriesRatio
    : 1.0;

  const proteinRatio = Math.min(1.2, dailyLog.totalNutrition.protein / goal.proteinTarget);
  const proteinScore = proteinRatio >= 0.9 ? 1.0 : proteinRatio;

  const carbRatio = Math.min(1.0, dailyLog.totalNutrition.carbohydrates / goal.carbTarget);
  const fatRatio = Math.min(1.0, dailyLog.totalNutrition.fats / goal.fatTarget);

  const weighted =
    calorieAdherence * 0.35 +
    proteinScore * 0.35 +
    carbRatio * 0.15 +
    fatRatio * 0.15;

  return Math.round(weighted * 10 * 10) / 10;
}
