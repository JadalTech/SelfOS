/**
 * Generic Routine Engine Types
 *
 * Reusable data models and type definitions for schedules, logs, and streaks.
 * Excludes any UI or Firebase-specific types.
 */

export type RoutineType = 'haircare' | 'skincare' | 'water' | 'nutrition' | 'gym' | 'sleep' | 'medication' | 'custom';
export type RoutineFrequency = 'daily' | 'weekly' | 'monthly' | 'custom';
export type RoutineStatus = 'draft' | 'active' | 'paused' | 'archived';
export type LogStatus = 'completed' | 'skipped' | 'missed';

export interface RoutineReminder {
  readonly id: string;
  readonly time: string;    // HH:mm format in target timezone
  readonly enabled: boolean;
}

export interface RoutineSchedule {
  readonly frequency: RoutineFrequency;
  readonly interval: number;          // e.g. every X days/weeks/months
  readonly daysOfWeek?: number[];     // 0 = Sunday, 6 = Saturday (if frequency = 'weekly')
  readonly daysOfMonth?: number[];    // 1 to 31 (if frequency = 'monthly')
  readonly startDate: string;         // YYYY-MM-DD
  readonly endDate?: string | null;   // YYYY-MM-DD
  readonly timezone: string;          // IANA Timezone string, e.g., 'Asia/Kolkata'
}

export interface Routine {
  readonly id: string;
  readonly userId: string;
  readonly title: string;
  readonly description?: string;
  readonly type: RoutineType;
  readonly status: RoutineStatus;
  readonly schedule: RoutineSchedule;
  readonly reminders: RoutineReminder[];
  readonly currentStreak: number;
  readonly longestStreak: number;
  readonly lastCompletedDate?: string | null; // YYYY-MM-DD relative to target timezone
  readonly createdAt: Date;
  readonly updatedAt: Date;
}

export interface RoutineLog {
  readonly id: string;
  readonly routineId: string;
  readonly type: RoutineType;
  readonly date: string;              // YYYY-MM-DD relative to target timezone
  readonly time: string;              // HH:mm:ss relative to target timezone
  readonly status: LogStatus;
  readonly payload?: Record<string, unknown>; // Replaced any with unknown
  readonly timestamp: Date;
}
