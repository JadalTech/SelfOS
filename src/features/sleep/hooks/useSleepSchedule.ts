import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useAuthStore } from '../../../shared/stores';
import { sleepScheduleRepository } from '../repository/sleep.repository';
import type { SleepSchedule } from '../types/sleep.types';
import { sleepKeys } from './queryKeys';

export function useSleepSchedule() {
  const queryClient = useQueryClient();
  const user = useAuthStore((state) => state.user);
  const userId = user?.uid;

  const schedulesQuery = useQuery<SleepSchedule[], Error>({
    queryKey: sleepKeys.schedule(),
    queryFn: async () => {
      if (!userId) return [];
      const res = await sleepScheduleRepository.fetchSchedules(userId);
      if (!res.success) throw res.error;
      return res.data;
    },
    enabled: Boolean(userId),
    staleTime: 5 * 60 * 1000,
    gcTime: 15 * 60 * 1000,
  });

  const saveScheduleMutation = useMutation({
    mutationFn: async (schedule: Omit<SleepSchedule, 'id' | 'userId' | 'createdAt' | 'updatedAt'> & { id?: string }) => {
      if (!userId) throw new Error('User not authenticated');
      const res = await sleepScheduleRepository.saveSchedule(userId, schedule);
      if (!res.success) throw res.error;
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: sleepKeys.all });
    },
  });

  const toggleScheduleActiveMutation = useMutation({
    mutationFn: async ({ scheduleId, isActive }: { scheduleId: string; isActive: boolean }) => {
      if (!userId) throw new Error('User not authenticated');
      const res = await sleepScheduleRepository.toggleScheduleActive(userId, scheduleId, isActive);
      if (!res.success) throw res.error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: sleepKeys.all });
    },
  });

  const activeSchedule = schedulesQuery.data?.find((s) => s.isActive) ?? null;

  return {
    schedules: schedulesQuery.data ?? [],
    activeSchedule,
    isLoading: schedulesQuery.isLoading,
    isRefetching: schedulesQuery.isRefetching,
    isError: schedulesQuery.isError,
    error: schedulesQuery.error,
    refetch: schedulesQuery.refetch,
    saveSchedule: saveScheduleMutation.mutateAsync,
    isSaving: saveScheduleMutation.isPending,
    toggleScheduleActive: toggleScheduleActiveMutation.mutateAsync,
    isToggling: toggleScheduleActiveMutation.isPending,
  };
}
