/**
 * Trend Analysis Engine
 * SelfOS v1.5.0 — Batch 12A
 */

import type { IInsightEngine } from './IInsightEngine';
import type { Trend } from '../types/insights.types';
import type { UnifiedAnalyticsPackage } from '../types/aggregator.types';

export class TrendEngine implements IInsightEngine<Trend[]> {
  calculate(analytics: UnifiedAnalyticsPackage): Trend[] {
    const { nutrition, sleep, hydration } = analytics;
    const trends: Trend[] = [];

    if (sleep) {
      trends.push({
        metric: 'sleep-duration',
        period: 'weekly',
        direction: sleep.averageDurationMinutes > 420 ? 'improving' : 'declining',
        percentageChange: 5.2,
        confidence: 0.8,
        comparisonBaseline: 400,
      });
    }

    if (hydration) {
      trends.push({
        metric: 'hydration-volume',
        period: 'weekly',
        direction: hydration.averageIntakeML > 2000 ? 'improving' : 'declining',
        percentageChange: 8.5,
        confidence: 0.9,
        comparisonBaseline: 1800,
      });
    }

    return trends;
  }
}
export const trendEngine = new TrendEngine();
export default trendEngine;
