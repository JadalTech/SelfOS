/**
 * Firestore Database Services for Hydration Module
 * SelfOS v1.4.0 — Batch 11A Revision
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
  onSnapshot,
  Unsubscribe,
} from 'firebase/firestore';
import { getFirebaseFirestore } from '../../../shared/firebase';
import type {
  HydrationEntry,
  HydrationGoal,
  HydrationGoalVersion,
  HydrationReminder,
  HydrationStatistics,
  CachedHydrationSummary,
} from '../types/hydration.types';
import { HYDRATION_COLLECTIONS } from '../constants/hydration.constants';
import {
  hydrationEntryConverter,
  hydrationGoalConverter,
  hydrationGoalVersionConverter,
  hydrationReminderConverter,
} from '../firestore/converters';

export class HydrationService {
  // ---------------------------------------------------------------------------
  // Collection Helpers
  // ---------------------------------------------------------------------------

  private getEntriesCollection(userId: string) {
    const db = getFirebaseFirestore();
    return collection(
      db,
      'users',
      userId,
      HYDRATION_COLLECTIONS.ENTRIES
    ).withConverter(hydrationEntryConverter);
  }

  private getGoalsCollection(userId: string) {
    const db = getFirebaseFirestore();
    return collection(
      db,
      'users',
      userId,
      HYDRATION_COLLECTIONS.GOALS
    ).withConverter(hydrationGoalConverter);
  }

  private getGoalVersionsCollection(userId: string) {
    const db = getFirebaseFirestore();
    return collection(
      db,
      'users',
      userId,
      HYDRATION_COLLECTIONS.GOAL_VERSIONS
    ).withConverter(hydrationGoalVersionConverter);
  }

  private getRemindersCollection(userId: string) {
    const db = getFirebaseFirestore();
    return collection(
      db,
      'users',
      userId,
      HYDRATION_COLLECTIONS.REMINDERS
    ).withConverter(hydrationReminderConverter);
  }

  private getStatisticsCollection(userId: string) {
    const db = getFirebaseFirestore();
    return collection(
      db,
      'users',
      userId,
      HYDRATION_COLLECTIONS.STATISTICS
    );
  }

  // ---------------------------------------------------------------------------
  // Entries
  // ---------------------------------------------------------------------------

  async createEntry(
    userId: string,
    input: Omit<HydrationEntry, 'id' | 'userId' | 'createdAt' | 'updatedAt'>
  ): Promise<HydrationEntry> {
    const colRef = this.getEntriesCollection(userId);
    const newDocRef = doc(colRef);
    const now = new Date();
    const entry: HydrationEntry = {
      ...input,
      id: newDocRef.id,
      userId,
      createdAt: now,
      updatedAt: now,
    };
    await setDoc(newDocRef, entry);
    return entry;
  }

  async updateEntry(
    userId: string,
    entryId: string,
    updates: Partial<Omit<HydrationEntry, 'id' | 'userId' | 'createdAt'>>
  ): Promise<HydrationEntry> {
    const colRef = this.getEntriesCollection(userId);
    const docRef = doc(colRef, entryId);
    const snap = await getDoc(docRef);
    if (!snap.exists()) {
      throw new Error(`Hydration entry ${entryId} not found`);
    }
    const existing = snap.data();
    const updated: HydrationEntry = {
      ...existing,
      ...updates,
      id: entryId,
      userId,
      updatedAt: new Date(),
    };
    await setDoc(docRef, updated);
    return updated;
  }

  async deleteEntry(userId: string, entryId: string): Promise<void> {
    const db = getFirebaseFirestore();
    const docRef = doc(
      db,
      'users',
      userId,
      HYDRATION_COLLECTIONS.ENTRIES,
      entryId
    );
    await deleteDoc(docRef);
  }

  async getEntry(
    userId: string,
    entryId: string
  ): Promise<HydrationEntry | null> {
    const colRef = this.getEntriesCollection(userId);
    const docRef = doc(colRef, entryId);
    const snap = await getDoc(docRef);
    return snap.exists() ? snap.data() : null;
  }

  async getEntries(
    userId: string,
    limitCount = 100
  ): Promise<HydrationEntry[]> {
    const colRef = this.getEntriesCollection(userId);
    const q = query(
      colRef,
      orderBy('timestamp', 'desc'),
      limit(limitCount)
    );
    const snapshot = await getDocs(q);
    return snapshot.docs.map((docSnap) => docSnap.data());
  }

  async getEntriesForDate(
    userId: string,
    date: string
  ): Promise<HydrationEntry[]> {
    const colRef = this.getEntriesCollection(userId);
    const q = query(
      colRef,
      where('date', '==', date),
      orderBy('timestamp', 'asc')
    );
    const snapshot = await getDocs(q);
    return snapshot.docs.map((docSnap) => docSnap.data());
  }

  async getEntriesForRange(
    userId: string,
    startDate: string,
    endDate: string
  ): Promise<HydrationEntry[]> {
    const colRef = this.getEntriesCollection(userId);
    const q = query(
      colRef,
      where('date', '>=', startDate),
      where('date', '<=', endDate),
      orderBy('date', 'asc'),
      orderBy('timestamp', 'asc')
    );
    const snapshot = await getDocs(q);
    return snapshot.docs.map((docSnap) => docSnap.data());
  }

  // ---------------------------------------------------------------------------
  // Real-time Streams
  // ---------------------------------------------------------------------------

  streamDailyEntries(
    userId: string,
    date: string,
    onData: (entries: HydrationEntry[]) => void,
    onError: (error: Error) => void
  ): Unsubscribe {
    const colRef = this.getEntriesCollection(userId);
    const q = query(
      colRef,
      where('date', '==', date),
      orderBy('timestamp', 'asc')
    );
    return onSnapshot(
      q,
      (snapshot) => {
        const entries = snapshot.docs.map((docSnap) => docSnap.data());
        onData(entries);
      },
      onError
    );
  }

  streamGoal(
    userId: string,
    onData: (goal: HydrationGoal | null) => void,
    onError: (error: Error) => void
  ): Unsubscribe {
    const colRef = this.getGoalsCollection(userId);
    const q = query(colRef, limit(1));
    return onSnapshot(
      q,
      (snapshot) => {
        if (snapshot.empty) {
          onData(null);
        } else {
          onData(snapshot.docs[0].data());
        }
      },
      onError
    );
  }

  // ---------------------------------------------------------------------------
  // Goal
  // ---------------------------------------------------------------------------

  async saveGoal(
    userId: string,
    input: Omit<HydrationGoal, 'id' | 'userId' | 'createdAt' | 'updatedAt'>
  ): Promise<HydrationGoal> {
    const colRef = this.getGoalsCollection(userId);
    const now = new Date();

    const goalDocRef = doc(colRef, 'current');

    let createdAt = now;
    const snap = await getDoc(goalDocRef);
    if (snap.exists()) {
      createdAt = snap.data().createdAt;
    }

    const goal: HydrationGoal = {
      ...input,
      id: 'current',
      userId,
      createdAt,
      updatedAt: now,
    };
    await setDoc(goalDocRef, goal);
    return goal;
  }

  async getGoal(userId: string): Promise<HydrationGoal | null> {
    const colRef = this.getGoalsCollection(userId);
    const goalDocRef = doc(colRef, 'current');
    const snap = await getDoc(goalDocRef);
    return snap.exists() ? snap.data() : null;
  }

  // ---------------------------------------------------------------------------
  // Goal Versioning (Revision)
  // ---------------------------------------------------------------------------

  async getGoalVersions(userId: string): Promise<HydrationGoalVersion[]> {
    const colRef = this.getGoalVersionsCollection(userId);
    const q = query(colRef, orderBy('createdAt', 'desc'));
    const snap = await getDocs(q);
    return snap.docs.map((d) => d.data());
  }

  async logGoalVersion(
    userId: string,
    input: Omit<HydrationGoalVersion, 'versionId' | 'userId' | 'createdAt'>
  ): Promise<HydrationGoalVersion> {
    const colRef = this.getGoalVersionsCollection(userId);
    const newDocRef = doc(colRef);
    const version: HydrationGoalVersion = {
      ...input,
      versionId: newDocRef.id,
      userId,
      createdAt: new Date(),
    };
    await setDoc(newDocRef, version);
    return version;
  }

  // ---------------------------------------------------------------------------
  // Reminders Configuration (Revision)
  // ---------------------------------------------------------------------------

  async getReminderConfig(userId: string): Promise<HydrationReminder | null> {
    const colRef = this.getRemindersCollection(userId);
    const reminderDocRef = doc(colRef, 'current');
    const snap = await getDoc(reminderDocRef);
    return snap.exists() ? snap.data() : null;
  }

  async saveReminderConfig(
    userId: string,
    input: Omit<HydrationReminder, 'id' | 'userId' | 'createdAt' | 'updatedAt'>
  ): Promise<HydrationReminder> {
    const colRef = this.getRemindersCollection(userId);
    const reminderDocRef = doc(colRef, 'current');
    const now = new Date();

    let createdAt = now;
    const snap = await getDoc(reminderDocRef);
    if (snap.exists()) {
      createdAt = snap.data().createdAt;
    }

    const reminder: HydrationReminder = {
      ...input,
      id: 'current',
      userId,
      createdAt,
      updatedAt: now,
    };
    await setDoc(reminderDocRef, reminder);
    return reminder;
  }

  // ---------------------------------------------------------------------------
  // Statistics
  // ---------------------------------------------------------------------------

  async getStatistics(
    userId: string
  ): Promise<HydrationStatistics | null> {
    const colRef = this.getStatisticsCollection(userId);
    const docRef = doc(colRef, 'current');
    const snap = await getDoc(docRef);
    return snap.exists() ? (snap.data() as HydrationStatistics) : null;
  }

  async updateStatistics(
    userId: string,
    stats: HydrationStatistics
  ): Promise<void> {
    const colRef = this.getStatisticsCollection(userId);
    const docRef = doc(colRef, 'current');
    await setDoc(docRef, stats);
  }

  // ---------------------------------------------------------------------------
  // Cached Summaries Architecture (Revision)
  // ---------------------------------------------------------------------------

  async cacheDailySummary(userId: string, summary: CachedHydrationSummary): Promise<void> {
    const db = getFirebaseFirestore();
    const docRef = doc(db, 'users', userId, HYDRATION_COLLECTIONS.CACHED_DAILY, summary.periodKey);
    await setDoc(docRef, summary);
  }

  async cacheWeeklySummary(userId: string, summary: CachedHydrationSummary): Promise<void> {
    const db = getFirebaseFirestore();
    const docRef = doc(db, 'users', userId, HYDRATION_COLLECTIONS.CACHED_WEEKLY, summary.periodKey);
    await setDoc(docRef, summary);
  }
}

export const hydrationService = new HydrationService();
