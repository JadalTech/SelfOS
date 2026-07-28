/**
 * Analytics Correlation Engine
 * SelfOS v1.5.0 — Batch 12A
 */

import type { IInsightEngine } from './IInsightEngine';
import type { Correlation } from '../types/insights.types';
import type { UnifiedAnalyticsPackage } from '../types/aggregator.types';

export class CorrelationEngine implements IInsightEngine<Correlation[]> {
  calculate(analytics: UnifiedAnalyticsPackage): Correlation[] {
    const { userId, sleep, workout, hydration } = analytics;
    const correlations: Correlation[] = [];

    // 1. Sleep vs Workout Correlation
    if (sleep && workout) {
      const strength = sleep.averageQualityScore > 75 && workout.consistencyRate > 75 ? 0.8 : 0.4;
      correlations.push({
        id: `corr_sleep_workout_${Date.now()}`,
        userId,
        moduleA: 'sleep',
        moduleB: 'workout',
        correlationType: 'positive-linear',
        strength,
        confidence: 0.85,
        supportingMetrics: {
          sleepQuality: sleep.averageQualityScore,
          workoutConsistency: workout.consistencyRate,
        },
        explanation: 'Higher sleep quality rating is strongly linked to higher workout consistency.',
        calculatedAt: new Date(),
      });
    }

    // 2. Workout vs Hydration Correlation
    if (workout && hydration) {
      const strength = hydration.averageIntakeML > 2200 && workout.sessionCount > 3 ? 0.75 : 0.3;
      correlations.push({
        id: `corr_workout_hydration_${Date.now()}`,
        userId,
        moduleA: 'workout',
        moduleB: 'hydration',
        correlationType: 'positive-linear',
        strength,
        confidence: 0.9,
        supportingMetrics: {
          sessionCount: workout.sessionCount,
          averageHydration: hydration.averageIntakeML,
        },
        explanation: 'Hydration levels tend to spike on days when high training volume workouts are registered.',
        calculatedAt: new Date(),
      });
    }

    return correlations;
  }
}
export const correlationEngine = new CorrelationEngine();
export default correlationEngine;
