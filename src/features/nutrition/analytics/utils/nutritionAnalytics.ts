/**
 * Pure Analytics Engine for Nutrition Module
 */

import type { DailyNutritionLog, NutritionGoal } from '../../types/nutrition.types';
import type { FeatureAnalytics } from '../../../../shared/types/analytics.types';
import { calculateNutritionQualityScore } from '../../engine/nutritionEngine';

export interface CalorieTrend {
  readonly date: string;
  readonly calories: number;
}

export interface MacroTrend {
  readonly date: string;
  readonly protein: number;
  readonly carbohydrates: number;
  readonly fats: number;
}

export function calculateCalorieTrends(logs: DailyNutritionLog[]): CalorieTrend[] {
  // Sort logs by date ascending
  const sorted = [...logs].sort((a, b) => a.date.localeCompare(b.date));
  return sorted.map((log) => ({
    date: log.date,
    calories: log.totalNutrition.calories,
  }));
}

export function calculateMacroTrends(logs: DailyNutritionLog[]): MacroTrend[] {
  const sorted = [...logs].sort((a, b) => a.date.localeCompare(b.date));
  return sorted.map((log) => ({
    date: log.date,
    protein: log.totalNutrition.protein,
    carbohydrates: log.totalNutrition.carbohydrates,
    fats: log.totalNutrition.fats,
  }));
}

export function calculateConsistencyScore(logs: DailyNutritionLog[], windowDays = 7): number {
  if (logs.length === 0 || windowDays <= 0) return 0;
  
  // Consistency defined as days logged / total window days
  const uniqueLoggedDates = new Set(logs.map((l) => l.date)).size;
  const ratio = Math.min(1.0, uniqueLoggedDates / windowDays);
  return Math.round(ratio * 100);
}

export function calculateLoggingStreak(logs: DailyNutritionLog[]): number {
  if (logs.length === 0) return 0;

  const sortedDates = [...new Set(logs.map((l) => l.date))].sort((a, b) => b.localeCompare(a));
  
  const today = new Date();
  const todayStr = today.toISOString().split('T')[0];
  
  const yesterday = new Date(today);
  yesterday.setDate(yesterday.getDate() - 1);
  const yesterdayStr = yesterday.toISOString().split('T')[0];

  // If streak was not maintained today or yesterday, it is broken
  if (sortedDates[0] !== todayStr && sortedDates[0] !== yesterdayStr) {
    return 0;
  }

  let streak = 0;
  let currentTarget = new Date(sortedDates[0]);

  for (const dateStr of sortedDates) {
    const expectedStr = currentTarget.toISOString().split('T')[0];
    if (dateStr === expectedStr) {
      streak++;
      // Set to previous day
      currentTarget.setDate(currentTarget.getDate() - 1);
    } else {
      break;
    }
  }

  return streak;
}

export interface FavoriteFoodItem {
  readonly foodId: string;
  readonly foodName: string;
  readonly count: number;
}

export function calculateFavoriteFoods(logs: DailyNutritionLog[], limitCount = 5): FavoriteFoodItem[] {
  const counts: Record<string, { name: string; count: number }> = {};

  for (const log of logs) {
    for (const meal of log.meals) {
      for (const entry of meal.foods) {
        const item = counts[entry.foodId];
        if (item) {
          counts[entry.foodId] = { name: entry.foodName, count: item.count + 1 };
        } else {
          counts[entry.foodId] = { name: entry.foodName, count: 1 };
        }
      }
    }
  }

  const items = Object.entries(counts).map(([foodId, info]) => ({
    foodId,
    foodName: info.name,
    count: info.count,
  }));

  return items.sort((a, b) => b.count - a.count).slice(0, limitCount);
}

export function buildFeatureAnalytics(logs: DailyNutritionLog[], goal: NutritionGoal): FeatureAnalytics[] {
  if (logs.length === 0) return [];

  // Calculate average quality score
  let totalScore = 0;
  let loggedDaysCount = 0;
  let totalCalories = 0;

  for (const log of logs) {
    const score = calculateNutritionQualityScore(log, goal);
    totalScore += score;
    totalCalories += log.totalNutrition.calories;
    loggedDaysCount++;
  }

  const avgQualityScore = loggedDaysCount > 0 ? totalScore / loggedDaysCount : 0;
  const avgCalorieIntake = loggedDaysCount > 0 ? totalCalories / loggedDaysCount : 0;

  const now = new Date();

  return [
    {
      feature: 'nutrition',
      metric: 'calorie-intake',
      value: Math.round(avgCalorieIntake),
      score: Math.min(10, Math.round((avgCalorieIntake / goal.calorieTarget) * 10)),
      trend: avgCalorieIntake > goal.calorieTarget * 1.1 ? 'declining' : 'stable',
      timestamp: now,
    },
    {
      feature: 'nutrition',
      metric: 'quality-score',
      value: Math.round(avgQualityScore * 10) / 10,
      score: Math.round(avgQualityScore),
      trend: avgQualityScore >= 8 ? 'improving' : 'stable',
      timestamp: now,
    },
    {
      feature: 'nutrition',
      metric: 'consistency',
      value: calculateConsistencyScore(logs, 7),
      score: Math.round(calculateConsistencyScore(logs, 7) / 10),
      trend: 'stable',
      timestamp: now,
    },
  ];
}
