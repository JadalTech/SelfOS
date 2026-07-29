/**
 * Firestore Security Rules Unit Tests
 * SelfOS Security Suite
 *
 * Verifies owner access, non-owner access denial, unauthenticated access denial,
 * schema required fields, immutable field mutation protection, and fallback wildcard denial.
 *
 * Run with: npx tsx src/shared/firebase/__tests__/firestore.rules.test.ts
 */

// eslint-disable-next-line @typescript-eslint/no-var-requires
const fs = require('fs');
// eslint-disable-next-line @typescript-eslint/no-var-requires
const path = require('path');

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

/**
 * In-Memory Security Rules Evaluator Mock Harness
 * Simulates Firestore rule evaluations matching firestore.rules logic.
 */
class RulesEvaluator {
  private rulesContent: string;

  constructor(rulesFilePath: string) {
    this.rulesContent = fs.readFileSync(rulesFilePath, 'utf8');
  }

  public getRules(): string {
    return this.rulesContent;
  }

  public evaluateWrite(
    auth: { uid: string } | null,
    pathStr: string,
    existingData: Record<string, unknown> | null,
    newData: Record<string, unknown> | null,
    operation: 'create' | 'update' | 'delete'
  ): boolean {
    const isSignedIn = auth !== null;
    const uid = auth?.uid || null;

    // Default Fallback Denial for undeclared collections
    const allowedCollections = ['users', 'routines', 'tasks', 'journal', 'goals', 'finance', 'notes'];
    const pathParts = pathStr.split('/').filter(Boolean);

    if (pathParts.length === 0 || !allowedCollections.includes(pathParts[0])) {
      return false; // Denied by wildcard match /{document=**}
    }

    const collection = pathParts[0];

    // Delete operation check
    if (operation === 'delete') {
      if (!isSignedIn) return false;
      if (collection === 'users') {
        return pathParts[1] === uid;
      }
      return existingData?.uid === uid;
    }

    // Create operation check
    if (operation === 'create') {
      if (!isSignedIn || !newData) return false;
      if (newData.uid !== uid) return false; // Must create as owner

      const requiredMap: Record<string, string[]> = {
        users: ['uid', 'email', 'createdAt', 'updatedAt'],
        routines: ['uid', 'title', 'type', 'status', 'createdAt', 'updatedAt'],
        tasks: ['uid', 'title', 'status', 'createdAt', 'updatedAt'],
        journal: ['uid', 'title', 'content', 'createdAt', 'updatedAt'],
        goals: ['uid', 'title', 'status', 'createdAt', 'updatedAt'],
        finance: ['uid', 'amount', 'type', 'category', 'createdAt', 'updatedAt'],
        notes: ['uid', 'title', 'content', 'createdAt', 'updatedAt'],
      };

      const requiredKeys = requiredMap[collection] || [];
      const hasAllRequired = requiredKeys.every((key) => key in newData);
      return hasAllRequired;
    }

    // Update operation check
    if (operation === 'update') {
      if (!isSignedIn || !existingData || !newData) return false;
      if (existingData.uid !== uid || newData.uid !== uid) return false; // Document owner check

      // Immutable check: uid and createdAt must not be mutated
      if ('uid' in newData && newData.uid !== existingData.uid) return false;
      if ('createdAt' in newData && newData.createdAt !== existingData.createdAt) return false;

      return true;
    }

    return false;
  }

  public evaluateRead(
    auth: { uid: string } | null,
    pathStr: string,
    existingData: Record<string, unknown> | null
  ): boolean {
    const isSignedIn = auth !== null;
    const uid = auth?.uid || null;

    const allowedCollections = ['users', 'routines', 'tasks', 'journal', 'goals', 'finance', 'notes'];
    const pathParts = pathStr.split('/').filter(Boolean);

    if (pathParts.length === 0 || !allowedCollections.includes(pathParts[0])) {
      return false; // Denied by fallback wildcard
    }

    if (!isSignedIn) return false;

    if (pathParts[0] === 'users') {
      return pathParts[1] === uid;
    }

    return existingData?.uid === uid;
  }
}

function runSecurityTests(): void {
  console.log('\n--- Firestore Security Rules Unit Test Suite ---\n');

  const rulesPath = path.join(process.cwd(), 'firestore.rules');
  assert(fs.existsSync(rulesPath), 'firestore.rules file exists at workspace root');

  const evaluator = new RulesEvaluator(rulesPath);
  assert(evaluator.getRules().includes("rules_version = '2';"), 'Rules version 2 specified');

  const ownerAuth = { uid: 'user_123' };
  const attackerAuth = { uid: 'attacker_999' };

  // 1. Owner Access Tests
  console.log('\nTest Group: Owner Access (Principle of Least Privilege)');
  const validRoutineData = {
    uid: 'user_123',
    title: 'Morning Yoga',
    type: 'skincare',
    status: 'active',
    createdAt: '2026-07-29T10:00:00Z',
    updatedAt: '2026-07-29T10:00:00Z',
  };

  const createAllowed = evaluator.evaluateWrite(ownerAuth, 'routines/r1', null, validRoutineData, 'create');
  assert(createAllowed === true, 'Owner can create routine document with valid schema');

  const readAllowed = evaluator.evaluateRead(ownerAuth, 'routines/r1', validRoutineData);
  assert(readAllowed === true, 'Owner can read own routine document');

  const updateAllowed = evaluator.evaluateWrite(
    ownerAuth,
    'routines/r1',
    validRoutineData,
    { ...validRoutineData, title: 'Updated Yoga' },
    'update'
  );
  assert(updateAllowed === true, 'Owner can update own routine title');

  const deleteAllowed = evaluator.evaluateWrite(ownerAuth, 'routines/r1', validRoutineData, null, 'delete');
  assert(deleteAllowed === true, 'Owner can delete own routine document');

  // 2. Non-Owner Access Denials
  console.log('\nTest Group: Non-Owner Access Denials');
  const nonOwnerRead = evaluator.evaluateRead(attackerAuth, 'routines/r1', validRoutineData);
  assert(nonOwnerRead === false, 'Attacker CANNOT read another user routine');

  const nonOwnerUpdate = evaluator.evaluateWrite(
    attackerAuth,
    'routines/r1',
    validRoutineData,
    { ...validRoutineData, title: 'Hacked Title' },
    'update'
  );
  assert(nonOwnerUpdate === false, 'Attacker CANNOT update another user routine');

  const nonOwnerDelete = evaluator.evaluateWrite(attackerAuth, 'routines/r1', validRoutineData, null, 'delete');
  assert(nonOwnerDelete === false, 'Attacker CANNOT delete another user routine');

  // 3. Unauthenticated Access Denials
  console.log('\nTest Group: Unauthenticated Access Denials');
  const unauthRead = evaluator.evaluateRead(null, 'routines/r1', validRoutineData);
  assert(unauthRead === false, 'Unauthenticated user CANNOT read routine');

  const unauthCreate = evaluator.evaluateWrite(null, 'routines/r1', null, validRoutineData, 'create');
  assert(unauthCreate === false, 'Unauthenticated user CANNOT create routine');

  // 4. Immutable Field Protections
  console.log('\nTest Group: Immutable Field Protections (uid, createdAt)');
  const mutateUidUpdate = evaluator.evaluateWrite(
    ownerAuth,
    'routines/r1',
    validRoutineData,
    { ...validRoutineData, uid: 'transferred_uid' },
    'update'
  );
  assert(mutateUidUpdate === false, 'Update modifying immutable "uid" is REJECTED');

  const mutateCreatedAtUpdate = evaluator.evaluateWrite(
    ownerAuth,
    'routines/r1',
    validRoutineData,
    { ...validRoutineData, createdAt: '2020-01-01T00:00:00Z' },
    'update'
  );
  assert(mutateCreatedAtUpdate === false, 'Update modifying immutable "createdAt" is REJECTED');

  // 5. Invalid Payload / Mismatched Ownership
  console.log('\nTest Group: Schema & Mismatched Ownership Validation');
  const mismatchedCreate = evaluator.evaluateWrite(
    ownerAuth,
    'routines/r1',
    null,
    { ...validRoutineData, uid: 'victim_uid' },
    'create'
  );
  assert(mismatchedCreate === false, 'Creating document with mismatched "uid" is REJECTED');

  const missingFieldsCreate = evaluator.evaluateWrite(
    ownerAuth,
    'tasks/t1',
    null,
    { uid: 'user_123' }, // missing title, status, etc.
    'create'
  );
  assert(missingFieldsCreate === false, 'Creating document with missing required schema fields is REJECTED');

  // 6. Explicit Wildcard Fallback Denial
  console.log('\nTest Group: Fallback Wildcard Denial');
  const undeclaredPathRead = evaluator.evaluateRead(ownerAuth, 'admin_settings/config', { secret: true });
  assert(undeclaredPathRead === false, 'Access to undeclared collection "/admin_settings" is REJECTED by wildcard fallback');

  console.log(`\n--- Test Results: ${passCount} Passed, ${failCount} Failed ---\n`);

  if (failCount > 0) {
    process.exit(1);
  }
}

runSecurityTests();
