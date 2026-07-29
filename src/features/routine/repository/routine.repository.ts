/**
 * Routine Repository
 *
 * Coordinates data flow between pure Domain Engine rules and RoutineService.
 * Validates authenticated user context, normalizes errors into AppErrors,
 * and returns type-safe Result wrappers.
 *
 * Contains NO React state, NO navigation, and NO UI logic.
 */

import { getFirebaseAuth } from '@/shared/firebase';
import { ok, err } from '@/shared/types';
import type { Result } from '@/shared/types';
import { AppError, normalizeFirebaseError } from '@/shared/errors';
import { routineService, RoutineService } from '../services/routine.service';
import { calculateCompletionStreak, rebuildStreakFromLogs } from '../engine/streak';
import type { Routine, RoutineLog, RoutineType, RoutineStatus } from '../types';
import type { RoutineFormValues } from '../validation/routine.validation';
import type {
  IRoutineRepository,
  CreateRoutinePayload,
  UpdateRoutinePayload,
} from '../domain/repositories/routine.repository.interface';

export class RoutineRepository implements IRoutineRepository {
  constructor(private readonly service: RoutineService = routineService) {}
  /**
   * Helper to ensure an authenticated user session exists.
   */
  private getAuthenticatedUserId(): Result<string> {
    const auth = getFirebaseAuth();
    const currentUser = auth.currentUser;

    if (!currentUser) {
      return err(AppError.auth('Authentication is required to perform this action.'));
    }
    return ok(currentUser.uid);
  }

  /**
   * Create a new routine.
   */
  async createRoutine(formValues: RoutineFormValues): Promise<Result<Routine>> {
    const authResult = this.getAuthenticatedUserId();
    if (!authResult.success) return authResult;

    try {
      const routineData: Omit<Routine, 'id' | 'userId'> = {
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

      const created = await routineService.createRoutine(authResult.data, routineData);
      return ok(created);
    } catch (error) {
      return err(normalizeFirebaseError(error));
    }
  }

  /**
   * Update an existing routine.
   */
  async updateRoutine(
    routineId: string,
    formValues: Partial<RoutineFormValues>
  ): Promise<Result<void>> {
    const authResult = this.getAuthenticatedUserId();
    if (!authResult.success) return authResult;

    try {
      await routineService.updateRoutine(authResult.data, routineId, formValues);
      return ok(undefined);
    } catch (error) {
      return err(normalizeFirebaseError(error));
    }
  }

  /**
   * Archive a routine (soft delete).
   */
  async archiveRoutine(routineId: string): Promise<Result<void>> {
    const authResult = this.getAuthenticatedUserId();
    if (!authResult.success) return authResult;

    try {
      await routineService.archiveRoutine(authResult.data, routineId);
      return ok(undefined);
    } catch (error) {
      return err(normalizeFirebaseError(error));
    }
  }

  /**
   * Restore an archived routine.
   */
  async restoreRoutine(routineId: string): Promise<Result<void>> {
    const authResult = this.getAuthenticatedUserId();
    if (!authResult.success) return authResult;

    try {
      await routineService.restoreRoutine(authResult.data, routineId);
      return ok(undefined);
    } catch (error) {
      return err(normalizeFirebaseError(error));
    }
  }

  /**
   * Fetch routines by type and status filters.
   */
  async fetchRoutines(filters?: {
    type?: RoutineType;
    status?: RoutineStatus;
  }): Promise<Result<Routine[]>> {
    const authResult = this.getAuthenticatedUserId();
    if (!authResult.success) return authResult;

    try {
      const routines = await routineService.fetchRoutines(authResult.data, filters);
      return ok(routines);
    } catch (error) {
      return err(normalizeFirebaseError(error));
    }
  }

  /**
   * Fetch single routine by ID.
   */
  async fetchRoutine(routineId: string): Promise<Result<Routine | null>> {
    const authResult = this.getAuthenticatedUserId();
    if (!authResult.success) return authResult;

    try {
      const routine = await routineService.fetchRoutine(authResult.data, routineId);
      return ok(routine);
    } catch (error) {
      return err(normalizeFirebaseError(error));
    }
  }

  /**
   * Fetch logs for a specific routine.
   */
  async fetchRoutineLogs(
    routineId: string,
    startDate?: string,
    endDate?: string
  ): Promise<Result<RoutineLog[]>> {
    const authResult = this.getAuthenticatedUserId();
    if (!authResult.success) return authResult;

    try {
      const logs = await routineService.fetchRoutineLogs(
        authResult.data,
        routineId,
        startDate,
        endDate
      );
      return ok(logs);
    } catch (error) {
      return err(normalizeFirebaseError(error));
    }
  }

  /**
   * Mark routine as completed on a specific date.
   * Atomically computes new streak and logs completion in a transaction batch write.
   */
  async completeRoutine(
    routineId: string,
    dateStr: string,
    payload?: Record<string, unknown>
  ): Promise<Result<RoutineLog>> {
    const authResult = this.getAuthenticatedUserId();
    if (!authResult.success) return authResult;

    try {
      const uid = authResult.data;
      const routine = await routineService.fetchRoutine(uid, routineId);

      if (!routine) {
        return err(AppError.notFound('Routine not found.'));
      }

      // Delegate pure streak calculation to domain engine
      const streakUpdate = calculateCompletionStreak(routine, dateStr);

      const now = new Date();
      const timeStr = `${String(now.getHours()).padStart(2, '0')}:${String(
        now.getMinutes()
      ).padStart(2, '0')}:${String(now.getSeconds()).padStart(2, '0')}`;

      const logData: Omit<RoutineLog, 'id'> = {
        routineId,
        type: routine.type,
        date: dateStr,
        time: timeStr,
        status: 'completed',
        payload,
        timestamp: now,
      };

      const createdLog = await routineService.writeCompletionBatch(uid, logData, streakUpdate);
      return ok(createdLog);
    } catch (error) {
      return err(normalizeFirebaseError(error));
    }
  }

  /**
   * Mark routine as skipped on a specific date.
   */
  async skipRoutine(
    routineId: string,
    dateStr: string,
    payload?: Record<string, unknown>
  ): Promise<Result<RoutineLog>> {
    const authResult = this.getAuthenticatedUserId();
    if (!authResult.success) return authResult;

    try {
      const uid = authResult.data;
      const routine = await routineService.fetchRoutine(uid, routineId);

      if (!routine) {
        return err(AppError.notFound('Routine not found.'));
      }

      const now = new Date();
      const timeStr = `${String(now.getHours()).padStart(2, '0')}:${String(
        now.getMinutes()
      ).padStart(2, '0')}:${String(now.getSeconds()).padStart(2, '0')}`;

      const logData: Omit<RoutineLog, 'id'> = {
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

      const createdLog = await routineService.writeCompletionBatch(uid, logData, streakUpdate);
      return ok(createdLog);
    } catch (error) {
      return err(normalizeFirebaseError(error));
    }
  }

  /**
   * Undo a completion log.
   * Atomically recalculates the streak from remaining historical logs and updates the routine.
   */
  async undoCompletion(routineId: string, logId: string): Promise<Result<void>> {
    const authResult = this.getAuthenticatedUserId();
    if (!authResult.success) return authResult;

    try {
      const uid = authResult.data;
      const routine = await routineService.fetchRoutine(uid, routineId);

      if (!routine) {
        return err(AppError.notFound('Routine not found.'));
      }

      // Fetch all historical logs for this routine
      const allLogs = await routineService.fetchRoutineLogs(uid, routineId);
      // Filter out the log being undone
      const remainingLogs = allLogs.filter((log) => log.id !== logId);

      const streakUpdate = rebuildStreakFromLogs(remainingLogs);

      await routineService.writeUndoBatch(uid, logId, routineId, streakUpdate);
      return ok(undefined);
    } catch (error) {
      return err(normalizeFirebaseError(error));
    }
  }

  /**
   * Fetch single routine by ID (IRoutineRepository compliant).
   */
  async getRoutine(uid: string, id: string): Promise<Result<Routine | null>> {
    try {
      const routine = await this.service.fetchRoutine(uid, id);
      return ok(routine);
    } catch (error) {
      return err(normalizeFirebaseError(error));
    }
  }

  /**
   * List routines for user (IRoutineRepository compliant).
   */
  async listRoutines(
    uid: string,
    filters?: { type?: RoutineType; status?: RoutineStatus }
  ): Promise<Result<Routine[]>> {
    try {
      const routines = await this.service.fetchRoutines(uid, filters);
      return ok(routines);
    } catch (error) {
      return err(normalizeFirebaseError(error));
    }
  }

  /**
   * Permanently delete routine (IRoutineRepository compliant).
   */
  async deleteRoutine(uid: string, id: string): Promise<Result<void>> {
    try {
      await this.service.deleteRoutinePermanently(uid, id);
      return ok(undefined);
    } catch (error) {
      return err(normalizeFirebaseError(error));
    }
  }
}

export const routineRepository: IRoutineRepository = new RoutineRepository();

