/**
 * Hydration ViewModel Presentation Types
 * SelfOS v1.4.0 — Batch 11B
 */

import type { DrinkType, DrinkTemperature, HydrationSource, HydrationStatus } from './hydration.types';

export interface HydrationEntryVM {
  readonly id: string;
  readonly date: string;
  readonly time: string;
  readonly amountML: number;
  readonly amountLabel: string;
  readonly drinkType: DrinkType;
  readonly drinkTypeLabel: string;
  readonly drinkTypeIcon: string;
  readonly temperature: DrinkTemperature;
  readonly temperatureLabel: string;
  readonly source: HydrationSource;
  readonly sourceLabel: string;
  readonly notes?: string;
  readonly formattedTimestamp: string;
}

export interface HydrationGoalVM {
  readonly dailyTargetML: number;
  readonly dailyTargetLabel: string;
  readonly customTargetEnabled: boolean;
  readonly weightKg?: number;
  readonly weightLabel: string;
  readonly activityLevel: string;
  readonly activityLevelLabel: string;
  readonly climate: string;
  readonly climateLabel: string;
  readonly wakeTime: string;
  readonly sleepTime: string;
  readonly reminderEnabled: boolean;
  readonly reminderIntervalMinutes: number;
  readonly reminderIntervalLabel: string;
  readonly smartAdjustments: boolean;
}

export interface HydrationStatisticsVM {
  readonly weeklyAverageLabel: string;
  readonly monthlyAverageLabel: string;
  readonly yearlyAverageLabel: string;
  readonly bestDayLabel: string;
  readonly worstDayLabel: string;
  readonly longestStreakLabel: string;
  readonly completionRateLabel: string;
  readonly averageDrinkSizeLabel: string;
  readonly peakHourLabel: string;
}

export interface HydrationDashboardVM {
  readonly consumedML: number;
  readonly consumedLabel: string;
  readonly goalML: number;
  readonly goalLabel: string;
  readonly remainingML: number;
  readonly remainingLabel: string;
  readonly completionPercent: number;
  readonly completionPercentLabel: string;
  readonly streak: number;
  readonly streakLabel: string;
  readonly status: HydrationStatus;
  readonly statusLabel: string;
  readonly statusColor: string;
}

export interface ChartDataPointVM {
  readonly label: string;
  readonly value: number;
  readonly secondaryValue?: number;
}
