import { skincareProductSchema, skincareRoutineSchema, skinAssessmentSchema } from '../src/features/skincare/validation/skincare.validation';
import {
  calculateSkinHealthScore,
  calculateProductExpiry,
  calculateConsistencyScore,
} from '../src/features/skincare/engine/skincareEngine';
import {
  calculateAverageHealthScore,
  buildSkincareAnalyticsVM,
} from '../src/features/skincare/analytics/utils/skincareAnalytics';
import { SkinAIContextBuilder } from '../src/features/skincare/ai/utils/SkinAIContextBuilder';
import { FallbackHeuristicSkinAIProvider } from '../src/features/skincare/ai/providers/FallbackHeuristicSkinAIProvider';
import { SkinAIProviderFactory } from '../src/features/skincare/ai/providers/providerFactory';
import { RuleRecommendationEngine } from '../src/features/skincare/ai/engine/ruleRecommendationEngine';
import { aiRequestManager } from '../src/features/skincare/ai/utils/requestManager';
import type {
  SkincareProduct,
  SkincareRoutine,
  SkincareLog,
  SkinAssessment,
  ProgressPhoto,
} from '../src/features/skincare/types';

function assert(condition: boolean, message: string) {
  if (!condition) {
    throw new Error(`[Assertion Failed] ${message}`);
  }
}

console.log('=== Starting Skincare Batch 7C Architecture & AI Verification Tests ===');

// --- Mock Data ---

const mockProduct: SkincareProduct = {
  id: 'sp1',
  userId: 'u1',
  name: 'CeraVe Hydrating Cleanser',
  brand: 'CeraVe',
  category: 'cleanser',
  type: 'cream',
  keyIngredients: ['Ceramides', 'Hyaluronic Acid'],
  openedDate: new Date('2026-01-01'),
  shelfLifeMonths: 12,
  isFavorite: true,
  isActive: true,
  createdAt: new Date(),
  updatedAt: new Date(),
};

const mockRoutine: SkincareRoutine = {
  id: 'sr1',
  userId: 'u1',
  routineId: 'cr1',
  timeOfDay: 'morning',
  steps: [
    {
      id: 'step1',
      productId: 'sp1',
      stepOrder: 1,
      timeOfDay: 'morning',
      instructions: 'Gentle massage',
      isOptional: false,
    },
  ],
  targetedConcerns: ['dryness', 'barrier-damage'],
  createdAt: new Date(),
  updatedAt: new Date(),
};

const mockLog: SkincareLog = {
  id: 'sl1',
  userId: 'u1',
  skincareRoutineId: 'sr1',
  routineLogId: 'rl1',
  date: '2026-07-24',
  time: '08:30:00',
  completedStepIds: ['step1'],
  skippedStepIds: [],
  appliedProductIds: ['sp1'],
  weather: 'sunny',
  uvIndex: 4,
  skinFeelingRating: 5,
  createdAt: new Date(),
};

const mockAssessment: SkinAssessment = {
  id: 'sa1',
  userId: 'u1',
  recordDate: '2026-07-24',
  skinType: 'combination',
  concerns: ['acne', 'dryness'],
  severityMap: { acne: 2, dryness: 3 },
  overallHealthScore: 8,
  hydrationLevel: 4,
  sensitivityLevel: 2,
  oilinessLevel: 3,
  barrierHealthScore: 4,
  sleepHours: 8,
  stressLevel: 2,
  createdAt: new Date(),
  updatedAt: new Date(),
};

const mockPastAssessment: SkinAssessment = {
  ...mockAssessment,
  id: 'sa0',
  recordDate: '2026-07-10',
  overallHealthScore: 6,
  hydrationLevel: 2,
  barrierHealthScore: 2,
  severityMap: { acne: 4, dryness: 4 },
};

const mockPhoto: ProgressPhoto = {
  id: 'sp_ph1',
  userId: 'u1',
  photoUrl: 'https://example.com/photo.jpg',
  storagePath: 'users/u1/skincare/photos/photo.jpg',
  date: '2026-07-24',
  timeOfDay: 'morning',
  angle: 'front',
  createdAt: new Date(),
};

// ---------------------------------------------------------------------------
// Test 1: Zod Validation Schemas
// ---------------------------------------------------------------------------
console.log('Test 1: Validating Zod Schemas...');

const validProduct = skincareProductSchema.parse({
  name: 'Hydrating Cleanser',
  brand: 'CeraVe',
  category: 'cleanser',
  type: 'cream',
  keyIngredients: [],
  isFavorite: false,
});
assert(validProduct.name === 'Hydrating Cleanser', 'Product schema parse success');

const validRoutine = skincareRoutineSchema.parse({
  title: 'Morning Glow Routine',
  timeOfDay: 'morning',
  steps: [{ productId: 'sp1', stepOrder: 1, timeOfDay: 'morning', isOptional: false }],
  targetedConcerns: ['dryness'],
  frequency: 'daily',
});
assert(validRoutine.title === 'Morning Glow Routine', 'Routine schema parse success');

const validAssessment = skinAssessmentSchema.parse({
  recordDate: '2026-07-24',
  skinType: 'combination',
  concerns: ['acne'],
  severityMap: { acne: 2 },
  overallHealthScore: 8,
  hydrationLevel: 4,
  sensitivityLevel: 2,
  oilinessLevel: 3,
  barrierHealthScore: 4,
});
assert(validAssessment.overallHealthScore === 8, 'Assessment schema parse success');

console.log('✓ Test 1 Passed: Zod schemas validated');

// ---------------------------------------------------------------------------
// Test 2: Domain Engine Calculations
// ---------------------------------------------------------------------------
console.log('Test 2: Verifying Domain Engine Calculations...');

const score = calculateSkinHealthScore({
  hydrationLevel: 5,
  barrierHealthScore: 5,
  sensitivityLevel: 1,
  oilinessLevel: 3,
});
assert(score === 10, 'Health score calculation correct');

const expiryInfo = calculateProductExpiry(new Date('2026-01-01'), 12);
assert(!expiryInfo.isExpired, 'Expiry calculation correct for non-expired product');

const consistency = calculateConsistencyScore([mockLog], 7);
assert(consistency === 14, 'Consistency score calculation correct');

console.log('✓ Test 2 Passed: Domain engine calculations verified');

// ---------------------------------------------------------------------------
// Test 3: Analytics Engine
// ---------------------------------------------------------------------------
console.log('Test 3: Verifying Analytics Engine...');

const avgScore = calculateAverageHealthScore([mockAssessment, mockPastAssessment]);
assert(avgScore === 7.1, 'Average health score calculation correct');

const analyticsVM = buildSkincareAnalyticsVM({
  assessments: [mockPastAssessment, mockAssessment],
  logs: [mockLog],
  routines: [mockRoutine],
  products: [mockProduct],
});
assert(analyticsVM.skinHealthScoreTrend === 'improving', 'Analytics VM trend verified');

console.log('✓ Test 3 Passed: Analytics engine verified');

// ---------------------------------------------------------------------------
// Test 4: AI Context & Providers
// ---------------------------------------------------------------------------
console.log('Test 4: Verifying AI Context & Provider Factory...');

const aiContext = SkinAIContextBuilder.buildContext({
  assessments: [mockAssessment],
  routines: [mockRoutine],
  logs: [mockLog],
  products: [mockProduct],
});
assert(aiContext.userProfile.skinType === 'combination', 'AI Context Builder verified');

const mockProvider = SkinAIProviderFactory.getProvider('mock');
assert(mockProvider.name === 'mock', 'Provider factory returns mock provider');

const heuristicProvider = SkinAIProviderFactory.getProvider('heuristic');
assert(heuristicProvider.name === 'fallback-heuristic', 'Provider factory returns heuristic provider');

// ---------------------------------------------------------------------------
// Test 5: Stage 1 Rule-Based Recommendation Engine & Request Manager
// ---------------------------------------------------------------------------
console.log('Test 5: Verifying Stage 1 Rule-Based Recommendation Engine & Request Manager...');

const stage1Recs = RuleRecommendationEngine.detectRecommendations(aiContext);
assert(stage1Recs.length > 0, 'Stage 1 Rule-Based Engine detected triggers (missing sunscreen)');
assert(stage1Recs.some((r) => r.recommendedCategory === 'sunscreen'), 'Missing sunscreen trigger confirmed');

const cooldownOk = aiRequestManager.checkCooldown('test_user_1', 100);
assert(cooldownOk === true, 'Request manager allows initial request');

const cooldownBlocked = aiRequestManager.checkCooldown('test_user_1', 1000);
assert(cooldownBlocked === false, 'Request manager throttles duplicate requests during cooldown');

heuristicProvider.askCoach('What is the best way to use sunscreen?', aiContext).then((answer) => {
  assert(answer.includes('sunscreen') || answer.includes('SPF'), 'AI Provider answered sunscreen question');
  console.log('✓ Test 4 & 5 Passed: AI Provider Factory, Rule Recommendation Engine & Request Manager verified');
  console.log('=== ALL BATCH 7C ARCHITECTURE VERIFICATION TESTS PASSED SUCCESSFULLY! ===');
});
