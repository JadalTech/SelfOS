/**
 * Shared Mutation Types
 *
 * Feature-agnostic type definitions for queued offline mutations.
 */

/**
 * Standard HTTP/Database mutation operation types.
 */
export type MutationType = 'create' | 'update' | 'delete';

/**
 * Metadata for a single queued mutation.
 */
export interface QueuedMutation<TPayload = unknown> {
  /** Stable unique identifier for idempotency. */
  readonly mutationId: string;

  /** Target domain feature (e.g. 'routine', 'journal', 'task', 'user'). */
  readonly feature: string;

  /** Target domain entity (e.g. 'routine_item', 'routine_log', 'profile'). */
  readonly entity: string;

  /** Operation type: create, update, or delete. */
  readonly mutationType: MutationType;

  /** Generic JSON-serializable payload. */
  readonly payload: TPayload;

  /** Creation ISO timestamp string. */
  readonly createdAt: string;

  /** Last updated ISO timestamp string. */
  readonly updatedAt: string;

  /** Number of failed retry attempts. */
  retryCount: number;

  /** Last error message if a failure occurred. */
  lastError?: string;
}

/**
 * Context option passed to mutation execution routines.
 */
export interface MutationContext {
  readonly timestamp: number;
  readonly isReplay: boolean;
}
