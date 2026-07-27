import type { SleepSource } from './sleep.types';

export interface SleepEntryVM {
  readonly id: string;
  readonly date: string; // YYYY-MM-DD
  readonly formattedDate: string; // e.g. "Monday, Jul 28"
  readonly bedtimeFormatted: string; // e.g. "10:30 PM"
  readonly wakeTimeFormatted: string; // e.g. "06:45 AM"
  readonly durationMinutes: number;
  readonly durationLabel: string; // e.g. "8h 15m"
  readonly qualityRating: number; // 1-10
  readonly qualityLabel: string; // e.g. "Restful"
  readonly recoveryScore?: number;
  readonly recoveryLabel?: string; // e.g. "85%"
  readonly timezone?: string;
  readonly sleepSource: SleepSource;
  readonly sleepEfficiency?: number;
  readonly sleepEfficiencyLabel?: string; // e.g. "92%"
  readonly sleepLatency?: number;
  readonly sleepLatencyLabel?: string; // e.g. "15m"
  readonly awakeDuration?: number;
  readonly awakeDurationLabel?: string; // e.g. "30m"
  readonly interruptionsCount?: number;
  readonly notes?: string;
  readonly tags?: string[];
}

export interface SleepScheduleVM {
  readonly id: string;
  readonly targetDurationMinutes: number;
  readonly targetDurationLabel: string; // e.g. "8 hours"
  readonly weekdayBedtime: string;
  readonly weekdayWakeTime: string;
  readonly weekdayScheduleLabel: string; // e.g. "10:30 PM - 06:30 AM"
  readonly weekendBedtime: string;
  readonly weekendWakeTime: string;
  readonly weekendScheduleLabel: string; // e.g. "11:30 PM - 08:30 AM"
  readonly isActive: boolean;
  readonly effectiveFrom: string;
  readonly effectiveUntil?: string;
}

export interface SleepGoalVM {
  readonly id: string;
  readonly category: string;
  readonly categoryLabel: string; // e.g. "Sleep Duration"
  readonly targetValue: number;
  readonly targetValueLabel: string; // e.g. "7.5 hours"
  readonly targetTime?: string;
  readonly isActive: boolean;
}

export interface SleepRecoveryVM {
  readonly date: string;
  readonly formattedDate: string; // e.g. "Monday, Jul 28"
  readonly recoveryScore: number;
  readonly status: 'poor' | 'fair' | 'good' | 'optimal';
  readonly statusLabel: string; // e.g. "Optimal"
  readonly statusColor: string; // Hex or Tailwind color class
  readonly statusBgColor: string; // Tailwind background opacity color class
  readonly durationScore: number;
  readonly qualityScore: number;
  readonly consistencyScore: number;
  readonly debtPenalty: number;
}

export interface SleepDashboardVM {
  readonly latestEntry: SleepEntryVM | null;
  readonly activeSchedule: SleepScheduleVM | null;
  readonly recovery: SleepRecoveryVM | null;
  readonly streakCount: number;
  readonly streakLabel: string; // e.g. "5 days"
  readonly sleepDebtMinutes: number;
  readonly sleepDebtLabel: string; // e.g. "1h 30m"
  readonly weeklyConsistencyPercent: number;
  readonly goalProgressPercent: number;
}
