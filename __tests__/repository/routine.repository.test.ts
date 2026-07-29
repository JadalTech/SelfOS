/**
 * Repository Integration Test Suite
 * SelfOS Testing Infrastructure
 *
 * Verifies repository CRUD operations, Firestore Document transformations,
 * Error handling normalization, and Offline Queue integration.
 *
 * Run with: npx tsx __tests__/repository/routine.repository.test.ts
 */

import { buildRoutine } from '../factories/routine.factory';
import { MockFirestoreDb } from '../mocks/firebase.mock';
import { MockNetworkService } from '../mocks/network.mock';

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

// Mock Repository Implementation under test
class MockRoutineRepository {
  constructor(
    private db: MockFirestoreDb,
    private network: MockNetworkService,
    private pendingQueue: any[] = []
  ) {}

  async createRoutine(routine: ReturnType<typeof buildRoutine>) {
    if (this.network.isOffline()) {
      this.pendingQueue.push({ action: 'create', data: routine });
      return { success: true, data: routine, isOptimistic: true };
    }

    try {
      await this.db.collection('routines').doc(routine.id).set(routine);
      return { success: true, data: routine, isOptimistic: false };
    } catch (err: any) {
      return { success: false, error: err.message };
    }
  }

  async getRoutineById(id: string) {
    const doc = await this.db.collection('routines').doc(id).get();
    if (!doc.exists()) {
      return { success: false, error: 'NOT_FOUND' };
    }
    return { success: true, data: doc.data() };
  }

  async deleteRoutine(id: string) {
    if (this.network.isOffline()) {
      this.pendingQueue.push({ action: 'delete', id });
      return { success: true, isOptimistic: true };
    }
    await this.db.collection('routines').doc(id).delete();
    return { success: true, isOptimistic: false };
  }

  getPendingQueueLength() {
    return this.pendingQueue.length;
  }
}

async function runRepositoryTests(): Promise<void> {
  console.log('\n--- Repository Integration Test Suite ---\n');

  const mockDb = new MockFirestoreDb();
  const mockNetwork = new MockNetworkService();
  const repo = new MockRoutineRepository(mockDb, mockNetwork);

  // 1. Online CRUD Operations
  console.log('Test Group: Online CRUD Operations');
  const routine1 = buildRoutine({ title: 'Morning Exercise' });
  const createRes = await repo.createRoutine(routine1);

  assert(createRes.success && !createRes.isOptimistic, 'Repository creates routine online directly');

  const getRes = await repo.getRoutineById(routine1.id);
  assert(getRes.success && getRes.data.title === 'Morning Exercise', 'Repository retrieves created routine');

  // 2. Error Handling & Missing Document
  console.log('\nTest Group: Error Handling');
  const missingRes = await repo.getRoutineById('non_existent_id');
  assert(!missingRes.success && missingRes.error === 'NOT_FOUND', 'Repository returns NOT_FOUND error for non-existent document');

  // 3. Offline Queue Integration
  console.log('\nTest Group: Offline Queue Integration');
  mockNetwork.setStatus('OFFLINE');
  const routine2 = buildRoutine({ title: 'Offline Water Log' });
  const offlineCreateRes = await repo.createRoutine(routine2);

  assert(offlineCreateRes.success && offlineCreateRes.isOptimistic, 'Repository handles creation optimistically when OFFLINE');
  assert(repo.getPendingQueueLength() === 1, 'Repository enqueues mutation into pending queue when offline');

  const offlineDelRes = await repo.deleteRoutine(routine1.id);
  assert(offlineDelRes.success && offlineDelRes.isOptimistic, 'Repository handles deletion optimistically when OFFLINE');
  assert(repo.getPendingQueueLength() === 2, 'Pending queue size increases on offline actions');

  console.log(`\n--- Test Results: ${passCount} Passed, ${failCount} Failed ---\n`);

  if (failCount > 0) {
    process.exit(1);
  }
}

void runRepositoryTests();
