/**
 * Offline Infrastructure Unit Tests
 * SelfOS Offline-First Suite
 *
 * Verifies NetworkService, OfflineQueue, SyncManager, MutationRegistry,
 * SyncEventEmitter, OptimisticHelpers, and OfflineCoordinator.
 *
 * Run with: npx tsx src/shared/offline/__tests__/offline-infrastructure.test.ts
 */

import { NetworkService } from '../network-service';
import { OfflineQueue } from '../../queue/offline-queue';
import { SyncManager } from '../../sync/sync-manager';
import { MutationRegistry, MutationHandler } from '../../sync/mutation-registry';
import { SyncEventEmitter } from '../../sync/sync-events';
import { OfflineCoordinator } from '../offline-coordinator';
import type { StorageService } from '../../storage';
import type { QueuedMutation } from '../../types/mutation';

// In-Memory StorageService mock for testing persistence
class MemoryStorageService implements StorageService {
  private data: Map<string, string> = new Map();

  async get(key: string): Promise<string | null> {
    return this.data.get(key) || null;
  }

  async set(key: string, value: string): Promise<void> {
    this.data.set(key, value);
  }

  async remove(key: string): Promise<void> {
    this.data.delete(key);
  }

  async clear(): Promise<void> {
    this.data.clear();
  }

  async contains(key: string): Promise<boolean> {
    return this.data.has(key);
  }

  async getObject<T>(key: string): Promise<T | null> {
    const raw = this.data.get(key);
    return raw ? (JSON.parse(raw) as T) : null;
  }

  async setObject<T>(key: string, value: T): Promise<void> {
    this.data.set(key, JSON.stringify(value));
  }
}

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

async function runTests(): Promise<void> {
  console.log('\n--- Offline Infrastructure Unit Test Suite ---\n');

  // 1. NetworkService Tests
  console.log('Test Group: NetworkService');
  const net = new NetworkService();
  assert(net.getStatus() === 'ONLINE', 'NetworkService initializes with ONLINE status');
  assert(net.isOnline() === true, 'isOnline() returns true initially');

  let receivedStatus = '';
  const unsubscribe = net.subscribe((status) => {
    receivedStatus = status;
  });
  assert(receivedStatus === 'ONLINE', 'Subscriber receives initial ONLINE status');

  net.setStatus('OFFLINE');
  assert(receivedStatus === 'OFFLINE', 'Subscriber notified of OFFLINE status');
  assert(net.isOffline() === true, 'isOffline() returns true when OFFLINE');

  unsubscribe();
  net.setStatus('ONLINE');
  assert(receivedStatus === 'OFFLINE', 'Unsubscribed listener ignored subsequent status updates');

  // 2. OfflineQueue Tests
  console.log('\nTest Group: OfflineQueue');
  const mockStorage = new MemoryStorageService();
  const queue = new OfflineQueue(mockStorage);

  const m1: QueuedMutation<{ title: string }> = {
    mutationId: 'm1',
    feature: 'routine',
    entity: 'item',
    mutationType: 'create',
    payload: { title: 'Test Routine' },
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    retryCount: 0,
  };

  await queue.enqueue(m1);
  assert((await queue.size()) === 1, 'Queue enqueues item correctly');

  const peeked = await queue.peek();
  assert(peeked?.mutationId === 'm1', 'Peek returns correct item without dequeuing');

  const m2: QueuedMutation = {
    mutationId: 'm2',
    feature: 'routine',
    entity: 'item',
    mutationType: 'update',
    payload: {},
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    retryCount: 0,
  };

  await queue.enqueue(m2);
  const dequeued = await queue.dequeue();
  assert(dequeued?.mutationId === 'm1', 'Dequeue returns first item in FIFO order');
  assert((await queue.size()) === 1, 'Size decreases after dequeue');

  await queue.clear();
  assert((await queue.size()) === 0, 'Clear wipes queue completely');

  // 3. MutationRegistry Tests
  console.log('\nTest Group: MutationRegistry');
  const registry = new MutationRegistry();
  let handled = false;
  const mockHandler: MutationHandler = {
    feature: 'routine',
    entity: 'item',
    handle: async () => {
      handled = true;
    },
  };

  registry.register(mockHandler);
  const resolved = registry.getHandler(m1);
  assert(resolved === mockHandler, 'MutationRegistry resolves registered handler by feature & entity');

  // 4. SyncManager & SyncEventEmitter Tests
  console.log('\nTest Group: SyncManager & SyncEventEmitter');
  const netService = new NetworkService();
  const queue2 = new OfflineQueue(new MemoryStorageService());
  const registry2 = new MutationRegistry();
  const emitter = new SyncEventEmitter();

  const syncMgr = new SyncManager({
    networkService: netService,
    offlineQueue: queue2,
    mutationRegistry: registry2,
    syncEventEmitter: emitter,
    maxRetry: 2,
    initialDelayMs: 10,
    maxDelayMs: 50,
  });

  let syncStarted = false;
  let syncCompleted = false;

  emitter.subscribe((type) => {
    if (type === 'SYNC_STARTED') syncStarted = true;
    if (type === 'SYNC_COMPLETED') syncCompleted = true;
  });

  registry2.register({
    feature: 'routine',
    entity: 'item',
    handle: async () => {},
  });

  await queue2.enqueue(m1);
  await syncMgr.processQueue();

  assert((await queue2.size()) === 0, 'SyncManager replays queue and removes completed mutation');
  assert(syncStarted && syncCompleted, 'SyncEventEmitter emits SYNC_STARTED and SYNC_COMPLETED events');

  // 5. OfflineCoordinator Tests
  console.log('\nTest Group: OfflineCoordinator');
  const netService3 = new NetworkService();
  const queue3 = new OfflineQueue(new MemoryStorageService());
  const coordinator = new OfflineCoordinator(netService3, queue3);

  netService3.setStatus('ONLINE');
  let remoteRan = false;
  const onlineResult = await coordinator.execute({
    feature: 'journal',
    entity: 'entry',
    mutationType: 'create',
    payload: { title: 'Online Entry' },
    remoteAction: async () => {
      remoteRan = true;
      return 'remote_ok';
    },
  });

  assert(onlineResult.success && remoteRan, 'OfflineCoordinator executes remote action when ONLINE');

  netService3.setStatus('OFFLINE');
  const offlineResult = await coordinator.execute({
    feature: 'journal',
    entity: 'entry',
    mutationType: 'create',
    payload: { id: 'temp_1', title: 'Offline Entry' },
    remoteAction: async () => 'remote_ok',
    optimisticResult: (payload) => payload.id,
  });

  assert(
    offlineResult.success && (await queue3.size()) === 1,
    'OfflineCoordinator enqueues mutation into queue when OFFLINE'
  );

  console.log(`\n--- Test Results: ${passCount} Passed, ${failCount} Failed ---\n`);

  if (failCount > 0) {
    process.exit(1);
  }
}

void runTests();
