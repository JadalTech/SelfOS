/**
 * Firestore Database Services for Workout Module
 */

import {
  collection,
  doc,
  getDocs,
  getDoc,
  setDoc,
  deleteDoc,
  query,
  orderBy,
  limit,
  where,
} from 'firebase/firestore';
import { getFirebaseFirestore } from '../../../shared/firebase';
import type {
  Exercise,
  WorkoutPlan,
  WorkoutTemplate,
  WorkoutSession,
  PersonalRecord,
} from '../types/workout.types';
import { WORKOUT_COLLECTIONS } from '../constants/workout.constants';
import {
  userExerciseConverter,
  workoutPlanConverter,
  workoutSessionConverter,
  workoutTemplateConverter,
  personalRecordConverter,
} from '../firestore/converters';

export class WorkoutService {
  // --- User Custom Exercises ---

  private getUserExercisesCollection(userId: string) {
    const db = getFirebaseFirestore();
    return collection(db, 'users', userId, WORKOUT_COLLECTIONS.USER_EXERCISES).withConverter(userExerciseConverter);
  }

  async fetchUserExercises(userId: string): Promise<Exercise[]> {
    const colRef = this.getUserExercisesCollection(userId);
    const q = query(colRef, orderBy('createdAt', 'desc'));
    const snapshot = await getDocs(q);
    return snapshot.docs.map((docSnap) => docSnap.data());
  }

  async createUserExercise(
    userId: string,
    input: Omit<Exercise, 'id' | 'userId' | 'createdAt' | 'updatedAt' | 'source'>
  ): Promise<Exercise> {
    const colRef = this.getUserExercisesCollection(userId);
    const newDocRef = doc(colRef);
    const now = new Date();
    const exercise: Exercise = {
      ...input,
      id: newDocRef.id,
      userId,
      source: 'user',
      createdAt: now,
      updatedAt: now,
    };
    await setDoc(newDocRef, exercise);
    return exercise;
  }

  async deleteUserExercise(userId: string, exerciseId: string): Promise<void> {
    const db = getFirebaseFirestore();
    const docRef = doc(db, 'users', userId, WORKOUT_COLLECTIONS.USER_EXERCISES, exerciseId);
    await deleteDoc(docRef);
  }

  // --- Workout Plans ---

  private getPlansCollection(userId: string) {
    const db = getFirebaseFirestore();
    return collection(db, 'users', userId, WORKOUT_COLLECTIONS.PLANS).withConverter(workoutPlanConverter);
  }

  async fetchPlans(userId: string): Promise<WorkoutPlan[]> {
    const colRef = this.getPlansCollection(userId);
    const q = query(colRef, orderBy('createdAt', 'desc'));
    const snapshot = await getDocs(q);
    return snapshot.docs.map((docSnap) => docSnap.data());
  }

  async savePlan(
    userId: string,
    input: Omit<WorkoutPlan, 'id' | 'userId' | 'createdAt' | 'updatedAt'> & { id?: string }
  ): Promise<WorkoutPlan> {
    const colRef = this.getPlansCollection(userId);
    const now = new Date();
    const planId = input.id || doc(colRef).id;
    const planDocRef = doc(colRef, planId);
    
    // Check if it already exists to preserve createdAt
    let createdAt = now;
    if (input.id) {
      const snap = await getDoc(planDocRef);
      if (snap.exists()) {
        createdAt = snap.data().createdAt;
      }
    }

    const plan: WorkoutPlan = {
      ...input,
      id: planId,
      userId,
      createdAt,
      updatedAt: now,
    };

    await setDoc(planDocRef, plan);
    return plan;
  }

  async deletePlan(userId: string, planId: string): Promise<void> {
    const db = getFirebaseFirestore();
    const docRef = doc(db, 'users', userId, WORKOUT_COLLECTIONS.PLANS, planId);
    await deleteDoc(docRef);
  }

  // --- Workout Templates ---

  private getTemplatesCollection(userId: string) {
    const db = getFirebaseFirestore();
    return collection(db, 'users', userId, WORKOUT_COLLECTIONS.TEMPLATES).withConverter(workoutTemplateConverter);
  }

  async fetchTemplates(userId: string): Promise<WorkoutTemplate[]> {
    const colRef = this.getTemplatesCollection(userId);
    const q = query(colRef, orderBy('createdAt', 'desc'));
    const snapshot = await getDocs(q);
    return snapshot.docs.map((docSnap) => docSnap.data());
  }

  async createTemplate(
    userId: string,
    input: Omit<WorkoutTemplate, 'id' | 'userId' | 'createdAt' | 'updatedAt'>
  ): Promise<WorkoutTemplate> {
    const colRef = this.getTemplatesCollection(userId);
    const newDocRef = doc(colRef);
    const now = new Date();
    const template: WorkoutTemplate = {
      ...input,
      id: newDocRef.id,
      userId,
      createdAt: now,
      updatedAt: now,
    };
    await setDoc(newDocRef, template);
    return template;
  }

  async deleteTemplate(userId: string, templateId: string): Promise<void> {
    const db = getFirebaseFirestore();
    const docRef = doc(db, 'users', userId, WORKOUT_COLLECTIONS.TEMPLATES, templateId);
    await deleteDoc(docRef);
  }

  // --- Workout Sessions & History ---

  private getSessionsCollection(userId: string) {
    const db = getFirebaseFirestore();
    return collection(db, 'users', userId, WORKOUT_COLLECTIONS.SESSIONS).withConverter(workoutSessionConverter);
  }

  async saveSession(userId: string, session: WorkoutSession): Promise<WorkoutSession> {
    const colRef = this.getSessionsCollection(userId);
    const docRef = doc(colRef, session.id);
    await setDoc(docRef, session);
    return session;
  }

  async getActiveSession(userId: string): Promise<WorkoutSession | null> {
    const colRef = this.getSessionsCollection(userId);
    // Find sessions in 'active' or 'paused' state
    const q = query(colRef, where('status', 'in', ['active', 'paused']), limit(1));
    const snapshot = await getDocs(q);
    if (snapshot.empty) return null;
    return snapshot.docs[0].data();
  }

  async fetchHistory(userId: string, limitCount = 50): Promise<WorkoutSession[]> {
    const colRef = this.getSessionsCollection(userId);
    // Retrieve completed or abandoned sessions as historical logs
    const q = query(
      colRef,
      where('status', 'in', ['completed', 'abandoned']),
      orderBy('startedAt', 'desc'),
      limit(limitCount)
    );
    const snapshot = await getDocs(q);
    return snapshot.docs.map((docSnap) => docSnap.data());
  }

  async deleteSession(userId: string, sessionId: string): Promise<void> {
    const db = getFirebaseFirestore();
    const docRef = doc(db, 'users', userId, WORKOUT_COLLECTIONS.SESSIONS, sessionId);
    await deleteDoc(docRef);
  }

  // --- Personal Records ---

  private getPRsCollection(userId: string) {
    const db = getFirebaseFirestore();
    return collection(db, 'users', userId, WORKOUT_COLLECTIONS.PERSONAL_RECORDS).withConverter(personalRecordConverter);
  }

  async fetchPersonalRecords(userId: string): Promise<PersonalRecord[]> {
    const colRef = this.getPRsCollection(userId);
    const q = query(colRef, orderBy('date', 'desc'));
    const snapshot = await getDocs(q);
    return snapshot.docs.map((docSnap) => docSnap.data());
  }

  async savePersonalRecord(userId: string, pr: PersonalRecord): Promise<PersonalRecord> {
    const colRef = this.getPRsCollection(userId);
    const docRef = doc(colRef, pr.id);
    await setDoc(docRef, pr);
    return pr;
  }

  async deletePersonalRecord(userId: string, prId: string): Promise<void> {
    const db = getFirebaseFirestore();
    const docRef = doc(db, 'users', userId, WORKOUT_COLLECTIONS.PERSONAL_RECORDS, prId);
    await deleteDoc(docRef);
  }
}

export const workoutService = new WorkoutService();
