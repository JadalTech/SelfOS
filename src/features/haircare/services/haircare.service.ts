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
import { getFirebaseFirestore } from '@/shared/firebase';
import type { HairProduct, HairRoutine, HairLog, HairPhoto, HairCondition } from '../types';
import {
  hairProductConverter,
  hairRoutineConverter,
  hairLogConverter,
} from './converters';
import { hairPhotoConverter } from './photoConverter';
import { hairConditionConverter } from './conditionConverter';

export class HaircareService {
  // --- Products Operations ---

  private getProductsCollection(userId: string) {
    const db = getFirebaseFirestore();
    return collection(db, 'users', userId, 'hair_products').withConverter(hairProductConverter);
  }

  async fetchProducts(userId: string): Promise<HairProduct[]> {
    const colRef = this.getProductsCollection(userId);
    const q = query(colRef, orderBy('createdAt', 'desc'));
    const snapshot = await getDocs(q);
    return snapshot.docs.map((docSnap) => docSnap.data());
  }

  async createProduct(userId: string, input: Omit<HairProduct, 'id' | 'userId' | 'createdAt' | 'updatedAt'>): Promise<HairProduct> {
    const colRef = this.getProductsCollection(userId);
    const newDocRef = doc(colRef);
    const now = new Date();

    const product: HairProduct = {
      ...input,
      id: newDocRef.id,
      userId,
      createdAt: now,
      updatedAt: now,
    };

    await setDoc(newDocRef, product);
    return product;
  }

  async updateProduct(userId: string, productId: string, updates: Partial<HairProduct>): Promise<HairProduct> {
    const db = getFirebaseFirestore();
    const docRef = doc(db, 'users', userId, 'hair_products', productId).withConverter(hairProductConverter);

    await updateDoc(docRef, {
      ...updates,
      updatedAt: new Date(),
    });

    const updatedSnap = await getDoc(docRef);
    if (!updatedSnap.exists()) {
      throw new Error(`Hair product ${productId} not found after update.`);
    }
    return updatedSnap.data();
  }

  async deleteProduct(userId: string, productId: string): Promise<void> {
    const db = getFirebaseFirestore();
    const docRef = doc(db, 'users', userId, 'hair_products', productId);
    await deleteDoc(docRef);
  }

  // --- Hair Routines Operations ---

  private getRoutinesCollection(userId: string) {
    const db = getFirebaseFirestore();
    return collection(db, 'users', userId, 'hair_routines').withConverter(hairRoutineConverter);
  }

  async fetchHairRoutines(userId: string): Promise<HairRoutine[]> {
    const colRef = this.getRoutinesCollection(userId);
    const q = query(colRef, orderBy('createdAt', 'desc'));
    const snapshot = await getDocs(q);
    return snapshot.docs.map((docSnap) => docSnap.data());
  }

  async createHairRoutine(
    userId: string,
    input: Omit<HairRoutine, 'id' | 'userId' | 'createdAt' | 'updatedAt'>
  ): Promise<HairRoutine> {
    const colRef = this.getRoutinesCollection(userId);
    const newDocRef = doc(colRef);
    const now = new Date();

    const hairRoutine: HairRoutine = {
      ...input,
      id: newDocRef.id,
      userId,
      createdAt: now,
      updatedAt: now,
    };

    await setDoc(newDocRef, hairRoutine);
    return hairRoutine;
  }

  async updateHairRoutine(
    userId: string,
    id: string,
    updates: Partial<HairRoutine>
  ): Promise<HairRoutine> {
    const db = getFirebaseFirestore();
    const docRef = doc(db, 'users', userId, 'hair_routines', id).withConverter(hairRoutineConverter);

    await updateDoc(docRef, {
      ...updates,
      updatedAt: new Date(),
    });

    const updatedSnap = await getDoc(docRef);
    if (!updatedSnap.exists()) {
      throw new Error(`Hair routine ${id} not found after update.`);
    }
    return updatedSnap.data();
  }

  async deleteHairRoutine(userId: string, id: string): Promise<void> {
    const db = getFirebaseFirestore();
    const docRef = doc(db, 'users', userId, 'hair_routines', id);
    await deleteDoc(docRef);
  }

  // --- Hair Logs Operations ---

  private getLogsCollection(userId: string) {
    const db = getFirebaseFirestore();
    return collection(db, 'users', userId, 'hair_logs').withConverter(hairLogConverter);
  }

  async fetchHairLogs(userId: string, limitCount = 50): Promise<HairLog[]> {
    const colRef = this.getLogsCollection(userId);
    const q = query(colRef, orderBy('date', 'desc'), orderBy('createdAt', 'desc'), limit(limitCount));
    const snapshot = await getDocs(q);
    return snapshot.docs.map((docSnap) => docSnap.data());
  }

  async logHaircareExecution(
    userId: string,
    input: Omit<HairLog, 'id' | 'userId' | 'createdAt'>
  ): Promise<HairLog> {
    const colRef = this.getLogsCollection(userId);
    const newDocRef = doc(colRef);
    const now = new Date();

    const hairLog: HairLog = {
      ...input,
      id: newDocRef.id,
      userId,
      createdAt: now,
    };

    await setDoc(newDocRef, hairLog);
    return hairLog;
  }

  // --- Hair Photos Operations ---

  private getPhotosCollection(userId: string) {
    const db = getFirebaseFirestore();
    return collection(db, 'users', userId, 'hair_photos').withConverter(hairPhotoConverter);
  }

  async fetchHairPhotos(userId: string, limitCount = 100): Promise<HairPhoto[]> {
    const colRef = this.getPhotosCollection(userId);
    const q = query(colRef, orderBy('captureDate', 'desc'), orderBy('createdAt', 'desc'), limit(limitCount));
    const snapshot = await getDocs(q);
    return snapshot.docs.map((docSnap) => docSnap.data());
  }

  async createPhotoMetadata(
    userId: string,
    photoId: string,
    input: { photoUrl: string; storagePath: string; captureDate: string; angle: HairPhoto['angle']; notes?: string }
  ): Promise<HairPhoto> {
    const db = getFirebaseFirestore();
    const docRef = doc(db, 'users', userId, 'hair_photos', photoId).withConverter(hairPhotoConverter);
    const now = new Date();

    const photo: HairPhoto = {
      id: photoId,
      userId,
      photoUrl: input.photoUrl,
      storagePath: input.storagePath,
      captureDate: input.captureDate,
      angle: input.angle,
      notes: input.notes,
      createdAt: now,
      updatedAt: now,
    };

    await setDoc(docRef, photo);
    return photo;
  }

  async deletePhotoMetadata(userId: string, photoId: string): Promise<void> {
    const db = getFirebaseFirestore();
    const docRef = doc(db, 'users', userId, 'hair_photos', photoId);
    await deleteDoc(docRef);
  }

  // --- Hair Conditions Operations ---

  private getConditionsCollection(userId: string) {
    const db = getFirebaseFirestore();
    return collection(db, 'users', userId, 'hair_conditions').withConverter(hairConditionConverter);
  }

  async fetchHairConditions(userId: string, limitCount = 100): Promise<HairCondition[]> {
    const colRef = this.getConditionsCollection(userId);
    const q = query(colRef, orderBy('recordDate', 'desc'), orderBy('createdAt', 'desc'), limit(limitCount));
    const snapshot = await getDocs(q);
    return snapshot.docs.map((docSnap) => docSnap.data());
  }

  async createHairCondition(
    userId: string,
    input: Omit<HairCondition, 'id' | 'userId' | 'createdAt' | 'updatedAt'>
  ): Promise<HairCondition> {
    const colRef = this.getConditionsCollection(userId);
    const newDocRef = doc(colRef);
    const now = new Date();

    const condition: HairCondition = {
      ...input,
      id: newDocRef.id,
      userId,
      createdAt: now,
      updatedAt: now,
    };

    await setDoc(newDocRef, condition);
    return condition;
  }

  async updateHairCondition(
    userId: string,
    id: string,
    updates: Partial<HairCondition>
  ): Promise<HairCondition> {
    const db = getFirebaseFirestore();
    const docRef = doc(db, 'users', userId, 'hair_conditions', id).withConverter(hairConditionConverter);

    await updateDoc(docRef, {
      ...updates,
      updatedAt: new Date(),
    });

    const updatedSnap = await getDoc(docRef);
    if (!updatedSnap.exists()) {
      throw new Error(`Hair condition record ${id} not found after update.`);
    }
    return updatedSnap.data();
  }

  async deleteHairCondition(userId: string, id: string): Promise<void> {
    const db = getFirebaseFirestore();
    const docRef = doc(db, 'users', userId, 'hair_conditions', id);
    await deleteDoc(docRef);
  }
}

export const haircareService = new HaircareService();
