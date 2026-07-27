/**
 * Workout Module AI Layer Verification Test Suite
 */

// 1. Mock native dependencies for Node-based CLI execution
(globalThis as any).__DEV__ = true;
(globalThis as any).AbortController = require('abort-controller');
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

// 2. Imports after overrides are registered
import { WorkoutPromptBuilder } from '../src/features/workout/ai/prompts/templates/WorkoutPrompts';
import { WorkoutContextBuilder } from '../src/features/workout/ai/utils/context/WorkoutContextBuilder';
import { FallbackHeuristicWorkoutAIProvider } from '../src/features/workout/ai/providers/FallbackHeuristicWorkoutAIProvider';
import { WorkoutAIProviderFactory } from '../src/features/workout/ai/providers/providerFactory';
import { WorkoutAIRepository } from '../src/features/workout/ai/repository/WorkoutAIRepository';
import { RequestManager } from '../src/features/workout/ai/utils/requestManager';
import type { WorkoutPlan, WorkoutSession, PersonalRecord } from '../src/features/workout/types/workout.types';
import type { WorkoutAIContext } from '../src/features/workout/ai/types/workoutAI.types';

// Mock client functions using custom spy mocks
const createMockFn = () => {
  const spy = (...args: any[]): any => {
    spy.mock.calls.push(args);
    return spy.mock.returnValue;
  };
  spy.mock = {
    calls: [] as any[][],
    returnValue: undefined as any,
  };
  spy.mockResolvedValue = (val: any) => {
    spy.mock.returnValue = Promise.resolve(val);
  };
  return spy;
};

const mockSaveMessage = createMockFn();
const mockSaveRecommendations = createMockFn();
const mockFetchConversation = createMockFn();

const mockAIService: any = {
  saveMessage: mockSaveMessage,
  saveRecommendations: mockSaveRecommendations,
  fetchConversation: mockFetchConversation,
};

// Main Verification Runner
async function runTests() {
  console.log('=== Starting Workout Batch 9C AI Layer Verification Tests ===');

  // Test Data Setup
  const mockPlan: WorkoutPlan = {
    id: 'test-plan-1',
    userId: 'user-123',
    name: 'Hypertrophy Power Split',
    description: 'A bodybuilding program targeting size.',
    targetDaysPerWeek: 4,
    isActive: true,
    exercises: [
      {
        id: 'ex-1',
        exerciseId: 'global-bench-press',
        exerciseName: 'Barbell Bench Press',
        exerciseCategory: 'strength',
        primaryMuscleGroup: 'chest',
        sets: [],
      },
    ],
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  const refDate = new Date('2026-07-26T12:00:00Z');

  // A completed session yesterday
  const session1: WorkoutSession = {
    id: 'sess-1',
    userId: 'user-123',
    name: 'Chest Push',
    status: 'completed',
    startedAt: new Date('2026-07-25T10:00:00Z'),
    completedAt: new Date('2026-07-25T11:00:00Z'),
    durationSeconds: 3600,
    totalVolume: 5000,
    totalReps: 80,
    notes: 'Strong lift.',
    exercises: [
      {
        id: 'work-1',
        exerciseId: 'global-bench-press',
        exerciseName: 'Barbell Bench Press',
        exerciseCategory: 'strength',
        primaryMuscleGroup: 'chest',
        sets: [
          { id: 's-1', type: 'working', weight: 100, reps: 10, completed: true },
          { id: 's-2', type: 'working', weight: 100, reps: 10, completed: true },
        ],
      },
    ],
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  const mockPRs: PersonalRecord[] = [
    {
      id: 'pr-1',
      userId: 'user-123',
      exerciseId: 'global-bench-press',
      exerciseName: 'Barbell Bench Press',
      type: 'max-weight',
      value: 100,
      unit: 'kg',
      date: '2026-07-26',
      sessionId: 'sess-1',
      createdAt: new Date(),
      updatedAt: new Date(),
    },
  ];

  // ----------------------------------------------------
  // TEST 1: Context Builder
  // ----------------------------------------------------
  console.log('\nTest 1: Verifying Context Builder...');
  const context = WorkoutContextBuilder.buildAIContext(
    mockPlan,
    [session1],
    mockPRs,
    refDate
  );

  if (context.feature !== 'workout') throw new Error('Context feature must be workout');
  if (context.activePlanName !== 'Hypertrophy Power Split') throw new Error('Incorrect plan name');
  if (context.workoutStreak !== 1) throw new Error(`Incorrect streak: expected 1, got ${context.workoutStreak}`);
  if (context.weeklyFrequency !== 1) throw new Error(`Incorrect weekly frequency: expected 1, got ${context.weeklyFrequency}`);
  if (context.userGoal !== 'Hypertrophy') throw new Error(`Incorrect goal inference: expected Hypertrophy, got ${context.userGoal}`);
  if (context.recentPersonalRecords.length !== 1) throw new Error('Incorrect recent PR length');
  console.log('✓ Test 1 Passed: Context Builder verified successfully');

  // ----------------------------------------------------
  // TEST 2: Prompt Builder Templates
  // ----------------------------------------------------
  console.log('\nTest 2: Verifying Prompt Builder Templates...');
  const sysPrompt = WorkoutPromptBuilder.buildSystemPrompt();
  const chatPrompt = WorkoutPromptBuilder.buildChatPrompt('Substitute bench press?', context);
  const recsPrompt = WorkoutPromptBuilder.buildRecommendationsPrompt(context);
  const reviewPrompt = WorkoutPromptBuilder.buildWeeklyReviewPrompt(context);

  if (!sysPrompt.includes('Workout AI Coach')) throw new Error('System prompt missing character');
  if (!chatPrompt.includes('Substitute bench press?')) throw new Error('Chat prompt missing user query');
  if (!recsPrompt.includes('JSON Schema')) throw new Error('Recommendations prompt missing JSON schema format');
  if (!reviewPrompt.includes('highlights')) throw new Error('Weekly review prompt missing format specifications');
  console.log('✓ Test 2 Passed: Prompt Builder verified successfully');

  // ----------------------------------------------------
  // TEST 3: Heuristic Provider Engine Rules
  // ----------------------------------------------------
  console.log('\nTest 3: Verifying Heuristic Rules Engine...');
  const heuristicProvider = new FallbackHeuristicWorkoutAIProvider();

  // Test 3.1: Recommendations trigger Low Frequency rule
  const recs = await heuristicProvider.generateRecommendations(context);
  const freqRec = recs.find((r) => r.id === 'rec_frequency_low');
  if (!freqRec) throw new Error('Expected Low Frequency recommendation to trigger');
  if (freqRec.targetConcern !== 'Consistency') throw new Error('Low Frequency must match Consistency concern');

  // Test 3.2: PR Progressive Overload rule
  const overloadRec = recs.find((r) => r.id === 'rec_progressive_overload');
  if (!overloadRec) throw new Error('Expected Progressive Overload recommendation to trigger');
  if (overloadRec.targetConcern !== 'Progressive Overload') throw new Error('Must match Progressive Overload concern');

  // Test 3.3: Muscle imbalance rule (missing Back & Legs)
  const imbalanceRec = recs.find((r) => r.id === 'rec_muscle_imbalance');
  if (!imbalanceRec) throw new Error('Expected muscle imbalance recommendation to trigger');
  if (!imbalanceRec.summary.includes('Back, Legs')) throw new Error('Should list missing back/legs muscle groups');

  // Test 3.4: Inactivity Detection
  const inactiveContext: WorkoutAIContext = {
    ...context,
    weeklyFrequency: 0,
  };
  const inactiveRecs = await heuristicProvider.generateRecommendations(inactiveContext);
  if (!inactiveRecs.some((r) => r.id === 'rec_inactivity_detected')) {
    throw new Error('Expected inactivity warning to trigger');
  }

  // Test 3.5: Overtraining risk rule
  const overtrainedContext: WorkoutAIContext = {
    ...context,
    weeklyFrequency: 7,
  };
  const overtrainedRecs = await heuristicProvider.generateRecommendations(overtrainedContext);
  if (!overtrainedRecs.some((r) => r.id === 'rec_overtraining_risk')) {
    throw new Error('Expected overtraining risk warning to trigger');
  }

  console.log('✓ Test 3 Passed: Heuristic Rules validated successfully');

  // ----------------------------------------------------
  // TEST 4: Provider Factory Cache
  // ----------------------------------------------------
  console.log('\nTest 4: Verifying Provider Factory...');
  const provider1 = WorkoutAIProviderFactory.getProvider('heuristic');
  const provider2 = WorkoutAIProviderFactory.getProvider('heuristic');
  const providerMock = WorkoutAIProviderFactory.getProvider('mock');

  if (provider1 !== provider2) throw new Error('Provider factory failed caching identical types');
  if (providerMock.name !== 'mock') throw new Error('Provider factory failed resolving mock type');
  console.log('✓ Test 4 Passed: Provider Factory verified');

  // ----------------------------------------------------
  // TEST 5: RequestManager Cooldown, Cancel and Timeout
  // ----------------------------------------------------
  console.log('\nTest 5: Verifying RequestManager...');
  const manager = new RequestManager();

  // Test 5.1: Cooldown Enforcements
  const firstCheck = manager.checkCooldown('test_cooldown');
  const secondCheck = manager.checkCooldown('test_cooldown');
  if (!firstCheck) throw new Error('First check should succeed');
  if (secondCheck) throw new Error('Second check should be blocked by cooldown');

  // Test 5.2: Timeout Rejections
  try {
    const slowPromise = new Promise((resolve) => setTimeout(resolve, 500));
    await manager.withTimeout(slowPromise, 100);
    throw new Error('Expected timeout to throw');
  } catch (err: any) {
    if (!err.message.includes('Request timed out')) {
      throw new Error('Unexpected timeout exception thrown');
    }
  }
  console.log('✓ Test 5 Passed: RequestManager parameters verified');

  // ----------------------------------------------------
  // TEST 6: Repository Ask & Save Log Flows
  // ----------------------------------------------------
  console.log('\nTest 6: Verifying Repository Ask & Save logs...');
  const repo = new WorkoutAIRepository(mockAIService);
  
  // Set mock returns
  mockSaveMessage.mockResolvedValue(undefined);
  mockSaveRecommendations.mockResolvedValue(undefined);
  mockFetchConversation.mockResolvedValue([]);

  const res = await repo.askCoach('user-123', 'Substitution for squats?', context, 'mock');
  if (!res.success) throw new Error('askCoach call failed');
  if (res.data.sender !== 'ai') throw new Error('askCoach failed mapping response sender');
  if (!res.data.text.includes('[Mock response]')) throw new Error('Expected mock response content');

  if (mockSaveMessage.mock.calls.length < 2) {
    throw new Error('Expected at least 2 saveMessage transactions logged');
  }
  console.log('✓ Test 6 Passed: Repository transactions verified successfully');

  console.log('\n=== ALL WORKOUT BATCH 9C AI TESTS PASSED SUCCESSFULLY! ===');
}

// Execute tests and assert result code
runTests().catch((err) => {
  console.error('\n❌ Test Verification Failed:', err);
  process.exit(1);
});
