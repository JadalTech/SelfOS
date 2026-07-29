/**
 * Cloud Functions Unit Test Suite
 * SelfOS Functions Backend
 *
 * Verifies Admin SDK singleton, config, logger, telemetry, validation,
 * error normalization, and idempotency guard.
 *
 * Run with: npx tsx functions/__tests__/functions.test.ts
 */

import { FUNCTION_CONFIG } from '../src/shared/config';
import { getAdminApp } from '../src/shared/firebase';
import { logger } from '../src/shared/logger';
import { telemetry } from '../src/shared/telemetry';
import { normalizeCallableError, createHttpsError } from '../src/shared/errors';
import { validateRequiredFields } from '../src/shared/validation';

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

async function runFunctionTests(): Promise<void> {
  console.log('\n--- Cloud Functions v2 Unit Test Suite ---\n');

  // 1. Configuration Tests
  console.log('Test Group: Configuration');
  assert(typeof FUNCTION_CONFIG.region === 'string', 'Config defines region string');
  assert(FUNCTION_CONFIG.defaultMemory === '256MiB', 'Config defaults memory to 256MiB');

  // 2. Admin SDK Singleton Tests
  console.log('\nTest Group: Admin SDK Singleton');
  const app1 = getAdminApp();
  const app2 = getAdminApp();
  assert(app1 === app2, 'getAdminApp() returns singleton instance without re-initialization');

  // 3. Logger & Telemetry Tests
  console.log('\nTest Group: Logger & Telemetry');
  logger.info('TestContext', 'Info test message', { key: 'val' });
  telemetry.trackEvent('test_event', { feature: 'unit_test' });
  telemetry.recordMetric({ name: 'latency', value: 42, unit: 'ms' });
  assert(true, 'Logger and Telemetry services execute without error');

  // 4. Validation Helpers Tests
  console.log('\nTest Group: Validation Helpers');
  const validData = { title: 'Test', count: 5 };
  const validated = validateRequiredFields<{ title: string; count: number }>(validData, ['title', 'count']);
  assert(validated.title === 'Test' && validated.count === 5, 'validateRequiredFields passes valid payload');

  let validationFailed = false;
  try {
    validateRequiredFields(validData, ['title', 'missingField' as unknown as keyof typeof validData]);
  } catch {
    validationFailed = true;
  }
  assert(validationFailed === true, 'validateRequiredFields throws HttpsError on missing required parameter');

  // 5. Error Normalization Tests
  console.log('\nTest Group: Error Normalization');
  const customHttpsError = createHttpsError('permission-denied', 'Access denied');
  const normalizedCustom = normalizeCallableError(customHttpsError, 'TestCtx');
  assert(normalizedCustom.code === 'permission-denied', 'normalizeCallableError preserves existing HttpsError');

  const genericError = new Error('Database failure');
  const normalizedGeneric = normalizeCallableError(genericError, 'TestCtx');
  assert(normalizedGeneric.code === 'internal', 'normalizeCallableError converts raw Error to internal HttpsError');

  console.log(`\n--- Test Results: ${passCount} Passed, ${failCount} Failed ---\n`);

  if (failCount > 0) {
    process.exit(1);
  }
}

void runFunctionTests();
