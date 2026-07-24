"use strict";
/**
 * Nutrition Validation Schemas (Zod)
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.nutritionTemplateSchema = exports.nutritionGoalSchema = exports.dailyNutritionLogSchema = exports.mealSchema = exports.foodEntrySchema = exports.foodSchema = exports.nutritionFactsSchema = void 0;
const zod_1 = require("zod");
exports.nutritionFactsSchema = zod_1.z.object({
    calories: zod_1.z.number().min(0, 'Calories must be greater than or equal to 0'),
    protein: zod_1.z.number().min(0, 'Protein must be greater than or equal to 0'),
    carbohydrates: zod_1.z.number().min(0, 'Carbohydrates must be greater than or equal to 0'),
    fats: zod_1.z.number().min(0, 'Fats must be greater than or equal to 0'),
    fiber: zod_1.z.number().min(0).optional(),
    sugar: zod_1.z.number().min(0).optional(),
    sodium: zod_1.z.number().min(0).optional(),
    vitamins: zod_1.z.object({
        vitaminA: zod_1.z.number().min(0).optional(),
        vitaminC: zod_1.z.number().min(0).optional(),
        vitaminD: zod_1.z.number().min(0).optional(),
        vitaminE: zod_1.z.number().min(0).optional(),
        vitaminB12: zod_1.z.number().min(0).optional(),
    }).optional(),
    minerals: zod_1.z.object({
        iron: zod_1.z.number().min(0).optional(),
        calcium: zod_1.z.number().min(0).optional(),
        magnesium: zod_1.z.number().min(0).optional(),
        potassium: zod_1.z.number().min(0).optional(),
    }).optional(),
    allergens: zod_1.z.array(zod_1.z.enum([
        'peanut',
        'tree-nut',
        'milk',
        'egg',
        'soy',
        'wheat',
        'fish',
        'shellfish',
    ])).optional(),
    dietTags: zod_1.z.array(zod_1.z.enum([
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
exports.foodSchema = zod_1.z.object({
    name: zod_1.z.string().min(1, 'Food name is required').max(100),
    brand: zod_1.z.string().max(100).optional(),
    category: zod_1.z.enum([
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
    servingSize: zod_1.z.number().min(0.1, 'Serving size must be greater than 0'),
    servingUnit: zod_1.z.enum([
        'g',
        'ml',
        'oz',
        'cup',
        'tbsp',
        'tsp',
        'piece',
        'serving',
    ]),
    nutritionFacts: exports.nutritionFactsSchema,
    barcode: zod_1.z.string().optional(),
    source: zod_1.z.enum(['global', 'user']).default('user'),
    verified: zod_1.z.boolean().default(false),
    externalId: zod_1.z.string().optional(),
    image: zod_1.z.string().url('Invalid image URL').optional().or(zod_1.z.literal('')),
    manufacturer: zod_1.z.string().optional(),
});
exports.foodEntrySchema = zod_1.z.object({
    id: zod_1.z.string(),
    foodId: zod_1.z.string().min(1, 'Food reference is required'),
    foodName: zod_1.z.string().min(1, 'Food name is required'),
    foodBrand: zod_1.z.string().optional(),
    quantity: zod_1.z.number().min(0.1, 'Quantity must be greater than 0'),
    servingUnit: zod_1.z.enum([
        'g',
        'ml',
        'oz',
        'cup',
        'tbsp',
        'tsp',
        'piece',
        'serving',
    ]),
    multiplier: zod_1.z.number().min(0),
    nutritionSnapshot: exports.nutritionFactsSchema,
});
exports.mealSchema = zod_1.z.object({
    id: zod_1.z.string(),
    mealType: zod_1.z.enum(['breakfast', 'lunch', 'dinner', 'snack']),
    date: zod_1.z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Date must be in YYYY-MM-DD format'),
    foods: zod_1.z.array(exports.foodEntrySchema),
    totalNutrition: exports.nutritionFactsSchema,
    notes: zod_1.z.string().max(500).optional(),
});
exports.dailyNutritionLogSchema = zod_1.z.object({
    date: zod_1.z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Date must be in YYYY-MM-DD format'),
    meals: zod_1.z.array(exports.mealSchema),
    totalNutrition: exports.nutritionFactsSchema,
    isCompleted: zod_1.z.boolean().default(false),
    hydrationReference: zod_1.z.object({
        logId: zod_1.z.string().optional(),
        totalWaterMl: zod_1.z.number().optional(),
    }).optional(),
});
exports.nutritionGoalSchema = zod_1.z.object({
    calorieTarget: zod_1.z.number().min(500, 'Calorie target must be at least 500 kcal').max(10000),
    proteinTarget: zod_1.z.number().min(10, 'Protein target must be at least 10g').max(500),
    carbTarget: zod_1.z.number().min(10, 'Carbohydrates target must be at least 10g').max(1000),
    fatTarget: zod_1.z.number().min(5, 'Fat target must be at least 5g').max(300),
    fiberTarget: zod_1.z.number().min(0).optional(),
    isActive: zod_1.z.boolean().default(true),
});
exports.nutritionTemplateSchema = zod_1.z.object({
    title: zod_1.z.string().min(1, 'Template title is required').max(100),
    mealType: zod_1.z.enum(['breakfast', 'lunch', 'dinner', 'snack']),
    foods: zod_1.z.array(exports.foodEntrySchema),
});
