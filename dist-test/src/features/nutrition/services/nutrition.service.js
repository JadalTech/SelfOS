"use strict";
/**
 * Firestore Database Services for Nutrition Module
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.nutritionService = exports.NutritionService = void 0;
const firestore_1 = require("firebase/firestore");
const firebase_1 = require("../../../shared/firebase");
const nutrition_constants_1 = require("../constants/nutrition.constants");
const converters_1 = require("../firestore/converters");
class NutritionService {
    // --- Global Food Catalog (Shared by all users) ---
    getGlobalCatalogCollection() {
        const db = (0, firebase_1.getFirebaseFirestore)();
        return (0, firestore_1.collection)(db, nutrition_constants_1.NUTRITION_COLLECTIONS.GLOBAL_FOODS).withConverter(converters_1.nutritionFoodConverter);
    }
    async searchGlobalFoods(searchTerm) {
        const colRef = this.getGlobalCatalogCollection();
        // Simplified client-side filtering or prefix matching if Firestore limits allow
        // Since Firestore doesn't support full-text search directly without third-party services,
        // we fetch standard verified items or filter by name prefix if term is short
        const q = (0, firestore_1.query)(colRef, (0, firestore_1.limit)(50));
        const snapshot = await (0, firestore_1.getDocs)(q);
        const results = snapshot.docs.map((docSnap) => docSnap.data());
        if (!searchTerm)
            return results;
        const term = searchTerm.toLowerCase();
        return results.filter((food) => food.name.toLowerCase().includes(term) ||
            (food.brand && food.brand.toLowerCase().includes(term)));
    }
    // --- Custom User Foods (User-scoped subcollection) ---
    getUserFoodsCollection(userId) {
        const db = (0, firebase_1.getFirebaseFirestore)();
        return (0, firestore_1.collection)(db, 'users', userId, nutrition_constants_1.NUTRITION_COLLECTIONS.USER_FOODS).withConverter(converters_1.nutritionFoodConverter);
    }
    async fetchUserFoods(userId) {
        const colRef = this.getUserFoodsCollection(userId);
        const q = (0, firestore_1.query)(colRef, (0, firestore_1.orderBy)('createdAt', 'desc'));
        const snapshot = await (0, firestore_1.getDocs)(q);
        return snapshot.docs.map((docSnap) => docSnap.data());
    }
    async createUserFood(userId, input) {
        const colRef = this.getUserFoodsCollection(userId);
        const newDocRef = (0, firestore_1.doc)(colRef);
        const now = new Date();
        const food = {
            ...input,
            id: newDocRef.id,
            userId,
            source: 'user',
            createdAt: now,
            updatedAt: now,
        };
        await (0, firestore_1.setDoc)(newDocRef, food);
        return food;
    }
    async deleteUserFood(userId, foodId) {
        const db = (0, firebase_1.getFirebaseFirestore)();
        const docRef = (0, firestore_1.doc)(db, 'users', userId, nutrition_constants_1.NUTRITION_COLLECTIONS.USER_FOODS, foodId);
        await (0, firestore_1.deleteDoc)(docRef);
    }
    // --- Nutrition Logs (User-scoped) ---
    getLogsCollection(userId) {
        const db = (0, firebase_1.getFirebaseFirestore)();
        return (0, firestore_1.collection)(db, 'users', userId, nutrition_constants_1.NUTRITION_COLLECTIONS.LOGS).withConverter(converters_1.nutritionLogConverter);
    }
    async fetchLogs(userId, limitDays = 30) {
        const colRef = this.getLogsCollection(userId);
        const q = (0, firestore_1.query)(colRef, (0, firestore_1.orderBy)('date', 'desc'), (0, firestore_1.limit)(limitDays));
        const snapshot = await (0, firestore_1.getDocs)(q);
        return snapshot.docs.map((docSnap) => docSnap.data());
    }
    async getLogByDate(userId, dateStr) {
        const db = (0, firebase_1.getFirebaseFirestore)();
        const docRef = (0, firestore_1.doc)(db, 'users', userId, nutrition_constants_1.NUTRITION_COLLECTIONS.LOGS, dateStr).withConverter(converters_1.nutritionLogConverter);
        const snap = await (0, firestore_1.getDoc)(docRef);
        return snap.exists() ? snap.data() : null;
    }
    async saveLog(userId, log) {
        const db = (0, firebase_1.getFirebaseFirestore)();
        const docRef = (0, firestore_1.doc)(db, 'users', userId, nutrition_constants_1.NUTRITION_COLLECTIONS.LOGS, log.date).withConverter(converters_1.nutritionLogConverter);
        await (0, firestore_1.setDoc)(docRef, log);
    }
    // --- Nutrition Goals (User-scoped) ---
    getGoalsCollection(userId) {
        const db = (0, firebase_1.getFirebaseFirestore)();
        return (0, firestore_1.collection)(db, 'users', userId, nutrition_constants_1.NUTRITION_COLLECTIONS.GOALS).withConverter(converters_1.nutritionGoalConverter);
    }
    async fetchGoals(userId) {
        const colRef = this.getGoalsCollection(userId);
        const q = (0, firestore_1.query)(colRef, (0, firestore_1.orderBy)('createdAt', 'desc'));
        const snapshot = await (0, firestore_1.getDocs)(q);
        return snapshot.docs.map((docSnap) => docSnap.data());
    }
    async saveGoal(userId, goal) {
        const colRef = this.getGoalsCollection(userId);
        // First, deactivate any active goals to ensure single active goal model
        if (goal.isActive) {
            const activeGoalsQuery = (0, firestore_1.query)(colRef, (0, firestore_1.where)('isActive', '==', true));
            const activeSnap = await (0, firestore_1.getDocs)(activeGoalsQuery);
            for (const dSnap of activeSnap.docs) {
                await (0, firestore_1.updateDoc)((0, firestore_1.doc)(colRef, dSnap.id), { isActive: false, updatedAt: firestore_1.Timestamp.now() });
            }
        }
        const newDocRef = (0, firestore_1.doc)(colRef);
        const now = new Date();
        const fullGoal = {
            ...goal,
            id: newDocRef.id,
            userId,
            createdAt: now,
            updatedAt: now,
        };
        await (0, firestore_1.setDoc)(newDocRef, fullGoal);
        return fullGoal;
    }
    async toggleGoalActive(userId, goalId, isActive) {
        const colRef = this.getGoalsCollection(userId);
        if (isActive) {
            const activeGoalsQuery = (0, firestore_1.query)(colRef, (0, firestore_1.where)('isActive', '==', true));
            const activeSnap = await (0, firestore_1.getDocs)(activeGoalsQuery);
            for (const dSnap of activeSnap.docs) {
                if (dSnap.id !== goalId) {
                    await (0, firestore_1.updateDoc)((0, firestore_1.doc)(colRef, dSnap.id), { isActive: false, updatedAt: firestore_1.Timestamp.now() });
                }
            }
        }
        const docRef = (0, firestore_1.doc)(colRef, goalId);
        await (0, firestore_1.updateDoc)(docRef, { isActive, updatedAt: firestore_1.Timestamp.now() });
    }
    // --- Nutrition Templates (User-scoped) ---
    getTemplatesCollection(userId) {
        const db = (0, firebase_1.getFirebaseFirestore)();
        return (0, firestore_1.collection)(db, 'users', userId, nutrition_constants_1.NUTRITION_COLLECTIONS.TEMPLATES).withConverter(converters_1.nutritionTemplateConverter);
    }
    async fetchTemplates(userId) {
        const colRef = this.getTemplatesCollection(userId);
        const q = (0, firestore_1.query)(colRef, (0, firestore_1.orderBy)('createdAt', 'desc'));
        const snapshot = await (0, firestore_1.getDocs)(q);
        return snapshot.docs.map((docSnap) => docSnap.data());
    }
    async createTemplate(userId, title, mealType, foods // Since foods entries are snapshotted
    ) {
        const colRef = this.getTemplatesCollection(userId);
        const newDocRef = (0, firestore_1.doc)(colRef);
        // Casting snapshotted entries as domain food entry structures
        const entries = foods.map((f, idx) => ({
            id: `item_${idx}_${Date.now()}`,
            foodId: `custom_${idx}_${Date.now()}`,
            foodName: `Template Item ${idx + 1}`,
            quantity: 100,
            servingUnit: 'g',
            multiplier: 1.0,
            nutritionSnapshot: f,
        }));
        const template = {
            id: newDocRef.id,
            userId,
            title,
            mealType,
            foods: entries,
            createdAt: new Date(),
        };
        await (0, firestore_1.setDoc)(newDocRef, template);
        return template;
    }
    async deleteTemplate(userId, templateId) {
        const db = (0, firebase_1.getFirebaseFirestore)();
        const docRef = (0, firestore_1.doc)(db, 'users', userId, nutrition_constants_1.NUTRITION_COLLECTIONS.TEMPLATES, templateId);
        await (0, firestore_1.deleteDoc)(docRef);
    }
}
exports.NutritionService = NutritionService;
exports.nutritionService = new NutritionService();
