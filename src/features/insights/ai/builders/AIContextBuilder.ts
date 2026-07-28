/**
 * AI Context Builder with Derived Confidence Metrics
 * SelfOS v1.5.0 — Batch 12C
 */

import type { PipelineOutput } from '../../pipeline/InsightPipeline';

export class AIContextBuilder {
  static buildContext(data: PipelineOutput): string {
    const score = data.score;
    // Derive confidence rating from domain completeness
    const derivedConfidence = score.confidence;

    const minimizedContext = {
      score: score.overallScore,
      grade: score.grade,
      derivedConfidence,
      activeRecommendationCount: data.recommendations.length,
      activeHabitCount: data.habits.length,
      wellnessTrajectory: data.prediction?.wellnessTrajectory || 'stable',
    };

    return JSON.stringify(minimizedContext);
  }
}
export default AIContextBuilder;
