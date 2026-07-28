/**
 * Standardized Cross-Module Input Metrics for AnalyticsAggregator
 * SelfOS v1.5.0 — Batch 12A
 */

import type { DrinkType } from '../../hydration/types';

export interface AggregatedNutritionMetrics {
  readonly dailyAverages: {
    readonly calories: number;
    readonly proteinGrams: number;
    readonly carbsGrams: number;
    readonly fatGrams: number;
    readonly sugarGrams: number;
  };
  readonly consistencyRate: number; // 0 to 100
  readonly dataCompleteness: number; // 0.0 to 1.0
  readonly sampleSize: number;
}

export interface AggregatedWorkoutMetrics {
  readonly weeklyVolume: number;
  readonly sessionCount: number;
  readonly consistencyRate: number; // 0 to 100
  readonly primaryMuscleGroups: readonly string[];
  readonly dataCompleteness: number; // 0.0 to 1.0
  readonly sampleSize: number;
}

export interface AggregatedSleepMetrics {
  readonly averageDurationMinutes: number;
  readonly averageQualityScore: number; // 0 to 100
  readonly consistencyRate: number; // 0 to 100
  readonly debtMinutes: number;
  readonly dataCompleteness: number; // 0.0 to 1.0
  readonly sampleSize: number;
}

export interface AggregatedHydrationMetrics {
  readonly averageIntakeML: number;
  readonly peakDrinkingHour: number;
  readonly consistencyRate: number; // 0 to 100
  readonly dominantDrinkType: DrinkType;
  readonly averageDetailedScore: number; // 0 to 10
  readonly dataCompleteness: number; // 0.0 to 1.0
  readonly sampleSize: number;
}

export interface UnifiedAnalyticsPackage {
  readonly userId: string;
  readonly nutrition: AggregatedNutritionMetrics | null;
  readonly workout: AggregatedWorkoutMetrics | null;
  readonly sleep: AggregatedSleepMetrics | null;
  readonly hydration: AggregatedHydrationMetrics | null;
}
