/**
 * Insight Pipeline Orchestration Layer
 * SelfOS v1.5.0 — Batch 12A
 */

import { healthScoreEngine } from '../engines/HealthScoreEngine';
import { trendEngine } from '../engines/TrendEngine';
import { correlationEngine } from '../engines/CorrelationEngine';
import { habitDetectionEngine } from '../engines/HabitDetectionEngine';
import { recommendationEngine } from '../engines/RecommendationEngine';
import { predictionEngine } from '../engines/PredictionEngine';

import type { UnifiedAnalyticsPackage } from '../types/aggregator.types';
import type {
  HealthScore,
  Trend,
  Correlation,
  HabitPattern,
  HealthRecommendation,
  Prediction,
  Insight,
} from '../types/insights.types';

export interface PipelineOutput {
  readonly score: HealthScore;
  readonly trends: Trend[];
  readonly correlations: Correlation[];
  readonly habits: HabitPattern[];
  readonly recommendations: HealthRecommendation[];
  readonly prediction: Prediction | null;
  readonly insights: Insight[];
}

export class InsightPipeline {
  static execute(analytics: UnifiedAnalyticsPackage): PipelineOutput {
    // 1. Unified Score
    const score = healthScoreEngine.calculate(analytics);

    // 2. Trends
    const trends = trendEngine.calculate(analytics);

    // 3. Correlations
    const correlations = correlationEngine.calculate(analytics);

    // 4. Habits
    const habits = habitDetectionEngine.calculate(analytics);

    // 5. Recommendations
    const recommendations = recommendationEngine.calculate(analytics);

    // 6. Projections
    const prediction = predictionEngine.calculate(analytics);

    // 7. Compose general high level insights from anomalies
    const insights: Insight[] = [];
    if (score.overallScore < 6.0) {
      insights.push({
        id: `ins_low_score_${Date.now()}`,
        userId: analytics.userId,
        title: 'Declining Unified Health Index',
        description: 'Your combined health metrics indicate potential fatigue. Check sleep details.',
        category: 'Recovery',
        severity: 'warning',
        status: 'active',
        priority: 'high',
        confidenceMetadata: {
          confidence: 0.8,
          dataCompleteness: score.confidence,
          sampleSize: 30,
          calculationVersion: '1.0.0',
        },
        sourceModules: ['sleep', 'workout'],
        generatedAt: new Date(),
        expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000),
      });
    }

    return {
      score,
      trends,
      correlations,
      habits,
      recommendations,
      prediction,
      insights,
    };
  }
}
export default InsightPipeline;
