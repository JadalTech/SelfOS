/**
 * Nutrition Validation Schemas (Zod)
 */

import { z } from 'zod';

export const nutritionFactsSchema = z.object({
  calories: z.number().min(0, 'Calories must be greater than or equal to 0'),
  protein: z.number().min(0, 'Protein must be greater than or equal to 0'),
  carbohydrates: z.number().min(0, 'Carbohydrates must be greater than or equal to 0'),
  fats: z.number().min(0, 'Fats must be greater than or equal to 0'),
  fiber: z.number().min(0).optional(),
  sugar: z.number().min(0).optional(),
  sodium: z.number().min(0).optional(),
  vitamins: z.object({
    vitaminA: z.number().min(0).optional(),
    vitaminC: z.number().min(0).optional(),
    vitaminD: z.number().min(0).optional(),
    vitaminE: z.number().min(0).optional(),
    vitaminB12: z.number().min(0).optional(),
  }).optional(),
  minerals: z.object({
    iron: z.number().min(0).optional(),
    calcium: z.number().min(0).optional(),
    magnesium: z.number().min(0).optional(),
    potassium: z.number().min(0).optional(),
  }).optional(),
  allergens: z.array(z.enum([
    'peanut',
    'tree-nut',
    'milk',
    'egg',
    'soy',
    'wheat',
    'fish',
    'shellfish',
  ])).optional(),
  dietTags: z.array(z.enum([
    'vegan',
    'vegetarian',
    'keto',
    'gluten-free',
    'dairy-free',
    'low-carb',
    'halal',
    'kosher',
  ])).optional(),
});

export const foodSchema = z.object({
  name: z.string().min(1, 'Food name is required').max(100),
  brand: z.string().max(100).optional(),
  category: z.enum([
    'fruit',
    'vegetable',
    'dairy',
    'grain',
    'protein',
    'beverage',
    'snack',
    'fat-oil',
    'custom',
  ]),
  servingSize: z.number().min(0.1, 'Serving size must be greater than 0'),
  servingUnit: z.enum([
    'g',
    'ml',
    'oz',
    'cup',
    'tbsp',
    'tsp',
    'piece',
    'serving',
  ]),
  nutritionFacts: nutritionFactsSchema,
  barcode: z.string().optional(),
  source: z.enum(['global', 'user']).default('user'),
  verified: z.boolean().default(false),
  externalId: z.string().optional(),
  image: z.string().url('Invalid image URL').optional().or(z.literal('')),
  manufacturer: z.string().optional(),
});

export const foodEntrySchema = z.object({
  id: z.string(),
  foodId: z.string().min(1, 'Food reference is required'),
  foodName: z.string().min(1, 'Food name is required'),
  foodBrand: z.string().optional(),
  quantity: z.number().min(0.1, 'Quantity must be greater than 0'),
  servingUnit: z.enum([
    'g',
    'ml',
    'oz',
    'cup',
    'tbsp',
    'tsp',
    'piece',
    'serving',
  ]),
  multiplier: z.number().min(0),
  nutritionSnapshot: nutritionFactsSchema,
});

export const mealSchema = z.object({
  id: z.string(),
  mealType: z.enum(['breakfast', 'lunch', 'dinner', 'snack']),
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Date must be in YYYY-MM-DD format'),
  foods: z.array(foodEntrySchema),
  totalNutrition: nutritionFactsSchema,
  notes: z.string().max(500).optional(),
});

export const dailyNutritionLogSchema = z.object({
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Date must be in YYYY-MM-DD format'),
  meals: z.array(mealSchema),
  totalNutrition: nutritionFactsSchema,
  isCompleted: z.boolean().default(false),
  hydrationReference: z.object({
    logId: z.string().optional(),
    totalWaterMl: z.number().optional(),
  }).optional(),
});

export const nutritionGoalSchema = z.object({
  calorieTarget: z.number().min(500, 'Calorie target must be at least 500 kcal').max(10000),
  proteinTarget: z.number().min(10, 'Protein target must be at least 10g').max(500),
  carbTarget: z.number().min(10, 'Carbohydrates target must be at least 10g').max(1000),
  fatTarget: z.number().min(5, 'Fat target must be at least 5g').max(300),
  fiberTarget: z.number().min(0).optional(),
  isActive: z.boolean().default(true),
});

export const nutritionTemplateSchema = z.object({
  title: z.string().min(1, 'Template title is required').max(100),
  mealType: z.enum(['breakfast', 'lunch', 'dinner', 'snack']),
  foods: z.array(foodEntrySchema),
});

export type FoodFormValues = z.infer<typeof foodSchema>;
export type FoodEntryFormValues = z.infer<typeof foodEntrySchema>;
export type MealFormValues = z.infer<typeof mealSchema>;
export type DailyNutritionLogFormValues = z.infer<typeof dailyNutritionLogSchema>;
export type NutritionGoalFormValues = z.infer<typeof nutritionGoalSchema>;
export type NutritionTemplateFormValues = z.infer<typeof nutritionTemplateSchema>;
