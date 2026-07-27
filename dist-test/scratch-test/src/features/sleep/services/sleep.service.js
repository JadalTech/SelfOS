"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.sleepService = exports.SleepService = void 0;
const firestore_1 = require("firebase/firestore");
const firebase_1 = require("../../../shared/firebase");
const converters_1 = require("../firestore/converters");
class SleepService {
    // --- Sleep Entries ---
    getEntriesCollection(userId) {
        const db = (0, firebase_1.getFirebaseFirestore)();
        return (0, firestore_1.collection)(db, 'users', userId, 'sleep_entries').withConverter(converters_1.sleepEntryConverter);
    }
    async fetchEntries(userId, limitCount = 100) {
        const colRef = this.getEntriesCollection(userId);
        const q = (0, firestore_1.query)(colRef, (0, firestore_1.orderBy)('date', 'desc'), (0, firestore_1.orderBy)('createdAt', 'desc'), (0, firestore_1.limit)(limitCount));
        const snapshot = await (0, firestore_1.getDocs)(q);
        return snapshot.docs.map((docSnap) => docSnap.data());
    }
    async getEntryByDate(userId, dateStr) {
        const db = (0, firebase_1.getFirebaseFirestore)();
        const docRef = (0, firestore_1.doc)(db, 'users', userId, 'sleep_entries', dateStr).withConverter(converters_1.sleepEntryConverter);
        const snap = await (0, firestore_1.getDoc)(docRef);
        if (snap.exists()) {
            return snap.data();
        }
        // If not matching doc ID exactly, query by date field
        const colRef = this.getEntriesCollection(userId);
        const q = (0, firestore_1.query)(colRef, (0, firestore_1.where)('date', '==', dateStr), (0, firestore_1.limit)(1));
        const querySnap = await (0, firestore_1.getDocs)(q);
        if (!querySnap.empty) {
            return querySnap.docs[0].data();
        }
        return null;
    }
    async saveEntry(userId, entry) {
        const colRef = this.getEntriesCollection(userId);
        // We can use the entry.date (YYYY-MM-DD) as the document ID to prevent duplicate records for a single day,
        // or let it auto-generate. Let's use entry.date as the ID so it naturally overwrites/updates if logged twice.
        const docId = entry.id || entry.date;
        const docRef = (0, firestore_1.doc)(colRef, docId);
        const now = new Date();
        const sleepEntry = {
            ...entry,
            id: docId,
            userId,
            createdAt: now,
            updatedAt: now,
        };
        await (0, firestore_1.setDoc)(docRef, sleepEntry);
        return sleepEntry;
    }
    async deleteEntry(userId, entryId) {
        const db = (0, firebase_1.getFirebaseFirestore)();
        const docRef = (0, firestore_1.doc)(db, 'users', userId, 'sleep_entries', entryId);
        await (0, firestore_1.deleteDoc)(docRef);
    }
    // --- Sleep Schedules ---
    getSchedulesCollection(userId) {
        const db = (0, firebase_1.getFirebaseFirestore)();
        return (0, firestore_1.collection)(db, 'users', userId, 'sleep_schedules').withConverter(converters_1.sleepScheduleConverter);
    }
    async fetchSchedules(userId) {
        const colRef = this.getSchedulesCollection(userId);
        const q = (0, firestore_1.query)(colRef, (0, firestore_1.orderBy)('createdAt', 'desc'));
        const snapshot = await (0, firestore_1.getDocs)(q);
        return snapshot.docs.map((docSnap) => docSnap.data());
    }
    async saveSchedule(userId, schedule) {
        const colRef = this.getSchedulesCollection(userId);
        // If the new schedule is active, deactivate existing ones
        if (schedule.isActive) {
            const activeQuery = (0, firestore_1.query)(colRef, (0, firestore_1.where)('isActive', '==', true));
            const activeSnap = await (0, firestore_1.getDocs)(activeQuery);
            for (const dSnap of activeSnap.docs) {
                if (!schedule.id || dSnap.id !== schedule.id) {
                    await (0, firestore_1.updateDoc)((0, firestore_1.doc)(colRef, dSnap.id), {
                        isActive: false,
                        effectiveUntil: schedule.effectiveFrom,
                        updatedAt: firestore_1.Timestamp.now(),
                    });
                }
            }
        }
        const docRef = schedule.id ? (0, firestore_1.doc)(colRef, schedule.id) : (0, firestore_1.doc)(colRef);
        const now = new Date();
        const fullSchedule = {
            ...schedule,
            id: docRef.id,
            userId,
            createdAt: now,
            updatedAt: now,
        };
        await (0, firestore_1.setDoc)(docRef, fullSchedule);
        return fullSchedule;
    }
    async toggleScheduleActive(userId, scheduleId, isActive) {
        const colRef = this.getSchedulesCollection(userId);
        if (isActive) {
            // Deactivate all others
            const activeQuery = (0, firestore_1.query)(colRef, (0, firestore_1.where)('isActive', '==', true));
            const activeSnap = await (0, firestore_1.getDocs)(activeQuery);
            const todayStr = new Date().toISOString().split('T')[0];
            for (const dSnap of activeSnap.docs) {
                if (dSnap.id !== scheduleId) {
                    await (0, firestore_1.updateDoc)((0, firestore_1.doc)(colRef, dSnap.id), {
                        isActive: false,
                        effectiveUntil: todayStr,
                        updatedAt: firestore_1.Timestamp.now(),
                    });
                }
            }
        }
        const docRef = (0, firestore_1.doc)(colRef, scheduleId);
        await (0, firestore_1.updateDoc)(docRef, {
            isActive,
            updatedAt: firestore_1.Timestamp.now(),
        });
    }
    // --- Sleep Goals ---
    getGoalsCollection(userId) {
        const db = (0, firebase_1.getFirebaseFirestore)();
        return (0, firestore_1.collection)(db, 'users', userId, 'sleep_goals').withConverter(converters_1.sleepGoalConverter);
    }
    async fetchGoals(userId) {
        const colRef = this.getGoalsCollection(userId);
        const q = (0, firestore_1.query)(colRef, (0, firestore_1.orderBy)('createdAt', 'desc'));
        const snapshot = await (0, firestore_1.getDocs)(q);
        return snapshot.docs.map((docSnap) => docSnap.data());
    }
    async saveGoal(userId, goal) {
        const colRef = this.getGoalsCollection(userId);
        const docRef = goal.id ? (0, firestore_1.doc)(colRef, goal.id) : (0, firestore_1.doc)(colRef);
        const now = new Date();
        const fullGoal = {
            ...goal,
            id: docRef.id,
            userId,
            createdAt: now,
            updatedAt: now,
        };
        await (0, firestore_1.setDoc)(docRef, fullGoal);
        return fullGoal;
    }
    async toggleGoalActive(userId, goalId, isActive) {
        const docRef = (0, firestore_1.doc)(this.getGoalsCollection(userId), goalId);
        await (0, firestore_1.updateDoc)(docRef, {
            isActive,
            updatedAt: firestore_1.Timestamp.now(),
        });
    }
    // --- Sleep Trends ---
    getTrendsCollection(userId) {
        const db = (0, firebase_1.getFirebaseFirestore)();
        return (0, firestore_1.collection)(db, 'users', userId, 'sleep_trends').withConverter(converters_1.sleepTrendConverter);
    }
    async fetchTrends(userId, limitCount = 10) {
        const colRef = this.getTrendsCollection(userId);
        const q = (0, firestore_1.query)(colRef, (0, firestore_1.orderBy)('calculatedAt', 'desc'), (0, firestore_1.limit)(limitCount));
        const snapshot = await (0, firestore_1.getDocs)(q);
        return snapshot.docs.map((docSnap) => docSnap.data());
    }
    async saveTrend(userId, trend) {
        const colRef = this.getTrendsCollection(userId);
        const docRef = (0, firestore_1.doc)(colRef); // Auto-generate trend record IDs
        await (0, firestore_1.setDoc)(docRef, trend);
    }
}
exports.SleepService = SleepService;
exports.sleepService = new SleepService();
