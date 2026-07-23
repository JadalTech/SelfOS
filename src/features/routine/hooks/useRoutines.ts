/**
 * React Query Hook for Fetching Routines List
 *
 * Handles caching, loading states, and filter queries for active routines.
 */

import { useQuery } from '@tanstack/react-query';
import { routineRepository } from '../repository/routine.repository';
import { routineKeys } from '../constants/queryKeys';
import type { Routine, RoutineType, RoutineStatus } from '../types';

interface UseRoutinesOptions {
  type?: RoutineType;
  status?: RoutineStatus;
  enabled?: boolean;
}

export function useRoutines(options: UseRoutinesOptions = {}) {
  const { type, status, enabled = true } = options;

  return useQuery<Routine[], Error>({
    queryKey: routineKeys.list({ type, status }),
    queryFn: async () => {
      const result = await routineRepository.fetchRoutines({ type, status });
      if (!result.success) {
        throw result.error;
      }
      return result.data;
    },
    enabled,
    staleTime: 5 * 60 * 1000, // 5 minutes stale time matching mobile app defaults
  });
}
