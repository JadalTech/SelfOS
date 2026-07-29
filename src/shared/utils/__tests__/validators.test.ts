/**
 * Unit Test Suite: Shared Validators & Helpers
 * SelfOS Testing Infrastructure
 *
 * Verifies email, password, displayName schemas, validateWith helper, clamp, capitalize, truncate, and date utilities.
 * Run with: npx tsx src/shared/utils/__tests__/validators.test.ts
 */

import { emailSchema, passwordSchema, displayNameSchema, validateWith } from '../validation';
import { clamp, capitalize, truncate, isNonNullable } from '../helpers';
import { isToday, startOfDay, endOfDay } from '../date';

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

async function runValidatorTests(): Promise<void> {
  console.log('\n--- Unit Test Suite: Shared Validators & Utilities ---\n');

  // 1. Zod Validation Schemas
  console.log('Test Group: Validation Schemas');
  const validEmail = validateWith(emailSchema, 'user@selfos.app');
  assert(validEmail.success === true, 'validateWith passes valid email address');

  const invalidEmail = validateWith(emailSchema, 'not-an-email');
  assert(invalidEmail.success === false, 'validateWith rejects invalid email string');

  const validPassword = validateWith(passwordSchema, 'secure123');
  assert(validPassword.success === true, 'validateWith passes password >= 6 characters');

  const shortPassword = validateWith(passwordSchema, '12345');
  assert(shortPassword.success === false, 'validateWith rejects password < 6 characters');

  const validName = validateWith(displayNameSchema, 'Alex Developer');
  assert(validName.success === true && validName.data === 'Alex Developer', 'validateWith trims and accepts valid name');

  // 2. Helper Functions
  console.log('\nTest Group: Helper Utilities');
  assert(clamp(15, 0, 10) === 10, 'clamp restricts value to upper boundary');
  assert(clamp(-5, 0, 10) === 0, 'clamp restricts value to lower boundary');
  assert(capitalize('routine') === 'Routine', 'capitalize upper-cases first letter');
  assert(truncate('SelfOS Comprehensive Platform', 10) === 'SelfOS Co…', 'truncate truncates string and appends ellipsis');

  const mixedArray = [1, null, 2, undefined, 3];
  const cleaned = mixedArray.filter(isNonNullable);
  assert(cleaned.length === 3 && cleaned.reduce((a, b) => a + b, 0) === 6, 'isNonNullable removes null and undefined');

  // 3. Date Utilities
  console.log('\nTest Group: Date Utilities');
  const now = new Date();
  assert(isToday(now) === true, 'isToday returns true for current Date');
  const start = startOfDay(now);
  assert(start.getHours() === 0 && start.getMinutes() === 0, 'startOfDay resets time to 00:00:00');
  const end = endOfDay(now);
  assert(end.getHours() === 23 && end.getMinutes() === 59, 'endOfDay sets time to 23:59:59');

  console.log(`\n--- Test Results: ${passCount} Passed, ${failCount} Failed ---\n`);

  if (failCount > 0) {
    process.exit(1);
  }
}

void runValidatorTests();
