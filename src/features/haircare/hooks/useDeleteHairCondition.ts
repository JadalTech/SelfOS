import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useAuthStore } from '@/shared/stores';
import { hairConditionRepository } from '../repository/hairCondition.repository';
import { haircareKeys } from './queryKeys';

export function useDeleteHairCondition() {
  const queryClient = useQueryClient();
  const user = useAuthStore((state) => state.user);
  const userId = user?.uid;

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      if (!userId) throw new Error('User not authenticated');
      const res = await hairConditionRepository.deleteCondition(userId, id);
      if (!res.success) throw res.error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: haircareKeys.conditions() });
      queryClient.invalidateQueries({ queryKey: haircareKeys.all });
    },
  });

  return {
    deleteCondition: deleteMutation.mutateAsync,
    isDeleting: deleteMutation.isPending,
    isError: deleteMutation.isError,
    error: deleteMutation.error,
  };
}
