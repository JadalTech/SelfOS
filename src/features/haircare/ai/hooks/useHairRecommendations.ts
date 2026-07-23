import { useQuery } from '@tanstack/react-query';
import { useAuthStore } from '@/shared/stores';
import { hairAIRepository } from '../repository/hairAIRepository';
import type { HairRecommendation } from '../types/ai.types';
import { haircareKeys } from '../../hooks/queryKeys';

export function useHairRecommendations() {
  const user = useAuthStore((state) => state.user);
  const userId = user?.uid;

  const query = useQuery<HairRecommendation[], Error>({
    queryKey: [...haircareKeys.ai(), 'recommendations'],
    queryFn: async () => {
      if (!userId) return [];
      const res = await hairAIRepository.getRecommendations(userId);
      if (!res.success) throw res.error;
      return res.data;
    },
    enabled: Boolean(userId),
    staleTime: 5 * 60 * 1000,
  });

  return {
    recommendations: query.data ?? [],
    topRecommendation: (query.data && query.data[0]) || null,
    isLoading: query.isLoading,
    isError: query.isError,
    error: query.error,
    refetch: query.refetch,
  };
}
