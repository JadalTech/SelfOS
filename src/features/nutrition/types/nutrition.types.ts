/**
 * Nutrition Module Domain Types & Enums
 */

export type FoodCategory =
  | 'fruit'
  | 'vegetable'
  | 'dairy'
  | 'grain'
  | 'protein'
  | 'beverage'
  | 'snack'
  | 'fat-oil'
  | 'custom';

export type MealType = 'breakfast' | 'lunch' | 'dinner' | 'snack';

export type ServingUnit =
  | 'g'
  | 'ml'
  | 'oz'
  | 'cup'
  | 'tbsp'
  | 'tsp'
  | 'piece'
  | 'serving';

export type DietTag =
  | 'vegan'
  | 'vegetarian'
  | 'keto'
  | 'gluten-free'
  | 'dairy-free'
  | 'low-carb'
  | 'halal'
  | 'kosher';

export type Allergen =
  | 'peanut'
  | 'tree-nut'
  | 'milk'
  | 'egg'
  | 'soy'
  | 'wheat'
  | 'fish'
  | 'shellfish';

export type GoalType =
  | 'calorie-target'
  | 'protein-target'
  | 'carb-target'
  | 'fat-target'
  | 'fiber-target';

export interface NutritionFacts {
  readonly calories: number; // kcal
  readonly protein: number; // grams
  readonly carbohydrates: number; // grams
  readonly fats: number; // grams
  readonly fiber?: number; // grams
  readonly sugar?: number; // grams
  readonly sodium?: number; // mg
  readonly vitamins?: {
    readonly vitaminA?: number; // mcg
    readonly vitaminC?: number; // mg
    readonly vitaminD?: number; // mcg
    readonly vitaminE?: number; // mg
    readonly vitaminB12?: number; // mcg
  };
  readonly minerals?: {
    readonly iron?: number; // mg
    readonly calcium?: number; // mg
    readonly magnesium?: number; // mg
    readonly potassium?: number; // mg
  };
  readonly allergens?: Allergen[];
  readonly dietTags?: DietTag[];
}

export interface Food {
  readonly id: string;
  readonly userId?: string; // Empty for global_catalog, set for user custom foods
  readonly name: string;
  readonly brand?: string;
  readonly category: FoodCategory;
  readonly servingSize: number;
  readonly servingUnit: ServingUnit;
  readonly nutritionFacts: NutritionFacts;
  // Metadata for future expansion
  readonly barcode?: string;
  readonly source?: 'global' | 'user';
  readonly verified?: boolean;
  readonly externalId?: string;
  readonly image?: string;
  readonly manufacturer?: string;
  readonly createdAt: Date;
  readonly updatedAt: Date;
}

export interface FoodEntry {
  readonly id: string;
  readonly foodId: string;
  readonly foodName: string;
  readonly foodBrand?: string;
  readonly quantity: number; // Consumed amount
  readonly servingUnit: ServingUnit;
  readonly multiplier: number; // quantity / servingSize
  // Snapshot for historical preservation (so changes in food catalog don't alter history)
  readonly nutritionSnapshot: NutritionFacts;
}

export interface Meal {
  readonly id: string;
  readonly mealType: MealType;
  readonly date: string; // YYYY-MM-DD
  readonly foods: FoodEntry[];
  readonly totalNutrition: NutritionFacts;
  readonly notes?: string;
}

export interface DailyNutritionLog {
  readonly id: string;
  readonly userId: string;
  readonly date: string; // YYYY-MM-DD
  readonly meals: Meal[];
  readonly totalNutrition: NutritionFacts;
  readonly isCompleted: boolean;
  readonly hydrationReference?: {
    readonly logId?: string;
    readonly totalWaterMl?: number;
  };
  readonly createdAt: Date;
  readonly updatedAt: Date;
}

export interface NutritionGoal {
  readonly id: string;
  readonly userId: string;
  readonly calorieTarget: number;
  readonly proteinTarget: number;
  readonly carbTarget: number;
  readonly fatTarget: number;
  readonly fiberTarget?: number;
  readonly isActive: boolean;
  readonly createdAt: Date;
  readonly updatedAt: Date;
}

export interface NutritionTemplate {
  readonly id: string;
  readonly userId: string;
  readonly title: string;
  readonly mealType: MealType;
  readonly foods: FoodEntry[];
  readonly createdAt: Date;
}
