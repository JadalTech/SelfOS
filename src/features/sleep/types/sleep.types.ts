/**
 * Sleep Module Domain Types & Enums
 */

export type SleepSource = 'manual' | 'wearable' | 'imported';

export type SleepGoalCategory = 'duration' | 'bedtime' | 'wake_time' | 'consistency' | 'recovery';

export interface SleepQuality {
  readonly rating: number; // perceived quality (1–10)
  readonly efficiencyPercentage?: number; // 0-100 (wearable support)
  readonly deepSleepMinutes?: number; // wearable support
  readonly remSleepMinutes?: number; // wearable support
  readonly lightSleepMinutes?: number; // wearable support
  readonly awakeMinutes?: number; // wearable support
}

export interface SleepEntry {
  readonly id: string;
  readonly userId: string;
  readonly date: string; // YYYY-MM-DD
  readonly bedtime: Date; // Actual sleep time
  readonly wakeTime: Date; // Actual wake-up time
  readonly durationMinutes: number; // calculated wakeTime - bedtime
  readonly quality: SleepQuality;
  readonly recoveryScore?: number; // Calculated recovery score (0-100)
  readonly notes?: string;
  readonly timezone?: string; // IANA timezone (e.g. "Asia/Kolkata")
  readonly sleepSource: SleepSource;
  readonly sleepEfficiency?: number; // percentage (0-100)
  readonly sleepLatency?: number; // minutes to fall asleep
  readonly awakeDuration?: number; // minutes awake after sleep onset
  readonly interruptionsCount?: number;
  readonly tags?: string[];
  readonly createdAt: Date;
  readonly updatedAt: Date;
}

export interface SleepSchedule {
  readonly id: string;
  readonly userId: string;
  readonly targetBedtime: string; // HH:MM
  readonly targetWakeTime: string; // HH:MM
  readonly targetDurationMinutes: number;
  readonly weekdayBedtime: string; // HH:MM
  readonly weekdayWakeTime: string; // HH:MM
  readonly weekendBedtime: string; // HH:MM
  readonly weekendWakeTime: string; // HH:MM
  readonly isActive: boolean;
  readonly effectiveFrom: string; // YYYY-MM-DD
  readonly effectiveUntil?: string; // YYYY-MM-DD (null for current schedule)
  readonly createdAt: Date;
  readonly updatedAt: Date;
}

export interface SleepGoal {
  readonly id: string;
  readonly userId: string;
  readonly category: SleepGoalCategory;
  readonly targetValue: number; // e.g. duration minutes, consistency percentage
  readonly targetTime?: string; // HH:MM (for bedtime or wake_time categories)
  readonly isActive: boolean;
  readonly createdAt: Date;
  readonly updatedAt: Date;
}

export interface SleepDebt {
  readonly userId: string;
  readonly date: string; // YYYY-MM-DD
  readonly sleepDebtMinutes: number; // Cumulative sleep debt (mins)
  readonly dailyDeficitMinutes: number; // Deficit for this day (target - actual)
  readonly calculatedAt: Date;
}

export interface SleepRecovery {
  readonly userId: string;
  readonly date: string; // YYYY-MM-DD
  readonly recoveryScore: number; // 0-100
  readonly status: 'poor' | 'fair' | 'good' | 'optimal';
  readonly components: {
    readonly durationScore: number; // 0-100
    readonly qualityScore: number; // 0-100
    readonly consistencyScore: number; // 0-100
    readonly debtPenalty: number;
  };
  readonly calculatedAt: Date;
}

export interface SleepTrendPoint {
  readonly date: string;
  readonly durationMinutes: number;
  readonly qualityScore: number;
  readonly recoveryScore?: number;
}

export interface SleepTrend {
  readonly userId: string;
  readonly startDate: string;
  readonly endDate: string;
  readonly averageDurationMinutes: number;
  readonly averageQualityScore: number;
  readonly averageRecoveryScore: number;
  readonly consistencyScore: number;
  readonly trendDirection: 'improving' | 'declining' | 'stable';
  readonly dataPoints: SleepTrendPoint[];
}

export interface WeeklySleepSummary {
  readonly userId: string;
  readonly weekStartDate: string; // YYYY-MM-DD
  readonly weekEndDate: string; // YYYY-MM-DD
  readonly averageDurationMinutes: number;
  readonly averageQualityScore: number;
  readonly averageRecoveryScore: number;
  readonly averageSleepDebtMinutes: number;
  readonly consistencyScore: number;
  readonly averageBedtimeDeviationMinutes: number;
  readonly averageWakeTimeDeviationMinutes: number;
  readonly goalCompletionRate: number; // 0.0 to 1.0
  readonly entriesCount: number;
}

export interface MonthlySleepSummary {
  readonly userId: string;
  readonly year: number;
  readonly month: number; // 1-12
  readonly averageDurationMinutes: number;
  readonly averageQualityScore: number;
  readonly averageRecoveryScore: number;
  readonly averageSleepDebtMinutes: number;
  readonly consistencyScore: number;
  readonly goalCompletionRate: number; // 0.0 to 1.0
  readonly entriesCount: number;
}
