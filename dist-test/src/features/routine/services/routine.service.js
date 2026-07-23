"use strict";
/**
 * Routine Service
 *
 * Handles direct Firestore interactions for Routines and Routine Logs.
 * Uses Firestore Data Converters to automatically handle type mapping.
 * Contains NO business rules, NO state management, and NO navigation logic.
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.routineService = exports.RoutineService = void 0;
const firestore_1 = require("firebase/firestore");
const firebase_1 = require("@/shared/firebase");
class RoutineService {
    /**
     * Helper to get typed routines collection reference for a user.
     */
    getRoutinesCollection(uid) {
        const db = (0, firebase_1.getFirebaseFirestore)();
        return (0, firestore_1.collection)(db, 'users', uid, 'routines').withConverter(firebase_1.routineConverter);
    }
    /**
     * Helper to get typed routine_logs collection reference for a user.
     */
    getLogsCollection(uid) {
        const db = (0, firebase_1.getFirebaseFirestore)();
        return (0, firestore_1.collection)(db, 'users', uid, 'routine_logs').withConverter(firebase_1.routineLogConverter);
    }
    /**
     * Create a new routine document in Firestore.
     */
    async createRoutine(uid, routineData) {
        const collectionRef = this.getRoutinesCollection(uid);
        const newDocRef = (0, firestore_1.doc)(collectionRef); // Auto-generate document ID
        const routine = {
            ...routineData,
            id: newDocRef.id,
            userId: uid,
        };
        await (0, firestore_1.setDoc)(newDocRef, routine);
        return routine;
    }
    /**
     * Update an existing routine document.
     */
    async updateRoutine(uid, routineId, partialData) {
        const docRef = (0, firestore_1.doc)(this.getRoutinesCollection(uid), routineId);
        await (0, firestore_1.updateDoc)(docRef, {
            ...partialData,
            updatedAt: new Date(),
        });
    }
    /**
     * Archive a routine (soft delete).
     */
    async archiveRoutine(uid, routineId) {
        const docRef = (0, firestore_1.doc)(this.getRoutinesCollection(uid), routineId);
        await (0, firestore_1.updateDoc)(docRef, {
            status: 'archived',
            updatedAt: new Date(),
        });
    }
    /**
     * Restore an archived routine to active status.
     */
    async restoreRoutine(uid, routineId) {
        const docRef = (0, firestore_1.doc)(this.getRoutinesCollection(uid), routineId);
        await (0, firestore_1.updateDoc)(docRef, {
            status: 'active',
            updatedAt: new Date(),
        });
    }
    /**
     * Fetch a single routine by ID.
     */
    async fetchRoutine(uid, routineId) {
        const docRef = (0, firestore_1.doc)(this.getRoutinesCollection(uid), routineId);
        const snapshot = await (0, firestore_1.getDoc)(docRef);
        return snapshot.exists() ? snapshot.data() : null;
    }
    /**
     * Fetch routines for a user with optional type and status filtering.
     */
    async fetchRoutines(uid, filters) {
        const collectionRef = this.getRoutinesCollection(uid);
        const queryConstraints = [];
        if (filters?.type) {
            queryConstraints.push((0, firestore_1.where)('type', '==', filters.type));
        }
        if (filters?.status) {
            queryConstraints.push((0, firestore_1.where)('status', '==', filters.status));
        }
        else {
            // Default to non-archived routines if status filter not explicitly specified
            queryConstraints.push((0, firestore_1.where)('status', 'in', ['draft', 'active', 'paused']));
        }
        const q = (0, firestore_1.query)(collectionRef, ...queryConstraints);
        const snapshot = await (0, firestore_1.getDocs)(q);
        return snapshot.docs.map((docSnap) => docSnap.data());
    }
    /**
     * Fetch logs for a specific routine with optional date bounds.
     */
    async fetchRoutineLogs(uid, routineId, startDate, endDate) {
        const collectionRef = this.getLogsCollection(uid);
        const queryConstraints = [
            (0, firestore_1.where)('routineId', '==', routineId),
            (0, firestore_1.orderBy)('date', 'desc'),
        ];
        if (startDate) {
            queryConstraints.push((0, firestore_1.where)('date', '>=', startDate));
        }
        if (endDate) {
            queryConstraints.push((0, firestore_1.where)('date', '<=', endDate));
        }
        const q = (0, firestore_1.query)(collectionRef, ...queryConstraints);
        const snapshot = await (0, firestore_1.getDocs)(q);
        return snapshot.docs.map((docSnap) => docSnap.data());
    }
    /**
     * Atomic batch write to create a completion/log document AND update the routine streak/lastCompletedDate.
     */
    async writeCompletionBatch(uid, logData, routineUpdate) {
        const db = (0, firebase_1.getFirebaseFirestore)();
        const batch = (0, firestore_1.writeBatch)(db);
        // Create log document
        const logsCollectionRef = this.getLogsCollection(uid);
        const newLogDocRef = (0, firestore_1.doc)(logsCollectionRef);
        const log = {
            ...logData,
            id: newLogDocRef.id,
        };
        batch.set(newLogDocRef, log);
        // Update parent routine document
        const routineDocRef = (0, firestore_1.doc)(this.getRoutinesCollection(uid), logData.routineId);
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
    async writeUndoBatch(uid, logId, routineId, routineUpdate) {
        const db = (0, firebase_1.getFirebaseFirestore)();
        const batch = (0, firestore_1.writeBatch)(db);
        // Delete the log document
        const logDocRef = (0, firestore_1.doc)(this.getLogsCollection(uid), logId);
        batch.delete(logDocRef);
        // Update parent routine document
        const routineDocRef = (0, firestore_1.doc)(this.getRoutinesCollection(uid), routineId);
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
    async deleteRoutinePermanently(uid, routineId) {
        const docRef = (0, firestore_1.doc)(this.getRoutinesCollection(uid), routineId);
        await (0, firestore_1.deleteDoc)(docRef);
    }
}
exports.RoutineService = RoutineService;
exports.routineService = new RoutineService();
