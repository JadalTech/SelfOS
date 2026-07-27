/**
 * Repository Interfaces for Workout Module
 */

import type { Result } from '../../../shared/types';
import { AppError } from '../../../shared/errors/AppError';
import type {
  Exercise,
  WorkoutPlan,
  WorkoutTemplate,
  WorkoutSession,
  PersonalRecord,
} from '../types/workout.types';
import type { FeatureAnalytics } from '../../../shared/types/analytics.types';

export interface IExerciseRepository {
  searchExercises(userId: string, searchTerm: string): Promise<Result<Exercise[], AppError>>;
  createUserExercise(
    userId: string,
    exercise: Omit<Exercise, 'id' | 'userId' | 'createdAt' | 'updatedAt' | 'source'>
  ): Promise<Result<Exercise, AppError>>;
  deleteUserExercise(userId: string, exerciseId: string): Promise<Result<void, AppError>>;
}

export interface IWorkoutRepository {
  // Plans
  fetchPlans(userId: string): Promise<Result<WorkoutPlan[], AppError>>;
  savePlan(
    userId: string,
    plan: Omit<WorkoutPlan, 'id' | 'userId' | 'createdAt' | 'updatedAt'> & { id?: string }
  ): Promise<Result<WorkoutPlan, AppError>>;
  deletePlan(userId: string, planId: string): Promise<Result<void, AppError>>;

  // Templates
  fetchTemplates(userId: string): Promise<Result<WorkoutTemplate[], AppError>>;
  createTemplate(
    userId: string,
    template: Omit<WorkoutTemplate, 'id' | 'userId' | 'createdAt' | 'updatedAt'>
  ): Promise<Result<WorkoutTemplate, AppError>>;
  deleteTemplate(userId: string, templateId: string): Promise<Result<void, AppError>>;

  // Active Session and History
  getActiveSession(userId: string): Promise<Result<WorkoutSession | null, AppError>>;
  saveSession(userId: string, session: WorkoutSession): Promise<Result<WorkoutSession, AppError>>;
  fetchHistory(userId: string, limitCount?: number): Promise<Result<WorkoutSession[], AppError>>;
  deleteSession(userId: string, sessionId: string): Promise<Result<void, AppError>>;
}

export interface IPersonalRecordRepository {
  fetchPersonalRecords(userId: string): Promise<Result<PersonalRecord[], AppError>>;
  checkAndLogNewPRs(userId: string, session: WorkoutSession): Promise<Result<PersonalRecord[], AppError>>;
  deletePersonalRecord(userId: string, recordId: string): Promise<Result<void, AppError>>;
}

export interface IWorkoutAnalyticsRepository {
  fetchWorkoutAnalytics(userId: string, limitDays?: number): Promise<Result<FeatureAnalytics[], AppError>>;
}
