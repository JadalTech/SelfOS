/**
 * Multi-Agent Coaching & Proactive Intelligence Unit Tests
 * SelfOS v2.0.0 — Batch 13C
 *
 * Run with: npx tsx src/features/assistant/__tests__/assistant.coaching.test.ts
 */

import { workflowEngine } from '../ai/orchestrator/WorkflowEngine';
import { goalPlanningEngine } from '../ai/planning/GoalPlanningEngine';
import { RecommendationConflictResolver } from '../ai/resolvers/RecommendationConflictResolver';
import { recommendationLifecycleManager } from '../ai/lifecycle/RecommendationLifecycleManager';
import { proactiveRecommendationEngine } from '../ai/recommendations/ProactiveRecommendationEngine';
import { adaptiveCoachingEngine } from '../ai/coaching/AdaptiveCoachingEngine';
import type { AssistantContext } from '../domain/assistant.types';

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

describe('WorkflowEngine — Execution Pipelines', () => {
  it('executes DailyCoaching multi-agent workflow correctly', async () => {
    const ctx: AssistantContext = { userId: 'user-1', healthScore: 8.5, activeStreak: 4 };
    const outputs = await workflowEngine.executeWorkflow('DailyCoaching', ctx, 'Start coaching');
    assert(outputs.length >= 3, `Expected at least 3 agent outputs, got ${outputs.length}`);
  });
});

describe('GoalPlanningEngine — Dependency Graph', () => {
  it('builds parent and child goal hierarchy graphs', () => {
    const nodes = goalPlanningEngine.createGoalHierarchy('Improve Sleep', ['Set bedtime at 11 PM', 'Turn off screens at 10 PM']);
    assert(nodes.length === 3, 'Creates 1 parent node and 2 child nodes');
    assert(nodes[0].childIds.length === 2, 'Parent node tracks child goal IDs');
  });
});

describe('RecommendationConflictResolver — De-duplication', () => {
  it('removes duplicate recommendation messages', () => {
    const raw = ['Drink water', 'Drink water', 'Sleep early'];
    const resolved = RecommendationConflictResolver.resolveConflicts(raw);
    assert(resolved.length === 2, `Expected 2 unique items, got ${resolved.length}`);
  });
});

describe('RecommendationLifecycleManager — State Tracking', () => {
  it('tracks transitions from New to Accepted', () => {
    const item = recommendationLifecycleManager.track('rec-1', 'Drink 250mL water');
    assert(item.state === 'New', 'Initial state is New');
    const updated = recommendationLifecycleManager.updateState('rec-1', 'Accepted');
    assert(updated?.state === 'Accepted', 'State transitions to Accepted');
  });
});

describe('ProactiveRecommendationEngine — Policy Constraints', () => {
  it('suppresses proactive tips during quiet hours or max daily count limit', () => {
    const quietTips = proactiveRecommendationEngine.generateProactiveTips(23, 0); // 11 PM (Quiet hours)
    assert(quietTips.length === 0, 'Suppresses tips during quiet hours');

    const dayLimitTips = proactiveRecommendationEngine.generateProactiveTips(14, 3); // 3 daily tips sent
    assert(dayLimitTips.length === 0, 'Suppresses tips when daily limit reached');
  });
});

describe('AdaptiveCoachingEngine — Adherence Adjustments', () => {
  it('adjusts coaching tone based on user adherence scores', () => {
    const highAdherenceStyle = adaptiveCoachingEngine.adjustCoachingStyle(90);
    assert(highAdherenceStyle.includes('high-accountability'), 'Applies high-accountability style on high adherence');
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
