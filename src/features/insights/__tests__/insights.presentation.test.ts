/**
 * Insights Engine Presentation Layer Unit Tests
 * SelfOS v1.5.0 — Batch 12B
 *
 * Run with: npx tsx src/features/insights/__tests__/insights.presentation.test.ts
 */

import { dashboardWidgetRegistry } from '../presentation/registry/DashboardWidgetRegistry';
import { HealthScoreMapper, ChartDataMapper } from '../presentation/mappers';
import type { HealthScore } from '../../insights/types';

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

describe('DashboardWidgetRegistry — composition', () => {
  it('correctly registers default available widgets', () => {
    const list = dashboardWidgetRegistry.getSortedWidgets();
    assert(list.length === 6, `Expected 6 default widgets, got ${list.length}`);
    assert(list[0].id === 'health-score-card', 'Correct default first widget');
  });

  it('updates ordering preferences and excludes hidden widgets', () => {
    dashboardWidgetRegistry.updateWidgetPreferences('insights-timeline', { visible: false });
    dashboardWidgetRegistry.updateWidgetPreferences('correlations-matrix', { order: 10 });
    
    const list = dashboardWidgetRegistry.getSortedWidgets();
    assert(!list.some((w) => w.id === 'insights-timeline'), 'Excludes non-visible widget');
    assert(list[list.length - 1].id === 'correlations-matrix', 'Correctly repositions lower priority widget');

    // Reset default visible preference
    dashboardWidgetRegistry.updateWidgetPreferences('insights-timeline', { visible: true });
    dashboardWidgetRegistry.updateWidgetPreferences('correlations-matrix', { order: 2 });
  });
});

describe('Mappers — HealthScoreMapper', () => {
  it('maps overall scores to view strings', () => {
    const rawScore: HealthScore = {
      id: 'score-1',
      userId: 'user-1',
      overallScore: 8.5,
      nutrition: { score: 8, weight: 0.25, dataCompleteness: 1, isMissing: false },
      workout: { score: 9, weight: 0.25, dataCompleteness: 1, isMissing: false },
      sleep: { score: 8, weight: 0.25, dataCompleteness: 1, isMissing: false },
      hydration: { score: 9, weight: 0.25, dataCompleteness: 1, isMissing: false },
      trend: 'improving',
      grade: 'A',
      confidence: 0.9,
      calculatedAt: new Date(),
    };
    const vm = HealthScoreMapper.toVM(rawScore);
    assert(vm.overallScoreLabel === '8.5/10', 'Correctly formats score string');
    assert(vm.gradeLabel === 'Grade A', 'Correctly formats grade');
    assert(vm.confidenceLabel === '90% Confidence', 'Correctly formats confidence');
  });
});

describe('ChartDataMapper — visual chart mapping', () => {
  it('creates clean comparative bar points from overall score models', () => {
    const rawScore: HealthScore = {
      id: 'score-1',
      userId: 'user-1',
      overallScore: 8.5,
      nutrition: { score: 8, weight: 0.25, dataCompleteness: 1, isMissing: false },
      workout: { score: 9, weight: 0.25, dataCompleteness: 1, isMissing: false },
      sleep: { score: 7, weight: 0.25, dataCompleteness: 1, isMissing: false },
      hydration: { score: 9, weight: 0.25, dataCompleteness: 1, isMissing: false },
      trend: 'improving',
      grade: 'A',
      confidence: 0.9,
      calculatedAt: new Date(),
    };
    const dataPoints = ChartDataMapper.toModuleComparison({
      score: rawScore,
      trends: [],
      correlations: [],
      habits: [],
      recommendations: [],
      prediction: null,
      insights: [],
    });
    assert(dataPoints.length === 4, 'Returns 4 metric comparison points');
    assert(dataPoints[2].label === 'Sleep', 'Correctly maps sleep labels');
    assert(dataPoints[2].value === 7, 'Correctly maps sleep value');
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
