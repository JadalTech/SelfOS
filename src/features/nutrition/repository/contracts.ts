/**
 * Repository Interfaces for Nutrition Module
 */

import type { Result } from '../../../shared/types';
import { AppError } from '../../../shared/errors/AppError';
import type {
  Food,
  DailyNutritionLog,
  NutritionGoal,
  NutritionTemplate,
  MealType,
  FoodEntry,
} from '../types/nutrition.types';
import type { FeatureAnalytics } from '../../../shared/types/analytics.types';

export interface IFoodRepository {
  searchFoods(userId: string, searchTerm: string): Promise<Result<Food[], AppError>>;
  createUserFood(userId: string, food: Omit<Food, 'id' | 'userId' | 'createdAt' | 'updatedAt'>): Promise<Result<Food, AppError>>;
  deleteUserFood(userId: string, foodId: string): Promise<Result<void, AppError>>;
}

export interface IMealRepository {
  fetchLogs(userId: string, limitDays?: number): Promise<Result<DailyNutritionLog[], AppError>>;
  getLogByDate(userId: string, dateStr: string): Promise<Result<DailyNutritionLog | null, AppError>>;
  addFoodToMeal(
    userId: string,
    dateStr: string,
    mealType: MealType,
    food: Food,
    quantity: number
  ): Promise<Result<DailyNutritionLog, AppError>>;
  removeFoodFromMeal(
    userId: string,
    dateStr: string,
    mealType: MealType,
    entryId: string
  ): Promise<Result<DailyNutritionLog, AppError>>;
  completeDailyLog(userId: string, dateStr: string, isCompleted: boolean): Promise<Result<DailyNutritionLog, AppError>>;
}

export interface IGoalRepository {
  fetchGoals(userId: string): Promise<Result<NutritionGoal[], AppError>>;
  saveGoal(userId: string, goal: Omit<NutritionGoal, 'id' | 'userId' | 'createdAt' | 'updatedAt'>): Promise<Result<NutritionGoal, AppError>>;
  toggleGoalActive(userId: string, goalId: string, isActive: boolean): Promise<Result<void, AppError>>;
}

export interface ITemplateRepository {
  fetchTemplates(userId: string): Promise<Result<NutritionTemplate[], AppError>>;
  createTemplate(userId: string, title: string, mealType: MealType, entries: FoodEntry[]): Promise<Result<NutritionTemplate, AppError>>;
  deleteTemplate(userId: string, templateId: string): Promise<Result<void, AppError>>;
}

export interface IAnalyticsRepository {
  fetchAnalyticsRecords(userId: string, limitDays?: number): Promise<Result<FeatureAnalytics[], AppError>>;
}
