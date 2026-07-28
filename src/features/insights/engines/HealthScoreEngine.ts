/**
 * Health Score Calculation Engine
 * SelfOS v1.5.0 — Batch 12A
 */

import type { IInsightEngine } from './IInsightEngine';
import type { HealthScore, HealthScoreBreakdown } from '../types/insights.types';
import type { UnifiedAnalyticsPackage } from '../types/aggregator.types';

export class HealthScoreEngine implements IInsightEngine<HealthScore> {
  calculate(analytics: UnifiedAnalyticsPackage): HealthScore {
    const { userId, nutrition, workout, sleep, hydration } = analytics;

    // 1. Resolve sub-scores
    const nutritionScore = nutrition ? Math.min(10, Math.round(nutrition.consistencyRate / 10)) : 0;
    const workoutScore = workout ? Math.min(10, Math.round(workout.consistencyRate / 10)) : 0;
    const sleepScore = sleep ? Math.min(10, Math.round(sleep.averageQualityScore / 10)) : 0;
    const hydrationScore = hydration ? Math.round(hydration.averageDetailedScore) : 0;

    // 2. Manage weights dynamic rebalancing
    let activeModules = 0;
    let totalWeight = 0;

    const breakdowns: Record<'nutrition' | 'workout' | 'sleep' | 'hydration', HealthScoreBreakdown> = {
      nutrition: { score: nutritionScore, weight: 0.25, dataCompleteness: nutrition?.dataCompleteness ?? 0, isMissing: !nutrition },
      workout: { score: workoutScore, weight: 0.25, dataCompleteness: workout?.dataCompleteness ?? 0, isMissing: !workout },
      sleep: { score: sleepScore, weight: 0.25, dataCompleteness: sleep?.dataCompleteness ?? 0, isMissing: !sleep },
      hydration: { score: hydrationScore, weight: 0.25, dataCompleteness: hydration?.dataCompleteness ?? 0, isMissing: !hydration },
    };

    for (const key of ['nutrition', 'workout', 'sleep', 'hydration'] as const) {
      if (!breakdowns[key].isMissing) {
        activeModules++;
      }
    }

    // Redistribute weight equally if any module is missing
    const defaultWeight = activeModules > 0 ? 1.0 / activeModules : 0;
    let overallScore = 0;

    for (const key of ['nutrition', 'workout', 'sleep', 'hydration'] as const) {
      const breakdown = breakdowns[key];
      const weight = breakdown.isMissing ? 0 : defaultWeight;
      breakdowns[key] = {
        ...breakdown,
        weight: Math.round(weight * 100) / 100,
      };
      overallScore += breakdown.score * weight;
    }

    overallScore = Math.min(10, Math.max(0, Math.round(overallScore * 10) / 10));

    // Grade assignment
    let grade: 'A' | 'B' | 'C' | 'D' | 'F' = 'F';
    if (overallScore >= 8.5) grade = 'A';
    else if (overallScore >= 7.0) grade = 'B';
    else if (overallScore >= 5.5) grade = 'C';
    else if (overallScore >= 4.0) grade = 'D';

    // Confidence metadata
    const activeCompleteness = Object.values(breakdowns)
      .filter((b) => !b.isMissing)
      .map((b) => b.dataCompleteness);
    const avgCompleteness = activeCompleteness.length > 0
      ? activeCompleteness.reduce((s, c) => s + c, 0) / activeCompleteness.length
      : 0;

    return {
      id: `score_${Date.now()}`,
      userId,
      overallScore,
      nutrition: breakdowns.nutrition,
      workout: breakdowns.workout,
      sleep: breakdowns.sleep,
      hydration: breakdowns.hydration,
      trend: 'stable',
      grade,
      confidence: Math.round(avgCompleteness * 100) / 100,
      calculatedAt: new Date(),
    };
  }
}
export const healthScoreEngine = new HealthScoreEngine();
export default healthScoreEngine;
