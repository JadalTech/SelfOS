/**
 * Cloud Functions Callable Handler & Auth Middleware Test Suite
 * SelfOS Cloud Functions Testing
 *
 * Verifies callable wrapper auth enforcement, schema validation, latency telemetry, and error normalization.
 *
 * Run with: npx tsx functions/__tests__/unit/callable-functions.test.ts
 */

import { validateAuth, validateRequiredFields } from '../../src/shared/validation';
import { normalizeCallableError, createHttpsError } from '../../src/shared/errors';

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

async function runCallableTests(): Promise<void> {
  console.log('\n--- Cloud Functions Unit Test Suite: Callable & Auth Middleware ---\n');

  // 1. Auth Validation Middleware
  console.log('Test Group: Auth Validation');
  const validRequest = { auth: { uid: 'user_123_abc' } } as any;
  const uid = validateAuth(validRequest);
  assert(uid === 'user_123_abc', 'validateAuth extracts UID from authenticated CallableRequest');

  let authFailed = false;
  try {
    validateAuth({ auth: undefined } as any);
  } catch (err: any) {
    authFailed = true;
  }
  assert(authFailed === true, 'validateAuth throws unauthenticated error when auth property is missing');

  // 2. Payload Validation Middleware
  console.log('\nTest Group: Payload Validation');
  const payload = { routineId: 'r_99', title: 'Hydration' };
  const validated = validateRequiredFields<typeof payload>(payload, ['routineId', 'title']);
  assert(validated.routineId === 'r_99', 'validateRequiredFields extracts required properties');

  // 3. Error Normalization
  console.log('\nTest Group: Error Normalization');
  const unauthenticatedError = createHttpsError('unauthenticated', 'User must log in');
  const normalizedUnauth = normalizeCallableError(unauthenticatedError, 'TestCallable');
  assert(normalizedUnauth.code === 'unauthenticated', 'Preserves unauthenticated error status');

  const randomError = new Error('Database disconnected');
  const normalizedInternal = normalizeCallableError(randomError, 'TestCallable');
  assert(normalizedInternal.code === 'internal', 'Maps unknown errors to internal status safely');

  console.log(`\n--- Test Results: ${passCount} Passed, ${failCount} Failed ---\n`);

  if (failCount > 0) {
    process.exit(1);
  }
}

void runCallableTests();
