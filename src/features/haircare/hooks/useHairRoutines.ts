import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useAuthStore } from '@/shared/stores';
import { haircareRepository, CreateHairRoutineInput } from '../repository/haircare.repository';
import type { HairRoutine } from '../types';
import { haircareKeys } from './queryKeys';
import { routineKeys } from '@/features/routine';

export function useHairRoutines() {
  const queryClient = useQueryClient();
  const user = useAuthStore((state) => state.user);
  const userId = user?.uid;

  const routinesQuery = useQuery<HairRoutine[], Error>({
    queryKey: haircareKeys.routines(),
    queryFn: async () => {
      if (!userId) return [];
      const res = await haircareRepository.fetchHairRoutines(userId);
      if (!res.success) throw res.error;
      return res.data;
    },
    enabled: Boolean(userId),
    staleTime: 5 * 60 * 1000,
  });

  const createMutation = useMutation({
    mutationFn: async (input: CreateHairRoutineInput) => {
      if (!userId) throw new Error('User not authenticated');
      const res = await haircareRepository.createHairRoutine(userId, input);
      if (!res.success) throw res.error;
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: haircareKeys.all });
      queryClient.invalidateQueries({ queryKey: routineKeys.all });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async ({ id, coreRoutineId }: { id: string; coreRoutineId?: string }) => {
      if (!userId) throw new Error('User not authenticated');
      const res = await haircareRepository.deleteHairRoutine(userId, id, coreRoutineId);
      if (!res.success) throw res.error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: haircareKeys.all });
      queryClient.invalidateQueries({ queryKey: routineKeys.all });
    },
  });

  return {
    hairRoutines: routinesQuery.data ?? [],
    isLoading: routinesQuery.isLoading,
    isRefetching: routinesQuery.isRefetching,
    isError: routinesQuery.isError,
    error: routinesQuery.error,
    refetch: routinesQuery.refetch,
    createHairRoutine: createMutation.mutateAsync,
    deleteHairRoutine: deleteMutation.mutateAsync,
    isMutating: createMutation.isPending || deleteMutation.isPending,
  };
}
