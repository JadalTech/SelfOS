/**
 * Presentation Mappers for Nutrition Module
 */

import type {
  Food,
  FoodEntry,
  Meal,
  DailyNutritionLog,
  NutritionGoal,
  NutritionTemplate,
} from '../types/nutrition.types';
import type {
  FoodVM,
  FoodEntryVM,
  MealVM,
  DailyNutritionVM,
  NutritionGoalVM,
  NutritionTemplateVM,
} from '../types/viewmodel.types';
import { FOOD_CATEGORY_OPTIONS, SERVING_UNIT_OPTIONS, MEAL_TYPE_OPTIONS } from '../constants/nutrition.constants';

export function mapToFoodVM(food: Food): FoodVM {
  const categoryOpt = FOOD_CATEGORY_OPTIONS.find((c) => c.value === food.category);
  const categoryLabel = categoryOpt ? categoryOpt.label : 'Custom';
  
  const unitOpt = SERVING_UNIT_OPTIONS.find((u) => u.value === food.servingUnit);
  const servingUnitLabel = unitOpt ? unitOpt.label : food.servingUnit;

  const facts = food.nutritionFacts;

  return {
    id: food.id,
    name: food.name,
    brand: food.brand || '',
    category: food.category,
    categoryLabel,
    servingSize: food.servingSize,
    servingUnit: food.servingUnit,
    servingUnitLabel,
    calories: facts.calories,
    caloriesLabel: `${facts.calories} kcal`,
    protein: facts.protein,
    proteinLabel: `${facts.protein}g`,
    carbohydrates: facts.carbohydrates,
    carbohydratesLabel: `${facts.carbohydrates}g`,
    fats: facts.fats,
    fatsLabel: `${facts.fats}g`,
    fiber: facts.fiber,
    fiberLabel: facts.fiber !== undefined ? `${facts.fiber}g` : undefined,
    sugar: facts.sugar,
    sugarLabel: facts.sugar !== undefined ? `${facts.sugar}g` : undefined,
    sodium: facts.sodium,
    sodiumLabel: facts.sodium !== undefined ? `${facts.sodium}mg` : undefined,
    allergens: facts.allergens || [],
    dietTags: facts.dietTags || [],
    isCustom: !!food.userId,
    verified: food.verified ?? false,
    image: food.image,
  };
}

export function mapToFoodEntryVM(entry: FoodEntry): FoodEntryVM {
  const snap = entry.nutritionSnapshot;
  return {
    id: entry.id,
    foodId: entry.foodId,
    foodName: entry.foodName,
    foodBrand: entry.foodBrand,
    quantity: entry.quantity,
    servingUnit: entry.servingUnit,
    multiplier: entry.multiplier,
    calories: snap.calories,
    caloriesLabel: `${snap.calories} kcal`,
    protein: snap.protein,
    proteinLabel: `${snap.protein}g`,
    carbohydrates: snap.carbohydrates,
    carbohydratesLabel: `${snap.carbohydrates}g`,
    fats: snap.fats,
    fatsLabel: `${snap.fats}g`,
    fiber: snap.fiber,
    sugar: snap.sugar,
    sodium: snap.sodium,
  };
}

export function mapToMealVM(meal: Meal): MealVM {
  const mealOpt = MEAL_TYPE_OPTIONS.find((m) => m.value === meal.mealType);
  const mealTypeLabel = mealOpt ? mealOpt.label : 'Meal';
  const mealTypeIcon = mealOpt ? mealOpt.icon : 'restaurant-outline';

  const foodsVM = meal.foods.map(mapToFoodEntryVM);
  const totals = meal.totalNutrition;

  return {
    id: meal.id,
    mealType: meal.mealType,
    mealTypeLabel,
    mealTypeIcon,
    foods: foodsVM,
    totalCalories: totals.calories,
    totalCaloriesLabel: `${totals.calories} kcal`,
    totalProtein: totals.protein,
    totalProteinLabel: `${totals.protein}g`,
    totalCarbs: totals.carbohydrates,
    totalCarbsLabel: `${totals.carbohydrates}g`,
    totalFats: totals.fats,
    totalFatsLabel: `${totals.fats}g`,
  };
}

export function mapToDailyNutritionVM(log: DailyNutritionLog): DailyNutritionVM {
  const dateObj = new Date(log.date);
  const dateFormatted = dateObj.toLocaleDateString(undefined, {
    weekday: 'long',
    month: 'short',
    day: 'numeric',
  });

  const mealsVM = log.meals.map(mapToMealVM);
  const totals = log.totalNutrition;
  const waterMl = log.hydrationReference?.totalWaterMl || 0;

  return {
    id: log.id,
    date: log.date,
    dateFormatted,
    meals: mealsVM,
    isCompleted: log.isCompleted,
    totalCalories: totals.calories,
    totalCaloriesLabel: `${totals.calories} kcal`,
    totalProtein: totals.protein,
    totalProteinLabel: `${totals.protein}g`,
    totalCarbs: totals.carbohydrates,
    totalCarbsLabel: `${totals.carbohydrates}g`,
    totalFats: totals.fats,
    totalFatsLabel: `${totals.fats}g`,
    waterMl,
    waterMlLabel: `${waterMl} ml`,
  };
}

export function mapToGoalVM(goal: NutritionGoal): NutritionGoalVM {
  return {
    id: goal.id,
    calorieTarget: goal.calorieTarget,
    calorieTargetLabel: `${goal.calorieTarget} kcal`,
    proteinTarget: goal.proteinTarget,
    proteinTargetLabel: `${goal.proteinTarget}g`,
    carbTarget: goal.carbTarget,
    carbTargetLabel: `${goal.carbTarget}g`,
    fatTarget: goal.fatTarget,
    fatTargetLabel: `${goal.fatTarget}g`,
    fiberTarget: goal.fiberTarget,
    fiberTargetLabel: goal.fiberTarget !== undefined ? `${goal.fiberTarget}g` : undefined,
    isActive: goal.isActive,
  };
}

export function mapToTemplateVM(template: NutritionTemplate): NutritionTemplateVM {
  const mealOpt = MEAL_TYPE_OPTIONS.find((m) => m.value === template.mealType);
  const mealTypeLabel = mealOpt ? mealOpt.label : 'Meal';

  let totalCalories = 0;
  for (const food of template.foods) {
    totalCalories += food.nutritionSnapshot.calories;
  }

  return {
    id: template.id,
    title: template.title,
    mealTypeLabel,
    foodsCount: template.foods.length,
    totalCaloriesLabel: `${totalCalories} kcal`,
  };
}

export function mapToFoodVMs(foods: Food[]): FoodVM[] {
  return foods.map(mapToFoodVM);
}

export function mapToDailyNutritionVMs(logs: DailyNutritionLog[]): DailyNutritionVM[] {
  return logs.map(mapToDailyNutritionVM);
}

export function mapToGoalVMs(goals: NutritionGoal[]): NutritionGoalVM[] {
  return goals.map(mapToGoalVM);
}

export function mapToTemplateVMs(templates: NutritionTemplate[]): NutritionTemplateVM[] {
  return templates.map(mapToTemplateVM);
}
