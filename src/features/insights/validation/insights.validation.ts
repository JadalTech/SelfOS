/**
 * Insights Engine Validation Schemas (Zod)
 * SelfOS v1.5.0 — Batch 12A
 */

import { z } from 'zod';

// =========================================================================
// Enum validation helpers
// =========================================================================

export const insightCategorySchema = z.enum([
  'Recovery',
  'Performance',
  'Consistency',
  'Lifestyle',
  'Nutrition',
  'Hydration',
  'Sleep',
  'Workout',
  'Risk',
  'Achievement',
]);

export const insightSeveritySchema = z.enum(['info', 'warning', 'critical', 'success']);
export const insightStatusSchema = z.enum(['active', 'expired', 'dismissed', 'resolved']);
export const insightPrioritySchema = z.enum(['low', 'medium', 'high', 'critical']);
export const sourceModuleSchema = z.enum(['nutrition', 'workout', 'sleep', 'hydration']);
export const correlationTypeSchema = z.enum(['positive-linear', 'negative-linear', 'non-linear', 'none']);
export const trendDirectionSchema = z.enum(['improving', 'declining', 'stable']);
export const trendPeriodSchema = z.enum(['daily', 'weekly', 'monthly']);

// =========================================================================
// Sub Schemas
// =========================================================================

export const insightConfidenceMetadataSchema = z.object({
  confidence: z.number().min(0).max(1.0),
  dataCompleteness: z.number().min(0).max(1.0),
  sampleSize: z.number().min(0),
  calculationVersion: z.string(),
});

export const healthScoreBreakdownSchema = z.object({
  score: z.number().min(0).max(10),
  weight: z.number().min(0).max(1.0),
  dataCompleteness: z.number().min(0).max(1.0),
  isMissing: z.boolean(),
});

// =========================================================================
// Main Domain Models Schemas
// =========================================================================

export const healthScoreSchema = z.object({
  id: z.string(),
  userId: z.string(),
  overallScore: z.number().min(0).max(10),
  nutrition: healthScoreBreakdownSchema,
  workout: healthScoreBreakdownSchema,
  sleep: healthScoreBreakdownSchema,
  hydration: healthScoreBreakdownSchema,
  trend: trendDirectionSchema,
  grade: z.enum(['A', 'B', 'C', 'D', 'F']),
  confidence: z.number().min(0).max(1.0),
  calculatedAt: z.date().or(z.string().transform((val) => new Date(val))),
});

export const insightSchema = z.object({
  id: z.string(),
  userId: z.string(),
  title: z.string().min(1).max(100),
  description: z.string().min(1).max(1000),
  category: insightCategorySchema,
  severity: insightSeveritySchema,
  status: insightStatusSchema,
  priority: insightPrioritySchema,
  confidenceMetadata: insightConfidenceMetadataSchema,
  sourceModules: z.array(sourceModuleSchema),
  generatedAt: z.date().or(z.string().transform((val) => new Date(val))),
  expiresAt: z.date().or(z.string().transform((val) => new Date(val))),
});

export const correlationSchema = z.object({
  id: z.string(),
  userId: z.string(),
  moduleA: sourceModuleSchema,
  moduleB: sourceModuleSchema,
  correlationType: correlationTypeSchema,
  strength: z.number().min(-1.0).max(1.0),
  confidence: z.number().min(0).max(1.0),
  supportingMetrics: z.record(z.union([z.number(), z.string()])),
  explanation: z.string(),
  calculatedAt: z.date().or(z.string().transform((val) => new Date(val))),
});

export const trendSchema = z.object({
  metric: z.string(),
  period: trendPeriodSchema,
  direction: trendDirectionSchema,
  percentageChange: z.number(),
  confidence: z.number().min(0).max(1.0),
  comparisonBaseline: z.number(),
});

export const habitPatternSchema = z.object({
  id: z.string(),
  userId: z.string(),
  habitName: z.string(),
  frequency: z.enum(['daily', 'weekday', 'weekend', 'weekly']),
  consistency: z.number().min(0).max(1.0),
  score: z.number().min(0).max(10),
  detectedPattern: z.string(),
  recommendation: z.string(),
  calculatedAt: z.date().or(z.string().transform((val) => new Date(val))),
});

export const healthRecommendationSchema = z.object({
  id: z.string(),
  userId: z.string(),
  priority: insightPrioritySchema,
  category: insightCategorySchema,
  description: z.string(),
  expectedImpact: z.string(),
  source: z.union([sourceModuleSchema, z.literal('insights-engine')]),
  generatedAt: z.date().or(z.string().transform((val) => new Date(val))),
});

export const predictionSchema = z.object({
  id: z.string(),
  userId: z.string(),
  predictionType: z.string(),
  confidence: z.number().min(0).max(1.0),
  projectedValue: z.number(),
  targetDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  assumptions: z.array(z.string()),
  habitMomentum: z.number().min(0).max(1.0),
  recoveryScorePrediction: z.number().min(0).max(100),
  riskProbability: z.number().min(0).max(1.0),
  consistencyForecast: z.number().min(0).max(1.0),
  wellnessTrajectory: trendDirectionSchema,
  calculatedAt: z.date().or(z.string().transform((val) => new Date(val))),
});
