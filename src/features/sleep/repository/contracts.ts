import type { Result } from '../../../shared/types';
import { AppError } from '../../../shared/errors/AppError';
import type { SleepEntry, SleepSchedule, SleepGoal, SleepTrend } from '../types/sleep.types';
import type { FeatureAnalytics } from '../../../shared/types/analytics.types';

export interface ISleepRepository {
  fetchEntries(userId: string, limitCount?: number): Promise<Result<SleepEntry[], AppError>>;
  getEntryByDate(userId: string, dateStr: string): Promise<Result<SleepEntry | null, AppError>>;
  saveEntry(
    userId: string,
    entry: Omit<SleepEntry, 'id' | 'userId' | 'createdAt' | 'updatedAt'> & { id?: string }
  ): Promise<Result<SleepEntry, AppError>>;
  deleteEntry(userId: string, entryId: string): Promise<Result<void, AppError>>;
}

export interface ISleepScheduleRepository {
  fetchSchedules(userId: string): Promise<Result<SleepSchedule[], AppError>>;
  saveSchedule(
    userId: string,
    schedule: Omit<SleepSchedule, 'id' | 'userId' | 'createdAt' | 'updatedAt'> & { id?: string }
  ): Promise<Result<SleepSchedule, AppError>>;
  toggleScheduleActive(userId: string, scheduleId: string, isActive: boolean): Promise<Result<void, AppError>>;
}

export interface ISleepGoalRepository {
  fetchGoals(userId: string): Promise<Result<SleepGoal[], AppError>>;
  saveGoal(
    userId: string,
    goal: Omit<SleepGoal, 'id' | 'userId' | 'createdAt' | 'updatedAt'> & { id?: string }
  ): Promise<Result<SleepGoal, AppError>>;
  toggleGoalActive(userId: string, goalId: string, isActive: boolean): Promise<Result<void, AppError>>;
}

export interface ISleepAnalyticsRepository {
  fetchTrends(userId: string, limitCount?: number): Promise<Result<SleepTrend[], AppError>>;
  saveTrend(userId: string, trend: SleepTrend): Promise<Result<void, AppError>>;
  fetchAnalyticsRecords(userId: string, limitDays?: number): Promise<Result<FeatureAnalytics[], AppError>>;
}
