import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useAuthStore } from '../../../shared/stores/auth.store';
import { skincareRepository, LogSkincareExecutionInput } from '../repository/skincare.repository';
import { mapToSkincareLogVMs } from '../mappers';
import { useSkincareRoutines } from './useSkincareRoutines';
import { skincareKeys } from './queryKeys';

export function useSkincareLogs(limitDays = 60) {
  const queryClient = useQueryClient();
  const userId = useAuthStore((s) => s.user?.uid);
  const { routines } = useSkincareRoutines();

  const query = useQuery({
    queryKey: skincareKeys.logs(),
    queryFn: async () => {
      if (!userId) return [];
      const res = await skincareRepository.fetchLogs(userId, limitDays);
      if (!res.success) throw res.error;
      return res.data;
    },
    enabled: !!userId,
  });

  const logVMs = mapToSkincareLogVMs(query.data || [], routines);

  const logExecutionMutation = useMutation({
    mutationFn: async (input: LogSkincareExecutionInput) => {
      if (!userId) throw new Error('User is not authenticated');
      const res = await skincareRepository.logRoutineExecution(userId, input);
      if (!res.success) throw res.error;
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: skincareKeys.logs() });
      queryClient.invalidateQueries({ queryKey: skincareKeys.dashboard() });
      queryClient.invalidateQueries({ queryKey: skincareKeys.analytics() });
    },
  });

  return {
    logs: query.data || [],
    logVMs,
    isLoading: query.isLoading,
    isError: query.isError,
    error: query.error,
    refetch: query.refetch,
    logExecution: logExecutionMutation.mutateAsync,
    isLogging: logExecutionMutation.isPending,
  };
}
