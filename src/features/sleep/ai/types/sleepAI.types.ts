import type {
  AIMessage,
  AIRecommendation,
  AIInsight,
  AIWeeklyReview,
} from '@/shared/types/ai.types';

export interface SleepChatMessage extends AIMessage {
  readonly conversationId: string;
}

export interface SleepRecommendation extends AIRecommendation {
  readonly category: 'duration' | 'hygiene' | 'consistency' | 'recovery' | 'schedule';
  readonly priority: 'low' | 'medium' | 'high';
  readonly actionLabel?: string;
  readonly actionRoute?: string;
}

export interface SleepRecoveryInsight extends AIInsight {
  readonly metricCategory: 'duration' | 'consistency' | 'quality' | 'debt';
}

export interface SleepWeeklyReview extends AIWeeklyReview {
  readonly healthScore: number; // calculated rating out of 10
}

export interface SleepAIContext {
  readonly todaySleep?: {
    readonly durationMinutes: number;
    readonly qualityRating: number;
    readonly bedtimeFormatted: string;
    readonly wakeTimeFormatted: string;
  };
  readonly weeklyAverages: {
    readonly averageDurationMinutes: number;
    readonly averageQualityScore: number;
    readonly averageRecoveryScore: number;
    readonly consistencyScore: number;
  };
  readonly monthlyAverages: {
    readonly averageDurationMinutes: number;
    readonly averageQualityScore: number;
    readonly averageRecoveryScore: number;
    readonly consistencyScore: number;
  };
  readonly sleepDebt: number; // in minutes
  readonly recoveryScore: number; // 0 to 100
  readonly consistencyScore: number; // 0 to 100
  readonly bedtimeTrend: 'improving' | 'declining' | 'stable';
  readonly wakeUpTrend: 'improving' | 'declining' | 'stable';
  readonly recentGoals: {
    readonly category: string;
    readonly targetValue: number;
    readonly targetTime?: string;
    readonly isActive: boolean;
  }[];
  readonly schedule: {
    readonly targetDurationMinutes: number;
    readonly weekdayBedtime: string;
    readonly weekdayWakeTime: string;
    readonly weekendBedtime: string;
    readonly weekendWakeTime: string;
  } | null;
  readonly preferredSleepDuration: number; // in minutes
  readonly recentNotesSummary?: string;
}
