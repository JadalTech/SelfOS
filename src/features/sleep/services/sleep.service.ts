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
import type { SleepEntry, SleepSchedule, SleepGoal, SleepTrend } from '../types/sleep.types';
import {
  sleepEntryConverter,
  sleepScheduleConverter,
  sleepGoalConverter,
  sleepTrendConverter,
} from '../firestore/converters';

export class SleepService {
  // --- Sleep Entries ---

  private getEntriesCollection(userId: string) {
    const db = getFirebaseFirestore();
    return collection(db, 'users', userId, 'sleep_entries').withConverter(sleepEntryConverter);
  }

  async fetchEntries(userId: string, limitCount = 100): Promise<SleepEntry[]> {
    const colRef = this.getEntriesCollection(userId);
    const q = query(colRef, orderBy('date', 'desc'), orderBy('createdAt', 'desc'), limit(limitCount));
    const snapshot = await getDocs(q);
    return snapshot.docs.map((docSnap) => docSnap.data());
  }

  async getEntryByDate(userId: string, dateStr: string): Promise<SleepEntry | null> {
    const db = getFirebaseFirestore();
    const docRef = doc(db, 'users', userId, 'sleep_entries', dateStr).withConverter(sleepEntryConverter);
    const snap = await getDoc(docRef);
    if (snap.exists()) {
      return snap.data();
    }
    // If not matching doc ID exactly, query by date field
    const colRef = this.getEntriesCollection(userId);
    const q = query(colRef, where('date', '==', dateStr), limit(1));
    const querySnap = await getDocs(q);
    if (!querySnap.empty) {
      return querySnap.docs[0].data();
    }
    return null;
  }

  async saveEntry(userId: string, entry: Omit<SleepEntry, 'id' | 'userId' | 'createdAt' | 'updatedAt'> & { id?: string }): Promise<SleepEntry> {
    const colRef = this.getEntriesCollection(userId);
    
    // We can use the entry.date (YYYY-MM-DD) as the document ID to prevent duplicate records for a single day,
    // or let it auto-generate. Let's use entry.date as the ID so it naturally overwrites/updates if logged twice.
    const docId = entry.id || entry.date;
    const docRef = doc(colRef, docId);
    const now = new Date();
    
    const sleepEntry: SleepEntry = {
      ...entry,
      id: docId,
      userId,
      createdAt: now,
      updatedAt: now,
    };
    
    await setDoc(docRef, sleepEntry);
    return sleepEntry;
  }

  async deleteEntry(userId: string, entryId: string): Promise<void> {
    const db = getFirebaseFirestore();
    const docRef = doc(db, 'users', userId, 'sleep_entries', entryId);
    await deleteDoc(docRef);
  }

  // --- Sleep Schedules ---

  private getSchedulesCollection(userId: string) {
    const db = getFirebaseFirestore();
    return collection(db, 'users', userId, 'sleep_schedules').withConverter(sleepScheduleConverter);
  }

  async fetchSchedules(userId: string): Promise<SleepSchedule[]> {
    const colRef = this.getSchedulesCollection(userId);
    const q = query(colRef, orderBy('createdAt', 'desc'));
    const snapshot = await getDocs(q);
    return snapshot.docs.map((docSnap) => docSnap.data());
  }

  async saveSchedule(
    userId: string,
    schedule: Omit<SleepSchedule, 'id' | 'userId' | 'createdAt' | 'updatedAt'> & { id?: string }
  ): Promise<SleepSchedule> {
    const colRef = this.getSchedulesCollection(userId);
    
    // If the new schedule is active, deactivate existing ones
    if (schedule.isActive) {
      const activeQuery = query(colRef, where('isActive', '==', true));
      const activeSnap = await getDocs(activeQuery);
      for (const dSnap of activeSnap.docs) {
        if (!schedule.id || dSnap.id !== schedule.id) {
          await updateDoc(doc(colRef, dSnap.id), {
            isActive: false,
            effectiveUntil: schedule.effectiveFrom,
            updatedAt: Timestamp.now(),
          });
        }
      }
    }

    const docRef = schedule.id ? doc(colRef, schedule.id) : doc(colRef);
    const now = new Date();
    
    const fullSchedule: SleepSchedule = {
      ...schedule,
      id: docRef.id,
      userId,
      createdAt: now,
      updatedAt: now,
    };
    
    await setDoc(docRef, fullSchedule);
    return fullSchedule;
  }

  async toggleScheduleActive(userId: string, scheduleId: string, isActive: boolean): Promise<void> {
    const colRef = this.getSchedulesCollection(userId);
    
    if (isActive) {
      // Deactivate all others
      const activeQuery = query(colRef, where('isActive', '==', true));
      const activeSnap = await getDocs(activeQuery);
      const todayStr = new Date().toISOString().split('T')[0];
      for (const dSnap of activeSnap.docs) {
        if (dSnap.id !== scheduleId) {
          await updateDoc(doc(colRef, dSnap.id), {
            isActive: false,
            effectiveUntil: todayStr,
            updatedAt: Timestamp.now(),
          });
        }
      }
    }
    
    const docRef = doc(colRef, scheduleId);
    await updateDoc(docRef, {
      isActive,
      updatedAt: Timestamp.now(),
    });
  }

  // --- Sleep Goals ---

  private getGoalsCollection(userId: string) {
    const db = getFirebaseFirestore();
    return collection(db, 'users', userId, 'sleep_goals').withConverter(sleepGoalConverter);
  }

  async fetchGoals(userId: string): Promise<SleepGoal[]> {
    const colRef = this.getGoalsCollection(userId);
    const q = query(colRef, orderBy('createdAt', 'desc'));
    const snapshot = await getDocs(q);
    return snapshot.docs.map((docSnap) => docSnap.data());
  }

  async saveGoal(
    userId: string,
    goal: Omit<SleepGoal, 'id' | 'userId' | 'createdAt' | 'updatedAt'> & { id?: string }
  ): Promise<SleepGoal> {
    const colRef = this.getGoalsCollection(userId);
    const docRef = goal.id ? doc(colRef, goal.id) : doc(colRef);
    const now = new Date();
    
    const fullGoal: SleepGoal = {
      ...goal,
      id: docRef.id,
      userId,
      createdAt: now,
      updatedAt: now,
    };
    
    await setDoc(docRef, fullGoal);
    return fullGoal;
  }

  async toggleGoalActive(userId: string, goalId: string, isActive: boolean): Promise<void> {
    const docRef = doc(this.getGoalsCollection(userId), goalId);
    await updateDoc(docRef, {
      isActive,
      updatedAt: Timestamp.now(),
    });
  }

  // --- Sleep Trends ---

  private getTrendsCollection(userId: string) {
    const db = getFirebaseFirestore();
    return collection(db, 'users', userId, 'sleep_trends').withConverter(sleepTrendConverter);
  }

  async fetchTrends(userId: string, limitCount = 10): Promise<SleepTrend[]> {
    const colRef = this.getTrendsCollection(userId);
    const q = query(colRef, orderBy('calculatedAt', 'desc'), limit(limitCount));
    const snapshot = await getDocs(q);
    return snapshot.docs.map((docSnap) => docSnap.data());
  }

  async saveTrend(userId: string, trend: SleepTrend): Promise<void> {
    const colRef = this.getTrendsCollection(userId);
    const docRef = doc(colRef); // Auto-generate trend record IDs
    await setDoc(docRef, trend);
  }
}

export const sleepService = new SleepService();
