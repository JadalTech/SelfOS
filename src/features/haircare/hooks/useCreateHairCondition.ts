import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useAuthStore } from '@/shared/stores';
import { hairConditionRepository, CreateHairConditionInput } from '../repository/hairCondition.repository';
import { haircareKeys } from './queryKeys';

export function useCreateHairCondition() {
  const queryClient = useQueryClient();
  const user = useAuthStore((state) => state.user);
  const userId = user?.uid;

  const createMutation = useMutation({
    mutationFn: async (input: CreateHairConditionInput) => {
      if (!userId) throw new Error('User not authenticated');
      const res = await hairConditionRepository.createCondition(userId, input);
      if (!res.success) throw res.error;
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: haircareKeys.conditions() });
      queryClient.invalidateQueries({ queryKey: haircareKeys.all });
    },
  });

  return {
    createCondition: createMutation.mutateAsync,
    isCreating: createMutation.isPending,
    isError: createMutation.isError,
    error: createMutation.error,
  };
}
