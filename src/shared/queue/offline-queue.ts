/**
 * Offline Queue
 *
 * Persistent FIFO queue for offline mutations powered by StorageService.
 * Ensures queued operations survive application restarts and crashes.
 */

import type { StorageService } from '../storage';
import { storage } from '../storage';
import type { QueuedMutation } from '../types/mutation';
import { logger } from '../utils/logger';

export const OFFLINE_QUEUE_STORAGE_KEY = '@selfos/offline_mutation_queue';

export class OfflineQueue {
  private queue: QueuedMutation[] = [];
  private isInitialized = false;
  private storageService: StorageService;

  constructor(storageService: StorageService = storage) {
    this.storageService = storageService;
  }

  /**
   * Initialize the queue by loading persisted mutations from storage.
   */
  public async initialize(): Promise<void> {
    if (this.isInitialized) return;

    try {
      const persisted = await this.storageService.getObject<QueuedMutation[]>(
        OFFLINE_QUEUE_STORAGE_KEY
      );
      if (Array.isArray(persisted)) {
        this.queue = persisted;
      } else {
        this.queue = [];
      }
      this.isInitialized = true;
      logger.info('OfflineQueue', `Initialized with ${this.queue.length} pending mutations.`);
    } catch (error) {
      logger.error('OfflineQueue', 'Failed to initialize offline queue from storage', error);
      this.queue = [];
      this.isInitialized = true;
    }
  }

  /**
   * Persist current in-memory queue to storage.
   */
  private async persist(): Promise<void> {
    try {
      await this.storageService.setObject(OFFLINE_QUEUE_STORAGE_KEY, this.queue);
    } catch (error) {
      logger.error('OfflineQueue', 'Failed to persist queue to storage', error);
    }
  }

  /**
   * Add a new mutation to the end of the queue.
   */
  public async enqueue<T>(mutation: QueuedMutation<T>): Promise<void> {
    await this.initialize();

    // Avoid duplicate mutationId enqueueing
    const existingIndex = this.queue.findIndex((item) => item.mutationId === mutation.mutationId);
    if (existingIndex !== -1) {
      logger.warn(
        'OfflineQueue',
        `Mutation with ID "${mutation.mutationId}" already queued. Skipping.`
      );
      return;
    }

    this.queue.push(mutation as QueuedMutation);
    await this.persist();
    logger.info(
      'OfflineQueue',
      `Enqueued mutation [${mutation.feature}:${mutation.entity}:${mutation.mutationType}] ID: ${mutation.mutationId}`
    );
  }

  /**
   * Retrieve and remove the next mutation at the head of the queue.
   */
  public async dequeue(): Promise<QueuedMutation | null> {
    await this.initialize();

    if (this.queue.length === 0) return null;

    const item = this.queue.shift() || null;
    await this.persist();
    return item;
  }

  /**
   * View the head mutation without removing it from the queue.
   */
  public async peek(): Promise<QueuedMutation | null> {
    await this.initialize();
    return this.queue.length > 0 ? this.queue[0] : null;
  }

  /**
   * Remove a specific mutation by mutationId.
   */
  public async remove(mutationId: string): Promise<boolean> {
    await this.initialize();

    const initialLength = this.queue.length;
    this.queue = this.queue.filter((item) => item.mutationId !== mutationId);

    const removed = this.queue.length < initialLength;
    if (removed) {
      await this.persist();
      logger.info('OfflineQueue', `Removed mutation ID: ${mutationId}`);
    }
    return removed;
  }

  /**
   * Clear all mutations from the queue.
   */
  public async clear(): Promise<void> {
    await this.initialize();
    this.queue = [];
    await this.persist();
    logger.info('OfflineQueue', 'Cleared all offline mutations.');
  }

  /**
   * Retrieve all currently queued mutations.
   */
  public async getAll(): Promise<QueuedMutation[]> {
    await this.initialize();
    return [...this.queue];
  }

  /**
   * Update an existing queued mutation (e.g. increment retryCount or error state).
   */
  public async update(updatedMutation: QueuedMutation): Promise<boolean> {
    await this.initialize();

    const index = this.queue.findIndex((item) => item.mutationId === updatedMutation.mutationId);
    if (index === -1) return false;

    this.queue[index] = {
      ...updatedMutation,
      updatedAt: new Date().toISOString(),
    };
    await this.persist();
    return true;
  }

  /**
   * Get the current count of queued mutations.
   */
  public async size(): Promise<number> {
    await this.initialize();
    return this.queue.length;
  }
}

/**
 * Singleton instance of OfflineQueue.
 */
export const offlineQueue = new OfflineQueue();
