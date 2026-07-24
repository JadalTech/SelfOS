/**
 * Firestore Database Services for Nutrition Module
 */

import {
  collection,
  doc,
  getDocs,
  getDoc,
  setDoc,
  updateDoc,
  deleteDoc,
  query,
  orderBy,
  limit,
  where,
  Timestamp,
} from 'firebase/firestore';
import { getFirebaseFirestore } from '../../../shared/firebase';
import type { Food, DailyNutritionLog, NutritionGoal, NutritionTemplate, MealType } from '../types/nutrition.types';
import { NUTRITION_COLLECTIONS } from '../constants/nutrition.constants';
import {
  nutritionFoodConverter,
  nutritionLogConverter,
  nutritionGoalConverter,
  nutritionTemplateConverter,
} from '../firestore/converters';

export class NutritionService {
  // --- Global Food Catalog (Shared by all users) ---

  private getGlobalCatalogCollection() {
    const db = getFirebaseFirestore();
    return collection(db, NUTRITION_COLLECTIONS.GLOBAL_FOODS).withConverter(nutritionFoodConverter);
  }

  async searchGlobalFoods(searchTerm: string): Promise<Food[]> {
    const colRef = this.getGlobalCatalogCollection();
    // Simplified client-side filtering or prefix matching if Firestore limits allow
    // Since Firestore doesn't support full-text search directly without third-party services,
    // we fetch standard verified items or filter by name prefix if term is short
    const q = query(colRef, limit(50));
    const snapshot = await getDocs(q);
    const results = snapshot.docs.map((docSnap) => docSnap.data());
    
    if (!searchTerm) return results;
    
    const term = searchTerm.toLowerCase();
    return results.filter(
      (food) =>
        food.name.toLowerCase().includes(term) ||
        (food.brand && food.brand.toLowerCase().includes(term))
    );
  }

  // --- Custom User Foods (User-scoped subcollection) ---

  private getUserFoodsCollection(userId: string) {
    const db = getFirebaseFirestore();
    return collection(db, 'users', userId, NUTRITION_COLLECTIONS.USER_FOODS).withConverter(nutritionFoodConverter);
  }

  async fetchUserFoods(userId: string): Promise<Food[]> {
    const colRef = this.getUserFoodsCollection(userId);
    const q = query(colRef, orderBy('createdAt', 'desc'));
    const snapshot = await getDocs(q);
    return snapshot.docs.map((docSnap) => docSnap.data());
  }

  async createUserFood(
    userId: string,
    input: Omit<Food, 'id' | 'userId' | 'createdAt' | 'updatedAt'>
  ): Promise<Food> {
    const colRef = this.getUserFoodsCollection(userId);
    const newDocRef = doc(colRef);
    const now = new Date();
    const food: Food = {
      ...input,
      id: newDocRef.id,
      userId,
      source: 'user',
      createdAt: now,
      updatedAt: now,
    };
    await setDoc(newDocRef, food);
    return food;
  }

  async deleteUserFood(userId: string, foodId: string): Promise<void> {
    const db = getFirebaseFirestore();
    const docRef = doc(db, 'users', userId, NUTRITION_COLLECTIONS.USER_FOODS, foodId);
    await deleteDoc(docRef);
  }

  // --- Nutrition Logs (User-scoped) ---

  private getLogsCollection(userId: string) {
    const db = getFirebaseFirestore();
    return collection(db, 'users', userId, NUTRITION_COLLECTIONS.LOGS).withConverter(nutritionLogConverter);
  }

  async fetchLogs(userId: string, limitDays = 30): Promise<DailyNutritionLog[]> {
    const colRef = this.getLogsCollection(userId);
    const q = query(colRef, orderBy('date', 'desc'), limit(limitDays));
    const snapshot = await getDocs(q);
    return snapshot.docs.map((docSnap) => docSnap.data());
  }

  async getLogByDate(userId: string, dateStr: string): Promise<DailyNutritionLog | null> {
    const db = getFirebaseFirestore();
    const docRef = doc(db, 'users', userId, NUTRITION_COLLECTIONS.LOGS, dateStr).withConverter(nutritionLogConverter);
    const snap = await getDoc(docRef);
    return snap.exists() ? snap.data() : null;
  }

  async saveLog(userId: string, log: DailyNutritionLog): Promise<void> {
    const db = getFirebaseFirestore();
    const docRef = doc(db, 'users', userId, NUTRITION_COLLECTIONS.LOGS, log.date).withConverter(nutritionLogConverter);
    await setDoc(docRef, log);
  }

  // --- Nutrition Goals (User-scoped) ---

  private getGoalsCollection(userId: string) {
    const db = getFirebaseFirestore();
    return collection(db, 'users', userId, NUTRITION_COLLECTIONS.GOALS).withConverter(nutritionGoalConverter);
  }

  async fetchGoals(userId: string): Promise<NutritionGoal[]> {
    const colRef = this.getGoalsCollection(userId);
    const q = query(colRef, orderBy('createdAt', 'desc'));
    const snapshot = await getDocs(q);
    return snapshot.docs.map((docSnap) => docSnap.data());
  }

  async saveGoal(
    userId: string,
    goal: Omit<NutritionGoal, 'id' | 'userId' | 'createdAt' | 'updatedAt'>
  ): Promise<NutritionGoal> {
    const colRef = this.getGoalsCollection(userId);
    
    // First, deactivate any active goals to ensure single active goal model
    if (goal.isActive) {
      const activeGoalsQuery = query(colRef, where('isActive', '==', true));
      const activeSnap = await getDocs(activeGoalsQuery);
      for (const dSnap of activeSnap.docs) {
        await updateDoc(doc(colRef, dSnap.id), { isActive: false, updatedAt: Timestamp.now() });
      }
    }

    const newDocRef = doc(colRef);
    const now = new Date();
    const fullGoal: NutritionGoal = {
      ...goal,
      id: newDocRef.id,
      userId,
      createdAt: now,
      updatedAt: now,
    };
    await setDoc(newDocRef, fullGoal);
    return fullGoal;
  }

  async toggleGoalActive(userId: string, goalId: string, isActive: boolean): Promise<void> {
    const colRef = this.getGoalsCollection(userId);
    
    if (isActive) {
      const activeGoalsQuery = query(colRef, where('isActive', '==', true));
      const activeSnap = await getDocs(activeGoalsQuery);
      for (const dSnap of activeSnap.docs) {
        if (dSnap.id !== goalId) {
          await updateDoc(doc(colRef, dSnap.id), { isActive: false, updatedAt: Timestamp.now() });
        }
      }
    }

    const docRef = doc(colRef, goalId);
    await updateDoc(docRef, { isActive, updatedAt: Timestamp.now() });
  }

  // --- Nutrition Templates (User-scoped) ---

  private getTemplatesCollection(userId: string) {
    const db = getFirebaseFirestore();
    return collection(db, 'users', userId, NUTRITION_COLLECTIONS.TEMPLATES).withConverter(nutritionTemplateConverter);
  }

  async fetchTemplates(userId: string): Promise<NutritionTemplate[]> {
    const colRef = this.getTemplatesCollection(userId);
    const q = query(colRef, orderBy('createdAt', 'desc'));
    const snapshot = await getDocs(q);
    return snapshot.docs.map((docSnap) => docSnap.data());
  }

  async createTemplate(
    userId: string,
    title: string,
    mealType: MealType,
    foods: Food['nutritionFacts'][] // Since foods entries are snapshotted
  ): Promise<NutritionTemplate> {
    const colRef = this.getTemplatesCollection(userId);
    const newDocRef = doc(colRef);
    
    // Casting snapshotted entries as domain food entry structures
    const entries = foods.map((f, idx) => ({
      id: `item_${idx}_${Date.now()}`,
      foodId: `custom_${idx}_${Date.now()}`,
      foodName: `Template Item ${idx + 1}`,
      quantity: 100,
      servingUnit: 'g' as const,
      multiplier: 1.0,
      nutritionSnapshot: f,
    }));

    const template: NutritionTemplate = {
      id: newDocRef.id,
      userId,
      title,
      mealType,
      foods: entries,
      createdAt: new Date(),
    };

    await setDoc(newDocRef, template);
    return template;
  }

  async deleteTemplate(userId: string, templateId: string): Promise<void> {
    const db = getFirebaseFirestore();
    const docRef = doc(db, 'users', userId, NUTRITION_COLLECTIONS.TEMPLATES, templateId);
    await deleteDoc(docRef);
  }
}

export const nutritionService = new NutritionService();
