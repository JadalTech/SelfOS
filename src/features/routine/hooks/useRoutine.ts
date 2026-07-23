/**
 * React Query Hook for Fetching Single Routine Details & Logs
 */

import { useQuery } from '@tanstack/react-query';
import { routineRepository } from '../repository/routine.repository';
import { routineKeys } from '../constants/queryKeys';
import type { Routine, RoutineLog } from '../types';

export function useRoutine(routineId: string) {
  const routineQuery = useQuery<Routine | null, Error>({
    queryKey: routineKeys.detail(routineId),
    queryFn: async () => {
      const result = await routineRepository.fetchRoutine(routineId);
      if (!result.success) {
        throw result.error;
      }
      return result.data;
    },
    enabled: Boolean(routineId),
  });

  const logsQuery = useQuery<RoutineLog[], Error>({
    queryKey: routineKeys.logs(routineId),
    queryFn: async () => {
      const result = await routineRepository.fetchRoutineLogs(routineId);
      if (!result.success) {
        throw result.error;
      }
      return result.data;
    },
    enabled: Boolean(routineId),
  });

  return {
    routine: routineQuery.data ?? null,
    logs: logsQuery.data ?? [],
    isLoading: routineQuery.isLoading || logsQuery.isLoading,
    isError: routineQuery.isError || logsQuery.isError,
    error: routineQuery.error || logsQuery.error,
    refetch: async () => {
      await Promise.all([routineQuery.refetch(), logsQuery.refetch()]);
    },
  };
}
