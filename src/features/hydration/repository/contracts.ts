/**
 * Repository Interfaces for Hydration Module
 * SelfOS v1.4.0 — Batch 11A Revision
 */

import type { Result } from '../../../shared/types';
import { AppError } from '../../../shared/errors/AppError';
import type {
  HydrationEntry,
  HydrationGoal,
  HydrationGoalVersion,
  HydrationReminder,
  HydrationStatistics,
} from '../types/hydration.types';
import type { FeatureAnalytics } from '../../../shared/types/analytics.types';

export interface IHydrationRepository {
  // Entry CRUD
  createEntry(
    userId: string,
    entry: Omit<HydrationEntry, 'id' | 'userId' | 'createdAt' | 'updatedAt'>
  ): Promise<Result<HydrationEntry, AppError>>;

  updateEntry(
    userId: string,
    entryId: string,
    updates: Partial<Omit<HydrationEntry, 'id' | 'userId' | 'createdAt'>>
  ): Promise<Result<HydrationEntry, AppError>>;

  deleteEntry(
    userId: string,
    entryId: string
  ): Promise<Result<void, AppError>>;

  getEntry(
    userId: string,
    entryId: string
  ): Promise<Result<HydrationEntry | null, AppError>>;

  getEntries(
    userId: string,
    limitCount?: number
  ): Promise<Result<HydrationEntry[], AppError>>;

  getEntriesForDate(
    userId: string,
    date: string
  ): Promise<Result<HydrationEntry[], AppError>>;

  getEntriesForRange(
    userId: string,
    startDate: string,
    endDate: string
  ): Promise<Result<HydrationEntry[], AppError>>;

  // Goal
  saveGoal(
    userId: string,
    goal: Omit<HydrationGoal, 'id' | 'userId' | 'createdAt' | 'updatedAt'>
  ): Promise<Result<HydrationGoal, AppError>>;

  getGoal(
    userId: string
  ): Promise<Result<HydrationGoal | null, AppError>>;

  // Goal Versioning (Revision)
  getGoalVersions(
    userId: string
  ): Promise<Result<HydrationGoalVersion[], AppError>>;

  logGoalVersion(
    userId: string,
    version: Omit<HydrationGoalVersion, 'versionId' | 'userId' | 'createdAt'>
  ): Promise<Result<HydrationGoalVersion, AppError>>;

  // Reminder (Revision)
  getReminderConfig(
    userId: string
  ): Promise<Result<HydrationReminder | null, AppError>>;

  saveReminderConfig(
    userId: string,
    reminder: Omit<HydrationReminder, 'id' | 'userId' | 'createdAt' | 'updatedAt'>
  ): Promise<Result<HydrationReminder, AppError>>;

  // Statistics
  getStatistics(
    userId: string
  ): Promise<Result<HydrationStatistics | null, AppError>>;

  updateStatistics(
    userId: string,
    stats: HydrationStatistics
  ): Promise<Result<void, AppError>>;
}

export interface IHydrationAnalyticsRepository {
  fetchHydrationAnalytics(
    userId: string,
    limitDays?: number
  ): Promise<Result<FeatureAnalytics[], AppError>>;
}
