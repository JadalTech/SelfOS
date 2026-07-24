import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useAuthStore } from '../../../shared/stores/auth.store';
import { skincareRepository, CreateSkincareRoutineInput } from '../repository/skincare.repository';
import { mapToSkincareRoutineVMs } from '../mappers';
import { useSkincareProducts } from './useSkincareProducts';
import { skincareKeys } from './queryKeys';
import type { SkincareRoutine } from '../types';

export function useSkincareRoutines() {
  const queryClient = useQueryClient();
  const userId = useAuthStore((s) => s.user?.uid);
  const { products } = useSkincareProducts();

  const query = useQuery({
    queryKey: skincareKeys.routines(),
    queryFn: async () => {
      if (!userId) return [];
      const res = await skincareRepository.fetchRoutines(userId);
      if (!res.success) throw res.error;
      return res.data;
    },
    enabled: !!userId,
    staleTime: 5 * 60 * 1000,
    gcTime: 15 * 60 * 1000,
  });

  const routineVMs = mapToSkincareRoutineVMs(query.data || [], products);

  const createMutation = useMutation({
    mutationFn: async (input: CreateSkincareRoutineInput) => {
      if (!userId) throw new Error('User is not authenticated');
      const res = await skincareRepository.createSkincareRoutine(userId, input);
      if (!res.success) throw res.error;
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: skincareKeys.routines() });
      queryClient.invalidateQueries({ queryKey: skincareKeys.dashboard() });
    },
  });

  const updateMutation = useMutation({
    mutationFn: async ({ skincareRoutineId, updates }: { skincareRoutineId: string; updates: Partial<SkincareRoutine> }) => {
      if (!userId) throw new Error('User is not authenticated');
      const res = await skincareRepository.updateSkincareRoutine(userId, skincareRoutineId, updates);
      if (!res.success) throw res.error;
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: skincareKeys.routines() });
      queryClient.invalidateQueries({ queryKey: skincareKeys.dashboard() });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async ({ skincareRoutineId, coreRoutineId }: { skincareRoutineId: string; coreRoutineId?: string }) => {
      if (!userId) throw new Error('User is not authenticated');
      const res = await skincareRepository.deleteSkincareRoutine(userId, skincareRoutineId, coreRoutineId);
      if (!res.success) throw res.error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: skincareKeys.routines() });
      queryClient.invalidateQueries({ queryKey: skincareKeys.dashboard() });
    },
  });

  return {
    routines: query.data || [],
    routineVMs,
    isLoading: query.isLoading,
    isError: query.isError,
    error: query.error,
    refetch: query.refetch,
    createRoutine: createMutation.mutateAsync,
    isCreating: createMutation.isPending,
    updateRoutine: updateMutation.mutateAsync,
    isUpdating: updateMutation.isPending,
    deleteRoutine: deleteMutation.mutateAsync,
    isDeleting: deleteMutation.isPending,
  };
}
