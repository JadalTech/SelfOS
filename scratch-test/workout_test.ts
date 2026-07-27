/**
 * Mock native dependencies for Node-based CLI execution
 */
(globalThis as any).__DEV__ = true;
process.env.EXPO_PUBLIC_FIREBASE_API_KEY = 'mock-api-key';
process.env.EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN = 'mock-auth-domain';
process.env.EXPO_PUBLIC_FIREBASE_PROJECT_ID = 'mock-project-id';
process.env.EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET = 'mock-storage-bucket';
process.env.EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID = 'mock-sender';
process.env.EXPO_PUBLIC_FIREBASE_APP_ID = 'mock-app-id';

const Module = require('module');
const originalRequire = Module.prototype.require;
Module.prototype.require = function (id: string) {
  if (id === 'expo-constants') {
    return {
      default: {
        expoConfig: {
          extra: {},
        },
      },
    };
  }
  if (id === '@react-native-async-storage/async-storage') {
    return {
      default: {
        getItem: async () => null,
        setItem: async () => {},
        removeItem: async () => {},
        clear: async () => {},
      },
    };
  }
  if (id === 'react-native') {
    return {
      Platform: { OS: 'ios' },
    };
  }
  return originalRequire.apply(this, arguments);
};

import {
  exerciseSchema,
  workoutPlanSchema,
  workoutSessionSchema,
  personalRecordSchema,
} from '../src/features/workout/validation/workout.validation';
import {
  calculateOneRepMax,
  calculateVolumeForSet,
  convertWeight,
  calculateSessionDensity,
  calculateMuscleGroupVolume,
  calculateExerciseFrequency,
  calculateSessionTotals,
  calculateWorkoutStreak,
  calculateWeeklyFrequency,
} from '../src/features/workout/engine/workoutEngine';
import {
  calculateRecoveryGaps,
  calculateVolumeTrends,
  calculateWorkoutConsistency,
  calculateMuscleGroupStats,
  calculateMuscleBalance,
  buildWorkoutAnalytics,
} from '../src/features/workout/analytics/utils/workoutAnalytics';
import {
  userExerciseConverter,
  workoutPlanConverter,
  workoutSessionConverter,
  personalRecordConverter,
} from '../src/features/workout/firestore/converters';
import {
  mapToExerciseVM,
  mapToExerciseSetVM,
  mapToWorkoutExerciseVM,
  mapToWorkoutSessionVM,
  mapToPersonalRecordVM,
} from '../src/features/workout/mappers/workout.mapper';
import { WorkoutRepository } from '../src/features/workout/repository/workout.repository';
import type {
  Exercise,
  WorkoutSession,
  PersonalRecord,
  WorkoutExercise,
  ExerciseSet,
} from '../src/features/workout/types/workout.types';
import { Timestamp } from 'firebase/firestore';

function assert(condition: boolean, message: string) {
  if (!condition) {
    throw new Error(`[Assertion Failed] ${message}`);
  }
}

console.log('=== Starting Workout Batch 9A Domain & Architecture Verification Tests ===');

// --- Mock Data ---

const mockExercise: Exercise = {
  id: 'ex-bench-press',
  name: 'Barbell Bench Press',
  primaryMuscleGroup: 'chest',
  secondaryMuscleGroups: ['shoulders', 'triceps'],
  equipment: 'barbell',
  category: 'strength',
  difficulty: 'intermediate',
  unilateral: false,
  defaultRestDurationSeconds: 120,
  defaultUnit: 'kg',
  source: 'global',
  createdAt: new Date('2026-07-01T12:00:00Z'),
  updatedAt: new Date('2026-07-01T12:00:00Z'),
};

const mockCardioExercise: Exercise = {
  id: 'ex-run',
  name: 'Running',
  primaryMuscleGroup: 'cardio',
  equipment: 'none',
  category: 'cardio',
  difficulty: 'beginner',
  unilateral: false,
  defaultUnit: 'seconds',
  source: 'global',
  createdAt: new Date('2026-07-01T12:00:00Z'),
  updatedAt: new Date('2026-07-01T12:00:00Z'),
};

const mockSet1: ExerciseSet = {
  id: 's1',
  type: 'working',
  weight: 80,
  reps: 8,
  completed: true,
  rpe: 8,
  restTimeSeconds: 120,
};

const mockSet2: ExerciseSet = {
  id: 's2',
  type: 'working',
  weight: 80,
  reps: 6,
  completed: true,
  rpe: 9,
  restTimeSeconds: 120,
};

const mockSetWarmup: ExerciseSet = {
  id: 'sw',
  type: 'warmup',
  weight: 40,
  reps: 10,
  completed: true,
};

const mockWorkoutExercise: WorkoutExercise = {
  id: 'we1',
  exerciseId: 'ex-bench-press',
  exerciseName: 'Barbell Bench Press',
  exerciseCategory: 'strength',
  primaryMuscleGroup: 'chest',
  sets: [mockSetWarmup, mockSet1, mockSet2],
};

const mockSession: WorkoutSession = {
  id: 'sess1',
  userId: 'u1',
  name: 'Push Day',
  status: 'completed',
  exercises: [mockWorkoutExercise],
  startedAt: new Date('2026-07-26T18:00:00Z'),
  completedAt: new Date('2026-07-26T18:45:00Z'),
  durationSeconds: 2700, // 45 mins
  totalVolume: 1120, // (80 * 8) + (80 * 6) = 640 + 480 = 1120. Warmup is excluded.
  totalReps: 14, // 8 + 6 = 14 (working reps count)
  createdAt: new Date('2026-07-26T18:00:00Z'),
  updatedAt: new Date('2026-07-26T18:45:00Z'),
};

// ---------------------------------------------------------------------------
// Test 1: Zod Schema Validation
// ---------------------------------------------------------------------------
console.log('Test 1: Validating Zod Schemas...');

// Success cases
const parsedExercise = exerciseSchema.parse(mockExercise);
assert(parsedExercise.name === 'Barbell Bench Press', 'Exercise schema parsed successfully');

const parsedPlan = workoutPlanSchema.parse({
  name: 'Strength Split',
  isActive: true,
  exercises: [mockWorkoutExercise],
});
assert(parsedPlan.name === 'Strength Split', 'Plan schema parsed successfully');

const parsedSession = workoutSessionSchema.parse(mockSession);
assert(parsedSession.name === 'Push Day', 'Session schema parsed successfully');

// Failure cases
try {
  workoutPlanSchema.parse({ name: '' });
  assert(false, 'Should have failed on empty plan name');
} catch (e: any) {
  assert(e.name === 'ZodError', 'Zod validation correctly caught empty name');
}

try {
  personalRecordSchema.parse({ exerciseId: '', type: 'max-weight', value: -10, date: 'invalid-date' });
  assert(false, 'Should have failed on negative weight value and invalid date format');
} catch (e: any) {
  assert(e.name === 'ZodError', 'Zod validation caught negative PR value & date format');
}

console.log('✓ Test 1 Passed: Zod schemas validated');

// ---------------------------------------------------------------------------
// Test 2: Domain Workout Engine Calculations
// ---------------------------------------------------------------------------
console.log('Test 2: Verifying Domain Engine Calculations...');

// Volume for set
assert(calculateVolumeForSet(mockSet1) === 640, 'Volume for working set calculated correctly');
assert(calculateVolumeForSet(mockSetWarmup) === 0, 'Volume for warmup set is 0');

// 1RM estimation
// 100kg for 5 reps -> 100 * (1 + 5/30) = 116.7
const est1RM = calculateOneRepMax(100, 5);
assert(est1RM === 116.7, 'Estimated 1RM calculated correctly');
assert(calculateOneRepMax(100, 1) === 100, 'Estimated 1RM for 1 rep is the weight itself');

// Unit weight conversion
assert(convertWeight(100, 'kg', 'lbs') === 220.5, '100 kg to lbs equals 220.5');
assert(convertWeight(220.462, 'lbs', 'kg') === 100, '220.5 lbs to kg equals 100');

// Density
const density = calculateSessionDensity(1120, 2700);
assert(density === 24.9, 'Density (1120 volume over 45 mins) calculated correctly');

// Muscle group volume
const mgVol = calculateMuscleGroupVolume([mockWorkoutExercise]);
assert(mgVol.chest === 1120, 'Chest training volume is 1120');
assert(mgVol.back === 0, 'Back training volume is 0');

// Exercise frequency
const freq = calculateExerciseFrequency([mockSession]);
assert(freq['ex-bench-press'] === 1, 'Exercise frequency tracks completed exercises');

// Streak counter
const datesList = [
  { date: '2026-07-26' },
  { date: '2026-07-25' },
  { date: '2026-07-24' },
  { date: '2026-07-21' },
];
// Today is 2026-07-26 in mock environment
const streak = calculateWorkoutStreak(datesList);
assert(streak === 3, 'Streak calculated as 3 consecutive days');

// Weekly frequency (let's assume week start is Monday 2026-07-20)
const weeklyFreq = calculateWeeklyFrequency(datesList, '2026-07-20');
assert(weeklyFreq === 4, 'Weekly frequency matches total logs in week window');

// Session totals
const totals = calculateSessionTotals([mockWorkoutExercise], new Date('2026-07-26T18:00:00Z'), new Date('2026-07-26T18:45:00Z'));
assert(totals.totalVolume === 1120, 'Totals volume is 1120');
assert(totals.totalReps === 14, 'Totals reps count is 14');
assert(totals.durationSeconds === 2700, 'Duration is 2700 seconds');
assert(totals.completedExercisesCount === 1, 'Completed exercises count is 1');
assert(totals.averageRPE === 8.5, 'Average RPE (8 and 9) is 8.5');
assert(totals.averageRestDuration === 120, 'Average rest duration is 120s');
assert(totals.caloriesBurned > 0, 'Estimated calorie burn is calculated');

console.log('✓ Test 2 Passed: Domain calculations verified');

// ---------------------------------------------------------------------------
// Test 3: Analytics Engine
// ---------------------------------------------------------------------------
console.log('Test 3: Verifying Analytics Calculations...');

const refDate = new Date('2026-07-26T20:00:00Z');

// Recovery Gaps
const gaps = calculateRecoveryGaps([mockSession], refDate);
assert(gaps.chest === 0, 'Chest recovery gap is 0 days (trained today)');
assert(gaps.back === 99, 'Back recovery gap is default 99 days (never trained)');

// Volume trend
const trends = calculateVolumeTrends([mockSession]);
assert(trends[0].volume === 1120, 'Volume trend point mapped');

// Consistency score (target 3 workouts/week, 4 weeks window)
const consistency = calculateWorkoutConsistency([mockSession], 3, 4, refDate);
assert(consistency === 25, 'Consistency with 1 workout over 4 weeks is 25%');

// Balance
const balance = calculateMuscleBalance([mockSession]);
assert(balance.pushVolume === 1120, 'Push volume calculated as 1120');
assert(balance.pullVolume === 0, 'Pull volume is 0');

// Muscle group stats
const stats = calculateMuscleGroupStats([mockSession], refDate);
assert(stats.chest.volume === 1120, 'Chest stat volume is 1120');
assert(stats.chest.setPercentage === 100, 'Chest set percentage is 100%');
assert(stats.chest.daysSinceLastTrained === 0, 'Chest last trained today');

// Build FeatureAnalytics
const mockPr: PersonalRecord = {
  id: 'pr1',
  userId: 'u1',
  exerciseId: 'ex-bench-press',
  exerciseName: 'Barbell Bench Press',
  type: 'max-weight',
  value: 80,
  unit: 'kg',
  date: '2026-07-26',
  createdAt: new Date(),
  updatedAt: new Date(),
};
const featureAnalytics = buildWorkoutAnalytics([mockSession], [mockPr], 3, refDate);
assert(featureAnalytics.some((a) => a.metric === 'weekly-workouts'), 'Weekly workouts metric present');
assert(featureAnalytics.some((a) => a.metric === 'average-volume'), 'Average volume metric present');
assert(featureAnalytics.some((a) => a.metric === 'consistency'), 'Consistency metric present');

console.log('✓ Test 3 Passed: Analytics calculations verified');

// ---------------------------------------------------------------------------
// Test 4: Firestore Converters
// ---------------------------------------------------------------------------
console.log('Test 4: Verifying Firestore Converters...');

const now = new Date();

// User exercise converter
const rawUserEx = userExerciseConverter.toFirestore({
  ...mockExercise,
  source: 'user',
  userId: 'u1',
});
assert(rawUserEx.source === 'user', 'Converter sets source to user');
assert(rawUserEx.createdAt instanceof Timestamp, 'Converter converts Date to Timestamp');

// Workout Session converter
const rawSess = workoutSessionConverter.toFirestore(mockSession);
assert(rawSess.status === 'completed', 'Converter maps session status');
assert(rawSess.startedAt instanceof Timestamp, 'Converter maps startedAt to Timestamp');
assert(rawSess.completedAt instanceof Timestamp, 'Converter maps completedAt to Timestamp');

// Personal Record converter
const rawPr = personalRecordConverter.toFirestore(mockPr);
assert(rawPr.value === 80, 'Converter maps value');
assert(rawPr.type === 'max-weight', 'Converter maps type');

console.log('✓ Test 4 Passed: Firestore converters verified');

// ---------------------------------------------------------------------------
// Test 5: ViewModel Mappers
// ---------------------------------------------------------------------------
console.log('Test 5: Verifying ViewModel Mappers...');

const exVM = mapToExerciseVM(mockExercise);
assert(exVM.primaryMuscleGroupLabel === 'Chest', 'Primary muscle group label mapped to Chest');
assert(exVM.secondaryMuscleGroupsLabel === 'Shoulders, Triceps', 'Secondary muscle groups mapped');
assert(exVM.equipmentLabel === 'Barbell', 'Equipment mapped');
assert(exVM.categoryLabel === 'Strength', 'Category mapped');
assert(exVM.difficultyLabel === 'Intermediate', 'Difficulty mapped');
assert(exVM.unilateralLabel === 'Bilateral', 'Unilateral flat mapped to Bilateral');
assert(exVM.defaultRestDurationLabel === '2m 0s', 'Default rest duration label formatted');

const setVM = mapToExerciseSetVM(mockSet1);
assert(setVM.weightLabel === '80 kg', 'Weight label formatted');
assert(setVM.repsLabel === '8 reps', 'Reps label formatted');
assert(setVM.rpeLabel === 'RPE 8', 'RPE label formatted');
assert(setVM.restTimeLabel === '120s', 'Rest time label formatted');

const workexVM = mapToWorkoutExerciseVM(mockWorkoutExercise);
assert(workexVM.setsCount === 3, 'Sets count mapped');
assert(workexVM.setsCompletedCount === 3, 'Completed sets count mapped');

const sessionVM = mapToWorkoutSessionVM(mockSession);
assert(sessionVM.durationFormatted === '45m', 'Session duration formatted to 45m');
assert(sessionVM.totalVolumeLabel === '1120 kg', 'Total volume label formatted');
assert(sessionVM.totalRepsLabel === '14 reps', 'Total reps label formatted');
assert(sessionVM.statusLabel === 'Completed', 'Status capitalized');

const prVM = mapToPersonalRecordVM(mockPr);
assert(prVM.valueLabel === '80 kg', 'Personal record value label formatted');
assert(prVM.typeLabel === 'Maximum Weight', 'Personal record type label formatted');

console.log('✓ Test 5 Passed: Mappers verified');

// ---------------------------------------------------------------------------
// Test 6: Repository Logic & PR Detection
// ---------------------------------------------------------------------------
console.log('Test 6: Verifying Repository PR Detection...');

// Mock service implementation for testing
class MockWorkoutService {
  public savedPrs: PersonalRecord[] = [];
  public prs: PersonalRecord[] = [];

  async fetchPersonalRecords(userId: string): Promise<PersonalRecord[]> {
    return this.prs;
  }
  async savePersonalRecord(userId: string, pr: PersonalRecord): Promise<PersonalRecord> {
    this.savedPrs.push(pr);
    return pr;
  }
  async deletePersonalRecord(userId: string, prId: string): Promise<void> {}
}

(async () => {
  const mockService = new MockWorkoutService();
  const repo = new WorkoutRepository(mockService as any);

  // If no existing PRs, every performance is a new PR
  const result = await repo.checkAndLogNewPRs('u1', mockSession);
  assert(result.success === true, 'Repository completed PR check successfully');
  assert(mockService.savedPrs.length === 4, 'Detected 4 new PRs (max-weight, max-reps, volume, 1RM)');
  assert(mockService.savedPrs.some((p) => p.type === 'max-weight' && p.value === 80), 'Saved max-weight PR');
  assert(mockService.savedPrs.some((p) => p.type === 'one-rep-max' && p.value === 101.3), 'Saved 1RM PR (80 * (1 + 8/30) = 101.3)');

  // Clean up saved records
  mockService.savedPrs = [];
  // Set existing records to higher values
  mockService.prs = [
    {
      id: 'pr-ex-bench-press-weight',
      userId: 'u1',
      exerciseId: 'ex-bench-press',
      exerciseName: 'Barbell Bench Press',
      type: 'max-weight',
      value: 90, // Higher than session max weight (80)
      unit: 'kg',
      date: '2026-07-20',
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      id: 'pr-ex-bench-press-1rm',
      userId: 'u1',
      exerciseId: 'ex-bench-press',
      exerciseName: 'Barbell Bench Press',
      type: 'one-rep-max',
      value: 120, // Higher than session 1RM (101.3)
      unit: 'kg',
      date: '2026-07-20',
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      id: 'pr-ex-bench-press-vol',
      userId: 'u1',
      exerciseId: 'ex-bench-press',
      exerciseName: 'Barbell Bench Press',
      type: 'highest-volume',
      value: 2000, // Higher than session volume (1120)
      unit: 'kg',
      date: '2026-07-20',
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      id: 'pr-ex-bench-press-reps',
      userId: 'u1',
      exerciseId: 'ex-bench-press',
      exerciseName: 'Barbell Bench Press',
      type: 'max-reps',
      value: 12, // Higher than session max reps (8)
      unit: 'reps',
      date: '2026-07-20',
      createdAt: new Date(),
      updatedAt: new Date(),
    },
  ];

  // Re-check: Should not detect any new PRs because existing are higher
  const reResult = await repo.checkAndLogNewPRs('u1', mockSession);
  assert(reResult.success === true, 'PR check completes successfully');
  assert(mockService.savedPrs.length === 0, 'No new PRs saved because existing are higher');

  console.log('✓ Test 6 Passed: Repository PR detection verified');

  console.log('=== ALL WORKOUT BATCH 9A ARCHITECTURE TESTS PASSED SUCCESSFULLY! ===');
})().catch((err) => {
  console.error('Test execution failed:', err);
  throw err;
});
