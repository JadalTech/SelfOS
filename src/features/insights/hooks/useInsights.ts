/**
 * React Query Hooks for Insights Module
 * SelfOS v1.5.0 — Batch 12A
 */

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useAuthStore } from '../../../shared/stores/auth.store';
import { insightsService } from '../services/InsightsService';

const INSIGHTS_QUERY_KEYS = {
  HEALTH_SCORE: (userId: string) => ['insights', 'health-score', userId],
  INSIGHTS: (userId: string) => ['insights', 'list', userId],
  CORRELATIONS: (userId: string) => ['insights', 'correlations', userId],
  TRENDS: (userId: string) => ['insights', 'trends', userId],
  RECOMMENDATIONS: (userId: string) => ['insights', 'recommendations', userId],
  PREDICTIONS: (userId: string) => ['insights', 'predictions', userId],
} as const;

// ---------------------------------------------------------------------------
// 1. Unified Health Score Hook
// ---------------------------------------------------------------------------

export function useHealthScore() {
  const userId = useAuthStore((s) => s.user?.uid);
  const queryClient = useQueryClient();

  const query = useQuery({
    queryKey: INSIGHTS_QUERY_KEYS.HEALTH_SCORE(userId || ''),
    queryFn: async () => {
      if (!userId) throw new Error('User not authenticated');
      const res = await insightsService.getLatestHealthScore(userId);
      if (!res.success) throw res.error;
      return res.data;
    },
    enabled: !!userId,
  });

  const mutation = useMutation({
    mutationFn: async () => {
      if (!userId) throw new Error('User not authenticated');
      insightsService.invalidateCache();
      const res = await insightsService.getLatestHealthScore(userId);
      if (!res.success) throw res.error;
      return res.data;
    },
    onSuccess: (data) => {
      queryClient.setQueryData(INSIGHTS_QUERY_KEYS.HEALTH_SCORE(userId || ''), data);
    },
  });

  return {
    ...query,
    refresh: mutation.mutateAsync,
    isRefreshing: mutation.isPending,
  };
}

// ---------------------------------------------------------------------------
// 2. Mapped Insights Hook
// ---------------------------------------------------------------------------

export function useInsights() {
  const userId = useAuthStore((s) => s.user?.uid);
  const queryClient = useQueryClient();

  const query = useQuery({
    queryKey: INSIGHTS_QUERY_KEYS.INSIGHTS(userId || ''),
    queryFn: async () => {
      if (!userId) throw new Error('User not authenticated');
      const res = await insightsService.getLatestInsights(userId);
      if (!res.success) throw res.error;
      return res.data;
    },
    enabled: !!userId,
  });

  return query;
}

// ---------------------------------------------------------------------------
// 3. Correlations Hook
// ---------------------------------------------------------------------------

export function useCorrelations() {
  const userId = useAuthStore((s) => s.user?.uid);

  return useQuery({
    queryKey: INSIGHTS_QUERY_KEYS.CORRELATIONS(userId || ''),
    queryFn: async () => {
      if (!userId) throw new Error('User not authenticated');
      const res = await insightsService.getCorrelations(userId);
      if (!res.success) throw res.error;
      return res.data;
    },
    enabled: !!userId,
  });
}

// ---------------------------------------------------------------------------
// 4. Trends Hook
// ---------------------------------------------------------------------------

export function useTrends() {
  const userId = useAuthStore((s) => s.user?.uid);

  return useQuery({
    queryKey: INSIGHTS_QUERY_KEYS.TRENDS(userId || ''),
    queryFn: async () => {
      if (!userId) throw new Error('User not authenticated');
      const res = await insightsService.getTrends(userId);
      if (!res.success) throw res.error;
      return res.data;
    },
    enabled: !!userId,
  });
}

// ---------------------------------------------------------------------------
// 5. Health Recommendations Hook
// ---------------------------------------------------------------------------

export function useRecommendations() {
  const userId = useAuthStore((s) => s.user?.uid);

  return useQuery({
    queryKey: INSIGHTS_QUERY_KEYS.RECOMMENDATIONS(userId || ''),
    queryFn: async () => {
      if (!userId) throw new Error('User not authenticated');
      const res = await insightsService.getRecommendations(userId);
      if (!res.success) throw res.error;
      return res.data;
    },
    enabled: !!userId,
  });
}

// ---------------------------------------------------------------------------
// 6. Projections / Predictions Hook
// ---------------------------------------------------------------------------

export function usePredictions() {
  const userId = useAuthStore((s) => s.user?.uid);

  return useQuery({
    queryKey: INSIGHTS_QUERY_KEYS.PREDICTIONS(userId || ''),
    queryFn: async () => {
      if (!userId) throw new Error('User not authenticated');
      const res = await insightsService.getPredictions(userId);
      if (!res.success) throw res.error;
      return res.data;
    },
    enabled: !!userId,
  });
}
export default useInsights;
