import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useAuthStore } from '../../../shared/stores';
import { sleepGoalRepository } from '../repository/sleep.repository';
import type { SleepGoal } from '../types/sleep.types';
import { sleepKeys } from './queryKeys';

export function useSleepGoals() {
  const queryClient = useQueryClient();
  const user = useAuthStore((state) => state.user);
  const userId = user?.uid;

  const goalsQuery = useQuery<SleepGoal[], Error>({
    queryKey: sleepKeys.goals(),
    queryFn: async () => {
      if (!userId) return [];
      const res = await sleepGoalRepository.fetchGoals(userId);
      if (!res.success) throw res.error;
      return res.data;
    },
    enabled: Boolean(userId),
    staleTime: 5 * 60 * 1000,
    gcTime: 15 * 60 * 1000,
  });

  const saveGoalMutation = useMutation({
    mutationFn: async (goal: Omit<SleepGoal, 'id' | 'userId' | 'createdAt' | 'updatedAt'> & { id?: string }) => {
      if (!userId) throw new Error('User not authenticated');
      const res = await sleepGoalRepository.saveGoal(userId, goal);
      if (!res.success) throw res.error;
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: sleepKeys.all });
    },
  });

  const toggleGoalActiveMutation = useMutation({
    mutationFn: async ({ goalId, isActive }: { goalId: string; isActive: boolean }) => {
      if (!userId) throw new Error('User not authenticated');
      const res = await sleepGoalRepository.toggleGoalActive(userId, goalId, isActive);
      if (!res.success) throw res.error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: sleepKeys.all });
    },
  });

  const activeGoals = goalsQuery.data?.filter((g) => g.isActive) ?? [];

  return {
    goals: goalsQuery.data ?? [],
    activeGoals,
    isLoading: goalsQuery.isLoading,
    isRefetching: goalsQuery.isRefetching,
    isError: goalsQuery.isError,
    error: goalsQuery.error,
    refetch: goalsQuery.refetch,
    saveGoal: saveGoalMutation.mutateAsync,
    isSaving: saveGoalMutation.isPending,
    toggleGoalActive: toggleGoalActiveMutation.mutateAsync,
    isToggling: toggleGoalActiveMutation.isPending,
  };
}
