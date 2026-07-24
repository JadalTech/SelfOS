/**
 * Unified Repository Facade for Nutrition Module
 */

import { ok, err } from '../../../shared/types';
import type { Result } from '../../../shared/types';
import { AppError } from '../../../shared/errors/AppError';
import type {
  IFoodRepository,
  IMealRepository,
  IGoalRepository,
  ITemplateRepository,
  IAnalyticsRepository,
} from './contracts';
import type {
  Food,
  DailyNutritionLog,
  NutritionGoal,
  NutritionTemplate,
  MealType,
  FoodEntry,
} from '../types/nutrition.types';
import { nutritionService, NutritionService } from '../services/nutrition.service';
import {
  calculateNutritionFactsForEntry,
  calculateMealTotals,
  calculateDailyNutritionTotals,
} from '../engine/nutritionEngine';
import { buildFeatureAnalytics } from '../analytics/utils/nutritionAnalytics';
import type { FeatureAnalytics } from '../../../shared/types/analytics.types';

export class NutritionRepository
  implements
    IFoodRepository,
    IMealRepository,
    IGoalRepository,
    ITemplateRepository,
    IAnalyticsRepository
{
  constructor(private readonly service: NutritionService = nutritionService) {}

  // --- IFoodRepository ---

  async searchFoods(userId: string, searchTerm: string): Promise<Result<Food[], AppError>> {
    try {
      const [globals, users] = await Promise.all([
        this.service.searchGlobalFoods(searchTerm),
        this.service.fetchUserFoods(userId),
      ]);

      const filteredUsers = searchTerm
        ? users.filter(
            (f) =>
              f.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
              (f.brand && f.brand.toLowerCase().includes(searchTerm.toLowerCase()))
          )
        : users;

      // Merge and return
      return ok([...filteredUsers, ...globals]);
    } catch (error) {
      return err(new AppError('FIREBASE_ERROR', 'Failed to search foods catalog', { originalError: error }));
    }
  }

  async createUserFood(
    userId: string,
    food: Omit<Food, 'id' | 'userId' | 'createdAt' | 'updatedAt'>
  ): Promise<Result<Food, AppError>> {
    try {
      const newFood = await this.service.createUserFood(userId, food);
      return ok(newFood);
    } catch (error) {
      return err(new AppError('FIREBASE_ERROR', 'Failed to create user food', { originalError: error }));
    }
  }

  async deleteUserFood(userId: string, foodId: string): Promise<Result<void, AppError>> {
    try {
      await this.service.deleteUserFood(userId, foodId);
      return ok(undefined);
    } catch (error) {
      return err(new AppError('FIREBASE_ERROR', 'Failed to delete user food', { originalError: error }));
    }
  }

  // --- IMealRepository ---

  async fetchLogs(userId: string, limitDays = 30): Promise<Result<DailyNutritionLog[], AppError>> {
    try {
      const logs = await this.service.fetchLogs(userId, limitDays);
      return ok(logs);
    } catch (error) {
      return err(new AppError('FIREBASE_ERROR', 'Failed to fetch nutrition logs', { originalError: error }));
    }
  }

  async getLogByDate(userId: string, dateStr: string): Promise<Result<DailyNutritionLog | null, AppError>> {
    try {
      const log = await this.service.getLogByDate(userId, dateStr);
      return ok(log);
    } catch (error) {
      return err(new AppError('FIREBASE_ERROR', `Failed to fetch log for date ${dateStr}`, { originalError: error }));
    }
  }

  async addFoodToMeal(
    userId: string,
    dateStr: string,
    mealType: MealType,
    food: Food,
    quantity: number
  ): Promise<Result<DailyNutritionLog, AppError>> {
    try {
      let log = await this.service.getLogByDate(userId, dateStr);
      const now = new Date();

      if (!log) {
        log = {
          id: `log_${dateStr}_${Date.now()}`,
          userId,
          date: dateStr,
          meals: [],
          totalNutrition: { calories: 0, protein: 0, carbohydrates: 0, fats: 0 },
          isCompleted: false,
          createdAt: now,
          updatedAt: now,
        };
      }

      // Find or create the meal container
      let meal = log.meals.find((m) => m.mealType === mealType);
      if (!meal) {
        meal = {
          id: `meal_${mealType}_${Date.now()}`,
          mealType,
          date: dateStr,
          foods: [],
          totalNutrition: { calories: 0, protein: 0, carbohydrates: 0, fats: 0 },
        };
        log = {
          ...log,
          meals: [...log.meals, meal],
        };
      }

      // Create FoodEntry snapshotting the nutrition details
      const entry: FoodEntry = {
        id: `entry_${Date.now()}`,
        foodId: food.id,
        foodName: food.name,
        foodBrand: food.brand,
        quantity,
        servingUnit: food.servingUnit,
        multiplier: quantity / food.servingSize,
        nutritionSnapshot: calculateNutritionFactsForEntry(quantity, food.servingSize, food.nutritionFacts),
      };

      // Add to foods
      const updatedFoods = [...meal.foods, entry];
      const updatedMeal = {
        ...meal,
        foods: updatedFoods,
        totalNutrition: calculateMealTotals(updatedFoods),
      };

      const updatedMeals = log.meals.map((m) => (m.mealType === mealType ? updatedMeal : m));
      const updatedLog: DailyNutritionLog = {
        ...log,
        meals: updatedMeals,
        totalNutrition: calculateDailyNutritionTotals(updatedMeals),
        updatedAt: now,
      };

      await this.service.saveLog(userId, updatedLog);
      return ok(updatedLog);
    } catch (error) {
      return err(new AppError('FIREBASE_ERROR', 'Failed to add food to meal log', { originalError: error }));
    }
  }

  async removeFoodFromMeal(
    userId: string,
    dateStr: string,
    mealType: MealType,
    entryId: string
  ): Promise<Result<DailyNutritionLog, AppError>> {
    try {
      const log = await this.service.getLogByDate(userId, dateStr);
      if (!log) {
        return err(new AppError('NOT_FOUND', `Daily log for ${dateStr} not found`));
      }

      const meal = log.meals.find((m) => m.mealType === mealType);
      if (!meal) {
        return err(new AppError('NOT_FOUND', `Meal of type ${mealType} not found`));
      }

      const updatedFoods = meal.foods.filter((f) => f.id !== entryId);
      const updatedMeal = {
        ...meal,
        foods: updatedFoods,
        totalNutrition: calculateMealTotals(updatedFoods),
      };

      const updatedMeals = log.meals.map((m) => (m.mealType === mealType ? updatedMeal : m));
      const updatedLog: DailyNutritionLog = {
        ...log,
        meals: updatedMeals,
        totalNutrition: calculateDailyNutritionTotals(updatedMeals),
        updatedAt: new Date(),
      };

      await this.service.saveLog(userId, updatedLog);
      return ok(updatedLog);
    } catch (error) {
      return err(new AppError('FIREBASE_ERROR', 'Failed to remove food from meal log', { originalError: error }));
    }
  }

  async completeDailyLog(userId: string, dateStr: string, isCompleted: boolean): Promise<Result<DailyNutritionLog, AppError>> {
    try {
      const log = await this.service.getLogByDate(userId, dateStr);
      if (!log) {
        return err(new AppError('NOT_FOUND', `Daily log for ${dateStr} not found`));
      }

      const updatedLog: DailyNutritionLog = {
        ...log,
        isCompleted,
        updatedAt: new Date(),
      };

      await this.service.saveLog(userId, updatedLog);
      return ok(updatedLog);
    } catch (error) {
      return err(new AppError('FIREBASE_ERROR', 'Failed to update log completion status', { originalError: error }));
    }
  }

  // --- IGoalRepository ---

  async fetchGoals(userId: string): Promise<Result<NutritionGoal[], AppError>> {
    try {
      const goals = await this.service.fetchGoals(userId);
      return ok(goals);
    } catch (error) {
      return err(new AppError('FIREBASE_ERROR', 'Failed to fetch nutrition goals', { originalError: error }));
    }
  }

  async saveGoal(
    userId: string,
    goal: Omit<NutritionGoal, 'id' | 'userId' | 'createdAt' | 'updatedAt'>
  ): Promise<Result<NutritionGoal, AppError>> {
    try {
      const newGoal = await this.service.saveGoal(userId, goal);
      return ok(newGoal);
    } catch (error) {
      return err(new AppError('FIREBASE_ERROR', 'Failed to save nutrition goal', { originalError: error }));
    }
  }

  async toggleGoalActive(userId: string, goalId: string, isActive: boolean): Promise<Result<void, AppError>> {
    try {
      await this.service.toggleGoalActive(userId, goalId, isActive);
      return ok(undefined);
    } catch (error) {
      return err(new AppError('FIREBASE_ERROR', 'Failed to toggle nutrition goal active status', { originalError: error }));
    }
  }

  // --- ITemplateRepository ---

  async fetchTemplates(userId: string): Promise<Result<NutritionTemplate[], AppError>> {
    try {
      const templates = await this.service.fetchTemplates(userId);
      return ok(templates);
    } catch (error) {
      return err(new AppError('FIREBASE_ERROR', 'Failed to fetch nutrition templates', { originalError: error }));
    }
  }

  async createTemplate(
    userId: string,
    title: string,
    mealType: MealType,
    entries: FoodEntry[]
  ): Promise<Result<NutritionTemplate, AppError>> {
    try {
      const snapshottedFacts = entries.map((e) => e.nutritionSnapshot);
      const template = await this.service.createTemplate(userId, title, mealType, snapshottedFacts);
      return ok(template);
    } catch (error) {
      return err(new AppError('FIREBASE_ERROR', 'Failed to create meal template', { originalError: error }));
    }
  }

  async deleteTemplate(userId: string, templateId: string): Promise<Result<void, AppError>> {
    try {
      await this.service.deleteTemplate(userId, templateId);
      return ok(undefined);
    } catch (error) {
      return err(new AppError('FIREBASE_ERROR', 'Failed to delete meal template', { originalError: error }));
    }
  }

  // --- IAnalyticsRepository ---

  async fetchAnalyticsRecords(userId: string, limitDays = 30): Promise<Result<FeatureAnalytics[], AppError>> {
    try {
      const [logsRes, goalsRes] = await Promise.all([
        this.fetchLogs(userId, limitDays),
        this.fetchGoals(userId),
      ]);

      if (!logsRes.success) return err(logsRes.error);
      if (!goalsRes.success) return err(goalsRes.error);

      const activeGoal = goalsRes.data.find((g) => g.isActive) || {
        calorieTarget: 2000,
        proteinTarget: 150,
        carbTarget: 200,
        fatTarget: 65,
      } as NutritionGoal;

      const records = buildFeatureAnalytics(logsRes.data, activeGoal);
      return ok(records);
    } catch (error) {
      return err(new AppError('UNKNOWN_ERROR', 'Failed to construct nutrition analytics', { originalError: error }));
    }
  }
}

export const nutritionRepository = new NutritionRepository();
