import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useAuthStore } from '@/shared/stores';
import { hairConditionRepository } from '../repository/hairCondition.repository';
import type { HairCondition } from '../types';
import { haircareKeys } from './queryKeys';

export function useUpdateHairCondition() {
  const queryClient = useQueryClient();
  const user = useAuthStore((state) => state.user);
  const userId = user?.uid;

  const updateMutation = useMutation({
    mutationFn: async ({ id, updates }: { id: string; updates: Partial<HairCondition> }) => {
      if (!userId) throw new Error('User not authenticated');
      const res = await hairConditionRepository.updateCondition(userId, id, updates);
      if (!res.success) throw res.error;
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: haircareKeys.conditions() });
      queryClient.invalidateQueries({ queryKey: haircareKeys.all });
    },
  });

  return {
    updateCondition: updateMutation.mutateAsync,
    isUpdating: updateMutation.isPending,
    isError: updateMutation.isError,
    error: updateMutation.error,
  };
}
