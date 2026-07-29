/**
 * Offline Coordinator
 *
 * Composition helper enabling repositories to opt-into offline execution
 * without inheriting from base repository classes.
 * Architecture: Repository -> OfflineCoordinator -> Firestore/Remote Service
 */

import { AppError } from '../errors';
import { NetworkService, networkService } from './network-service';
import { OfflineQueue, offlineQueue } from '../queue/offline-queue';
import { err, ok } from '../types';
import type { Result } from '../types';
import type { MutationType, QueuedMutation } from '../types/mutation';
import { logger } from '../utils/logger';

export interface ExecuteOfflineOptions<TPayload, TResult> {
  /** Feature domain identifier (e.g. 'routine', 'journal', 'task'). */
  feature: string;

  /** Target domain entity (e.g. 'routine_item', 'task_entry'). */
  entity: string;

  /** Mutation operation type: create, update, or delete. */
  mutationType: MutationType;

  /** Mutation payload to enqueue if offline. */
  payload: TPayload;

  /** Remote service execution routine when online. */
  remoteAction: () => Promise<TResult>;

  /** Optional optimistic result transformer when executing offline. */
  optimisticResult?: (payload: TPayload) => TResult;
}

export class OfflineCoordinator {
  private networkService: NetworkService;
  private offlineQueue: OfflineQueue;

  constructor(
    networkServiceInstance: NetworkService = networkService,
    offlineQueueInstance: OfflineQueue = offlineQueue
  ) {
    this.networkService = networkServiceInstance;
    this.offlineQueue = offlineQueueInstance;
  }

  /**
   * Execute a write operation with composition-based offline support.
   *
   * Flow:
   * - If ONLINE: Executes `remoteAction()` immediately.
   * - If OFFLINE: Enqueues mutation into `OfflineQueue` and returns optimistic success result.
   */
  public async execute<TPayload, TResult>(
    options: ExecuteOfflineOptions<TPayload, TResult>
  ): Promise<Result<TResult>> {
    const { feature, entity, mutationType, payload, remoteAction, optimisticResult } = options;

    if (this.networkService.isOnline()) {
      try {
        const data = await remoteAction();
        return ok(data);
      } catch (error) {
        logger.error('OfflineCoordinator', `Remote write failed for ${feature}:${entity}`, error);
        return err(
          error instanceof AppError
            ? error
            : AppError.unknown(`Failed to execute remote action for ${feature}:${entity}`)
        );
      }
    }

    // Device is OFFLINE: Enqueue mutation for asynchronous replay
    const mutationId = `${feature}_${entity}_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
    const now = new Date().toISOString();

    const queuedMutation: QueuedMutation<TPayload> = {
      mutationId,
      feature,
      entity,
      mutationType,
      payload,
      createdAt: now,
      updatedAt: now,
      retryCount: 0,
    };

    try {
      await this.offlineQueue.enqueue(queuedMutation);
      logger.info(
        'OfflineCoordinator',
        `Device offline. Mutation enqueued [${feature}:${entity}:${mutationType}] ID: ${mutationId}`
      );

      const fallbackResult = optimisticResult
        ? optimisticResult(payload)
        : (payload as unknown as TResult);

      return ok(fallbackResult);
    } catch (enqueueError) {
      logger.error('OfflineCoordinator', 'Failed to enqueue offline mutation', enqueueError);
      return err(AppError.storage('Failed to store mutation for offline sync.'));
    }
  }

  /**
   * Check if network is currently connected.
   */
  public isOnline(): boolean {
    return this.networkService.isOnline();
  }
}

/**
 * Singleton instance of OfflineCoordinator.
 */
export const offlineCoordinator = new OfflineCoordinator();
