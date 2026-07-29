/**
 * IRoutineRepository Domain Interface
 *
 * Defines domain operations for routine management with zero database or SDK dependencies.
 */

import type { Result } from '@/shared/types';
import type { Routine, RoutineType, RoutineStatus } from '../types';

export interface CreateRoutinePayload {
  readonly title: string;
  readonly description?: string;
  readonly type: RoutineType;
  readonly status: RoutineStatus;
  readonly schedule: Routine['schedule'];
  readonly reminders: Routine['reminders'];
}

export interface UpdateRoutinePayload {
  readonly title?: string;
  readonly description?: string;
  readonly type?: RoutineType;
  readonly status?: RoutineStatus;
  readonly schedule?: Partial<Routine['schedule']>;
  readonly reminders?: Routine['reminders'];
}

export interface IRoutineRepository {
  /** Fetches a single routine by ID */
  getRoutine(uid: string, id: string): Promise<Result<Routine | null>>;

  /** Lists all routines belonging to a user with optional status filter */
  listRoutines(uid: string, filters?: { type?: RoutineType; status?: RoutineStatus }): Promise<Result<Routine[]>>;

  /** Creates a new routine document */
  createRoutine(uid: string, data: CreateRoutinePayload): Promise<Result<Routine>>;

  /** Updates an existing routine document */
  updateRoutine(uid: string, id: string, data: UpdateRoutinePayload): Promise<Result<Routine>>;

  /** Soft-deletes a routine by setting status to 'archived' */
  archiveRoutine(uid: string, id: string): Promise<Result<void>>;

  /** Hard-deletes a routine document */
  deleteRoutine(uid: string, id: string): Promise<Result<void>>;
}
