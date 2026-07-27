import { useQuery } from '@tanstack/react-query';
import { useAuthStore } from '../../../shared/stores';
import { sleepRepository } from '../repository/sleep.repository';
import type { SleepEntry } from '../types/sleep.types';
import { sleepKeys } from './queryKeys';

export function useSleepToday() {
  const user = useAuthStore((state) => state.user);
  const userId = user?.uid;
  const todayStr = new Date().toISOString().split('T')[0];

  const todayQuery = useQuery<SleepEntry | null, Error>({
    queryKey: sleepKeys.today(),
    queryFn: async () => {
      if (!userId) return null;
      const res = await sleepRepository.getEntryByDate(userId, todayStr);
      if (!res.success) throw res.error;
      return res.data;
    },
    enabled: Boolean(userId),
    staleTime: 5 * 60 * 1000,
    gcTime: 15 * 60 * 1000,
  });

  return {
    todayEntry: todayQuery.data ?? null,
    isLoading: todayQuery.isLoading,
    isRefetching: todayQuery.isRefetching,
    isError: todayQuery.isError,
    error: todayQuery.error,
    refetch: todayQuery.refetch,
  };
}
