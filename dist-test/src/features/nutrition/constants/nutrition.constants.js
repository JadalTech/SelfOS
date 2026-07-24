"use strict";
/**
 * Nutrition Module Constants & Configurations
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.ALLERGEN_OPTIONS = exports.DIET_TAG_OPTIONS = exports.MEAL_TYPE_OPTIONS = exports.SERVING_UNIT_OPTIONS = exports.FOOD_CATEGORY_OPTIONS = exports.NUTRITION_COLLECTIONS = void 0;
exports.NUTRITION_COLLECTIONS = {
    GLOBAL_FOODS: 'food_catalog',
    USER_FOODS: 'user_foods',
    LOGS: 'nutrition_logs',
    GOALS: 'nutrition_goals',
    TEMPLATES: 'nutrition_templates',
};
exports.FOOD_CATEGORY_OPTIONS = [
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
exports.SERVING_UNIT_OPTIONS = [
    { value: 'g', label: 'Grams (g)' },
    { value: 'ml', label: 'Milliliters (ml)' },
    { value: 'oz', label: 'Ounces (oz)' },
    { value: 'cup', label: 'Cups' },
    { value: 'tbsp', label: 'Tablespoons (tbsp)' },
    { value: 'tsp', label: 'Teaspoons (tsp)' },
    { value: 'piece', label: 'Whole Pieces' },
    { value: 'serving', label: 'Servings' },
];
exports.MEAL_TYPE_OPTIONS = [
    { value: 'breakfast', label: 'Breakfast', icon: 'sunny-outline' },
    { value: 'lunch', label: 'Lunch', icon: 'partly-sunny-outline' },
    { value: 'dinner', label: 'Dinner', icon: 'moon-outline' },
    { value: 'snack', label: 'Snack', icon: 'rose-outline' },
];
exports.DIET_TAG_OPTIONS = [
    { value: 'vegan', label: 'Vegan' },
    { value: 'vegetarian', label: 'Vegetarian' },
    { value: 'keto', label: 'Keto Friendly' },
    { value: 'gluten-free', label: 'Gluten Free' },
    { value: 'dairy-free', label: 'Dairy Free' },
    { value: 'low-carb', label: 'Low Carb' },
    { value: 'halal', label: 'Halal' },
    { value: 'kosher', label: 'Kosher' },
];
exports.ALLERGEN_OPTIONS = [
    { value: 'peanut', label: 'Peanuts' },
    { value: 'tree-nut', label: 'Tree Nuts' },
    { value: 'milk', label: 'Milk/Lactose' },
    { value: 'egg', label: 'Eggs' },
    { value: 'soy', label: 'Soy' },
    { value: 'wheat', label: 'Wheat/Gluten' },
    { value: 'fish', label: 'Fish' },
    { value: 'shellfish', label: 'Shellfish' },
];
