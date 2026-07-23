/**
 * Scratch Unit Verification Script for AI Hair Coach Engine
 */

import { HairAIContextBuilder } from '../src/features/haircare/ai/utils/contextBuilder';
import { PromptBuilder } from '../src/features/haircare/ai/prompts/promptBuilder';
import { HairAIService } from '../src/features/haircare/ai/services/hairAI.service';
import type { Routine } from '../src/features/routine/types';
import type {
  HairProduct,
  HairRoutine,
  HairLog,
  HairPhoto,
  HairCondition,
} from '../src/features/haircare/types';
import { buildHairAnalyticsVM } from '../src/features/haircare/analytics/utils/hairAnalytics';

function assert(condition: boolean, message: string): void {
  if (!condition) {
    throw new Error(`[Assertion Failed] ${message}`);
  }
}

console.log('=== Starting Batch 6F AI Hair Coach Unit Tests ===');

const mockProduct: HairProduct = {
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
  currentStreak: 1, // Low streak to trigger Rule 1
  longestStreak: 5,
  createdAt: new Date(),
  updatedAt: new Date(),
};

const mockHairRoutine: HairRoutine = {
  id: 'hr1',
  userId: 'u1',
  routineId: 'cr1',
  haircareCategory: 'wash-day',
  productIds: ['p1'],
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
];

const mockPhotos: HairPhoto[] = [];
const mockConditions: HairCondition[] = [];

// ---------------------------------------------------------------------------
// Test 1: HairAIContextBuilder
// ---------------------------------------------------------------------------
console.log('Running Test 1: HairAIContextBuilder...');
const analytics = buildHairAnalyticsVM([mockProduct], [mockHairRoutine], [mockCoreRoutine], mockLogs, mockPhotos, mockConditions);
const ctx = HairAIContextBuilder.buildContext([mockProduct], [mockHairRoutine], [mockCoreRoutine], mockLogs, mockPhotos, mockConditions, analytics);

assert(ctx.activeProducts.length === 1, '1 active product in context');
assert(ctx.currentStreak === 1, 'Current streak is 1');
assert(ctx.photosCount === 0, '0 photo count in context');
console.log('✅ Test 1 Passed');

// ---------------------------------------------------------------------------
// Test 2: PromptBuilder System & Recommendation Prompts
// ---------------------------------------------------------------------------
console.log('Running Test 2: PromptBuilder...');
const systemPrompt = PromptBuilder.buildCoachSystemPrompt(ctx);
assert(systemPrompt.includes('Nizoral 2%'), 'System prompt includes active product');
assert(systemPrompt.includes('SelfOS AI Hair Coach'), 'System prompt includes persona');
console.log('✅ Test 2 Passed');

// ---------------------------------------------------------------------------
// Test 3: Recommendation Engine Heuristics
// ---------------------------------------------------------------------------
console.log('Running Test 3: HairAIService recommendations...');
async function runAsyncTests() {
  const service = new HairAIService();
  const recs = await service.generateRecommendations(ctx);

  assert(recs.length >= 2, 'Generated multiple rule-based recommendations');
  assert(recs.some((r) => r.id === 'rec_streak'), 'Generated low streak consistency recommendation');
  assert(recs.some((r) => r.id === 'rec_condition'), 'Generated missing scalp condition assessment recommendation');
  assert(recs.some((r) => r.id === 'rec_photo'), 'Generated baseline progress photo recommendation');
  console.log('✅ Test 3 Passed');

  // Test 4: Ask Coach Q&A Response
  console.log('Running Test 4: HairAIService Q&A response...');
  const answer = await service.askCoach(ctx, 'How often should I wash my hair?');
  assert(answer.length > 20, 'Received non-empty answer from AI provider');
  console.log('✅ Test 4 Passed');

  console.log('\n=== All Batch 6F AI Hair Coach Unit Tests Passed! ===');
}

runAsyncTests().catch((err) => {
  console.error('Test Failed:', err);
  process.exit(1);
});
