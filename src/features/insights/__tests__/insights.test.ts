/**
 * Insights Engine Domain Layer Unit Tests
 * SelfOS v1.5.0 — Batch 12A
 *
 * Run with: npx tsx src/features/insights/__tests__/insights.test.ts
 */

import type { UnifiedAnalyticsPackage } from '../types/aggregator.types';
import { healthScoreEngine } from '../engines/HealthScoreEngine';
import { correlationEngine } from '../engines/CorrelationEngine';
import { trendEngine } from '../engines/TrendEngine';
import { habitDetectionEngine } from '../engines/HabitDetectionEngine';
import { recommendationEngine } from '../engines/RecommendationEngine';
import { predictionEngine } from '../engines/PredictionEngine';
import { InsightPipeline } from '../pipeline/InsightPipeline';
import { healthScoreSchema, insightSchema, predictionSchema } from '../validation/insights.validation';

// Test harness variables
let passCount = 0;
let failCount = 0;
const failures: string[] = [];

function assert(condition: boolean, message: string): void {
  if (condition) {
    passCount++;
  } else {
    failCount++;
    failures.push(`FAIL: ${message}`);
    console.error(`  ✗ ${message}`);
  }
}

function describe(name: string, fn: () => void): void {
  console.log(`\n▸ ${name}`);
  fn();
}

function it(name: string, fn: () => void): void {
  try {
    fn();
    console.log(`  ✓ ${name}`);
  } catch (error) {
    failCount++;
    const msg = error instanceof Error ? error.message : String(error);
    failures.push(`FAIL: ${name} — ${msg}`);
    console.error(`  ✗ ${name} — ${msg}`);
  }
}

// ---------------------------------------------------------------------------
// TEST SUITE
// ---------------------------------------------------------------------------

describe('HealthScoreEngine — dynamic rebalancing & grades', () => {
  it('correctly calculates overall score with full data', () => {
    const pkg: UnifiedAnalyticsPackage = {
      userId: 'user-123',
      nutrition: { consistencyRate: 80, dataCompleteness: 1.0, sampleSize: 30, dailyAverages: { calories: 2000, proteinGrams: 150, carbsGrams: 200, fatGrams: 65, sugarGrams: 40 } },
      workout: { consistencyRate: 80, volume: 1000, sessionCount: 4, primaryMuscleGroups: [], dataCompleteness: 1.0, sampleSize: 30 } as any,
      sleep: { averageQualityScore: 80, averageDurationMinutes: 480, consistencyRate: 80, debtMinutes: 0, dataCompleteness: 1.0, sampleSize: 30 },
      hydration: { averageDetailedScore: 8, averageIntakeML: 2000, consistencyRate: 80, peakDrinkingHour: 10, dominantDrinkType: 'water', dataCompleteness: 1.0, sampleSize: 30 },
    };

    const result = healthScoreEngine.calculate(pkg);
    // Nutrition = 8, Workout = 8, Sleep = 8, Hydration = 8. Overall = 8.
    assert(result.overallScore === 8, `Expected score 8, got ${result.overallScore}`);
    assert(result.grade === 'B', `Expected grade B, got ${result.grade}`);
    assert(result.nutrition.weight === 0.25, `Expected nutrition weight 0.25, got ${result.nutrition.weight}`);
  });

  it('gracefully rebalances weights when modules are missing', () => {
    const pkg: UnifiedAnalyticsPackage = {
      userId: 'user-123',
      nutrition: { consistencyRate: 90, dataCompleteness: 1.0, sampleSize: 30, dailyAverages: { calories: 2000, proteinGrams: 150, carbsGrams: 200, fatGrams: 65, sugarGrams: 40 } },
      workout: null, // missing workout
      sleep: null, // missing sleep
      hydration: { averageDetailedScore: 9, averageIntakeML: 2000, consistencyRate: 90, peakDrinkingHour: 10, dominantDrinkType: 'water', dataCompleteness: 1.0, sampleSize: 30 },
    };

    const result = healthScoreEngine.calculate(pkg);
    // Active: Nutrition (9) and Hydration (9). Overall: (9 + 9) / 2 = 9. Weight should be distributed equally (0.5 each).
    assert(result.overallScore === 9, `Expected score 9, got ${result.overallScore}`);
    assert(result.nutrition.weight === 0.5, `Expected nutrition weight 0.5, got ${result.nutrition.weight}`);
    assert(result.workout.isMissing === true, 'Workout should be flagged as missing');
    assert(result.workout.weight === 0, 'Workout weight should rebalance to 0');
  });
});

describe('CorrelationEngine — relationship logic', () => {
  it('identifies strong relationships between sleep and training consistency', () => {
    const pkg: UnifiedAnalyticsPackage = {
      userId: 'user-123',
      nutrition: null,
      workout: { consistencyRate: 90, weeklyVolume: 12000, sessionCount: 5, primaryMuscleGroups: [], dataCompleteness: 1.0, sampleSize: 30 },
      sleep: { averageQualityScore: 90, averageDurationMinutes: 480, consistencyRate: 90, debtMinutes: 0, dataCompleteness: 1.0, sampleSize: 30 },
      hydration: null,
    };
    const correlations = correlationEngine.calculate(pkg);
    assert(correlations.length === 1, `Expected 1 correlation record, got ${correlations.length}`);
    assert(correlations[0].strength === 0.8, `Expected sleep/workout correlation strength 0.8, got ${correlations[0].strength}`);
  });
});

describe('HabitDetectionEngine — streak analysis', () => {
  it('detects highly consistent hydration streaks', () => {
    const pkg: UnifiedAnalyticsPackage = {
      userId: 'user-123',
      nutrition: null,
      workout: null,
      sleep: null,
      hydration: { averageDetailedScore: 9, averageIntakeML: 2500, consistencyRate: 90, peakDrinkingHour: 12, dominantDrinkType: 'water', dataCompleteness: 1.0, sampleSize: 30 },
    };
    const habits = habitDetectionEngine.calculate(pkg);
    assert(habits.length === 1, `Expected 1 habit detected, got ${habits.length}`);
    assert(habits[0].habitName === 'High Hydration consistency', `Got habit name: ${habits[0].habitName}`);
  });
});

describe('RecommendationEngine — deterministic rule triggers', () => {
  it('triggers sleep recovery recommendation on low sleep quality', () => {
    const pkg: UnifiedAnalyticsPackage = {
      userId: 'user-123',
      nutrition: null,
      workout: null,
      sleep: { averageQualityScore: 50, averageDurationMinutes: 380, consistencyRate: 50, debtMinutes: 100, dataCompleteness: 1.0, sampleSize: 30 },
      hydration: null,
    };
    const recs = recommendationEngine.calculate(pkg);
    assert(recs.some((r) => r.category === 'Sleep' && r.priority === 'high'), 'Recommends sleep adjustments on poor scores');
  });
});

describe('PredictionEngine — trajectory and momentum calculations', () => {
  it('estimates recovery trend and wellness trajectory correctly', () => {
    const pkg: UnifiedAnalyticsPackage = {
      userId: 'user-123',
      nutrition: null,
      workout: { consistencyRate: 85, weeklyVolume: 12000, sessionCount: 4, primaryMuscleGroups: [], dataCompleteness: 1.0, sampleSize: 30 },
      sleep: { averageQualityScore: 80, averageDurationMinutes: 480, consistencyRate: 85, debtMinutes: 0, dataCompleteness: 1.0, sampleSize: 30 },
      hydration: { averageDetailedScore: 8, averageIntakeML: 2300, consistencyRate: 85, peakDrinkingHour: 10, dominantDrinkType: 'water', dataCompleteness: 1.0, sampleSize: 30 },
    };
    const pred = predictionEngine.calculate(pkg);
    assert(pred !== null, 'Prediction should not be null');
    if (pred) {
      assert(pred.wellnessTrajectory === 'improving', `Expected improving trajectory, got ${pred.wellnessTrajectory}`);
      assert(pred.riskProbability === 0.15, `Expected low risk, got ${pred.riskProbability}`);
    }
  });
});

describe('InsightPipeline — unified sequential execution', () => {
  it('combines output payloads and triggers low score alert', () => {
    const pkg: UnifiedAnalyticsPackage = {
      userId: 'user-123',
      nutrition: null,
      workout: null,
      sleep: { averageQualityScore: 30, averageDurationMinutes: 300, consistencyRate: 30, debtMinutes: 120, dataCompleteness: 1.0, sampleSize: 30 },
      hydration: null,
    };
    const output = InsightPipeline.execute(pkg);
    assert(output.score.overallScore === 3, 'Calculates low overall score');
    assert(output.insights.length === 1, 'Triggers 1 warning alert in pipeline');
    assert(output.insights[0].title === 'Declining Unified Health Index', 'Correct alert title');
  });
});

describe('Zod validation boundaries', () => {
  it('passes valid HealthScores and catches range limits', () => {
    const scoreVal = {
      id: 'score-1',
      userId: 'user-1',
      overallScore: 7.5,
      nutrition: { score: 7, weight: 0.5, dataCompleteness: 1.0, isMissing: false },
      workout: { score: 8, weight: 0.5, dataCompleteness: 1.0, isMissing: false },
      sleep: { score: 0, weight: 0, dataCompleteness: 0, isMissing: true },
      hydration: { score: 0, weight: 0, dataCompleteness: 0, isMissing: true },
      trend: 'stable',
      grade: 'B',
      confidence: 1.0,
      calculatedAt: new Date(),
    };
    const parsed = healthScoreSchema.safeParse(scoreVal);
    assert(parsed.success === true, 'Valid health score passes schema check');

    const invalidScore = { ...scoreVal, overallScore: 12 }; // score can only be 0-10
    const invalidParsed = healthScoreSchema.safeParse(invalidScore);
    assert(invalidParsed.success === false, 'Invalid health score > 10 fails validation');
  });
});

// ---------------------------------------------------------------------------
// RESULTS PRINT
// ---------------------------------------------------------------------------
console.log('\n' + '='.repeat(60));
console.log(`Tests complete: ${passCount} passed, ${failCount} failed`);
if (failures.length > 0) {
  console.log('\nFailures:');
  failures.forEach((f) => console.log(`  ${f}`));
}
console.log('='.repeat(60));

process.exit(failCount > 0 ? 1 : 0);
