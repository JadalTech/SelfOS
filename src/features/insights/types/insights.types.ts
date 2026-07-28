/**
 * Insights Engine Domain Types & Models
 * SelfOS v1.5.0 — Batch 12A
 */

// =========================================================================
// Metadata Structures
// =========================================================================

export interface InsightConfidenceMetadata {
  readonly confidence: number; // 0.0 to 1.0
  readonly dataCompleteness: number; // 0.0 to 1.0 representation
  readonly sampleSize: number; // Days of sample data used
  readonly calculationVersion: string;
}

// =========================================================================
// Enum-like Constants & Types
// =========================================================================

export type InsightCategory =
  | 'Recovery'
  | 'Performance'
  | 'Consistency'
  | 'Lifestyle'
  | 'Nutrition'
  | 'Hydration'
  | 'Sleep'
  | 'Workout'
  | 'Risk'
  | 'Achievement';

export type InsightSeverity = 'info' | 'warning' | 'critical' | 'success';

export type InsightStatus = 'active' | 'expired' | 'dismissed' | 'resolved';

export type InsightPriority = 'low' | 'medium' | 'high' | 'critical';

export type SourceModule = 'nutrition' | 'workout' | 'sleep' | 'hydration';

export type CorrelationType =
  | 'positive-linear'
  | 'negative-linear'
  | 'non-linear'
  | 'none';

export type TrendDirection = 'improving' | 'declining' | 'stable';

export type TrendPeriod = 'daily' | 'weekly' | 'monthly';

// =========================================================================
// Domain Entities
// =========================================================================

export interface HealthScoreBreakdown {
  readonly score: number; // Normalized out of 10
  readonly weight: number; // Current weight applied
  readonly dataCompleteness: number;
  readonly isMissing: boolean;
}

export interface HealthScore {
  readonly id: string;
  readonly userId: string;
  readonly overallScore: number; // Normalized overall out of 10
  readonly nutrition: HealthScoreBreakdown;
  readonly workout: HealthScoreBreakdown;
  readonly sleep: HealthScoreBreakdown;
  readonly hydration: HealthScoreBreakdown;
  readonly trend: TrendDirection;
  readonly grade: 'A' | 'B' | 'C' | 'D' | 'F';
  readonly confidence: number; // Overall confidence out of 1.0
  readonly calculatedAt: Date;
}

export interface Insight {
  readonly id: string;
  readonly userId: string;
  readonly title: string;
  readonly description: string;
  readonly category: InsightCategory;
  readonly severity: InsightSeverity;
  readonly status: InsightStatus;
  readonly priority: InsightPriority;
  readonly confidenceMetadata: InsightConfidenceMetadata;
  readonly sourceModules: readonly SourceModule[];
  readonly generatedAt: Date;
  readonly expiresAt: Date;
}

export interface Correlation {
  readonly id: string;
  readonly userId: string;
  readonly moduleA: SourceModule;
  readonly moduleB: SourceModule;
  readonly correlationType: CorrelationType;
  readonly strength: number; // -1.0 to 1.0
  readonly confidence: number; // 0.0 to 1.0
  readonly supportingMetrics: Record<string, number | string>;
  readonly explanation: string;
  readonly calculatedAt: Date;
}

export interface Trend {
  readonly metric: string;
  readonly period: TrendPeriod;
  readonly direction: TrendDirection;
  readonly percentageChange: number;
  readonly confidence: number;
  readonly comparisonBaseline: number;
}

export interface HabitPattern {
  readonly id: string;
  readonly userId: string;
  readonly habitName: string;
  readonly frequency: 'daily' | 'weekday' | 'weekend' | 'weekly';
  readonly consistency: number; // 0.0 to 1.0
  readonly score: number; // 0 to 10
  readonly detectedPattern: string;
  readonly recommendation: string;
  readonly calculatedAt: Date;
}

export interface HealthRecommendation {
  readonly id: string;
  readonly userId: string;
  readonly priority: InsightPriority;
  readonly category: InsightCategory;
  readonly description: string;
  readonly expectedImpact: string;
  readonly source: SourceModule | 'insights-engine';
  readonly generatedAt: Date;
}

export interface Prediction {
  readonly id: string;
  readonly userId: string;
  readonly predictionType: string;
  readonly confidence: number;
  readonly projectedValue: number;
  readonly targetDate: string; // YYYY-MM-DD
  readonly assumptions: readonly string[];
  readonly habitMomentum: number; // 0.0 to 1.0
  readonly recoveryScorePrediction: number; // 0 to 100
  readonly riskProbability: number; // 0.0 to 1.0
  readonly consistencyForecast: number; // 0.0 to 1.0
  readonly wellnessTrajectory: 'improving' | 'declining' | 'stable';
  readonly calculatedAt: Date;
}
