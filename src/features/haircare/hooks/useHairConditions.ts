import { useQuery } from '@tanstack/react-query';
import { useAuthStore } from '@/shared/stores';
import { hairConditionRepository } from '../repository/hairCondition.repository';
import type { HairCondition } from '../types';
import { haircareKeys } from './queryKeys';

export function useHairConditions() {
  const user = useAuthStore((state) => state.user);
  const userId = user?.uid;

  const conditionsQuery = useQuery<HairCondition[], Error>({
    queryKey: haircareKeys.conditions(),
    queryFn: async () => {
      if (!userId) return [];
      const res = await hairConditionRepository.fetchConditions(userId);
      if (!res.success) throw res.error;
      return res.data;
    },
    enabled: Boolean(userId),
    staleTime: 5 * 60 * 1000,
  });

  return {
    conditions: conditionsQuery.data ?? [],
    isLoading: conditionsQuery.isLoading,
    isRefetching: conditionsQuery.isRefetching,
    isError: conditionsQuery.isError,
    error: conditionsQuery.error,
    refetch: conditionsQuery.refetch,
  };
}
