"use strict";
/**
 * Routine Repository
 *
 * Coordinates data flow between pure Domain Engine rules and RoutineService.
 * Validates authenticated user context, normalizes errors into AppErrors,
 * and returns type-safe Result wrappers.
 *
 * Contains NO React state, NO navigation, and NO UI logic.
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.routineRepository = exports.RoutineRepository = void 0;
const firebase_1 = require("@/shared/firebase");
const types_1 = require("@/shared/types");
const errors_1 = require("@/shared/errors");
const routine_service_1 = require("../services/routine.service");
const streak_1 = require("../engine/streak");
class RoutineRepository {
    /**
     * Helper to ensure an authenticated user session exists.
     */
    getAuthenticatedUserId() {
        const auth = (0, firebase_1.getFirebaseAuth)();
        const currentUser = auth.currentUser;
        if (!currentUser) {
            return (0, types_1.err)(errors_1.AppError.auth('Authentication is required to perform this action.'));
        }
        return (0, types_1.ok)(currentUser.uid);
    }
    /**
     * Create a new routine.
     */
    async createRoutine(formValues) {
        const authResult = this.getAuthenticatedUserId();
        if (!authResult.success)
            return authResult;
        try {
            const routineData = {
                title: formValues.title,
                description: formValues.description,
                type: formValues.type,
                status: formValues.status,
                schedule: formValues.schedule,
                reminders: formValues.reminders,
                currentStreak: 0,
                longestStreak: 0,
                createdAt: new Date(),
                updatedAt: new Date(),
            };
            const created = await routine_service_1.routineService.createRoutine(authResult.data, routineData);
            return (0, types_1.ok)(created);
        }
        catch (error) {
            return (0, types_1.err)((0, errors_1.normalizeFirebaseError)(error));
        }
    }
    /**
     * Update an existing routine.
     */
    async updateRoutine(routineId, formValues) {
        const authResult = this.getAuthenticatedUserId();
        if (!authResult.success)
            return authResult;
        try {
            await routine_service_1.routineService.updateRoutine(authResult.data, routineId, formValues);
            return (0, types_1.ok)(undefined);
        }
        catch (error) {
            return (0, types_1.err)((0, errors_1.normalizeFirebaseError)(error));
        }
    }
    /**
     * Archive a routine (soft delete).
     */
    async archiveRoutine(routineId) {
        const authResult = this.getAuthenticatedUserId();
        if (!authResult.success)
            return authResult;
        try {
            await routine_service_1.routineService.archiveRoutine(authResult.data, routineId);
            return (0, types_1.ok)(undefined);
        }
        catch (error) {
            return (0, types_1.err)((0, errors_1.normalizeFirebaseError)(error));
        }
    }
    /**
     * Restore an archived routine.
     */
    async restoreRoutine(routineId) {
        const authResult = this.getAuthenticatedUserId();
        if (!authResult.success)
            return authResult;
        try {
            await routine_service_1.routineService.restoreRoutine(authResult.data, routineId);
            return (0, types_1.ok)(undefined);
        }
        catch (error) {
            return (0, types_1.err)((0, errors_1.normalizeFirebaseError)(error));
        }
    }
    /**
     * Fetch routines by type and status filters.
     */
    async fetchRoutines(filters) {
        const authResult = this.getAuthenticatedUserId();
        if (!authResult.success)
            return authResult;
        try {
            const routines = await routine_service_1.routineService.fetchRoutines(authResult.data, filters);
            return (0, types_1.ok)(routines);
        }
        catch (error) {
            return (0, types_1.err)((0, errors_1.normalizeFirebaseError)(error));
        }
    }
    /**
     * Fetch single routine by ID.
     */
    async fetchRoutine(routineId) {
        const authResult = this.getAuthenticatedUserId();
        if (!authResult.success)
            return authResult;
        try {
            const routine = await routine_service_1.routineService.fetchRoutine(authResult.data, routineId);
            return (0, types_1.ok)(routine);
        }
        catch (error) {
            return (0, types_1.err)((0, errors_1.normalizeFirebaseError)(error));
        }
    }
    /**
     * Fetch logs for a specific routine.
     */
    async fetchRoutineLogs(routineId, startDate, endDate) {
        const authResult = this.getAuthenticatedUserId();
        if (!authResult.success)
            return authResult;
        try {
            const logs = await routine_service_1.routineService.fetchRoutineLogs(authResult.data, routineId, startDate, endDate);
            return (0, types_1.ok)(logs);
        }
        catch (error) {
            return (0, types_1.err)((0, errors_1.normalizeFirebaseError)(error));
        }
    }
    /**
     * Mark routine as completed on a specific date.
     * Atomically computes new streak and logs completion in a transaction batch write.
     */
    async completeRoutine(routineId, dateStr, payload) {
        const authResult = this.getAuthenticatedUserId();
        if (!authResult.success)
            return authResult;
        try {
            const uid = authResult.data;
            const routine = await routine_service_1.routineService.fetchRoutine(uid, routineId);
            if (!routine) {
                return (0, types_1.err)(errors_1.AppError.notFound('Routine not found.'));
            }
            // Delegate pure streak calculation to domain engine
            const streakUpdate = (0, streak_1.calculateCompletionStreak)(routine, dateStr);
            const now = new Date();
            const timeStr = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}:${String(now.getSeconds()).padStart(2, '0')}`;
            const logData = {
                routineId,
                type: routine.type,
                date: dateStr,
                time: timeStr,
                status: 'completed',
                payload,
                timestamp: now,
            };
            const createdLog = await routine_service_1.routineService.writeCompletionBatch(uid, logData, streakUpdate);
            return (0, types_1.ok)(createdLog);
        }
        catch (error) {
            return (0, types_1.err)((0, errors_1.normalizeFirebaseError)(error));
        }
    }
    /**
     * Mark routine as skipped on a specific date.
     */
    async skipRoutine(routineId, dateStr, payload) {
        const authResult = this.getAuthenticatedUserId();
        if (!authResult.success)
            return authResult;
        try {
            const uid = authResult.data;
            const routine = await routine_service_1.routineService.fetchRoutine(uid, routineId);
            if (!routine) {
                return (0, types_1.err)(errors_1.AppError.notFound('Routine not found.'));
            }
            const now = new Date();
            const timeStr = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}:${String(now.getSeconds()).padStart(2, '0')}`;
            const logData = {
                routineId,
                type: routine.type,
                date: dateStr,
                time: timeStr,
                status: 'skipped',
                payload,
                timestamp: now,
            };
            // Skipping preserves current streak values
            const streakUpdate = {
                currentStreak: routine.currentStreak,
                longestStreak: routine.longestStreak,
                lastCompletedDate: routine.lastCompletedDate,
            };
            const createdLog = await routine_service_1.routineService.writeCompletionBatch(uid, logData, streakUpdate);
            return (0, types_1.ok)(createdLog);
        }
        catch (error) {
            return (0, types_1.err)((0, errors_1.normalizeFirebaseError)(error));
        }
    }
    /**
     * Undo a completion log.
     * Atomically recalculates the streak from remaining historical logs and updates the routine.
     */
    async undoCompletion(routineId, logId) {
        const authResult = this.getAuthenticatedUserId();
        if (!authResult.success)
            return authResult;
        try {
            const uid = authResult.data;
            const routine = await routine_service_1.routineService.fetchRoutine(uid, routineId);
            if (!routine) {
                return (0, types_1.err)(errors_1.AppError.notFound('Routine not found.'));
            }
            // Fetch all historical logs for this routine
            const allLogs = await routine_service_1.routineService.fetchRoutineLogs(uid, routineId);
            // Filter out the log being undone
            const remainingLogs = allLogs.filter((log) => log.id !== logId);
            // Delegate pure streak recalculation to domain engine
            const streakUpdate = (0, streak_1.rebuildStreakFromLogs)(routine, remainingLogs);
            await routine_service_1.routineService.writeUndoBatch(uid, logId, routineId, streakUpdate);
            return (0, types_1.ok)(undefined);
        }
        catch (error) {
            return (0, types_1.err)((0, errors_1.normalizeFirebaseError)(error));
        }
    }
}
exports.RoutineRepository = RoutineRepository;
exports.routineRepository = new RoutineRepository();
