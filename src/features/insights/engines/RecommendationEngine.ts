/**
 * Rule-Based Recommendation Engine
 * SelfOS v1.5.0 — Batch 12A
 */

import type { IInsightEngine } from './IInsightEngine';
import type { HealthRecommendation } from '../types/insights.types';
import type { UnifiedAnalyticsPackage } from '../types/aggregator.types';

export class RecommendationEngine implements IInsightEngine<HealthRecommendation[]> {
  calculate(analytics: UnifiedAnalyticsPackage): HealthRecommendation[] {
    const { userId, sleep, hydration, workout } = analytics;
    const recommendations: HealthRecommendation[] = [];

    // 1. Sleep quality decline recommendation
    if (sleep && sleep.averageQualityScore < 60) {
      recommendations.push({
        id: `rec_sleep_qual_${Date.now()}`,
        userId,
        priority: 'high',
        category: 'Sleep',
        description: 'Your sleep quality is falling. Consider shifting your bedtime 30 minutes earlier to ensure rest recovery.',
        expectedImpact: 'Improves sleep consistency rating and reduces sleep debt.',
        source: 'sleep',
        generatedAt: new Date(),
      });
    }

    // 2. Hydration deficit recommendation
    if (hydration && hydration.averageIntakeML < 1800) {
      recommendations.push({
        id: `rec_hydr_def_${Date.now()}`,
        userId,
        priority: 'medium',
        category: 'Hydration',
        description: 'Average daily fluid intake is below 1800 mL. Try adjusting your reminder interval to 45 minutes.',
        expectedImpact: 'Reaches baseline water target and improves hydration score.',
        source: 'hydration',
        generatedAt: new Date(),
      });
    }

    return recommendations;
  }
}
export const recommendationEngine = new RecommendationEngine();
export default recommendationEngine;
