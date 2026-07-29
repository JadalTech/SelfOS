/**
 * Mutation Registry
 *
 * Strongly-typed registration mechanism for feature mutation handlers.
 * Decouples feature domain execution from the core SyncManager.
 */

import type { MutationType, QueuedMutation } from '../types/mutation';
import { logger } from '../utils/logger';

/**
 * Interface that all feature mutation handlers must implement.
 */
export interface MutationHandler<TPayload = unknown> {
  /** Feature identifier (e.g. 'routine', 'journal', 'task'). */
  readonly feature: string;

  /** Optional specific entity identifier, or '*' for all entities in feature. */
  readonly entity?: string;

  /**
   * Execute the actual backend/remote network mutation.
   * Must throw an error if the operation fails so SyncManager can handle retries.
   */
  handle(mutation: QueuedMutation<TPayload>): Promise<void>;
}

export class MutationRegistry {
  private handlers: Map<string, MutationHandler<unknown>> = new Map();

  /**
   * Format unique lookup key for a feature, entity, and mutation type.
   */
  private buildKey(feature: string, entity: string, mutationType?: MutationType): string {
    return mutationType ? `${feature}:${entity}:${mutationType}` : `${feature}:${entity}`;
  }

  /**
   * Register a strongly-typed feature handler.
   */
  public register<TPayload>(handler: MutationHandler<TPayload>): void {
    const feature = handler.feature;
    const entity = handler.entity || '*';
    const key = this.buildKey(feature, entity);

    this.handlers.set(key, handler as MutationHandler<unknown>);
    logger.info('MutationRegistry', `Registered handler for key "${key}"`);
  }

  /**
   * Register a specific handler for feature + entity + mutationType.
   */
  public registerSpecific<TPayload>(
    feature: string,
    entity: string,
    mutationType: MutationType,
    handlerFn: (mutation: QueuedMutation<TPayload>) => Promise<void>
  ): void {
    const key = this.buildKey(feature, entity, mutationType);
    this.handlers.set(key, {
      feature,
      entity,
      handle: handlerFn as (mutation: QueuedMutation<unknown>) => Promise<void>,
    });
    logger.info('MutationRegistry', `Registered specific handler for key "${key}"`);
  }

  /**
   * Retrieve registered handler for a queued mutation.
   * Fallbacks:
   * 1. Exact match: feature:entity:mutationType
   * 2. Entity match: feature:entity
   * 3. Feature wildcard: feature:*
   */
  public getHandler(mutation: QueuedMutation): MutationHandler<unknown> | null {
    const exactKey = this.buildKey(mutation.feature, mutation.entity, mutation.mutationType);
    if (this.handlers.has(exactKey)) {
      return this.handlers.get(exactKey)!;
    }

    const entityKey = this.buildKey(mutation.feature, mutation.entity);
    if (this.handlers.has(entityKey)) {
      return this.handlers.get(entityKey)!;
    }

    const wildcardKey = this.buildKey(mutation.feature, '*');
    if (this.handlers.has(wildcardKey)) {
      return this.handlers.get(wildcardKey)!;
    }

    return null;
  }

  /**
   * Check if a handler is registered for a given feature and entity.
   */
  public hasHandler(feature: string, entity: string): boolean {
    return (
      this.handlers.has(this.buildKey(feature, entity)) ||
      this.handlers.has(this.buildKey(feature, '*'))
    );
  }

  /**
   * Clear all registered handlers (mainly for testing).
   */
  public clear(): void {
    this.handlers.clear();
  }
}

/**
 * Singleton instance of MutationRegistry.
 */
export const mutationRegistry = new MutationRegistry();
