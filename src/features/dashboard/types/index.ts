/**
 * Dashboard View Model Specifications
 *
 * Flat, presentational interfaces designed for widget consumption.
 * Contains no raw Firestore data types.
 */

import type { RoutineType, LogStatus } from '../../routine/types';
import type { CalculatedDayStatus } from '../../routine/engine/completion';

export interface GreetingVM {
  readonly name: string;
  readonly email: string;
  readonly greetingText: string; // 'Good Morning', 'Good Afternoon', 'Good Evening'
  readonly formattedDate: string; // 'Thursday, Jul 24'
}

export interface ProgressVM {
  readonly scheduledCount: number;
  readonly completedCount: number;
  readonly percentage: number; // 0 to 100
  readonly statusText: string;
}

export interface RoutineItemVM {
  readonly id: string;
  readonly title: string;
  readonly type: RoutineType;
  readonly time?: string;
  readonly status: CalculatedDayStatus;
  readonly currentStreak: number;
  readonly frequencySummary: string;
}

export interface StatsVM {
  readonly activeRoutinesCount: number;
  readonly topStreakCount: number;
  readonly topStreakTitle: string;
  readonly completionRate30Days: number;
  readonly totalCompletionsAllTime: number;
}

export interface WeeklyDayVM {
  readonly dayName: string; // 'Mon', 'Tue'
  readonly dateStr: string; // 'YYYY-MM-DD'
  readonly isScheduled: boolean;
  readonly isCompleted: boolean;
  readonly isToday: boolean;
}

export interface WeeklyProgressVM {
  readonly days: WeeklyDayVM[];
  readonly activeWeeklyDaysCount: number;
}

export interface ActivityVM {
  readonly id: string;
  readonly routineId: string;
  readonly title: string;
  readonly type: RoutineType;
  readonly date: string;
  readonly time: string;
  readonly status: LogStatus;
}

export interface ModuleNavVM {
  readonly id: string;
  readonly title: string;
  readonly description: string;
  readonly icon: string;
  readonly route: string;
  readonly enabled: boolean;
  readonly comingSoon: boolean;
  readonly badge?: string;
}

export interface DashboardViewModel {
  readonly greeting: GreetingVM;
  readonly progress: ProgressVM;
  readonly todayRoutines: RoutineItemVM[];
  readonly topPendingRoutine?: RoutineItemVM;
  readonly stats: StatsVM;
  readonly weekly: WeeklyProgressVM;
  readonly recentActivities: ActivityVM[];
  readonly modules: ModuleNavVM[];
  readonly isPartialLoading?: boolean;
  readonly isError?: boolean;
}
