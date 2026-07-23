/**
 * Routine Service
 *
 * Handles direct Firestore interactions for Routines and Routine Logs.
 * Uses Firestore Data Converters to automatically handle type mapping.
 * Contains NO business rules, NO state management, and NO navigation logic.
 */

import {
  collection,
  doc,
  getDoc,
  getDocs,
  setDoc,
  updateDoc,
  deleteDoc,
  query,
  where,
  orderBy,
  writeBatch,
} from 'firebase/firestore';
import { getFirebaseFirestore, routineConverter, routineLogConverter } from '@/shared/firebase';
import type { Routine, RoutineLog, RoutineType, RoutineStatus } from '../types';

export class RoutineService {
  /**
   * Helper to get typed routines collection reference for a user.
   */
  private getRoutinesCollection(uid: string) {
    const db = getFirebaseFirestore();
    return collection(db, 'users', uid, 'routines').withConverter(routineConverter);
  }

  /**
   * Helper to get typed routine_logs collection reference for a user.
   */
  private getLogsCollection(uid: string) {
    const db = getFirebaseFirestore();
    return collection(db, 'users', uid, 'routine_logs').withConverter(routineLogConverter);
  }

  /**
   * Create a new routine document in Firestore.
   */
  async createRoutine(uid: string, routineData: Omit<Routine, 'id' | 'userId'>): Promise<Routine> {
    const collectionRef = this.getRoutinesCollection(uid);
    const newDocRef = doc(collectionRef); // Auto-generate document ID

    const routine: Routine = {
      ...routineData,
      id: newDocRef.id,
      userId: uid,
    };

    await setDoc(newDocRef, routine);
    return routine;
  }

  /**
   * Update an existing routine document.
   */
  async updateRoutine(
    uid: string,
    routineId: string,
    partialData: Partial<Omit<Routine, 'id' | 'userId' | 'createdAt'>>
  ): Promise<void> {
    const docRef = doc(this.getRoutinesCollection(uid), routineId);
    await updateDoc(docRef, {
      ...partialData,
      updatedAt: new Date(),
    });
  }

  /**
   * Archive a routine (soft delete).
   */
  async archiveRoutine(uid: string, routineId: string): Promise<void> {
    const docRef = doc(this.getRoutinesCollection(uid), routineId);
    await updateDoc(docRef, {
      status: 'archived',
      updatedAt: new Date(),
    });
  }

  /**
   * Restore an archived routine to active status.
   */
  async restoreRoutine(uid: string, routineId: string): Promise<void> {
    const docRef = doc(this.getRoutinesCollection(uid), routineId);
    await updateDoc(docRef, {
      status: 'active',
      updatedAt: new Date(),
    });
  }

  /**
   * Fetch a single routine by ID.
   */
  async fetchRoutine(uid: string, routineId: string): Promise<Routine | null> {
    const docRef = doc(this.getRoutinesCollection(uid), routineId);
    const snapshot = await getDoc(docRef);
    return snapshot.exists() ? snapshot.data() : null;
  }

  /**
   * Fetch routines for a user with optional type and status filtering.
   */
  async fetchRoutines(
    uid: string,
    filters?: { type?: RoutineType; status?: RoutineStatus }
  ): Promise<Routine[]> {
    const collectionRef = this.getRoutinesCollection(uid);
    const queryConstraints = [];

    if (filters?.type) {
      queryConstraints.push(where('type', '==', filters.type));
    }
    if (filters?.status) {
      queryConstraints.push(where('status', '==', filters.status));
    } else {
      // Default to non-archived routines if status filter not explicitly specified
      queryConstraints.push(where('status', 'in', ['draft', 'active', 'paused']));
    }

    const q = query(collectionRef, ...queryConstraints);
    const snapshot = await getDocs(q);
    return snapshot.docs.map((docSnap) => docSnap.data());
  }

  /**
   * Fetch logs for a specific routine with optional date bounds.
   */
  async fetchRoutineLogs(
    uid: string,
    routineId: string,
    startDate?: string,
    endDate?: string
  ): Promise<RoutineLog[]> {
    const collectionRef = this.getLogsCollection(uid);
    const queryConstraints = [
      where('routineId', '==', routineId),
      orderBy('date', 'desc'),
    ];

    if (startDate) {
      queryConstraints.push(where('date', '>=', startDate));
    }
    if (endDate) {
      queryConstraints.push(where('date', '<=', endDate));
    }

    const q = query(collectionRef, ...queryConstraints);
    const snapshot = await getDocs(q);
    return snapshot.docs.map((docSnap) => docSnap.data());
  }

  /**
   * Atomic batch write to create a completion/log document AND update the routine streak/lastCompletedDate.
   */
  async writeCompletionBatch(
    uid: string,
    logData: Omit<RoutineLog, 'id'>,
    routineUpdate: { currentStreak: number; longestStreak: number; lastCompletedDate?: string | null }
  ): Promise<RoutineLog> {
    const db = getFirebaseFirestore();
    const batch = writeBatch(db);

    // Create log document
    const logsCollectionRef = this.getLogsCollection(uid);
    const newLogDocRef = doc(logsCollectionRef);

    const log: RoutineLog = {
      ...logData,
      id: newLogDocRef.id,
    };

    batch.set(newLogDocRef, log);

    // Update parent routine document
    const routineDocRef = doc(this.getRoutinesCollection(uid), logData.routineId);
    batch.update(routineDocRef, {
      currentStreak: routineUpdate.currentStreak,
      longestStreak: routineUpdate.longestStreak,
      lastCompletedDate: routineUpdate.lastCompletedDate ?? null,
      updatedAt: new Date(),
    });

    // Commit atomically
    await batch.commit();
    return log;
  }

  /**
   * Atomic batch write to delete a log document AND update the routine streak/lastCompletedDate on undo.
   */
  async writeUndoBatch(
    uid: string,
    logId: string,
    routineId: string,
    routineUpdate: { currentStreak: number; longestStreak: number; lastCompletedDate?: string | null }
  ): Promise<void> {
    const db = getFirebaseFirestore();
    const batch = writeBatch(db);

    // Delete the log document
    const logDocRef = doc(this.getLogsCollection(uid), logId);
    batch.delete(logDocRef);

    // Update parent routine document
    const routineDocRef = doc(this.getRoutinesCollection(uid), routineId);
    batch.update(routineDocRef, {
      currentStreak: routineUpdate.currentStreak,
      longestStreak: routineUpdate.longestStreak,
      lastCompletedDate: routineUpdate.lastCompletedDate ?? null,
      updatedAt: new Date(),
    });

    // Commit atomically
    await batch.commit();
  }

  /**
   * Permanently delete a routine document (internal/cleanup only).
   */
  async deleteRoutinePermanently(uid: string, routineId: string): Promise<void> {
    const docRef = doc(this.getRoutinesCollection(uid), routineId);
    await deleteDoc(docRef);
  }
}

export const routineService = new RoutineService();
