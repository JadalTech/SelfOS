/**
 * AI Assistant UI Layer Unit Tests
 * SelfOS v2.0.0 — Batch 13B
 *
 * Run with: npx tsx src/features/assistant/__tests__/assistant.ui.test.ts
 */

import { assistantWidgetRegistry } from '../presentation/registry/AssistantWidgetRegistry';
import { AssistantResponseMapper } from '../presentation/mappers/AssistantResponseMapper';
import { ConversationLayoutManager } from '../presentation/managers/ConversationLayoutManager';
import type { AssistantResponse } from '../domain/assistant.types';

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

describe('AssistantWidgetRegistry — Card Configs', () => {
  it('correctly registers default enabled response cards', () => {
    const list = assistantWidgetRegistry.getRegisteredCards();
    assert(list.length === 3, `Expected 3 default registered cards, got ${list.length}`);
    assert(list[0].cardName === 'HealthScoreCard', 'Correct first ordered card');
  });
});

describe('AssistantResponseMapper — presentation formatting', () => {
  it('maps assistant response domain entities to UI props', () => {
    const domainResponse: AssistantResponse = {
      text: 'Here is your summary.',
      followUpQuestions: ['Should I adjust my sleep schedule?'],
      actionItems: [{ id: '1', description: 'Drink water', priority: 'high' }],
      classification: { intentType: 'ask_summary', confidence: 0.95 },
    };

    const vm = AssistantResponseMapper.toVM(domainResponse);
    assert(vm.text === 'Here is your summary.', 'Correct text');
    assert(vm.actionItemsCountLabel === '1 Actions', 'Correct actions count label');
    assert(vm.confidenceLabel === '95% Confidence', 'Correct confidence percentage string');
  });
});

describe('ConversationLayoutManager — offsets', () => {
  it('calculates keyboard vertical offsets', () => {
    const offset = ConversationLayoutManager.getKeyboardVerticalOffset();
    assert(offset === 90, 'Returns correct offset representation');
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
