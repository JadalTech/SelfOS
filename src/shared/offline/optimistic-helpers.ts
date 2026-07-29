/**
 * Optimistic Update Helpers
 *
 * Generic React Query optimistic UI mutation helpers.
 * Handles cache snapshots, optimistic state updates, automatic rollbacks on error,
 * and cache invalidation on completion. Completely feature-agnostic.
 */

import type { QueryClient, QueryKey } from '@tanstack/react-query';
import { logger } from '../utils/logger';

export interface OptimisticMutationOptions<TData, TVariables> {
  /** React Query Client instance. */
  queryClient: QueryClient;

  /** Target React Query Key to optimistically update. */
  queryKey: QueryKey;

  /** Pure transformer function producing optimistically updated cached data. */
  updateFn: (oldData: TData | undefined, variables: TVariables) => TData;

  /** Optional callback executed on error before cache rollback. */
  onError?: (error: unknown, variables: TVariables, snapshot: TData | undefined) => void;

  /** Optional callback executed when mutation settles (success or error). */
  onSettled?: (variables: TVariables) => void;
}

export interface OptimisticMutationResult<TData, TVariables> {
  onMutate: (variables: TVariables) => Promise<{ previousData: TData | undefined }>;
  onError: (error: unknown, variables: TVariables, context: { previousData: TData | undefined } | undefined) => void;
  onSettled: (data: unknown, error: unknown, variables: TVariables) => void;
}

/**
 * Creates React Query mutation option handlers (`onMutate`, `onError`, `onSettled`)
 * supporting snapshot, optimistic cache update, rollback, and invalidation.
 */
export function createOptimisticMutationOptions<TData, TVariables>(
  options: OptimisticMutationOptions<TData, TVariables>
): OptimisticMutationResult<TData, TVariables> {
  const { queryClient, queryKey, updateFn, onError, onSettled } = options;

  return {
    onMutate: async (variables: TVariables) => {
      // 1. Cancel any outgoing refetches so they don't overwrite our optimistic update
      await queryClient.cancelQueries({ queryKey });

      // 2. Snapshot the previous cached value
      const previousData = queryClient.getQueryData<TData>(queryKey);

      // 3. Optimistically update the cache with new value
      queryClient.setQueryData<TData>(queryKey, (old) => updateFn(old, variables));

      logger.info('OptimisticHelpers', 'Applied optimistic update to cache', { queryKey });

      // Return context object with snapshot for rollback on error
      return { previousData };
    },

    onError: (error, variables, context) => {
      // 4. Rollback to the previous snapshot if mutation fails
      if (context && context.previousData !== undefined) {
        queryClient.setQueryData<TData>(queryKey, context.previousData);
        logger.warn('OptimisticHelpers', 'Rolled back optimistic update due to mutation error', {
          queryKey,
          error,
        });
      }

      if (onError) {
        onError(error, variables, context?.previousData);
      }
    },

    onSettled: (_data, _error, variables) => {
      // 5. Invalidate and refetch query data to sync with server truth
      void queryClient.invalidateQueries({ queryKey });

      if (onSettled) {
        onSettled(variables);
      }
    },
  };
}

/**
 * Utility to manually restore cache data for a query key.
 */
export function restoreQueryData<TData>(
  queryClient: QueryClient,
  queryKey: QueryKey,
  data: TData
): void {
  queryClient.setQueryData<TData>(queryKey, data);
}
