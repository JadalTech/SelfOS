import type { NutritionAIContext } from '../../types/nutritionAI.types';
import type { DailyNutritionLog, NutritionGoal } from '../../../types/nutrition.types';

export class NutritionContextBuilder {
  static buildAIContext(
    dailyLog: DailyNutritionLog | null,
    activeGoal: NutritionGoal | null,
    streak: number = 0,
    weeklyAvgCalories: number = 2000,
    weeklyAdherence: number = 8,
    favorites: { foodName: string; category: any; count: number }[] = []
  ): NutritionAIContext {
    // 1. Extract daily totals or fallback to zero
    const dailyTotals = dailyLog?.totalNutrition || {
      calories: 0,
      protein: 0,
      carbohydrates: 0,
      fats: 0,
      fiber: 0,
      sugar: 0,
      sodium: 0,
      allergens: [],
      dietTags: [],
    };

    // 2. Extract goals or fallback to standard averages
    const dailyGoals = {
      calories: activeGoal?.calorieTarget || 2000,
      protein: activeGoal?.proteinTarget || 150,
      carbTarget: activeGoal?.carbTarget || 200,
      fatTarget: activeGoal?.fatTarget || 65,
      fiberTarget: activeGoal?.fiberTarget || 30,
    };

    // 3. Compute macro ratios deterministically
    const totalMacrosGrams = dailyTotals.protein + dailyTotals.carbohydrates + dailyTotals.fats;
    const proteinPercent = totalMacrosGrams > 0 ? Math.round((dailyTotals.protein / totalMacrosGrams) * 100) : 0;
    const carbPercent = totalMacrosGrams > 0 ? Math.round((dailyTotals.carbohydrates / totalMacrosGrams) * 100) : 0;
    const fatPercent = totalMacrosGrams > 0 ? Math.round((dailyTotals.fats / totalMacrosGrams) * 100) : 0;

    return {
      feature: 'nutrition',
      activeGoalLabel: `Goal: ${dailyGoals.calories} kcal`,
      consistencyPercent: Math.round(weeklyAdherence * 10),
      currentAveragesLabel: `Avg: ${weeklyAvgCalories} kcal`,
      dailyTotals: {
        calories: dailyTotals.calories,
        protein: dailyTotals.protein,
        carbohydrates: dailyTotals.carbohydrates,
        fats: dailyTotals.fats,
        fiber: dailyTotals.fiber || 0,
        sugar: dailyTotals.sugar || 0,
        sodium: dailyTotals.sodium || 0,
        allergens: dailyTotals.allergens || [],
        dietTags: dailyTotals.dietTags || [],
      },
      dailyGoals: {
        calories: dailyGoals.calories,
        protein: dailyGoals.protein,
        carbs: dailyGoals.carbTarget,
        fats: dailyGoals.fatTarget,
        fiber: dailyGoals.fiberTarget,
      },
      macroRatios: {
        proteinPercent,
        carbPercent,
        fatPercent,
      },
      weeklyAverageCalories: weeklyAvgCalories,
      weeklyAdherenceScore: weeklyAdherence,
      loggingStreak: streak,
      favoriteFoods: favorites.slice(0, 3).map((f) => ({
        foodName: f.foodName,
        category: f.category,
        count: f.count,
      })),
    };
  }
}
