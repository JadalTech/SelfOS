/**
 * Productivity Intelligence, Reviews, Forecasting & Production Hardening Unit Tests
 * SelfOS v3.3.0 — Batch 14D
 *
 * Run with: npx tsx src/features/productivity/intelligence/__tests__/intelligence.test.ts
 */

import { ReasoningPipeline } from '../pipeline/ReasoningPipeline';
import { InsightExplanationEngine } from '../explanations/InsightExplanationEngine';
import { WeeklyReviewEngine } from '../reviews/ReviewEngine';
import { ForecastEngine } from '../forecasting/ForecastEngine';
import { ForecastConfidenceEngine } from '../forecasting/ForecastConfidenceEngine';
import { TrendDetectionEngine } from '../trends/TrendDetectionEngine';
import { LifeRiskEngine } from '../risk/LifeRiskEngine';
import { CrossDomainIntelligenceEngine } from '../insights/CrossDomainIntelligenceEngine';
import { LifeInsightsEngine } from '../insights/LifeInsightsEngine';
import { ExecutiveDashboardAggregator } from '../presentation/services/ExecutiveDashboardAggregator';

// Test variables
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

// =========================================================================
// RUN TEST SCENARIOS
// =========================================================================

describe('ReasoningPipeline — Execution', () => {
  it('executes 4 multi-stage reasoning steps', () => {
    const steps = ReasoningPipeline.executePipeline({});
    assert(steps.length === 4, 'Executes 4 reasoning steps');
    assert(steps[0].stage === 'ingestion', 'Stage 1 is ingestion');
    assert(steps[3].stage === 'recommendation', 'Stage 4 is recommendation');
  });
});

describe('InsightExplanationEngine — Justifications', () => {
  it('provides transparent explanations based on sleep scores', () => {
    const exp = InsightExplanationEngine.explainRecommendation('Move workout', 45);
    assert(exp.includes('sleep quality score was low (45/100)'), 'Explains sleep quality impact');
  });
});

describe('WeeklyReviewEngine — Report Generation', () => {
  it('synthesizes weekly reviews with achievements and recommendations', () => {
    const metrics = { goalsCompleted: 2, tasksCompleted: 14, focusHours: 18, healthScoreAvg: 85 };
    const review = WeeklyReviewEngine.generateWeeklyReview('2026-07-21', '2026-07-28', metrics);
    assert(review.period === 'weekly', 'Period is weekly');
    assert(review.achievements.length > 0, 'Includes achievements');
    assert(review.recommendations.length > 0, 'Includes recommendations');
  });
});

describe('ForecastEngine & Confidence', () => {
  it('computes confidence intervals and goal completion forecasts', () => {
    const confidence = ForecastConfidenceEngine.computeConfidence(12);
    assert(confidence.score === 90, 'High confidence (90%) on 12 data points');

    const forecast = ForecastEngine.predictGoalCompletion(4, 1.0, 12);
    assert(forecast.predictedValue === 4, 'Predicts completion in 4 days');
    assert(forecast.confidence.score === 90, 'Forecast inherits confidence score');
  });
});

describe('TrendDetectionEngine — Trajectories', () => {
  it('detects improving and declining metric trends', () => {
    const improving = TrendDetectionEngine.detectTrend('focus_hours', 20, 15);
    assert(improving.direction === 'improving', 'Detects improving direction');
    assert(improving.percentageChange === 33, 'Calculates +33% change');

    const declining = TrendDetectionEngine.detectTrend('sleep_quality', 50, 75);
    assert(declining.direction === 'declining', 'Detects declining direction');
  });
});

describe('LifeRiskEngine — Risk Alerts', () => {
  it('triggers sleep deprivation and over-scheduling risk alerts', () => {
    const alerts = LifeRiskEngine.evaluateRisks(40, 20); // Sleep score 40, 20 tasks
    assert(alerts.length === 2, 'Triggers 2 life risk alerts');
    assert(alerts[0].riskType === 'sleep_deprivation', 'Triggers sleep deprivation alert');
    assert(alerts[1].riskType === 'over_scheduling', 'Triggers over scheduling alert');
  });
});

describe('CrossDomainIntelligenceEngine — Synthesis', () => {
  it('synthesizes cross-domain recommendations from sleep and task rate', () => {
    const insight = CrossDomainIntelligenceEngine.synthesize({
      sleepQualityScore: 50,
      taskCompletionRate: 0.3,
    });
    assert(insight.summary.includes('Low sleep quality is directly impacting task completion'), 'Synthesizes correlated insight');
  });
});

describe('LifeInsightsEngine — Score Computations', () => {
  it('calculates unified Life Score, Growth Score, and Balance Score', () => {
    const insight = LifeInsightsEngine.computeLifeInsight(80, 75, 7);
    assert(insight.lifeScore > 0, 'Computes positive Life Score');
    assert(insight.growthScore === 83, 'Computes Growth Score');
    assert(insight.balanceScore === 78, 'Computes Balance Score');
  });
});

describe('ExecutiveDashboardAggregator — Aggregation', () => {
  it('aggregates executive operating summary model', () => {
    const summary = ExecutiveDashboardAggregator.aggregate('u1');
    assert(summary.userId === 'u1', 'Summary belongs to user u1');
    assert(summary.lifeScore > 0, 'Aggregates Life Score');
  });
});

// =========================================================================
// RESULTS
// =========================================================================
console.log('\n' + '='.repeat(60));
console.log(`Tests complete: ${passCount} passed, ${failCount} failed`);
if (failures.length > 0) {
  console.log('\nFailures:');
  failures.forEach((f) => console.log(`  ${f}`));
}
console.log('='.repeat(60));

process.exit(failCount > 0 ? 1 : 0);
