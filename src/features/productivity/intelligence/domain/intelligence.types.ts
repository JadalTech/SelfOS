/**
 * Productivity Intelligence, Reviews & Forecasting Domain Types
 * SelfOS v3.3.0 — Batch 14D
 */

export interface IntelligenceArtifact {
  readonly id: string;
  readonly type: 'review' | 'forecast' | 'insight' | 'risk_alert';
  readonly title: string;
  readonly description: string;
  readonly timestamp: Date;
}

export interface ReviewMetrics {
  readonly goalsCompleted: number;
  readonly tasksCompleted: number;
  readonly focusHours: number;
  readonly healthScoreAvg: number;
}

export interface WeeklyReview extends IntelligenceArtifact {
  readonly type: 'review';
  readonly period: 'weekly';
  readonly startDate: string; // YYYY-MM-DD
  readonly endDate: string;
  readonly metrics: ReviewMetrics;
  readonly achievements: readonly string[];
  readonly recommendations: readonly string[];
}

export interface MonthlyReview extends IntelligenceArtifact {
  readonly type: 'review';
  readonly period: 'monthly';
  readonly month: string; // YYYY-MM
  readonly metrics: ReviewMetrics;
  readonly growthTrends: readonly string[];
}

export interface QuarterlyReview extends IntelligenceArtifact {
  readonly type: 'review';
  readonly period: 'quarterly';
  readonly quarter: string; // Q1, Q2, etc.
  readonly executiveReport: string;
}

export interface ForecastConfidence {
  readonly score: number; // 0-100% confidence
  readonly rationale: string;
}

export interface Forecast extends IntelligenceArtifact {
  readonly type: 'forecast';
  readonly targetMetric: string;
  readonly predictedValue: number;
  readonly confidence: ForecastConfidence;
  readonly burnoutRisk: 'low' | 'moderate' | 'high';
}

export interface LifeInsight extends IntelligenceArtifact {
  readonly type: 'insight';
  readonly lifeScore: number;       // 0-100
  readonly growthScore: number;     // 0-100
  readonly balanceScore: number;    // 0-100
  readonly wellbeingScore: number;  // 0-100
}

export interface ExecutiveSummary {
  readonly userId: string;
  readonly generatedAt: Date;
  readonly lifeScore: number;
  readonly weeklyReviewSummary: string;
  readonly forecastSummary: string;
  readonly activeRiskAlertsCount: number;
}

export interface ProductivityHealth {
  readonly score: number; // 0-100
  readonly status: 'optimal' | 'balanced' | 'overloaded';
}
