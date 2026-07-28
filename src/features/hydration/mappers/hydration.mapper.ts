/**
 * Presentation Mappers for Hydration Module
 * SelfOS v1.4.0 — Batch 11B
 */

import type {
  HydrationEntry,
  HydrationGoal,
  HydrationStatistics,
  HydrationDaySummary,
  DrinkType,
} from '../types/hydration.types';
import type {
  HydrationEntryVM,
  HydrationGoalVM,
  HydrationStatisticsVM,
  HydrationDashboardVM,
  ChartDataPointVM,
} from '../types/viewmodel.types';
import {
  DRINK_METADATA,
  DRINK_TEMPERATURE_OPTIONS,
  HYDRATION_SOURCE_OPTIONS,
  ACTIVITY_LEVEL_OPTIONS,
  CLIMATE_OPTIONS,
  HYDRATION_STATUS_THRESHOLDS,
  getDrinkMetadata,
} from '../constants/hydration.constants';

// =========================================================================
// 1. Hydration Entry Mapper
// =========================================================================

export const HydrationEntryMapper = {
  toVM(entry: HydrationEntry): HydrationEntryVM {
    const meta = getDrinkMetadata(entry.drinkType);
    const tempOpt = DRINK_TEMPERATURE_OPTIONS.find((o) => o.value === entry.temperature);
    const sourceOpt = HYDRATION_SOURCE_OPTIONS.find((o) => o.value === entry.source);

    const formattedTimestamp = new Date(entry.timestamp).toLocaleTimeString([], {
      hour: '2-digit',
      minute: '2-digit',
    });

    return {
      id: entry.id,
      date: entry.date,
      time: entry.time,
      amountML: entry.amountML,
      amountLabel: `${entry.amountML} mL`,
      drinkType: entry.drinkType,
      drinkTypeLabel: meta.label,
      drinkTypeIcon: meta.icon,
      temperature: entry.temperature,
      temperatureLabel: tempOpt ? tempOpt.label : entry.temperature,
      source: entry.source,
      sourceLabel: sourceOpt ? sourceOpt.label : entry.source,
      notes: entry.notes,
      formattedTimestamp,
    };
  },

  toVMList(entries: HydrationEntry[]): HydrationEntryVM[] {
    return entries.map((e) => this.toVM(e));
  },
};

// =========================================================================
// 2. Hydration Goal Mapper
// =========================================================================

export const HydrationGoalMapper = {
  toVM(goal: HydrationGoal): HydrationGoalVM {
    const activityOpt = ACTIVITY_LEVEL_OPTIONS.find((o) => o.value === goal.activityLevel);
    const climateOpt = CLIMATE_OPTIONS.find((o) => o.value === goal.climate);

    return {
      dailyTargetML: goal.dailyTargetML,
      dailyTargetLabel: `${goal.dailyTargetML} mL`,
      customTargetEnabled: goal.customTargetEnabled,
      weightKg: goal.weightKg,
      weightLabel: goal.weightKg ? `${goal.weightKg} kg` : 'Not Set',
      activityLevel: goal.activityLevel,
      activityLevelLabel: activityOpt ? activityOpt.label : goal.activityLevel,
      climate: goal.climate,
      climateLabel: climateOpt ? climateOpt.label : goal.climate,
      wakeTime: goal.wakeTime,
      sleepTime: goal.sleepTime,
      reminderEnabled: goal.reminderEnabled,
      reminderIntervalMinutes: goal.reminderIntervalMinutes,
      reminderIntervalLabel: `${goal.reminderIntervalMinutes} mins`,
      smartAdjustments: goal.smartAdjustments,
    };
  },
};

// =========================================================================
// 3. Hydration Statistics Mapper
// =========================================================================

export const HydrationStatisticsMapper = {
  toVM(stats: HydrationStatistics | null): HydrationStatisticsVM {
    if (!stats) {
      return {
        weeklyAverageLabel: '0 mL',
        monthlyAverageLabel: '0 mL',
        yearlyAverageLabel: '0 mL',
        bestDayLabel: 'N/A',
        worstDayLabel: 'N/A',
        longestStreakLabel: '0 days',
        completionRateLabel: '0%',
        averageDrinkSizeLabel: '0 mL',
        peakHourLabel: 'N/A',
      };
    }

    const peakHourFormatted = stats.peakHour !== undefined
      ? `${String(stats.peakHour).padStart(2, '0')}:00`
      : 'N/A';

    return {
      weeklyAverageLabel: `${stats.weeklyAverage} mL`,
      monthlyAverageLabel: `${stats.monthlyAverage} mL`,
      yearlyAverageLabel: `${stats.yearlyAverage} mL`,
      bestDayLabel: stats.bestDay ? `${stats.bestDay.amountML} mL (${stats.bestDay.date})` : 'N/A',
      worstDayLabel: stats.worstDay ? `${stats.worstDay.amountML} mL (${stats.worstDay.date})` : 'N/A',
      longestStreakLabel: `${stats.longestStreak} days`,
      completionRateLabel: `${stats.completionRate}%`,
      averageDrinkSizeLabel: `${stats.averageDrinkSize} mL`,
      peakHourLabel: peakHourFormatted,
    };
  },
};

// =========================================================================
// 4. Hydration Dashboard Mapper
// =========================================================================

export const HydrationDashboardMapper = {
  toVM(summary: HydrationDaySummary): HydrationDashboardVM {
    const statusThreshold = HYDRATION_STATUS_THRESHOLDS.find((t) => t.status === summary.status);

    return {
      consumedML: summary.consumedML,
      consumedLabel: `${summary.consumedML} mL`,
      goalML: summary.goalML,
      goalLabel: `${summary.goalML} mL`,
      remainingML: summary.remainingML,
      remainingLabel: `${summary.remainingML} mL`,
      completionPercent: summary.completionPercent,
      completionPercentLabel: `${summary.completionPercent}%`,
      streak: summary.streak,
      streakLabel: `${summary.streak} day streak`,
      status: summary.status,
      statusLabel: statusThreshold ? statusThreshold.label : summary.status,
      statusColor: statusThreshold ? statusThreshold.color : '#3B82F6',
    };
  },
};

// =========================================================================
// 5. Hydration Chart Mapper
// =========================================================================

export const HydrationChartMapper = {
  toDailyIntakePoints(entries: HydrationEntry[]): ChartDataPointVM[] {
    const sorted = [...entries].sort((a, b) => a.timestamp.getTime() - b.timestamp.getTime());
    return sorted.map((e) => ({
      label: e.time,
      value: e.amountML,
    }));
  },

  toWeeklyIntakePoints(summaries: HydrationDaySummary[]): ChartDataPointVM[] {
    return summaries.map((s) => {
      const dateObj = new Date(s.date);
      const label = dateObj.toLocaleDateString([], { weekday: 'short' });
      return {
        label,
        value: s.consumedML,
        secondaryValue: s.goalML,
      };
    });
  },

  toDrinkTypeDistribution(entries: HydrationEntry[]): ChartDataPointVM[] {
    const breakdown = new Map<DrinkType, number>();
    for (const e of entries) {
      breakdown.set(e.drinkType, (breakdown.get(e.drinkType) ?? 0) + e.amountML);
    }
    return [...breakdown.entries()].map(([type, amount]) => {
      const meta = getDrinkMetadata(type);
      return {
        label: meta.label,
        value: amount,
      };
    });
  },
};
