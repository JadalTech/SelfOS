import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useAuthStore } from '@/shared/stores';
import { haircareRepository, LogHaircareInput } from '../repository/haircare.repository';
import type { HairLog } from '../types';
import { haircareKeys } from './queryKeys';
import { routineKeys } from '@/features/routine';

export function useHairLogs() {
  const queryClient = useQueryClient();
  const user = useAuthStore((state) => state.user);
  const userId = user?.uid;

  const logsQuery = useQuery<HairLog[], Error>({
    queryKey: haircareKeys.logs(),
    queryFn: async () => {
      if (!userId) return [];
      const res = await haircareRepository.fetchHairLogs(userId, 50);
      if (!res.success) throw res.error;
      return res.data;
    },
    enabled: Boolean(userId),
    staleTime: 5 * 60 * 1000,
  });

  const logExecutionMutation = useMutation({
    mutationFn: async (input: LogHaircareInput) => {
      if (!userId) throw new Error('User not authenticated');
      const res = await haircareRepository.logHaircareExecution(userId, input);
      if (!res.success) throw res.error;
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: haircareKeys.all });
      queryClient.invalidateQueries({ queryKey: routineKeys.all });
    },
  });

  return {
    logs: logsQuery.data ?? [],
    isLoading: logsQuery.isLoading,
    isRefetching: logsQuery.isRefetching,
    isError: logsQuery.isError,
    error: logsQuery.error,
    refetch: logsQuery.refetch,
    logExecution: logExecutionMutation.mutateAsync,
    isMutating: logExecutionMutation.isPending,
  };
}
