import { useQuery } from '@tanstack/react-query';
import { useAuthStore } from '@/shared/stores';
import { hairAIRepository } from '../repository/hairAIRepository';
import type { HairReviewSummary } from '../types/ai.types';
import { haircareKeys } from '../../hooks/queryKeys';

export function useWeeklyHairReview() {
  const user = useAuthStore((state) => state.user);
  const userId = user?.uid;

  const query = useQuery<HairReviewSummary, Error>({
    queryKey: [...haircareKeys.ai(), 'weekly-review'],
    queryFn: async () => {
      if (!userId) throw new Error('User not authenticated');
      const res = await hairAIRepository.getWeeklyReview(userId);
      if (!res.success) throw res.error;
      return res.data;
    },
    enabled: Boolean(userId),
    staleTime: 10 * 60 * 1000,
  });

  return {
    review: query.data || null,
    isLoading: query.isLoading,
    isError: query.isError,
    error: query.error,
    refetch: query.refetch,
  };
}
