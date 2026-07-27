"use strict";
/**
 * Firestore Custom Converters for Nutrition Module
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.nutritionTemplateConverter = exports.nutritionGoalConverter = exports.nutritionLogConverter = exports.nutritionFoodConverter = void 0;
const firestore_1 = require("firebase/firestore");
exports.nutritionFoodConverter = {
    toFirestore(food) {
        return {
            userId: food.userId ?? null,
            name: food.name,
            brand: food.brand ?? null,
            category: food.category,
            servingSize: food.servingSize,
            servingUnit: food.servingUnit,
            nutritionFacts: food.nutritionFacts || {},
            barcode: food.barcode ?? null,
            source: food.source ?? 'user',
            verified: food.verified ?? false,
            externalId: food.externalId ?? null,
            image: food.image ?? null,
            manufacturer: food.manufacturer ?? null,
            createdAt: food.createdAt instanceof Date ? firestore_1.Timestamp.fromDate(food.createdAt) : firestore_1.Timestamp.now(),
            updatedAt: firestore_1.Timestamp.now(),
        };
    },
    fromFirestore(snapshot, options) {
        const data = snapshot.data(options);
        return {
            id: snapshot.id,
            userId: data.userId || undefined,
            name: data.name || '',
            brand: data.brand || undefined,
            category: data.category || 'custom',
            servingSize: typeof data.servingSize === 'number' ? data.servingSize : 100,
            servingUnit: data.servingUnit || 'g',
            nutritionFacts: {
                calories: data.nutritionFacts?.calories || 0,
                protein: data.nutritionFacts?.protein || 0,
                carbohydrates: data.nutritionFacts?.carbohydrates || 0,
                fats: data.nutritionFacts?.fats || 0,
                fiber: data.nutritionFacts?.fiber ?? undefined,
                sugar: data.nutritionFacts?.sugar ?? undefined,
                sodium: data.nutritionFacts?.sodium ?? undefined,
                vitamins: data.nutritionFacts?.vitamins || undefined,
                minerals: data.nutritionFacts?.minerals || undefined,
                allergens: data.nutritionFacts?.allergens || undefined,
                dietTags: data.nutritionFacts?.dietTags || undefined,
            },
            barcode: data.barcode || undefined,
            source: data.source || 'user',
            verified: data.verified ?? false,
            externalId: data.externalId || undefined,
            image: data.image || undefined,
            manufacturer: data.manufacturer || undefined,
            createdAt: data.createdAt instanceof firestore_1.Timestamp ? data.createdAt.toDate() : new Date(),
            updatedAt: data.updatedAt instanceof firestore_1.Timestamp ? data.updatedAt.toDate() : new Date(),
        };
    },
};
exports.nutritionLogConverter = {
    toFirestore(log) {
        return {
            userId: log.userId,
            date: log.date,
            meals: log.meals || [],
            totalNutrition: log.totalNutrition || {},
            isCompleted: log.isCompleted ?? false,
            hydrationReference: log.hydrationReference || null,
            createdAt: log.createdAt instanceof Date ? firestore_1.Timestamp.fromDate(log.createdAt) : firestore_1.Timestamp.now(),
            updatedAt: firestore_1.Timestamp.now(),
        };
    },
    fromFirestore(snapshot, options) {
        const data = snapshot.data(options);
        return {
            id: snapshot.id,
            userId: data.userId || '',
            date: data.date || '',
            meals: Array.isArray(data.meals) ? data.meals : [],
            totalNutrition: {
                calories: data.totalNutrition?.calories || 0,
                protein: data.totalNutrition?.protein || 0,
                carbohydrates: data.totalNutrition?.carbohydrates || 0,
                fats: data.totalNutrition?.fats || 0,
                fiber: data.totalNutrition?.fiber ?? undefined,
                sugar: data.totalNutrition?.sugar ?? undefined,
                sodium: data.totalNutrition?.sodium ?? undefined,
            },
            isCompleted: data.isCompleted ?? false,
            hydrationReference: data.hydrationReference || undefined,
            createdAt: data.createdAt instanceof firestore_1.Timestamp ? data.createdAt.toDate() : new Date(),
            updatedAt: data.updatedAt instanceof firestore_1.Timestamp ? data.updatedAt.toDate() : new Date(),
        };
    },
};
exports.nutritionGoalConverter = {
    toFirestore(goal) {
        return {
            userId: goal.userId,
            calorieTarget: goal.calorieTarget,
            proteinTarget: goal.proteinTarget,
            carbTarget: goal.carbTarget,
            fatTarget: goal.fatTarget,
            fiberTarget: goal.fiberTarget ?? null,
            isActive: goal.isActive ?? true,
            createdAt: goal.createdAt instanceof Date ? firestore_1.Timestamp.fromDate(goal.createdAt) : firestore_1.Timestamp.now(),
            updatedAt: firestore_1.Timestamp.now(),
        };
    },
    fromFirestore(snapshot, options) {
        const data = snapshot.data(options);
        return {
            id: snapshot.id,
            userId: data.userId || '',
            calorieTarget: data.calorieTarget || 2000,
            proteinTarget: data.proteinTarget || 150,
            carbTarget: data.carbTarget || 200,
            fatTarget: data.fatTarget || 65,
            fiberTarget: typeof data.fiberTarget === 'number' ? data.fiberTarget : undefined,
            isActive: data.isActive ?? true,
            createdAt: data.createdAt instanceof firestore_1.Timestamp ? data.createdAt.toDate() : new Date(),
            updatedAt: data.updatedAt instanceof firestore_1.Timestamp ? data.updatedAt.toDate() : new Date(),
        };
    },
};
exports.nutritionTemplateConverter = {
    toFirestore(template) {
        return {
            userId: template.userId,
            title: template.title,
            mealType: template.mealType,
            foods: template.foods || [],
            createdAt: template.createdAt instanceof Date ? firestore_1.Timestamp.fromDate(template.createdAt) : firestore_1.Timestamp.now(),
        };
    },
    fromFirestore(snapshot, options) {
        const data = snapshot.data(options);
        return {
            id: snapshot.id,
            userId: data.userId || '',
            title: data.title || '',
            mealType: data.mealType || 'breakfast',
            foods: Array.isArray(data.foods) ? data.foods : [],
            createdAt: data.createdAt instanceof firestore_1.Timestamp ? data.createdAt.toDate() : new Date(),
        };
    },
};
