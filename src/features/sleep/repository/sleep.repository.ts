import { ok, err } from '../../../shared/types';
import type { Result } from '../../../shared/types';
import { AppError } from '../../../shared/errors/AppError';
import type { SleepEntry, SleepSchedule, SleepGoal, SleepTrend } from '../types/sleep.types';
import type { FeatureAnalytics } from '../../../shared/types/analytics.types';
import { sleepService, SleepService } from '../services/sleep.service';
import * as SleepEngine from '../engine/sleepEngine';
import {
  ISleepRepository,
  ISleepScheduleRepository,
  ISleepGoalRepository,
  ISleepAnalyticsRepository,
} from './contracts';

export class SleepRepository implements ISleepRepository {
  constructor(private readonly service: SleepService = sleepService) {}

  async fetchEntries(userId: string, limitCount = 100): Promise<Result<SleepEntry[], AppError>> {
    try {
      const entries = await this.service.fetchEntries(userId, limitCount);
      return ok(entries);
    } catch (error) {
      return err(new AppError('FIREBASE_ERROR', 'Failed to fetch sleep entries', { originalError: error }));
    }
  }

  async getEntryByDate(userId: string, dateStr: string): Promise<Result<SleepEntry | null, AppError>> {
    try {
      const entry = await this.service.getEntryByDate(userId, dateStr);
      return ok(entry);
    } catch (error) {
      return err(new AppError('FIREBASE_ERROR', `Failed to fetch sleep entry for date ${dateStr}`, { originalError: error }));
    }
  }

  async saveEntry(
    userId: string,
    entry: Omit<SleepEntry, 'id' | 'userId' | 'createdAt' | 'updatedAt'> & { id?: string }
  ): Promise<Result<SleepEntry, AppError>> {
    try {
      const saved = await this.service.saveEntry(userId, entry);
      return ok(saved);
    } catch (error) {
      return err(new AppError('FIREBASE_ERROR', 'Failed to save sleep entry', { originalError: error }));
    }
  }

  async deleteEntry(userId: string, entryId: string): Promise<Result<void, AppError>> {
    try {
      await this.service.deleteEntry(userId, entryId);
      return ok(undefined);
    } catch (error) {
      return err(new AppError('FIREBASE_ERROR', 'Failed to delete sleep entry', { originalError: error }));
    }
  }
}

export class SleepScheduleRepository implements ISleepScheduleRepository {
  constructor(private readonly service: SleepService = sleepService) {}

  async fetchSchedules(userId: string): Promise<Result<SleepSchedule[], AppError>> {
    try {
      const schedules = await this.service.fetchSchedules(userId);
      return ok(schedules);
    } catch (error) {
      return err(new AppError('FIREBASE_ERROR', 'Failed to fetch sleep schedules', { originalError: error }));
    }
  }

  async saveSchedule(
    userId: string,
    schedule: Omit<SleepSchedule, 'id' | 'userId' | 'createdAt' | 'updatedAt'> & { id?: string }
  ): Promise<Result<SleepSchedule, AppError>> {
    try {
      const saved = await this.service.saveSchedule(userId, schedule);
      return ok(saved);
    } catch (error) {
      return err(new AppError('FIREBASE_ERROR', 'Failed to save sleep schedule', { originalError: error }));
    }
  }

  async toggleScheduleActive(userId: string, scheduleId: string, isActive: boolean): Promise<Result<void, AppError>> {
    try {
      await this.service.toggleScheduleActive(userId, scheduleId, isActive);
      return ok(undefined);
    } catch (error) {
      return err(new AppError('FIREBASE_ERROR', 'Failed to toggle sleep schedule state', { originalError: error }));
    }
  }
}

export class SleepGoalRepository implements ISleepGoalRepository {
  constructor(private readonly service: SleepService = sleepService) {}

  async fetchGoals(userId: string): Promise<Result<SleepGoal[], AppError>> {
    try {
      const goals = await this.service.fetchGoals(userId);
      return ok(goals);
    } catch (error) {
      return err(new AppError('FIREBASE_ERROR', 'Failed to fetch sleep goals', { originalError: error }));
    }
  }

  async saveGoal(
    userId: string,
    goal: Omit<SleepGoal, 'id' | 'userId' | 'createdAt' | 'updatedAt'> & { id?: string }
  ): Promise<Result<SleepGoal, AppError>> {
    try {
      const saved = await this.service.saveGoal(userId, goal);
      return ok(saved);
    } catch (error) {
      return err(new AppError('FIREBASE_ERROR', 'Failed to save sleep goal', { originalError: error }));
    }
  }

  async toggleGoalActive(userId: string, goalId: string, isActive: boolean): Promise<Result<void, AppError>> {
    try {
      await this.service.toggleGoalActive(userId, goalId, isActive);
      return ok(undefined);
    } catch (error) {
      return err(new AppError('FIREBASE_ERROR', 'Failed to toggle sleep goal state', { originalError: error }));
    }
  }
}

export class SleepAnalyticsRepository implements ISleepAnalyticsRepository {
  constructor(private readonly service: SleepService = sleepService) {}

  async fetchTrends(userId: string, limitCount = 10): Promise<Result<SleepTrend[], AppError>> {
    try {
      const trends = await this.service.fetchTrends(userId, limitCount);
      return ok(trends);
    } catch (error) {
      return err(new AppError('FIREBASE_ERROR', 'Failed to fetch sleep trends', { originalError: error }));
    }
  }

  async saveTrend(userId: string, trend: SleepTrend): Promise<Result<void, AppError>> {
    try {
      await this.service.saveTrend(userId, trend);
      return ok(undefined);
    } catch (error) {
      return err(new AppError('FIREBASE_ERROR', 'Failed to save sleep trend record', { originalError: error }));
    }
  }

  async fetchAnalyticsRecords(userId: string, limitDays = 30): Promise<Result<FeatureAnalytics[], AppError>> {
    try {
      // Dynamically generate analytics contracts from raw sleep entries
      const entries = await this.service.fetchEntries(userId, limitDays);
      const schedules = await this.service.fetchSchedules(userId);
      const activeSchedule = schedules.find((s) => s.isActive);
      
      if (entries.length === 0) {
        return ok([]);
      }
      
      const records: FeatureAnalytics[] = [];
      
      // 1. Average Sleep Duration
      const totalDuration = entries.reduce((sum, e) => sum + e.durationMinutes, 0);
      const avgDuration = Math.round(totalDuration / entries.length);
      records.push({
        feature: 'sleep',
        metric: 'average_duration',
        value: avgDuration,
        score: Math.min(10, avgDuration / 60), // hourly score representation
        trend: 'stable',
        timestamp: new Date(),
      });
      
      // 2. Average Quality Score
      const totalQuality = entries.reduce((sum, e) => sum + e.quality.rating, 0);
      const avgQuality = Math.round((totalQuality / entries.length) * 10) / 10;
      records.push({
        feature: 'sleep',
        metric: 'average_quality',
        value: avgQuality,
        score: avgQuality, // 1-10 scale maps perfectly
        trend: 'stable',
        timestamp: new Date(),
      });
      
      // 3. Consistency Score
      if (activeSchedule) {
        const consistency = SleepEngine.calculateScheduleConsistency(entries, activeSchedule);
        records.push({
          feature: 'sleep',
          metric: 'consistency_score',
          value: consistency,
          score: consistency / 10, // scale to 1-10
          trend: 'stable',
          timestamp: new Date(),
        });
      }
      
      // 4. Average Recovery Score
      const entriesWithRecovery = entries.filter((e) => e.recoveryScore !== undefined);
      if (entriesWithRecovery.length > 0) {
        const totalRecovery = entriesWithRecovery.reduce((sum, e) => sum + (e.recoveryScore || 0), 0);
        const avgRecovery = Math.round(totalRecovery / entriesWithRecovery.length);
        records.push({
          feature: 'sleep',
          metric: 'average_recovery',
          value: avgRecovery,
          score: avgRecovery / 10,
          trend: 'stable',
          timestamp: new Date(),
        });
      }

      return ok(records);
    } catch (error) {
      return err(new AppError('FIREBASE_ERROR', 'Failed to aggregate sleep analytics records', { originalError: error }));
    }
  }
}

export const sleepRepository = new SleepRepository();
export const sleepScheduleRepository = new SleepScheduleRepository();
export const sleepGoalRepository = new SleepGoalRepository();
export const sleepAnalyticsRepository = new SleepAnalyticsRepository();
