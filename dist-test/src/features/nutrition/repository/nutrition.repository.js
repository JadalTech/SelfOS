"use strict";
/**
 * Unified Repository Facade for Nutrition Module
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.nutritionRepository = exports.NutritionRepository = void 0;
const types_1 = require("../../../shared/types");
const AppError_1 = require("../../../shared/errors/AppError");
const nutrition_service_1 = require("../services/nutrition.service");
const nutritionEngine_1 = require("../engine/nutritionEngine");
const nutritionAnalytics_1 = require("../analytics/utils/nutritionAnalytics");
class NutritionRepository {
    service;
    constructor(service = nutrition_service_1.nutritionService) {
        this.service = service;
    }
    // --- IFoodRepository ---
    async searchFoods(userId, searchTerm) {
        try {
            const [globals, users] = await Promise.all([
                this.service.searchGlobalFoods(searchTerm),
                this.service.fetchUserFoods(userId),
            ]);
            const filteredUsers = searchTerm
                ? users.filter((f) => f.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                    (f.brand && f.brand.toLowerCase().includes(searchTerm.toLowerCase())))
                : users;
            // Merge and return
            return (0, types_1.ok)([...filteredUsers, ...globals]);
        }
        catch (error) {
            return (0, types_1.err)(new AppError_1.AppError('FIREBASE_ERROR', 'Failed to search foods catalog', { originalError: error }));
        }
    }
    async createUserFood(userId, food) {
        try {
            const newFood = await this.service.createUserFood(userId, food);
            return (0, types_1.ok)(newFood);
        }
        catch (error) {
            return (0, types_1.err)(new AppError_1.AppError('FIREBASE_ERROR', 'Failed to create user food', { originalError: error }));
        }
    }
    async deleteUserFood(userId, foodId) {
        try {
            await this.service.deleteUserFood(userId, foodId);
            return (0, types_1.ok)(undefined);
        }
        catch (error) {
            return (0, types_1.err)(new AppError_1.AppError('FIREBASE_ERROR', 'Failed to delete user food', { originalError: error }));
        }
    }
    // --- IMealRepository ---
    async fetchLogs(userId, limitDays = 30) {
        try {
            const logs = await this.service.fetchLogs(userId, limitDays);
            return (0, types_1.ok)(logs);
        }
        catch (error) {
            return (0, types_1.err)(new AppError_1.AppError('FIREBASE_ERROR', 'Failed to fetch nutrition logs', { originalError: error }));
        }
    }
    async getLogByDate(userId, dateStr) {
        try {
            const log = await this.service.getLogByDate(userId, dateStr);
            return (0, types_1.ok)(log);
        }
        catch (error) {
            return (0, types_1.err)(new AppError_1.AppError('FIREBASE_ERROR', `Failed to fetch log for date ${dateStr}`, { originalError: error }));
        }
    }
    async addFoodToMeal(userId, dateStr, mealType, food, quantity) {
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
            const entry = {
                id: `entry_${Date.now()}`,
                foodId: food.id,
                foodName: food.name,
                foodBrand: food.brand,
                quantity,
                servingUnit: food.servingUnit,
                multiplier: quantity / food.servingSize,
                nutritionSnapshot: (0, nutritionEngine_1.calculateNutritionFactsForEntry)(quantity, food.servingSize, food.nutritionFacts),
            };
            // Add to foods
            const updatedFoods = [...meal.foods, entry];
            const updatedMeal = {
                ...meal,
                foods: updatedFoods,
                totalNutrition: (0, nutritionEngine_1.calculateMealTotals)(updatedFoods),
            };
            const updatedMeals = log.meals.map((m) => (m.mealType === mealType ? updatedMeal : m));
            const updatedLog = {
                ...log,
                meals: updatedMeals,
                totalNutrition: (0, nutritionEngine_1.calculateDailyNutritionTotals)(updatedMeals),
                updatedAt: now,
            };
            await this.service.saveLog(userId, updatedLog);
            return (0, types_1.ok)(updatedLog);
        }
        catch (error) {
            return (0, types_1.err)(new AppError_1.AppError('FIREBASE_ERROR', 'Failed to add food to meal log', { originalError: error }));
        }
    }
    async removeFoodFromMeal(userId, dateStr, mealType, entryId) {
        try {
            const log = await this.service.getLogByDate(userId, dateStr);
            if (!log) {
                return (0, types_1.err)(new AppError_1.AppError('NOT_FOUND', `Daily log for ${dateStr} not found`));
            }
            const meal = log.meals.find((m) => m.mealType === mealType);
            if (!meal) {
                return (0, types_1.err)(new AppError_1.AppError('NOT_FOUND', `Meal of type ${mealType} not found`));
            }
            const updatedFoods = meal.foods.filter((f) => f.id !== entryId);
            const updatedMeal = {
                ...meal,
                foods: updatedFoods,
                totalNutrition: (0, nutritionEngine_1.calculateMealTotals)(updatedFoods),
            };
            const updatedMeals = log.meals.map((m) => (m.mealType === mealType ? updatedMeal : m));
            const updatedLog = {
                ...log,
                meals: updatedMeals,
                totalNutrition: (0, nutritionEngine_1.calculateDailyNutritionTotals)(updatedMeals),
                updatedAt: new Date(),
            };
            await this.service.saveLog(userId, updatedLog);
            return (0, types_1.ok)(updatedLog);
        }
        catch (error) {
            return (0, types_1.err)(new AppError_1.AppError('FIREBASE_ERROR', 'Failed to remove food from meal log', { originalError: error }));
        }
    }
    async completeDailyLog(userId, dateStr, isCompleted) {
        try {
            const log = await this.service.getLogByDate(userId, dateStr);
            if (!log) {
                return (0, types_1.err)(new AppError_1.AppError('NOT_FOUND', `Daily log for ${dateStr} not found`));
            }
            const updatedLog = {
                ...log,
                isCompleted,
                updatedAt: new Date(),
            };
            await this.service.saveLog(userId, updatedLog);
            return (0, types_1.ok)(updatedLog);
        }
        catch (error) {
            return (0, types_1.err)(new AppError_1.AppError('FIREBASE_ERROR', 'Failed to update log completion status', { originalError: error }));
        }
    }
    // --- IGoalRepository ---
    async fetchGoals(userId) {
        try {
            const goals = await this.service.fetchGoals(userId);
            return (0, types_1.ok)(goals);
        }
        catch (error) {
            return (0, types_1.err)(new AppError_1.AppError('FIREBASE_ERROR', 'Failed to fetch nutrition goals', { originalError: error }));
        }
    }
    async saveGoal(userId, goal) {
        try {
            const newGoal = await this.service.saveGoal(userId, goal);
            return (0, types_1.ok)(newGoal);
        }
        catch (error) {
            return (0, types_1.err)(new AppError_1.AppError('FIREBASE_ERROR', 'Failed to save nutrition goal', { originalError: error }));
        }
    }
    async toggleGoalActive(userId, goalId, isActive) {
        try {
            await this.service.toggleGoalActive(userId, goalId, isActive);
            return (0, types_1.ok)(undefined);
        }
        catch (error) {
            return (0, types_1.err)(new AppError_1.AppError('FIREBASE_ERROR', 'Failed to toggle nutrition goal active status', { originalError: error }));
        }
    }
    // --- ITemplateRepository ---
    async fetchTemplates(userId) {
        try {
            const templates = await this.service.fetchTemplates(userId);
            return (0, types_1.ok)(templates);
        }
        catch (error) {
            return (0, types_1.err)(new AppError_1.AppError('FIREBASE_ERROR', 'Failed to fetch nutrition templates', { originalError: error }));
        }
    }
    async createTemplate(userId, title, mealType, entries) {
        try {
            const snapshottedFacts = entries.map((e) => e.nutritionSnapshot);
            const template = await this.service.createTemplate(userId, title, mealType, snapshottedFacts);
            return (0, types_1.ok)(template);
        }
        catch (error) {
            return (0, types_1.err)(new AppError_1.AppError('FIREBASE_ERROR', 'Failed to create meal template', { originalError: error }));
        }
    }
    async deleteTemplate(userId, templateId) {
        try {
            await this.service.deleteTemplate(userId, templateId);
            return (0, types_1.ok)(undefined);
        }
        catch (error) {
            return (0, types_1.err)(new AppError_1.AppError('FIREBASE_ERROR', 'Failed to delete meal template', { originalError: error }));
        }
    }
    // --- IAnalyticsRepository ---
    async fetchAnalyticsRecords(userId, limitDays = 30) {
        try {
            const [logsRes, goalsRes] = await Promise.all([
                this.fetchLogs(userId, limitDays),
                this.fetchGoals(userId),
            ]);
            if (!logsRes.success)
                return (0, types_1.err)(logsRes.error);
            if (!goalsRes.success)
                return (0, types_1.err)(goalsRes.error);
            const activeGoal = goalsRes.data.find((g) => g.isActive) || {
                calorieTarget: 2000,
                proteinTarget: 150,
                carbTarget: 200,
                fatTarget: 65,
            };
            const records = (0, nutritionAnalytics_1.buildFeatureAnalytics)(logsRes.data, activeGoal);
            return (0, types_1.ok)(records);
        }
        catch (error) {
            return (0, types_1.err)(new AppError_1.AppError('UNKNOWN_ERROR', 'Failed to construct nutrition analytics', { originalError: error }));
        }
    }
}
exports.NutritionRepository = NutritionRepository;
exports.nutritionRepository = new NutritionRepository();
