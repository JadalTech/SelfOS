/**
 * Sync Lifecycle Events
 *
 * Decoupled event system for monitoring sync process progression.
 * Consumed by background services, analytics, and debugging tools without UI coupling.
 */

import type { QueuedMutation } from '../types/mutation';
import { logger } from '../utils/logger';

export type SyncEventType = 'SYNC_STARTED' | 'ITEM_SYNCED' | 'ITEM_FAILED' | 'SYNC_COMPLETED';

export interface SyncEventDataMap {
  SYNC_STARTED: { totalItems: number; timestamp: number };
  ITEM_SYNCED: { mutation: QueuedMutation; durationMs: number };
  ITEM_FAILED: { mutation: QueuedMutation; error: string; willRetry: boolean };
  SYNC_COMPLETED: { processedCount: number; failedCount: number; durationMs: number };
}

export type SyncEventListener<T extends SyncEventType = SyncEventType> = (
  type: T,
  data: SyncEventDataMap[T]
) => void;

export class SyncEventEmitter {
  private listeners: Set<SyncEventListener> = new Set();

  /**
   * Subscribe to sync lifecycle events.
   * Returns an unsubscribe function for safe cleanup.
   */
  public subscribe(listener: SyncEventListener): () => void {
    this.listeners.add(listener);
    return () => {
      this.listeners.delete(listener);
    };
  }

  /**
   * Emit a sync lifecycle event to all subscribers.
   */
  public emit<T extends SyncEventType>(type: T, data: SyncEventDataMap[T]): void {
    for (const listener of Array.from(this.listeners)) {
      try {
        listener(type, data);
      } catch (error) {
        logger.error('SyncEventEmitter', `Error processing sync event: ${type}`, error);
      }
    }
  }

  /**
   * Clear all listeners.
   */
  public removeAllListeners(): void {
    this.listeners.clear();
  }
}

/**
 * Singleton instance of SyncEventEmitter.
 */
export const syncEventEmitter = new SyncEventEmitter();
