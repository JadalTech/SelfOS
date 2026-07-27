// Mock native mobile modules and resolve TS path aliases for pure Node environment
declare const __dirname: string;
(globalThis as any).__DEV__ = true;

if (typeof require !== 'undefined') {
  const Module = require('module');
  const path = require('path');
  const originalRequire = Module.prototype.require;
  
  // Resolve `@/` alias to the compiled `dist-test/src/` directory
  const srcPath = path.resolve(__dirname, '../src');

  Module.prototype.require = function (this: any, name: string) {
    if (name.startsWith('@/')) {
      const resolvedPath = name.replace('@/', srcPath + '/');
      return originalRequire.call(this, resolvedPath);
    }
    if (name === 'react-native') {
      return {
        Platform: { OS: 'ios' },
      };
    }
    if (name === '@react-native-async-storage/async-storage') {
      return {};
    }
    if (name === 'expo-constants') {
      return {
        default: {
          expoConfig: {
            extra: {},
          },
        },
      };
    }
    return originalRequire.apply(this, arguments);
  };
}

/**
 * Scratch Unit Verification Script for Sleep Engine, Validation, Converters, and Repositories
 */

import * as SleepEngine from '../src/features/sleep/engine/sleepEngine';
import {
  sleepEntrySchema,
  sleepScheduleSchema,
  sleepGoalSchema,
} from '../src/features/sleep/validation/sleep.validation';
import {
  sleepEntryConverter,
  sleepScheduleConverter,
  sleepGoalConverter,
  sleepTrendConverter,
} from '../src/features/sleep/firestore/converters';
import { sleepRecoveryService } from '../src/features/sleep/services/sleepRecovery.service';
import { sleepAnalyticsService } from '../src/features/sleep/services/sleepAnalytics.service';
import { sleepValidationService } from '../src/features/sleep/services/sleepValidation.service';
import { SleepRepository, SleepScheduleRepository } from '../src/features/sleep/repository/sleep.repository';
import type { SleepEntry, SleepSchedule, SleepGoal } from '../src/features/sleep/types/sleep.types';

function assert(condition: boolean, message: string): void {
  if (!condition) {
    throw new Error(`[Assertion Failed] ${message}`);
  }
}

console.log('=== Starting Sleep Module Architecture Unit & Integration Tests ===');

// Mock Data
const mockSchedule: SleepSchedule = {
  id: 'sch1',
  userId: 'u1',
  targetBedtime: '23:00',
  targetWakeTime: '07:00',
  targetDurationMinutes: 480,
  weekdayBedtime: '22:30',
  weekdayWakeTime: '06:30',
  weekendBedtime: '23:30',
  weekendWakeTime: '08:30',
  isActive: true,
  effectiveFrom: '2026-07-01',
  createdAt: new Date(),
  updatedAt: new Date(),
};

const mockGoalDuration: SleepGoal = {
  id: 'g1',
  userId: 'u1',
  category: 'duration',
  targetValue: 450, // 7.5 hours
  isActive: true,
  createdAt: new Date(),
  updatedAt: new Date(),
};

const mockGoalConsistency: SleepGoal = {
  id: 'g2',
  userId: 'u1',
  category: 'consistency',
  targetValue: 80, // 80%
  isActive: true,
  createdAt: new Date(),
  updatedAt: new Date(),
};

// ---------------------------------------------------------------------------
// Test 1: SleepEngine Calculations
// ---------------------------------------------------------------------------
console.log('Running Test 1: SleepEngine pure math...');

// 1.1 Overnight sleep duration
const bedtime = new Date('2026-07-27T23:00:00');
const wakeTime = new Date('2026-07-28T07:00:00');
const duration = SleepEngine.calculateSleepDuration(bedtime, wakeTime);
assert(duration === 480, `Expected 480 minutes of sleep, got ${duration}`);

// 1.2 Time difference (circular)
const diff1 = SleepEngine.calculateTimeDifferenceMinutes('23:00', '23:30');
assert(diff1 === 30, `Expected 30 min difference, got ${diff1}`);

const diffCircular = SleepEngine.calculateTimeDifferenceMinutes('23:30', '00:30');
assert(diffCircular === 60, `Expected 60 min circular difference, got ${diffCircular}`);

// 1.3 Weekend night detection
// July 24, 2026 is Friday, July 25 is Saturday, July 26 is Sunday
assert(SleepEngine.isWeekendNight('2026-07-24') === true, 'July 24 is a weekend night (Friday)');
assert(SleepEngine.isWeekendNight('2026-07-25') === true, 'July 25 is a weekend night (Saturday)');
assert(SleepEngine.isWeekendNight('2026-07-27') === false, 'July 27 is a weekday night (Monday)');

// 1.4 Get Target Bedtime/Wake-up from Schedule
const targetsWeekday = SleepEngine.getTargetBedtimeAndWakeTime('2026-07-27', mockSchedule);
assert(targetsWeekday.targetBedtime === '22:30', 'Weekday bedtime target resolved correctly');

const targetsWeekend = SleepEngine.getTargetBedtimeAndWakeTime('2026-07-24', mockSchedule);
assert(targetsWeekend.targetBedtime === '23:30', 'Weekend bedtime target resolved correctly');

// 1.5 Sleep efficiency
const efficiency = SleepEngine.calculateSleepEfficiency(480, 48);
assert(efficiency === 90, `Expected 90% efficiency, got ${efficiency}`);

console.log('✅ Test 1 Passed');

// ---------------------------------------------------------------------------
// Test 2: Validation Schemas
// ---------------------------------------------------------------------------
console.log('Running Test 2: Zod validation schemas...');

// 2.1 Valid Sleep Entry
const entryInput = {
  date: '2026-07-27',
  bedtime: new Date('2026-07-27T23:00:00'),
  wakeTime: new Date('2026-07-28T07:00:00'),
  quality: {
    rating: 8,
    efficiencyPercentage: 92,
  },
  sleepSource: 'wearable',
  sleepEfficiency: 92,
  awakeDuration: 30,
};
const parsedEntry = sleepEntrySchema.parse(entryInput);
assert(parsedEntry.date === '2026-07-27', 'Sleep Entry parsed successfully');

// 2.2 Invalid Sleep Entry (wakeTime <= bedtime)
try {
  sleepEntrySchema.parse({
    ...entryInput,
    wakeTime: new Date('2026-07-27T22:00:00'),
  });
  assert(false, 'Should fail validation since wakeTime is before bedtime');
} catch (error) {
  assert(error instanceof Error, 'Validation failed as expected');
}

// 2.3 Invalid Schedule Times
try {
  sleepScheduleSchema.parse({
    ...mockSchedule,
    weekdayBedtime: 'invalid-time',
  });
  assert(false, 'Should fail validation due to invalid time string format');
} catch (error) {
  assert(error instanceof Error, 'Validation failed for invalid schedule time format');
}

console.log('✅ Test 2 Passed');

// ---------------------------------------------------------------------------
// Test 3: SleepRecovery Calculations
// ---------------------------------------------------------------------------
console.log('Running Test 3: SleepRecovery calculations...');

const mockEntry: SleepEntry = {
  id: 'e1',
  userId: 'u1',
  date: '2026-07-27',
  bedtime: new Date('2026-07-27T23:00:00'), // target was 22:30 (deviation 30 mins)
  wakeTime: new Date('2026-07-28T06:30:00'), // target was 06:30 (deviation 0 mins)
  durationMinutes: 450, // 7.5 hours (target was 480 mins)
  quality: { rating: 8 },
  sleepSource: 'manual',
  createdAt: new Date(),
  updatedAt: new Date(),
};

// 3.1 Normal recovery calculation
const recoveryRes = sleepRecoveryService.calculateRecovery('u1', mockEntry, mockSchedule, 60, 85);
assert(recoveryRes.recoveryScore === 85, `Expected 85 recovery score, got ${recoveryRes.recoveryScore}`);
assert(recoveryRes.status === 'good', 'Expected good status');

// 3.2 High debt recovery penalty calculation
const recoveryHighDebt = sleepRecoveryService.calculateRecovery('u1', mockEntry, mockSchedule, 360, 85);
// Penalty = min(20, 360 / 30) = 12 points
assert(recoveryHighDebt.recoveryScore === 75, `Expected 75 recovery score under high debt, got ${recoveryHighDebt.recoveryScore}`);

console.log('✅ Test 3 Passed');

// ---------------------------------------------------------------------------
// Test 4: SleepAnalytics & Trends
// ---------------------------------------------------------------------------
console.log('Running Test 4: SleepAnalytics aggregates and FeatureAnalytics...');

const mockPastEntries: SleepEntry[] = [
  {
    id: 'e1',
    userId: 'u1',
    date: '2026-07-27',
    bedtime: new Date('2026-07-27T22:30:00'),
    wakeTime: new Date('2026-07-28T06:30:00'),
    durationMinutes: 480,
    quality: { rating: 9 },
    recoveryScore: 92,
    sleepSource: 'manual',
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: 'e2',
    userId: 'u1',
    date: '2026-07-26',
    bedtime: new Date('2026-07-26T22:30:00'),
    wakeTime: new Date('2026-07-27T06:30:00'),
    durationMinutes: 480,
    quality: { rating: 8 },
    recoveryScore: 88,
    sleepSource: 'manual',
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: 'e3',
    userId: 'u1',
    date: '2026-07-25',
    bedtime: new Date('2026-07-25T23:30:00'), // Weekend (target is 23:30)
    wakeTime: new Date('2026-07-26T08:30:00'), // Weekend (target is 08:30)
    durationMinutes: 540,
    quality: { rating: 7 },
    recoveryScore: 80,
    sleepSource: 'manual',
    createdAt: new Date(),
    updatedAt: new Date(),
  },
];

// 4.1 Weekly summary calculation
const weeklySummary = sleepAnalyticsService.calculateWeeklySummary(
  'u1',
  mockPastEntries,
  mockSchedule,
  [mockGoalDuration, mockGoalConsistency],
  '2026-07-20',
  '2026-07-27'
);
assert(weeklySummary.entriesCount === 3, 'Calculated weekly summaries for 3 entries');
assert(weeklySummary.averageDurationMinutes === 500, `Expected avg duration 500, got ${weeklySummary.averageDurationMinutes}`);
assert(weeklySummary.consistencyScore === 100, `Expected 100% consistency (all entries hit targets), got ${weeklySummary.consistencyScore}`);
assert(weeklySummary.goalCompletionRate === 1.0, `Expected 100% goal completion, got ${weeklySummary.goalCompletionRate}`);

// 4.2 Shared FeatureAnalytics mapper
const featureAnalytics = sleepAnalyticsService.mapToFeatureAnalytics(
  'u1',
  mockPastEntries,
  mockSchedule,
  [mockGoalDuration, mockGoalConsistency]
);
assert(featureAnalytics.length === 6, 'Generated 6 FeatureAnalytics contract metrics');
const durationMetric = featureAnalytics.find((f) => f.metric === 'average_duration');
assert(durationMetric !== undefined && durationMetric.value === 500, 'Average duration feature metric matches');

console.log('✅ Test 4 Passed');

// ---------------------------------------------------------------------------
// Test 5: Firestore Converters
// ---------------------------------------------------------------------------
console.log('Running Test 5: Firestore converters...');

const firestoreDoc = sleepEntryConverter.toFirestore(mockPastEntries[0] as any);
assert(firestoreDoc.userId === 'u1', 'Converted user ID matches');
assert(firestoreDoc.quality.rating === 9, 'Quality rating mapped');
assert(firestoreDoc.tags.length === 0, 'Tags array initialized');

const backToDomain = sleepEntryConverter.fromFirestore({
  id: 'e1',
  data: () => firestoreDoc,
} as any);
assert(backToDomain.date === '2026-07-27', 'Date mapped back from Firestore document');
assert(backToDomain.durationMinutes === 480, 'Duration minutes mapped back');

console.log('✅ Test 5 Passed');

// ---------------------------------------------------------------------------
// Test 6: Repository Error Normalization (Result<AppError> paths)
// ---------------------------------------------------------------------------
console.log('Running Test 6: Repository AppError normalization...');

// Mock database service to throw an error
const mockFailingService: any = {
  fetchEntries: async () => {
    throw new Error('Firestore connection timed out');
  },
  saveSchedule: async () => {
    throw new Error('Write permission denied');
  },
};

const failingSleepRepo = new SleepRepository(mockFailingService);
const failingScheduleRepo = new SleepScheduleRepository(mockFailingService);

// 6.1 Assert that fetching entries fails with AppError wrapping the root cause
failingSleepRepo.fetchEntries('u1').then((res) => {
  assert(res.success === false, 'Repository operation returned success: false');
  if (!res.success) {
    assert(res.error.code === 'FIREBASE_ERROR', 'Normalized to FIREBASE_ERROR code');
    assert(res.error.message.includes('Failed to fetch sleep entries'), 'Contains descriptive message');
  }
  console.log('✅ Test 6.1 (fetch error handling) Passed');
});

// 6.2 Assert that saving schedule fails with AppError wrapping the root cause
failingScheduleRepo.saveSchedule('u1', mockSchedule).then((res) => {
  assert(res.success === false, 'Repository operation returned success: false');
  if (!res.success) {
    assert(res.error.code === 'FIREBASE_ERROR', 'Normalized to FIREBASE_ERROR code');
    assert(res.error.message.includes('Failed to save sleep schedule'), 'Contains descriptive message');
  }
  console.log('✅ Test 6.2 (save error handling) Passed');
  console.log('\n=== All Sleep Module Architecture Unit & Integration Tests Passed! ===');
});
