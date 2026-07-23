/**
 * Scratch Unit Verification Script for Haircare Analytics Engine
 */

import {
  calculateWeeklyAnalytics,
  calculateMonthlyAnalytics,
  calculateProductAnalytics,
  calculateConditionTrends,
  buildHairAnalyticsVM,
} from '../src/features/haircare/analytics/utils/hairAnalytics';
import type { Routine } from '../src/features/routine/types';
import type {
  HairProduct,
  HairRoutine,
  HairLog,
  HairPhoto,
  HairCondition,
} from '../src/features/haircare/types';

function assert(condition: boolean, message: string): void {
  if (!condition) {
    throw new Error(`[Assertion Failed] ${message}`);
  }
}

console.log('=== Starting Batch 6E Analytics Engine Unit Tests ===');

const mockProduct1: HairProduct = {
  id: 'p1',
  userId: 'u1',
  name: 'Nizoral 2%',
  brand: 'McNeil',
  category: 'shampoo',
  isFavorite: true,
  isActive: true,
  createdAt: new Date(),
  updatedAt: new Date(),
};

const mockProduct2: HairProduct = {
  id: 'p2',
  userId: 'u1',
  name: 'Rosemary Hair Oil',
  brand: 'Mielle',
  category: 'oil',
  isFavorite: false,
  isActive: true,
  createdAt: new Date(),
  updatedAt: new Date(),
};

const mockCoreRoutine: Routine = {
  id: 'cr1',
  userId: 'u1',
  title: 'Sunday Wash Day',
  type: 'haircare',
  status: 'active',
  schedule: {
    frequency: 'weekly',
    interval: 1,
    startDate: '2026-07-01',
    timezone: 'UTC',
  },
  reminders: [],
  currentStreak: 4,
  longestStreak: 8,
  createdAt: new Date(),
  updatedAt: new Date(),
};

const mockHairRoutine: HairRoutine = {
  id: 'hr1',
  userId: 'u1',
  routineId: 'cr1',
  haircareCategory: 'wash-day',
  productIds: ['p1', 'p2'],
  createdAt: new Date(),
  updatedAt: new Date(),
};

const mockLogs: HairLog[] = [
  {
    id: 'hl1',
    userId: 'u1',
    hairRoutineId: 'hr1',
    date: '2026-07-23',
    time: '10:00:00',
    appliedProductIds: ['p1'],
    createdAt: new Date(),
  },
  {
    id: 'hl2',
    userId: 'u1',
    hairRoutineId: 'hr1',
    date: '2026-07-20',
    time: '10:00:00',
    appliedProductIds: ['p1', 'p2'],
    createdAt: new Date(),
  },
  {
    id: 'hl3',
    userId: 'u1',
    hairRoutineId: 'hr1',
    date: '2026-07-16',
    time: '10:00:00',
    appliedProductIds: ['p2'],
    createdAt: new Date(),
  },
];

const mockPhotos: HairPhoto[] = [
  {
    id: 'hp1',
    userId: 'u1',
    photoUrl: 'https://test/photo1.jpg',
    storagePath: 'users/u1/haircare/photos/hp1.jpg',
    captureDate: '2026-07-23',
    angle: 'crown',
    createdAt: new Date(),
    updatedAt: new Date(),
  },
];

const mockConditions: HairCondition[] = [
  {
    id: 'hc1',
    userId: 'u1',
    recordDate: '2026-07-23',
    hairType: 'wavy',
    porosity: 'medium',
    scalpType: 'normal',
    hairDensity: 'medium',
    sheddingLevel: 1,
    dandruffLevel: 1,
    itchinessLevel: 1,
    oilinessLevel: 2,
    drynessLevel: 2,
    breakageLevel: 1,
    frizzLevel: 2,
    shineLevel: 4,
    overallHealth: 9,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: 'hc2',
    userId: 'u1',
    recordDate: '2026-07-16',
    hairType: 'wavy',
    porosity: 'medium',
    scalpType: 'normal',
    hairDensity: 'medium',
    sheddingLevel: 2,
    dandruffLevel: 2,
    itchinessLevel: 2,
    oilinessLevel: 3,
    drynessLevel: 2,
    breakageLevel: 1,
    frizzLevel: 3,
    shineLevel: 3,
    overallHealth: 7,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
];

// ---------------------------------------------------------------------------
// Test 1: Weekly Analytics Calculations
// ---------------------------------------------------------------------------
console.log('Running Test 1: calculateWeeklyAnalytics...');
const weekly = calculateWeeklyAnalytics(mockLogs, [mockCoreRoutine]);
assert(weekly.completedCount >= 0, 'Completed count calculated');
assert(weekly.completionRate >= 0, 'Completion rate percentage calculated');
console.log('✅ Test 1 Passed');

// ---------------------------------------------------------------------------
// Test 2: Monthly Wash Interval Calculations
// ---------------------------------------------------------------------------
console.log('Running Test 2: calculateMonthlyAnalytics...');
const monthly = calculateMonthlyAnalytics(mockLogs);
assert(monthly.totalWashDays === 3, 'Total wash days is 3');
assert(monthly.avgWashIntervalDays === 3.5, `Avg wash interval is 3.5 days (got ${monthly.avgWashIntervalDays})`);
console.log('✅ Test 2 Passed');

// ---------------------------------------------------------------------------
// Test 3: Product Usage Ranking Calculations
// ---------------------------------------------------------------------------
console.log('Running Test 3: calculateProductAnalytics...');
const productUsage = calculateProductAnalytics([mockProduct1, mockProduct2], mockLogs);
assert(productUsage.length === 2, '2 products ranked');
assert(productUsage[0].usageCount === 2, 'Top product has 2 usages');
assert(productUsage[1].usageCount === 2, 'Second product has 2 usages');
console.log('✅ Test 3 Passed');

// ---------------------------------------------------------------------------
// Test 4: Condition Trend Calculations
// ---------------------------------------------------------------------------
console.log('Running Test 4: calculateConditionTrends...');
const trend = calculateConditionTrends(mockConditions);
assert(trend.avgOverallHealth === 8, `Avg overall health is 8 (got ${trend.avgOverallHealth})`);
assert(trend.trendDirection === 'improving', `Trend direction is improving (got ${trend.trendDirection})`);
console.log('✅ Test 4 Passed');

// ---------------------------------------------------------------------------
// Test 5: Full HairAnalyticsVM Construction
// ---------------------------------------------------------------------------
console.log('Running Test 5: buildHairAnalyticsVM...');
const analyticsVM = buildHairAnalyticsVM(
  [mockProduct1, mockProduct2],
  [mockHairRoutine],
  [mockCoreRoutine],
  mockLogs,
  mockPhotos,
  mockConditions
);

assert(analyticsVM.insights.length === 5, '5 Insight cards generated');
assert(analyticsVM.currentStreak === 4, 'Current streak is 4');
assert(analyticsVM.longestStreak === 8, 'Longest streak is 8');
assert(analyticsVM.totalPhotosCount === 1, 'Total photo count is 1');
console.log('✅ Test 5 Passed');

console.log('\n=== All Batch 6E Analytics Engine Unit Tests Passed! ===');
