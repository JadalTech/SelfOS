/**
 * Hydration Module Unit Tests
 * SelfOS v1.4.0 — Batch 11A Revision
 *
 * Standalone test file — run with: npx tsx src/features/hydration/__tests__/hydration.test.ts
 */

import type {
  HydrationEntry,
  HydrationGoal,
  HydrationDaySummary,
  DrinkType,
} from '../types/hydration.types';

// Engine
import {
  calculateRecommendedWater,
  adjustForWeather,
  adjustForWorkout,
  adjustForActivityLevel,
  calculateFullTarget,
  calculateReminderSchedule,
  hydrationStatus,
  remainingWater,
  completionPercent,
  calculateTodayTotal,
  predictEndOfDayCompletion,
  nextReminder,
  calculateStreak,
  generateDaySummary,
  aggregateDrinkTypes,
  calculateEffectiveHydration,
  calculatePeakHour,
  calculateHydrationScore,
  // Revision Additions:
  expectedNextDrink,
  estimatedGoalCompletionTime,
  recommendedDrinkAmount,
  riskOfMissingGoal,
  hydrationMomentum,
  consistencyScore,
  calculateDetailedHydrationScore,
} from '../engine/hydrationEngine';

// Analytics
import {
  buildDailySummaries,
  calculateAverageIntake,
  calculateCompletionRate,
  calculateLongestStreak,
  findBestAndWorstDays,
  calculateAverageDrinkSize,
  buildHydrationStatistics,
  buildHydrationTrends,
  buildHydrationAnalytics,
  // Revision Additions:
  calculatePreferredDrinkingWindow,
  calculateWeekdayVsWeekendPerformance,
} from '../analytics/hydrationAnalytics';

// Validation
import {
  hydrationEntrySchema,
  hydrationGoalSchema,
  hydrationReminderSchema,
  goalVersionSchema,
  validateEntryAgainstExisting,
  validateReminderWindow,
  validateFixedReminderSchedule,
  validateGoalVersion,
} from '../validation/hydration.validation';

// Converters
import {
  hydrationEntryConverter,
  hydrationGoalConverter,
  hydrationGoalVersionConverter,
  hydrationReminderConverter,
} from '../firestore/converters';

// Mappers
import { HydrationEntryMapper } from '../mappers';

// AI Coach
import type { HydrationAIContext } from '../ai/types/hydrationAI.types';
import { fallbackHydrationAIProvider } from '../ai/providers/FallbackHydrationAIProvider';
import { HydrationAIResponseValidator } from '../ai/utils/responseValidator';
import { HydrationContextBuilder } from '../ai/utils/HydrationContextBuilder';

// Constants
import {
  HYDRATION_MIN_AMOUNT_ML,
  HYDRATION_MAX_AMOUNT_ML,
  HYDRATION_DEFAULT_TARGET_ML,
  WATER_PER_KG_ML,
  getDrinkMetadata,
} from '../constants/hydration.constants';

// ---------------------------------------------------------------------------
// Test Utilities
// ---------------------------------------------------------------------------

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

function assertApprox(actual: number, expected: number, tolerance: number, message: string): void {
  assert(Math.abs(actual - expected) <= tolerance, `${message} (got ${actual}, expected ~${expected})`);
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
// Test Fixtures
// ---------------------------------------------------------------------------

function makeEntry(overrides: Partial<HydrationEntry> = {}): HydrationEntry {
  return {
    id: 'entry-1',
    userId: 'user-1',
    date: '2026-07-28',
    time: '10:00',
    timestamp: new Date('2026-07-28T10:00:00'),
    amountML: 250,
    drinkType: 'water',
    temperature: 'normal',
    source: 'manual',
    createdAt: new Date(),
    updatedAt: new Date(),
    ...overrides,
  };
}

function makeEntries(count: number, date: string, hour = 8): HydrationEntry[] {
  return Array.from({ length: count }, (_, i) =>
    makeEntry({
      id: `entry-${i}`,
      date,
      time: `${String(hour + i).padStart(2, '0')}:00`,
      timestamp: new Date(`${date}T${String(hour + i).padStart(2, '0')}:00:00`),
      amountML: 250,
    })
  );
}

// ---------------------------------------------------------------------------
// ENGINE TESTS
// ---------------------------------------------------------------------------

describe('Hydration Engine — calculateRecommendedWater', () => {
  it('calculates based on weight', () => {
    assert(calculateRecommendedWater(70) === 70 * WATER_PER_KG_ML, '70kg → 2310 mL');
    assert(calculateRecommendedWater(80) === 80 * WATER_PER_KG_ML, '80kg → 2640 mL');
  });

  it('returns default for zero weight', () => {
    assert(
      calculateRecommendedWater(0) === HYDRATION_DEFAULT_TARGET_ML,
      'zero weight → default'
    );
  });
});

describe('Hydration Engine — adjustForWeather', () => {
  it('applies cold multiplier (0.9)', () => {
    assertApprox(adjustForWeather(2000, 'cold'), 1800, 1, 'cold climate');
  });

  it('applies hot multiplier (1.2)', () => {
    assertApprox(adjustForWeather(2000, 'hot'), 2400, 1, 'hot climate');
  });
});

describe('Hydration Engine — adjustForWorkout', () => {
  it('adds 500mL per hour', () => {
    assert(adjustForWorkout(2000, 60) === 2500, '60 min → +500');
  });
});

describe('Hydration Engine — prediction expansions', () => {
  it('expectedNextDrink returns next estimated hour based on pace', () => {
    const entries = [
      makeEntry({ timestamp: new Date('2026-07-28T08:00:00') }),
      makeEntry({ timestamp: new Date('2026-07-28T10:00:00') }), // 2hr gap
    ];
    const next = expectedNextDrink(entries, new Date('2026-07-28T11:00:00'));
    assert(next === '12:00', `estimates next drink at 12:00, got ${next}`);
  });

  it('estimatedGoalCompletionTime returns completion time', () => {
    // 07:00 wake, 09:00 current (120 mins). Consumed 1000mL, goal 2000mL. Pace = 1000/120 = 8.33 mL/min.
    // Remaining = 1000mL. Time to goal = 1000 / 8.33 = 120 mins. Completion = 09:00 + 120 mins = 11:00.
    const compTime = estimatedGoalCompletionTime(
      1000,
      2000,
      '07:00',
      new Date('2026-07-28T09:00:00')
    );
    assert(compTime !== null, 'estimated completion time is not null');
    if (compTime) {
      assert(compTime.getHours() === 11, `Expected 11:00 completion, got hour ${compTime.getHours()}`);
    }
  });

  it('recommendedDrinkAmount suggests amount per remaining slot', () => {
    // Goal 2000, consumed 1000 (1000 left). Waking sleepTime 23:00, current 19:00 (4 hours left = 240 min).
    // Interval 60 mins -> 4 slots remaining. Suggestion = 1000 / 4 = 250 mL.
    const suggestion = recommendedDrinkAmount(
      1000,
      2000,
      '23:00',
      60,
      new Date('2026-07-28T19:00:00')
    );
    assert(suggestion === 250, `suggests 250 mL, got ${suggestion}`);
  });

  it('riskOfMissingGoal identifies probability', () => {
    const risk = riskOfMissingGoal(100, 2000, '07:00', '23:00', new Date('2026-07-28T22:00:00'));
    assert(risk > 0.5, `risk should be high, got ${risk}`);
  });

  it('hydrationMomentum returns ratio of current hour vs requirement', () => {
    const entries = [
      makeEntry({ timestamp: new Date('2026-07-28T09:30:00'), amountML: 500 }),
    ];
    // Goal 2400 waking hours 16h (960 min) -> 2.5 mL/min requirement.
    // Last hour (10:00): 500 mL / 60 min = 8.33 mL/min. Ratio = 8.33 / 2.5 = 3.33.
    const mom = hydrationMomentum(
      entries,
      2400,
      '07:00',
      '23:00',
      new Date('2026-07-28T10:00:00')
    );
    assertApprox(mom, 3.33, 0.1, `momentum expected ~3.33, got ${mom}`);
  });

  it('consistencyScore computes deviation mapping', () => {
    const score1 = consistencyScore([100, 100, 100]);
    assert(score1 === 1.0, `score for perfect completions should be 1.0, got ${score1}`);
  });

  it('calculateDetailedHydrationScore returns multi-dimensional values', () => {
    const score = calculateDetailedHydrationScore([], 2000, 10, '07:00', '23:00');
    assert(score.overall < 5, 'overall score should be low with empty entries');
    assert(score.consistency > 5, 'consistency score should reflect streak value');
  });
});

// ---------------------------------------------------------------------------
// ANALYTICS REVISION TESTS
// ---------------------------------------------------------------------------

describe('Analytics Revision — calculatePreferredDrinkingWindow', () => {
  it('correctly maps morning preferred window', () => {
    const entries = [
      makeEntry({ timestamp: new Date('2026-07-28T08:00:00'), amountML: 1000 }),
      makeEntry({ timestamp: new Date('2026-07-28T15:00:00'), amountML: 200 }),
    ];
    const window = calculatePreferredDrinkingWindow(entries);
    assert(window === 'morning', `Expected morning, got ${window}`);
  });
});

describe('Analytics Revision — calculateWeekdayVsWeekendPerformance', () => {
  it('separates weekdays and weekends', () => {
    const summaries: HydrationDaySummary[] = [
      // 2026-07-27 is Monday, 2026-07-26 is Sunday
      { date: '2026-07-27', consumedML: 2000, goalML: 2000, completionPercent: 100, remainingML: 0, drinksCount: 4, largestDrink: 500, averageDrink: 500, streak: 0, status: 'good' },
      { date: '2026-07-26', consumedML: 1000, goalML: 2000, completionPercent: 50, remainingML: 1000, drinksCount: 2, largestDrink: 500, averageDrink: 500, streak: 0, status: 'low' },
    ];
    const comparison = calculateWeekdayVsWeekendPerformance(summaries);
    assert(comparison.weekdayAverageML === 2000, `Expected weekday 2000, got ${comparison.weekdayAverageML}`);
    assert(comparison.weekendAverageML === 1000, `Expected weekend 1000, got ${comparison.weekendAverageML}`);
  });
});

// ---------------------------------------------------------------------------
// VALIDATION REVISION TESTS
// ---------------------------------------------------------------------------

describe('Validation Revision — business rules', () => {
  it('validateEntryAgainstExisting detects duplicate timestamp gaps', () => {
    const existing = [
      { date: '2026-07-28', timestamp: new Date('2026-07-28T10:00:00') },
    ];
    const result = validateEntryAgainstExisting(
      { date: '2026-07-28', amountML: 250, timestamp: new Date('2026-07-28T10:00:30') },
      existing
    );
    assert(result.valid === false, 'Detects entry too close to existing');
    assert(result.errors.some((e) => e.code === 'DUPLICATE_TIMESTAMP'), 'contains DUPLICATE_TIMESTAMP error code');
  });

  it('validateReminderWindow detects overlaps', () => {
    const result = validateReminderWindow(
      { start: '08:00', end: '12:00', intervalMinutes: 60 },
      [{ start: '10:00', end: '14:00', intervalMinutes: 60 }]
    );
    assert(result.valid === false, 'Detects overlapping reminder windows');
  });

  it('validateFixedReminderSchedule validates bounds', () => {
    const result = validateFixedReminderSchedule(
      ['06:00', '08:00'],
      '07:00',
      '23:00'
    );
    assert(result.valid === false, 'Detects out of bounds reminder times');
  });

  it('validateGoalVersion rejects goals with no changes', () => {
    const result = validateGoalVersion({
      previousTargetML: 2500,
      newTargetML: 2500,
      effectiveDate: '2026-07-28',
    });
    assert(result.valid === false, 'Goal must be different');
  });
});

// ---------------------------------------------------------------------------
// EDGE CASES AND Leap Years
// ---------------------------------------------------------------------------

describe('Edge Cases — leap years & midnight transitions', () => {
  it('handles leap year dates in schema safely', () => {
    const leapRes = hydrationEntrySchema.safeParse({
      date: '2024-02-29',
      time: '12:00',
      timestamp: new Date('2024-02-29T12:00:00'),
      amountML: 250,
      drinkType: 'water',
    });
    assert(leapRes.success === true, 'Leap year Feb 29 date passes validation');
  });

  it('predictEndOfDayCompletion handles post-midnight wake range correctly', () => {
    // Wake 07:00, Sleep 01:00 (crosses midnight). Current time is 00:30 (next calendar day).
    // Consumed: 1500mL. Pace elapsed should compute correctly without blowing up.
    const predicted = predictEndOfDayCompletion(
      1500,
      '07:00',
      '01:00',
      new Date('2026-07-29T00:30:00')
    );
    assert(predicted > 1500, `predicted total should be greater than consumed, got ${predicted}`);
  });
});

// ---------------------------------------------------------------------------
// CONVERTER REVISION TESTS
// ---------------------------------------------------------------------------

describe('Converters Revision — reminders & goal versions', () => {
  it('goal version converter roundtrips DocumentData structure', () => {
    const versionObj = {
      versionId: 'test-ver-id',
      userId: 'user-1',
      previousTargetML: 2000,
      newTargetML: 2500,
      reason: 'manual' as const,
      effectiveDate: '2026-07-28',
      createdAt: new Date('2026-07-28T12:00:00'),
    };
    const firestoreData = hydrationGoalVersionConverter.toFirestore(versionObj);
    assert(firestoreData.newTargetML === 2500, 'correctly serializes field');
  });
});

// ---------------------------------------------------------------------------
// MAPPER TESTS (Revision)
// ---------------------------------------------------------------------------

describe('Mappers — HydrationEntryMapper', () => {
  it('correctly maps domain entry to entry viewmodel format', () => {
    const entryObj: HydrationEntry = {
      id: 'entry-123',
      userId: 'user-1',
      date: '2026-07-28',
      time: '14:30',
      timestamp: new Date('2026-07-28T14:30:00'),
      amountML: 500,
      drinkType: 'water',
      temperature: 'cold',
      source: 'widget',
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    const vm = HydrationEntryMapper.toVM(entryObj);
    assert(vm.amountLabel === '500 mL', 'Formats amount label');
    assert(vm.drinkTypeLabel === 'Water', 'Maps drink type label');
    assert(vm.temperatureLabel === 'Cold', 'Maps temperature label');
    assert(vm.sourceLabel === 'Widget', 'Maps source label');
  });
});

// ---------------------------------------------------------------------------
// AI COACH TESTS (Revision)
// ---------------------------------------------------------------------------

describe('AI Coach — Fallback Heuristics', () => {
  it('triggers warnings for low water intake under 40%', async () => {
    const context: HydrationAIContext = {
      date: '2026-07-28',
      consumedML: 100,
      goalML: 2000,
      remainingML: 1900,
      hydrationScore: 2,
      currentStreak: 1,
      averageDrinkSize: 100,
      peakHour: 8,
      drinkTypeBreakdown: { water: 100, electrolyte: 0, tea: 0, coffee: 0, milk: 0, juice: 0, other: 0 },
      activityLevel: 'moderate',
      climate: 'normal',
    };
    const response = await fallbackHydrationAIProvider.askCoach(context, 'give coaching');
    assert(response.data.severity === 'warning', 'Should trigger warning for low intake');
    assert(response.data.text.includes('40%'), 'Warning message contains percentage reference');
  });

  it('triggers warning for excessive caffeine coffee consumption', async () => {
    const context: HydrationAIContext = {
      date: '2026-07-28',
      consumedML: 1500,
      goalML: 2000,
      remainingML: 500,
      hydrationScore: 8,
      currentStreak: 1,
      averageDrinkSize: 250,
      peakHour: 8,
      drinkTypeBreakdown: { water: 1000, coffee: 500, electrolyte: 0, tea: 0, milk: 0, juice: 0, other: 0 },
      activityLevel: 'moderate',
      climate: 'normal',
    };
    const response = await fallbackHydrationAIProvider.askCoach(context, 'give coaching');
    assert(response.data.severity === 'warning', 'Triggers caution for caffeine levels');
    assert(response.data.suggestedML === 500, 'Suggests 500mL fluid adjustment');
  });
});

describe('AI Safety Layer', () => {
  it('caps excessive amount recommendations to safe levels', () => {
    const validated = HydrationAIResponseValidator.validateAdvice({
      text: 'Drink water',
      severity: 'info',
      suggestedML: 1500, // unsafe single serving amount
    });
    assert(validated.suggestedML === 500, 'Caps single recommendation to safe limit of 500mL');
  });
});

describe('AI Context Builder', () => {
  it('minimizes and translates raw database models safely', () => {
    const entries: HydrationEntry[] = [
      makeEntry({ amountML: 500, drinkType: 'water' }),
    ];
    const goal: HydrationGoal = {
      id: 'current',
      userId: 'user-1',
      dailyTargetML: 2000,
      customTargetEnabled: false,
      activityLevel: 'moderate',
      climate: 'normal',
      wakeTime: '07:00',
      sleepTime: '23:00',
      reminderEnabled: true,
      reminderIntervalMinutes: 60,
      smartAdjustments: true,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    const ctx = HydrationContextBuilder.buildContext({ entries, goal });
    assert(ctx.consumedML === 500, 'Computes total consumed correctly');
    assert(ctx.remainingML === 1500, 'Computes remaining correctly');
  });
});

// ---------------------------------------------------------------------------
// Results
// ---------------------------------------------------------------------------

console.log('\n' + '='.repeat(60));
console.log(`Tests complete: ${passCount} passed, ${failCount} failed`);
if (failures.length > 0) {
  console.log('\nFailures:');
  failures.forEach((f) => console.log(`  ${f}`));
}
console.log('='.repeat(60));

process.exit(failCount > 0 ? 1 : 0);
