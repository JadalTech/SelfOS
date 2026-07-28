/**
 * Executive Dashboard Aggregator
 * SelfOS v3.3.0 — Batch 14D
 */

import { LifeInsightsEngine } from '../../insights/LifeInsightsEngine';
import { ForecastEngine } from '../../forecasting/ForecastEngine';
import type { ExecutiveSummary } from '../../domain/intelligence.types';

export class ExecutiveDashboardAggregator {
  static aggregate(userId: string): ExecutiveSummary {
    const lifeInsight = LifeInsightsEngine.computeLifeInsight(85, 80, 5);
    const forecast = ForecastEngine.predictGoalCompletion(4, 0.8);

    return {
      userId,
      generatedAt: new Date(),
      lifeScore: lifeInsight.lifeScore,
      weeklyReviewSummary: 'High goal momentum across health and productivity.',
      forecastSummary: forecast.description,
      activeRiskAlertsCount: 0,
    };
  }
}
export default ExecutiveDashboardAggregator;
