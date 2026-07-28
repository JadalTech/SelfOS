/**
 * Unified Repository Facade for Hydration Module
 * SelfOS v1.4.0 — Batch 11A Revision
 */

import { ok, err } from '../../../shared/types';
import type { Result } from '../../../shared/types';
import { AppError } from '../../../shared/errors/AppError';
import type {
  IHydrationRepository,
  IHydrationAnalyticsRepository,
} from './contracts';
import type {
  HydrationEntry,
  HydrationGoal,
  HydrationGoalVersion,
  HydrationReminder,
  HydrationStatistics,
} from '../types/hydration.types';
import { hydrationService, HydrationService } from '../services/hydration.service';
import {
  hydrationEntrySchema,
  hydrationGoalSchema,
  hydrationReminderSchema,
  goalVersionSchema,
} from '../validation/hydration.validation';
import { buildHydrationAnalytics } from '../analytics/hydrationAnalytics';
import { HYDRATION_DEFAULT_TARGET_ML } from '../constants/hydration.constants';
import type { FeatureAnalytics } from '../../../shared/types/analytics.types';

export class HydrationRepository
  implements IHydrationRepository, IHydrationAnalyticsRepository
{
  constructor(private readonly service: HydrationService = hydrationService) {}

  // ---------------------------------------------------------------------------
  // Entry CRUD
  // ---------------------------------------------------------------------------

  async createEntry(
    userId: string,
    entry: Omit<HydrationEntry, 'id' | 'userId' | 'createdAt' | 'updatedAt'>
  ): Promise<Result<HydrationEntry, AppError>> {
    try {
      hydrationEntrySchema.parse(entry);
      const created = await this.service.createEntry(userId, entry);
      return ok(created);
    } catch (error) {
      if (error && (error as Record<string, unknown>).name === 'ZodError') {
        return err(AppError.validation((error as Error).message));
      }
      return err(
        new AppError('FIREBASE_ERROR', 'Failed to create hydration entry', {
          originalError: error,
        })
      );
    }
  }

  async updateEntry(
    userId: string,
    entryId: string,
    updates: Partial<Omit<HydrationEntry, 'id' | 'userId' | 'createdAt'>>
  ): Promise<Result<HydrationEntry, AppError>> {
    try {
      const updated = await this.service.updateEntry(userId, entryId, updates);
      return ok(updated);
    } catch (error) {
      return err(
        new AppError('FIREBASE_ERROR', 'Failed to update hydration entry', {
          originalError: error,
        })
      );
    }
  }

  async deleteEntry(
    userId: string,
    entryId: string
  ): Promise<Result<void, AppError>> {
    try {
      await this.service.deleteEntry(userId, entryId);
      return ok(undefined);
    } catch (error) {
      return err(
        new AppError('FIREBASE_ERROR', 'Failed to delete hydration entry', {
          originalError: error,
        })
      );
    }
  }

  async getEntry(
    userId: string,
    entryId: string
  ): Promise<Result<HydrationEntry | null, AppError>> {
    try {
      const entry = await this.service.getEntry(userId, entryId);
      return ok(entry);
    } catch (error) {
      return err(
        new AppError('FIREBASE_ERROR', 'Failed to get hydration entry', {
          originalError: error,
        })
      );
    }
  }

  async getEntries(
    userId: string,
    limitCount?: number
  ): Promise<Result<HydrationEntry[], AppError>> {
    try {
      const entries = await this.service.getEntries(userId, limitCount);
      return ok(entries);
    } catch (error) {
      return err(
        new AppError('FIREBASE_ERROR', 'Failed to fetch hydration entries', {
          originalError: error,
        })
      );
    }
  }

  async getEntriesForDate(
    userId: string,
    date: string
  ): Promise<Result<HydrationEntry[], AppError>> {
    try {
      const entries = await this.service.getEntriesForDate(userId, date);
      return ok(entries);
    } catch (error) {
      return err(
        new AppError('FIREBASE_ERROR', 'Failed to fetch entries for date', {
          originalError: error,
        })
      );
    }
  }

  async getEntriesForRange(
    userId: string,
    startDate: string,
    endDate: string
  ): Promise<Result<HydrationEntry[], AppError>> {
    try {
      const entries = await this.service.getEntriesForRange(
        userId,
        startDate,
        endDate
      );
      return ok(entries);
    } catch (error) {
      return err(
        new AppError('FIREBASE_ERROR', 'Failed to fetch entries for range', {
          originalError: error,
        })
      );
    }
  }

  // ---------------------------------------------------------------------------
  // Goal
  // ---------------------------------------------------------------------------

  async saveGoal(
    userId: string,
    goal: Omit<HydrationGoal, 'id' | 'userId' | 'createdAt' | 'updatedAt'>
  ): Promise<Result<HydrationGoal, AppError>> {
    try {
      hydrationGoalSchema.parse(goal);
      const saved = await this.service.saveGoal(userId, goal);
      return ok(saved);
    } catch (error) {
      if (error && (error as Record<string, unknown>).name === 'ZodError') {
        return err(AppError.validation((error as Error).message));
      }
      return err(
        new AppError('FIREBASE_ERROR', 'Failed to save hydration goal', {
          originalError: error,
        })
      );
    }
  }

  async getGoal(
    userId: string
  ): Promise<Result<HydrationGoal | null, AppError>> {
    try {
      const goal = await this.service.getGoal(userId);
      return ok(goal);
    } catch (error) {
      return err(
        new AppError('FIREBASE_ERROR', 'Failed to get hydration goal', {
          originalError: error,
        })
      );
    }
  }

  // ---------------------------------------------------------------------------
  // Goal Versioning (Revision)
  // ---------------------------------------------------------------------------

  async getGoalVersions(
    userId: string
  ): Promise<Result<HydrationGoalVersion[], AppError>> {
    try {
      const versions = await this.service.getGoalVersions(userId);
      return ok(versions);
    } catch (error) {
      return err(
        new AppError('FIREBASE_ERROR', 'Failed to get goal versions', {
          originalError: error,
        })
      );
    }
  }

  async logGoalVersion(
    userId: string,
    version: Omit<HydrationGoalVersion, 'versionId' | 'userId' | 'createdAt'>
  ): Promise<Result<HydrationGoalVersion, AppError>> {
    try {
      goalVersionSchema.parse(version);
      const logged = await this.service.logGoalVersion(userId, version);
      return ok(logged);
    } catch (error) {
      if (error && (error as Record<string, unknown>).name === 'ZodError') {
        return err(AppError.validation((error as Error).message));
      }
      return err(
        new AppError('FIREBASE_ERROR', 'Failed to log goal version', {
          originalError: error,
        })
      );
    }
  }

  // ---------------------------------------------------------------------------
  // Reminders Configuration (Revision)
  // ---------------------------------------------------------------------------

  async getReminderConfig(
    userId: string
  ): Promise<Result<HydrationReminder | null, AppError>> {
    try {
      const reminder = await this.service.getReminderConfig(userId);
      return ok(reminder);
    } catch (error) {
      return err(
        new AppError('FIREBASE_ERROR', 'Failed to get reminder config', {
          originalError: error,
        })
      );
    }
  }

  async saveReminderConfig(
    userId: string,
    reminder: Omit<HydrationReminder, 'id' | 'userId' | 'createdAt' | 'updatedAt'>
  ): Promise<Result<HydrationReminder, AppError>> {
    try {
      hydrationReminderSchema.parse(reminder);
      const saved = await this.service.saveReminderConfig(userId, reminder);
      return ok(saved);
    } catch (error) {
      if (error && (error as Record<string, unknown>).name === 'ZodError') {
        return err(AppError.validation((error as Error).message));
      }
      return err(
        new AppError('FIREBASE_ERROR', 'Failed to save reminder config', {
          originalError: error,
        })
      );
    }
  }

  // ---------------------------------------------------------------------------
  // Statistics
  // ---------------------------------------------------------------------------

  async getStatistics(
    userId: string
  ): Promise<Result<HydrationStatistics | null, AppError>> {
    try {
      const stats = await this.service.getStatistics(userId);
      return ok(stats);
    } catch (error) {
      return err(
        new AppError('FIREBASE_ERROR', 'Failed to get hydration statistics', {
          originalError: error,
        })
      );
    }
  }

  async updateStatistics(
    userId: string,
    stats: HydrationStatistics
  ): Promise<Result<void, AppError>> {
    try {
      await this.service.updateStatistics(userId, stats);
      return ok(undefined);
    } catch (error) {
      return err(
        new AppError('FIREBASE_ERROR', 'Failed to update hydration statistics', {
          originalError: error,
        })
      );
    }
  }

  // ---------------------------------------------------------------------------
  // Analytics (IHydrationAnalyticsRepository)
  // ---------------------------------------------------------------------------

  async fetchHydrationAnalytics(
    userId: string,
    limitDays = 90
  ): Promise<Result<FeatureAnalytics[], AppError>> {
    try {
      const [entries, goal] = await Promise.all([
        this.service.getEntries(userId, 500),
        this.service.getGoal(userId),
      ]);

      const goalML = goal?.dailyTargetML ?? HYDRATION_DEFAULT_TARGET_ML;
      const analytics = buildHydrationAnalytics(entries, goalML);
      return ok(analytics);
    } catch (error) {
      return err(
        new AppError('FIREBASE_ERROR', 'Failed to compile hydration analytics', {
          originalError: error,
        })
      );
    }
  }
}

export const hydrationRepository = new HydrationRepository();
