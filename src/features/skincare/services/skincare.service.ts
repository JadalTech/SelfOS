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
} from 'firebase/firestore';
import { getFirebaseFirestore } from '../../../shared/firebase';
import type {
  SkincareProduct,
  SkincareRoutine,
  SkincareLog,
  SkinAssessment,
  ProgressPhoto,
  SkinReminder,
} from '../types';
import { SKINCARE_COLLECTIONS } from '../constants/skincare.constants';
import {
  skincareProductConverter,
  skincareRoutineConverter,
  skincareLogConverter,
  skinAssessmentConverter,
  progressPhotoConverter,
  skinReminderConverter,
} from './converters';

export class SkincareService {
  // --- Products ---

  private getProductsCollection(userId: string) {
    const db = getFirebaseFirestore();
    return collection(db, 'users', userId, SKINCARE_COLLECTIONS.PRODUCTS).withConverter(skincareProductConverter);
  }

  async fetchProducts(userId: string): Promise<SkincareProduct[]> {
    const colRef = this.getProductsCollection(userId);
    const q = query(colRef, orderBy('createdAt', 'desc'));
    const snapshot = await getDocs(q);
    return snapshot.docs.map((docSnap) => docSnap.data());
  }

  async getProductById(userId: string, productId: string): Promise<SkincareProduct | null> {
    const db = getFirebaseFirestore();
    const docRef = doc(db, 'users', userId, SKINCARE_COLLECTIONS.PRODUCTS, productId).withConverter(skincareProductConverter);
    const snap = await getDoc(docRef);
    return snap.exists() ? snap.data() : null;
  }

  async createProduct(
    userId: string,
    input: Omit<SkincareProduct, 'id' | 'userId' | 'createdAt' | 'updatedAt'>
  ): Promise<SkincareProduct> {
    const colRef = this.getProductsCollection(userId);
    const newDocRef = doc(colRef);
    const now = new Date();

    const product: SkincareProduct = {
      ...input,
      id: newDocRef.id,
      userId,
      createdAt: now,
      updatedAt: now,
    };

    await setDoc(newDocRef, product);
    return product;
  }

  async updateProduct(userId: string, productId: string, updates: Partial<SkincareProduct>): Promise<SkincareProduct> {
    const db = getFirebaseFirestore();
    const docRef = doc(db, 'users', userId, SKINCARE_COLLECTIONS.PRODUCTS, productId).withConverter(skincareProductConverter);

    await updateDoc(docRef, {
      ...updates,
      updatedAt: new Date(),
    });

    const updatedSnap = await getDoc(docRef);
    if (!updatedSnap.exists()) {
      throw new Error(`Skincare product ${productId} not found after update.`);
    }
    return updatedSnap.data();
  }

  async deleteProduct(userId: string, productId: string): Promise<void> {
    const db = getFirebaseFirestore();
    const docRef = doc(db, 'users', userId, SKINCARE_COLLECTIONS.PRODUCTS, productId);
    await deleteDoc(docRef);
  }

  // --- Skincare Routines ---

  private getRoutinesCollection(userId: string) {
    const db = getFirebaseFirestore();
    return collection(db, 'users', userId, SKINCARE_COLLECTIONS.ROUTINES).withConverter(skincareRoutineConverter);
  }

  async fetchRoutines(userId: string): Promise<SkincareRoutine[]> {
    const colRef = this.getRoutinesCollection(userId);
    const q = query(colRef, orderBy('createdAt', 'desc'));
    const snapshot = await getDocs(q);
    return snapshot.docs.map((docSnap) => docSnap.data());
  }

  async getRoutineById(userId: string, routineId: string): Promise<SkincareRoutine | null> {
    const db = getFirebaseFirestore();
    const docRef = doc(db, 'users', userId, SKINCARE_COLLECTIONS.ROUTINES, routineId).withConverter(skincareRoutineConverter);
    const snap = await getDoc(docRef);
    return snap.exists() ? snap.data() : null;
  }

  async createRoutine(
    userId: string,
    input: Omit<SkincareRoutine, 'id' | 'userId' | 'createdAt' | 'updatedAt'>
  ): Promise<SkincareRoutine> {
    const colRef = this.getRoutinesCollection(userId);
    const newDocRef = doc(colRef);
    const now = new Date();

    const routine: SkincareRoutine = {
      ...input,
      id: newDocRef.id,
      userId,
      createdAt: now,
      updatedAt: now,
    };

    await setDoc(newDocRef, routine);
    return routine;
  }

  async updateRoutine(userId: string, skincareRoutineId: string, updates: Partial<SkincareRoutine>): Promise<SkincareRoutine> {
    const db = getFirebaseFirestore();
    const docRef = doc(db, 'users', userId, SKINCARE_COLLECTIONS.ROUTINES, skincareRoutineId).withConverter(skincareRoutineConverter);

    await updateDoc(docRef, {
      ...updates,
      updatedAt: new Date(),
    });

    const updatedSnap = await getDoc(docRef);
    if (!updatedSnap.exists()) {
      throw new Error(`Skincare routine ${skincareRoutineId} not found after update.`);
    }
    return updatedSnap.data();
  }

  async deleteRoutine(userId: string, skincareRoutineId: string): Promise<void> {
    const db = getFirebaseFirestore();
    const docRef = doc(db, 'users', userId, SKINCARE_COLLECTIONS.ROUTINES, skincareRoutineId);
    await deleteDoc(docRef);
  }

  // --- Skincare Logs ---

  private getLogsCollection(userId: string) {
    const db = getFirebaseFirestore();
    return collection(db, 'users', userId, SKINCARE_COLLECTIONS.LOGS).withConverter(skincareLogConverter);
  }

  async fetchLogs(userId: string, limitCount = 50): Promise<SkincareLog[]> {
    const colRef = this.getLogsCollection(userId);
    const q = query(colRef, orderBy('date', 'desc'), limit(limitCount));
    const snapshot = await getDocs(q);
    return snapshot.docs.map((docSnap) => docSnap.data());
  }

  async createLog(userId: string, input: Omit<SkincareLog, 'id' | 'userId' | 'createdAt'>): Promise<SkincareLog> {
    const colRef = this.getLogsCollection(userId);
    const newDocRef = doc(colRef);
    const now = new Date();

    const log: SkincareLog = {
      ...input,
      id: newDocRef.id,
      userId,
      createdAt: now,
    };

    await setDoc(newDocRef, log);
    return log;
  }

  // --- Skin Assessments ---

  private getAssessmentsCollection(userId: string) {
    const db = getFirebaseFirestore();
    return collection(db, 'users', userId, SKINCARE_COLLECTIONS.ASSESSMENTS).withConverter(skinAssessmentConverter);
  }

  async fetchAssessments(userId: string): Promise<SkinAssessment[]> {
    const colRef = this.getAssessmentsCollection(userId);
    const q = query(colRef, orderBy('recordDate', 'desc'));
    const snapshot = await getDocs(q);
    return snapshot.docs.map((docSnap) => docSnap.data());
  }

  async createAssessment(
    userId: string,
    input: Omit<SkinAssessment, 'id' | 'userId' | 'createdAt' | 'updatedAt'>
  ): Promise<SkinAssessment> {
    const colRef = this.getAssessmentsCollection(userId);
    const newDocRef = doc(colRef);
    const now = new Date();

    const assessment: SkinAssessment = {
      ...input,
      id: newDocRef.id,
      userId,
      createdAt: now,
      updatedAt: now,
    };

    await setDoc(newDocRef, assessment);
    return assessment;
  }

  async updateAssessment(userId: string, assessmentId: string, updates: Partial<SkinAssessment>): Promise<SkinAssessment> {
    const db = getFirebaseFirestore();
    const docRef = doc(db, 'users', userId, SKINCARE_COLLECTIONS.ASSESSMENTS, assessmentId).withConverter(skinAssessmentConverter);

    await updateDoc(docRef, {
      ...updates,
      updatedAt: new Date(),
    });

    const updatedSnap = await getDoc(docRef);
    if (!updatedSnap.exists()) {
      throw new Error(`Skin assessment ${assessmentId} not found after update.`);
    }
    return updatedSnap.data();
  }

  async deleteAssessment(userId: string, assessmentId: string): Promise<void> {
    const db = getFirebaseFirestore();
    const docRef = doc(db, 'users', userId, SKINCARE_COLLECTIONS.ASSESSMENTS, assessmentId);
    await deleteDoc(docRef);
  }

  // --- Progress Photos Metadata ---

  private getPhotosCollection(userId: string) {
    const db = getFirebaseFirestore();
    return collection(db, 'users', userId, SKINCARE_COLLECTIONS.PHOTOS).withConverter(progressPhotoConverter);
  }

  async fetchPhotos(userId: string): Promise<ProgressPhoto[]> {
    const colRef = this.getPhotosCollection(userId);
    const q = query(colRef, orderBy('date', 'desc'));
    const snapshot = await getDocs(q);
    return snapshot.docs.map((docSnap) => docSnap.data());
  }

  async createPhotoRecord(userId: string, input: Omit<ProgressPhoto, 'id' | 'userId' | 'createdAt'>): Promise<ProgressPhoto> {
    const colRef = this.getPhotosCollection(userId);
    const newDocRef = doc(colRef);
    const now = new Date();

    const photo: ProgressPhoto = {
      ...input,
      id: newDocRef.id,
      userId,
      createdAt: now,
    };

    await setDoc(newDocRef, photo);
    return photo;
  }

  async deletePhotoRecord(userId: string, photoId: string): Promise<void> {
    const db = getFirebaseFirestore();
    const docRef = doc(db, 'users', userId, SKINCARE_COLLECTIONS.PHOTOS, photoId);
    await deleteDoc(docRef);
  }

  // --- Skin Reminders ---

  private getRemindersCollection(userId: string) {
    const db = getFirebaseFirestore();
    return collection(db, 'users', userId, SKINCARE_COLLECTIONS.REMINDERS).withConverter(skinReminderConverter);
  }

  async fetchReminders(userId: string): Promise<SkinReminder[]> {
    const colRef = this.getRemindersCollection(userId);
    const q = query(colRef, orderBy('createdAt', 'desc'));
    const snapshot = await getDocs(q);
    return snapshot.docs.map((docSnap) => docSnap.data());
  }

  async createReminder(
    userId: string,
    input: Omit<SkinReminder, 'id' | 'userId' | 'createdAt' | 'updatedAt'>
  ): Promise<SkinReminder> {
    const colRef = this.getRemindersCollection(userId);
    const newDocRef = doc(colRef);
    const now = new Date();

    const reminder: SkinReminder = {
      ...input,
      id: newDocRef.id,
      userId,
      createdAt: now,
      updatedAt: now,
    };

    await setDoc(newDocRef, reminder);
    return reminder;
  }

  async updateReminder(userId: string, reminderId: string, updates: Partial<SkinReminder>): Promise<SkinReminder> {
    const db = getFirebaseFirestore();
    const docRef = doc(db, 'users', userId, SKINCARE_COLLECTIONS.REMINDERS, reminderId).withConverter(skinReminderConverter);

    await updateDoc(docRef, {
      ...updates,
      updatedAt: new Date(),
    });

    const updatedSnap = await getDoc(docRef);
    if (!updatedSnap.exists()) {
      throw new Error(`Skin reminder ${reminderId} not found after update.`);
    }
    return updatedSnap.data();
  }

  async deleteReminder(userId: string, reminderId: string): Promise<void> {
    const db = getFirebaseFirestore();
    const docRef = doc(db, 'users', userId, SKINCARE_COLLECTIONS.REMINDERS, reminderId);
    await deleteDoc(docRef);
  }
}

export const skincareService = new SkincareService();
