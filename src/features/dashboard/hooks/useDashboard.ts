/**
 * Custom Aggregation Hook: useDashboard
 *
 * Coordinates data fetching from feature repositories, user auth store,
 * and delegates processing to pure dashboard mappers.
 * Contains ZERO business rules and ZERO Firestore SDK calls.
 */

import { useMemo, useCallback } from 'react';
import { useAuthStore } from '@/shared/stores';
import {
  useRoutines,
  useCompleteRoutine,
  useSkipRoutine,
  routineRepository,
} from '@/features/routine';
import type { RoutineLog } from '@/features/routine/types';
import { useQuery } from '@tanstack/react-query';
import { buildDashboardViewModel } from '../utils/dashboardMapper';
import { dashboardKeys } from '../constants/queryKeys';
import type { DashboardViewModel } from '../types';

export function useDashboard() {
  const user = useAuthStore((state) => state.user);

  // 1. Query Active Routines List
  const routinesQuery = useRoutines({ status: 'active' });

  // Extract active routine IDs to query recent completion logs
  const routines = useMemo(() => routinesQuery.data ?? [], [routinesQuery.data]);
  const routineIdsKey = useMemo(() => routines.map((r) => r.id).sort().join(','), [routines]);

  // 2. Query Recent Completion Logs for Active Routines
  const logsQuery = useQuery<RoutineLog[], Error>({
    queryKey: [...dashboardKeys.all, 'logs', routineIdsKey],
    queryFn: async () => {
      if (routines.length === 0) return [];

      // Fetch logs across all active routines in parallel
      const logPromises = routines.map((r) => routineRepository.fetchRoutineLogs(r.id));
      const results = await Promise.all(logPromises);

      const allLogs: RoutineLog[] = [];
      for (const res of results) {
        if (res.success) {
          allLogs.push(...res.data);
        }
      }
      return allLogs;
    },
    enabled: routines.length > 0,
    staleTime: 5 * 60 * 1000,
  });

  const logs = useMemo(() => logsQuery.data ?? [], [logsQuery.data]);

  // 3. Delegate View Model Construction to Pure Mapper
  const viewModel: DashboardViewModel | null = useMemo(() => {
    if (routinesQuery.isLoading) return null;
    return buildDashboardViewModel(user, routines, logs);
  }, [user, routines, logs, routinesQuery.isLoading]);

  // 4. Quick Action Mutations
  const completeMutation = useCompleteRoutine();
  const skipMutation = useSkipRoutine();

  const handleComplete = useCallback(
    async (routineId: string, dateStr?: string) => {
      const targetDate = dateStr || new Date().toISOString().split('T')[0];
      await completeMutation.mutateAsync({ routineId, dateStr: targetDate });
    },
    [completeMutation]
  );

  const handleSkip = useCallback(
    async (routineId: string, dateStr?: string) => {
      const targetDate = dateStr || new Date().toISOString().split('T')[0];
      await skipMutation.mutateAsync({ routineId, dateStr: targetDate });
    },
    [skipMutation]
  );

  const refetch = useCallback(async () => {
    await Promise.all([routinesQuery.refetch(), logsQuery.refetch()]);
  }, [routinesQuery, logsQuery]);

  return {
    viewModel,
    isLoading: routinesQuery.isLoading,
    isRefetching: routinesQuery.isRefetching || logsQuery.isRefetching,
    isError: routinesQuery.isError || logsQuery.isError,
    error: routinesQuery.error || logsQuery.error,
    refetch,
    completeRoutine: handleComplete,
    skipRoutine: handleSkip,
    isActionPending: completeMutation.isPending || skipMutation.isPending,
  };
}
