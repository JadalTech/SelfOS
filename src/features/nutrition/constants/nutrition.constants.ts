/**
 * Nutrition Module Constants & Configurations
 */

import type { FoodCategory, ServingUnit, MealType, DietTag, Allergen } from '../types/nutrition.types';

export const NUTRITION_COLLECTIONS = {
  GLOBAL_FOODS: 'food_catalog',
  USER_FOODS: 'user_foods',
  LOGS: 'nutrition_logs',
  GOALS: 'nutrition_goals',
  TEMPLATES: 'nutrition_templates',
} as const;

export const FOOD_CATEGORY_OPTIONS: { value: FoodCategory; label: string; icon: string }[] = [
  { value: 'fruit', label: 'Fruit', icon: 'nutrition-outline' },
  { value: 'vegetable', label: 'Vegetable', icon: 'leaf-outline' },
  { value: 'dairy', label: 'Dairy', icon: 'egg-outline' },
  { value: 'grain', label: 'Grain & Bread', icon: 'cafe-outline' },
  { value: 'protein', label: 'Meat & Protein', icon: 'fish-outline' },
  { value: 'beverage', label: 'Beverage', icon: 'water-outline' },
  { value: 'snack', label: 'Snack & Sweets', icon: 'ice-cream-outline' },
  { value: 'fat-oil', label: 'Fats & Oils', icon: 'color-fill-outline' },
  { value: 'custom', label: 'Custom Recipe', icon: 'restaurant-outline' },
];

export const SERVING_UNIT_OPTIONS: { value: ServingUnit; label: string }[] = [
  { value: 'g', label: 'Grams (g)' },
  { value: 'ml', label: 'Milliliters (ml)' },
  { value: 'oz', label: 'Ounces (oz)' },
  { value: 'cup', label: 'Cups' },
  { value: 'tbsp', label: 'Tablespoons (tbsp)' },
  { value: 'tsp', label: 'Teaspoons (tsp)' },
  { value: 'piece', label: 'Whole Pieces' },
  { value: 'serving', label: 'Servings' },
];

export const MEAL_TYPE_OPTIONS: { value: MealType; label: string; icon: string }[] = [
  { value: 'breakfast', label: 'Breakfast', icon: 'sunny-outline' },
  { value: 'lunch', label: 'Lunch', icon: 'partly-sunny-outline' },
  { value: 'dinner', label: 'Dinner', icon: 'moon-outline' },
  { value: 'snack', label: 'Snack', icon: 'rose-outline' },
];

export const DIET_TAG_OPTIONS: { value: DietTag; label: string }[] = [
  { value: 'vegan', label: 'Vegan' },
  { value: 'vegetarian', label: 'Vegetarian' },
  { value: 'keto', label: 'Keto Friendly' },
  { value: 'gluten-free', label: 'Gluten Free' },
  { value: 'dairy-free', label: 'Dairy Free' },
  { value: 'low-carb', label: 'Low Carb' },
  { value: 'halal', label: 'Halal' },
  { value: 'kosher', label: 'Kosher' },
];

export const ALLERGEN_OPTIONS: { value: Allergen; label: string }[] = [
  { value: 'peanut', label: 'Peanuts' },
  { value: 'tree-nut', label: 'Tree Nuts' },
  { value: 'milk', label: 'Milk/Lactose' },
  { value: 'egg', label: 'Eggs' },
  { value: 'soy', label: 'Soy' },
  { value: 'wheat', label: 'Wheat/Gluten' },
  { value: 'fish', label: 'Fish' },
  { value: 'shellfish', label: 'Shellfish' },
];
