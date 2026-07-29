/**
 * Sync Manager
 *
 * Coordinates offline mutation replay, exponential backoff retries,
 * reconnect triggers, and sync lifecycle events.
 * Independent of UI components.
 */

import { NetworkService, networkService } from '../offline/network-service';
import { OfflineQueue, offlineQueue } from '../queue/offline-queue';
import type { QueuedMutation } from '../types/mutation';
import { logger } from '../utils/logger';
import { MutationRegistry, mutationRegistry } from './mutation-registry';
import { SyncEventEmitter, syncEventEmitter } from './sync-events';

export interface SyncManagerOptions {
  networkService?: NetworkService;
  offlineQueue?: OfflineQueue;
  mutationRegistry?: MutationRegistry;
  syncEventEmitter?: SyncEventEmitter;
  /** Maximum number of automatic retries per mutation before halting auto-retry. Default: 5. */
  maxRetry?: number;
  /** Initial exponential backoff delay in milliseconds. Default: 1000ms. */
  initialDelayMs?: number;
  /** Maximum exponential backoff delay in milliseconds. Default: 30000ms. */
  maxDelayMs?: number;
}

export class SyncManager {
  private networkService: NetworkService;
  private offlineQueue: OfflineQueue;
  private mutationRegistry: MutationRegistry;
  private syncEventEmitter: SyncEventEmitter;
  private maxRetry: number;
  private initialDelayMs: number;
  private maxDelayMs: number;

  private isProcessing = false;
  private processedMutationIds: Set<string> = new Set();
  private unsubscribeNetwork: (() => void) | null = null;

  constructor(options: SyncManagerOptions = {}) {
    this.networkService = options.networkService || networkService;
    this.offlineQueue = options.offlineQueue || offlineQueue;
    this.mutationRegistry = options.mutationRegistry || mutationRegistry;
    this.syncEventEmitter = options.syncEventEmitter || syncEventEmitter;
    this.maxRetry = options.maxRetry ?? 5;
    this.initialDelayMs = options.initialDelayMs ?? 1000;
    this.maxDelayMs = options.maxDelayMs ?? 30000;
  }

  /**
   * Start listening for reconnect events and auto-sync opportunities.
   */
  public startListening(): void {
    if (this.unsubscribeNetwork) return;

    this.unsubscribeNetwork = this.networkService.subscribe((status) => {
      if (status === 'ONLINE') {
        logger.info('SyncManager', 'Network restored to ONLINE. Triggering sync process.');
        void this.processQueue();
      }
    });
  }

  /**
   * Stop network change listener.
   */
  public stopListening(): void {
    if (this.unsubscribeNetwork) {
      this.unsubscribeNetwork();
      this.unsubscribeNetwork = null;
    }
  }

  /**
   * Compute exponential backoff delay with random full jitter.
   */
  public calculateBackoffDelay(retryCount: number): number {
    const exponential = Math.min(
      this.maxDelayMs,
      this.initialDelayMs * Math.pow(2, retryCount)
    );
    // Apply full jitter: random value between 0 and exponential delay
    return Math.floor(Math.random() * exponential);
  }

  /**
   * Replay all pending mutations in FIFO queue.
   */
  public async processQueue(): Promise<void> {
    if (this.isProcessing) {
      logger.info('SyncManager', 'Queue processing already in progress. Skipping duplicate run.');
      return;
    }

    if (!this.networkService.isOnline()) {
      logger.info('SyncManager', 'Device is offline. Postponing queue processing.');
      return;
    }

    this.isProcessing = true;
    const startTime = Date.now();
    const mutations = await this.offlineQueue.getAll();

    if (mutations.length === 0) {
      this.isProcessing = false;
      return;
    }

    this.syncEventEmitter.emit('SYNC_STARTED', {
      totalItems: mutations.length,
      timestamp: startTime,
    });

    let processedCount = 0;
    let failedCount = 0;

    for (const mutation of mutations) {
      // Re-verify network status before each mutation replay
      if (!this.networkService.isOnline()) {
        logger.warn('SyncManager', 'Network dropped during queue replay. Halting sync cycle.');
        break;
      }

      // Idempotency check: Skip already completed mutations
      if (this.processedMutationIds.has(mutation.mutationId)) {
        logger.info('SyncManager', `Mutation ${mutation.mutationId} already processed. Dequeueing.`);
        await this.offlineQueue.remove(mutation.mutationId);
        continue;
      }

      // Halt automatic replay if max retries exceeded until manual retry
      if (mutation.retryCount >= this.maxRetry) {
        logger.warn(
          'SyncManager',
          `Mutation ${mutation.mutationId} exceeded max retries (${mutation.retryCount}/${this.maxRetry}). Preserving in queue for manual intervention.`
        );
        failedCount++;
        continue;
      }

      const itemStartTime = Date.now();
      const handler = this.mutationRegistry.getHandler(mutation);

      if (!handler) {
        logger.error(
          'SyncManager',
          `No registered handler found for mutation [${mutation.feature}:${mutation.entity}]. Preserving.`
        );
        this.syncEventEmitter.emit('ITEM_FAILED', {
          mutation,
          error: `No handler registered for ${mutation.feature}:${mutation.entity}`,
          willRetry: false,
        });
        failedCount++;
        continue;
      }

      try {
        logger.info('SyncManager', `Replaying mutation ID: ${mutation.mutationId}`);
        await handler.handle(mutation);

        // Mark as processed (Idempotency)
        this.processedMutationIds.add(mutation.mutationId);
        await this.offlineQueue.remove(mutation.mutationId);

        processedCount++;
        const durationMs = Date.now() - itemStartTime;

        this.syncEventEmitter.emit('ITEM_SYNCED', {
          mutation,
          durationMs,
        });
      } catch (error) {
        failedCount++;
        const errorMessage = error instanceof Error ? error.message : String(error);
        const newRetryCount = mutation.retryCount + 1;
        const willRetry = newRetryCount < this.maxRetry;

        logger.error(
          'SyncManager',
          `Failed to process mutation ${mutation.mutationId} (Attempt ${newRetryCount}/${this.maxRetry})`,
          error
        );

        // Update mutation state in persistent queue
        await this.offlineQueue.update({
          ...mutation,
          retryCount: newRetryCount,
          lastError: errorMessage,
        });

        this.syncEventEmitter.emit('ITEM_FAILED', {
          mutation,
          error: errorMessage,
          willRetry,
        });

        if (willRetry) {
          const backoffMs = this.calculateBackoffDelay(newRetryCount);
          logger.info('SyncManager', `Backing off for ${backoffMs}ms before continuing queue.`);
          await new Promise((resolve) => setTimeout(resolve, backoffMs));
        }
      }
    }

    const totalDurationMs = Date.now() - startTime;
    this.syncEventEmitter.emit('SYNC_COMPLETED', {
      processedCount,
      failedCount,
      durationMs: totalDurationMs,
    });

    this.isProcessing = false;
  }

  /**
   * Expose list of failed mutations that exceeded max retry limit.
   */
  public async getFailedMutations(): Promise<QueuedMutation[]> {
    const all = await this.offlineQueue.getAll();
    return all.filter((item) => item.retryCount >= this.maxRetry);
  }

  /**
   * Reset retry count for a failed mutation to enable manual re-execution.
   */
  public async retryMutation(mutationId: string): Promise<boolean> {
    const all = await this.offlineQueue.getAll();
    const target = all.find((item) => item.mutationId === mutationId);
    if (!target) return false;

    const updated = await this.offlineQueue.update({
      ...target,
      retryCount: 0,
      lastError: undefined,
    });

    if (updated && this.networkService.isOnline()) {
      void this.processQueue();
    }
    return updated;
  }

  /**
   * Check if sync manager is actively processing the queue.
   */
  public isSyncing(): boolean {
    return this.isProcessing;
  }

  /**
   * Clear idempotency cache (e.g. on user logout).
   */
  public clearIdempotencyCache(): void {
    this.processedMutationIds.clear();
  }
}

/**
 * Singleton instance of SyncManager.
 */
export const syncManager = new SyncManager();
