/**
 * Life Management Platform Unit & Integration Tests
 * SelfOS v3.0.0 — Batch 14A
 *
 * Run with: npx tsx src/features/productivity/__tests__/productivity.test.ts
 */

import { DependencyGraphEngine } from '../graph/DependencyGraphEngine';
import { TaskLifecycle, GoalLifecycle } from '../lifecycle/ProductivityLifecycles';
import { SchedulingPolicy } from '../planning/SchedulingPolicy';
import { DailyPlanningEngine } from '../planning/DailyPlanningEngine';
import { productivityEventBus } from '../events/ProductivityEventBus';
import { ProductivityAnalyticsEngine } from '../analytics/ProductivityAnalyticsEngine';
import { ProductivitySearchService } from '../search/ProductivitySearchService';
import type { Task, Goal } from '../domain/productivity.types';

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

describe('DependencyGraphEngine — Task Blockers', () => {
  it('identifies blocked tasks when prerequisite is incomplete', () => {
    const tasks: Task[] = [
      { id: 't1', userId: 'u1', title: 'Design Schema', priority: 'high', status: 'in_progress', category: 'career', tags: [], subtasks: [], estimatedMinutes: 30, createdAt: new Date(), updatedAt: new Date() },
      { id: 't2', userId: 'u1', title: 'Write Migration', dependsOnTaskId: 't1', priority: 'medium', status: 'planned', category: 'career', tags: [], subtasks: [], estimatedMinutes: 45, createdAt: new Date(), updatedAt: new Date() },
    ];

    const blocked = DependencyGraphEngine.getBlockedTaskIds(tasks);
    assert(blocked.has('t2'), 't2 is flagged blocked because t1 is in_progress');
  });
});

describe('Lifecycle State Machine Transitions', () => {
  it('validates allowed task transitions', () => {
    assert(TaskLifecycle.isValidTransition('created', 'planned') === true, 'created -> planned is valid');
    assert(TaskLifecycle.isValidTransition('created', 'completed') === false, 'created -> completed is invalid without progress');
  });

  it('validates allowed goal transitions', () => {
    assert(GoalLifecycle.isValidTransition('draft', 'active') === true, 'draft -> active is valid');
    assert(GoalLifecycle.isValidTransition('completed', 'active') === false, 'completed -> active is invalid');
  });
});

describe('SchedulingPolicy — Health-Aware Capacities', () => {
  it('decreases workload capacity on poor sleep and high fatigue', () => {
    const cap = SchedulingPolicy.calculateCapacityMultiplier({
      sleepQualityScore: 40,
      workoutFatigueScore: 80,
    });
    assert(cap === 0.5, `Expected capacity 0.5, got ${cap}`);
  });
});

describe('DailyPlanningEngine — Schedule Generation', () => {
  it('generates a daily plan slots list considering health input', () => {
    const tasks: Task[] = [
      { id: 't1', userId: 'u1', title: 'Core Task', priority: 'urgent', status: 'created', category: 'career', tags: [], subtasks: [], estimatedMinutes: 60, createdAt: new Date(), updatedAt: new Date() },
    ];
    const plan = DailyPlanningEngine.generateDailyPlan('u1', '2026-07-28', tasks, { sleepQualityScore: 90 });
    assert(plan.slots.length >= 3, 'Generates time slots list');
    assert(plan.healthAdjustedCapacity === 1.0, 'Full capacity score on high sleep quality');
  });
});

describe('ProductivityEventBus — Event Emission', () => {
  it('emits events to subscribers successfully', () => {
    let received = false;
    const unsubscribe = productivityEventBus.subscribe((e) => {
      if (e.type === 'TaskCreated') received = true;
    });

    productivityEventBus.emit('TaskCreated', { taskId: 't1' });
    assert(received === true, 'Subscriber received TaskCreated event');
    unsubscribe();
  });
});

describe('ProductivityAnalyticsEngine — Score Computations', () => {
  it('computes productivity score and burnout risk accurately', () => {
    const goals: Goal[] = [
      { id: 'g1', userId: 'u1', title: 'Fitness', category: 'health', status: 'completed', targetDate: new Date(), progressPercentage: 100, milestones: [], createdAt: new Date(), updatedAt: new Date() },
    ];
    const tasks: Task[] = [
      { id: 't1', userId: 'u1', title: 'Run', priority: 'medium', status: 'completed', category: 'health', tags: [], subtasks: [], estimatedMinutes: 30, createdAt: new Date(), updatedAt: new Date() },
    ];

    const analytics = ProductivityAnalyticsEngine.computeAnalytics(goals, tasks);
    assert(analytics.productivityScore === 100, 'Score is 100 on full completions');
    assert(analytics.burnoutRisk === 'low', 'Burnout risk is low');
  });
});

describe('ProductivitySearchService — Filtering', () => {
  it('searches tasks by title and category filter', () => {
    const tasks: Task[] = [
      { id: 't1', userId: 'u1', title: 'Buy groceries', priority: 'low', status: 'created', category: 'personal', tags: [], subtasks: [], estimatedMinutes: 20, createdAt: new Date(), updatedAt: new Date() },
      { id: 't2', userId: 'u1', title: 'Write code', priority: 'high', status: 'created', category: 'career', tags: [], subtasks: [], estimatedMinutes: 60, createdAt: new Date(), updatedAt: new Date() },
    ];

    const results = ProductivitySearchService.searchTasks(tasks, 'code', 'career');
    assert(results.length === 1, 'Finds 1 matching task');
    assert(results[0].id === 't2', 'Returns correct task t2');
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
