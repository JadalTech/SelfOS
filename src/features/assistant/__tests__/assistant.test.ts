/**
 * AI Assistant Core Layer Unit Tests
 * SelfOS v2.0.0 — Batch 13A
 *
 * Run with: npx tsx src/features/assistant/__tests__/assistant.test.ts
 */

import { agentRegistry } from '../ai/registry/AgentRegistry';
import '../ai/planner/Agents'; // Trigger self-registration
import { conversationSessionManager } from '../ai/memory/ConversationSessionManager';
import { ConversationSummarizer } from '../ai/summarizer/ConversationSummarizer';
import { IntentClassifier } from '../ai/coordinator/IntentClassifier';
import { assistantPlanner } from '../ai/coordinator/AssistantPlanner';
import { AssistantSafetyValidator } from '../ai/safety/AssistantSafetyValidator';
import { toolExecutor } from '../ai/tools/ToolExecutor';
import type { AssistantContext } from '../domain/assistant.types';

// Test harness variables
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

import { ok } from '../../../shared/types';

// Inject mock repository to avoid loading react-native imports in node test runner
toolExecutor.setRepository({
  async getLatestHealthScore() {
    return ok({ overallScore: 8 });
  },
  async getTrends() {
    return ok([]);
  },
});

// ---------------------------------------------------------------------------
// TEST CASES
// ---------------------------------------------------------------------------

describe('AgentRegistry — Specialists orchestration', () => {
  it('correctly registers and resolves specialized agents dynamically', () => {
    const agent = agentRegistry.resolve('HealthCoachAgent');
    assert(agent !== null, 'Should resolve HealthCoachAgent');
    assert(agent?.capability.name === 'HealthCoachAgent', 'Correct resolved agent name');
  });
});

describe('ConversationSessionManager — Lifecycle', () => {
  it('creates sessions and tracks expirations correctly', () => {
    const session = conversationSessionManager.createSession('user-1');
    assert(session.userId === 'user-1', 'Correct session userId');
    assert(session.isExpired === false, 'Session initially active');
  });
});

describe('ConversationSummarizer — History pruning', () => {
  it('summarizes turns list content cleanly', () => {
    const turns = [
      { turnId: '1', message: { id: 'm1', sender: 'user' as const, text: 'Hello', timestamp: new Date() } },
    ];
    const summary = ConversationSummarizer.summarize(turns);
    assert(summary.includes('User talked about'), 'Generates valid summary context');
  });
});

describe('IntentClassifier & Confidence Routing', () => {
  it('correctly classifies score and hydration intents', () => {
    const scoreIntent = IntentClassifier.classify('What is my health score?');
    assert(scoreIntent.intentType === 'ask_health_score', 'Classifies score intent');
    assert(scoreIntent.confidence >= 0.9, 'Provides high confidence score');
  });
});

describe('AssistantPlanner — routing flows', () => {
  it('routes high confidence requests directly to registry agents', async () => {
    const ctx: AssistantContext = { userId: 'user-1', healthScore: 8.0, activeStreak: 5 };
    const response = await assistantPlanner.plan(ctx, 'What is my health score?');
    assert(response.text.includes('HealthCoachAgent response'), 'Orchestrates HealthCoachAgent successfully');
  });

  it('routes low confidence requests to fallback conversation flows', async () => {
    const ctx: AssistantContext = { userId: 'user-1', healthScore: 8.0, activeStreak: 5 };
    const response = await assistantPlanner.plan(ctx, 'xyz');
    assert(response.text.includes('not sure how to assist'), 'Handles fallback routing correctly');
  });
});

describe('AssistantSafetyValidator — boundaries', () => {
  it('filters prohibited medical or diagnostic claims', () => {
    const mockResponse = {
      text: 'I can diagnose your medical insomnia symptoms.',
      followUpQuestions: [],
      actionItems: [],
      classification: { intentType: 'ask_summary' as const, confidence: 0.9 },
    };
    const sanitized = AssistantSafetyValidator.validate(mockResponse);
    assert(sanitized.text.includes('educational purposes only'), 'Sanitizes medical claims successfully');
  });
});

// ---------------------------------------------------------------------------
// RESULTS
// ---------------------------------------------------------------------------
console.log('\n' + '='.repeat(60));
console.log(`Tests complete: ${passCount} passed, ${failCount} failed`);
if (failures.length > 0) {
  console.log('\nFailures:');
  failures.forEach((f) => console.log(`  ${f}`));
}
console.log('='.repeat(60));

process.exit(failCount > 0 ? 1 : 0);
