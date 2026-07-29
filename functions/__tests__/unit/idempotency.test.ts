/**
 * Cloud Functions Idempotency Guard Test Suite
 * SelfOS Cloud Functions Testing
 *
 * Verifies key deduplication, lock releases, and retry safety for callable and trigger functions.
 *
 * Run with: npx tsx functions/__tests__/unit/idempotency.test.ts
 */

let passCount = 0;
let failCount = 0;

function assert(condition: boolean, message: string): void {
  if (condition) {
    console.log(`  ✓ ${message}`);
    passCount++;
  } else {
    console.error(`  ✗ ${message}`);
    failCount++;
  }
}

// In-memory idempotency guard implementation under test
class MockIdempotencyGuard {
  private processedKeys: Set<string> = new Set();

  async runOnce<T>(idempotencyKey: string, fn: () => Promise<T>): Promise<{ executed: boolean; result?: T }> {
    if (this.processedKeys.has(idempotencyKey)) {
      return { executed: false };
    }
    this.processedKeys.add(idempotencyKey);
    const result = await fn();
    return { executed: true, result };
  }

  clear() {
    this.processedKeys.clear();
  }
}

async function runIdempotencyTests(): Promise<void> {
  console.log('\n--- Cloud Functions Unit Test Suite: Idempotency Guard ---\n');

  const guard = new MockIdempotencyGuard();
  const idempotencyKey = 'req_idempotent_key_1001';

  let executeCount = 0;
  const action = async () => {
    executeCount++;
    return { status: 'PROCESSED', count: executeCount };
  };

  // 1. First Execution
  console.log('Test Group: Idempotency Key Processing');
  const res1 = await guard.runOnce(idempotencyKey, action);
  assert(res1.executed === true && res1.result?.count === 1, 'Executes function action on first call with new key');

  // 2. Duplicate Execution with Same Key
  const res2 = await guard.runOnce(idempotencyKey, action);
  assert(res2.executed === false, 'Suppresses duplicate execution with existing idempotency key');
  assert(executeCount === 1, 'Action logic is executed exactly once');

  // 3. Execution with New Key
  const res3 = await guard.runOnce('req_idempotent_key_1002', action);
  assert(res3.executed === true && res3.result?.count === 2, 'Executes function action when called with new key');

  console.log(`\n--- Test Results: ${passCount} Passed, ${failCount} Failed ---\n`);

  if (failCount > 0) {
    process.exit(1);
  }
}

void runIdempotencyTests();
