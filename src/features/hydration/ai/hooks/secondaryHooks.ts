import { useQuery } from '@tanstack/react-query';
import { useAuthStore } from '../../../../shared/stores/auth.store';
import { hydrationAIRepository } from '../repository/HydrationAIRepository';
import { hydrationAIService } from '../services/HydrationAIService';

// ---------------------------------------------------------------------------
// 1. Predictions Hook
// ---------------------------------------------------------------------------

export function useHydrationPredictions() {
  const userId = useAuthStore((s) => s.user?.uid);

  return useQuery({
    queryKey: ['hydration', 'ai', 'predictions', userId],
    queryFn: async () => {
      if (!userId) throw new Error('User not authenticated');
      const context = await hydrationAIRepository.compileContext(userId);
      const res = await hydrationAIService.getPredictions(userId, context);
      if (!res.success) throw res.error;
      return res.data;
    },
    enabled: !!userId,
    staleTime: 2 * 60 * 60 * 1000, // 2 Hour TTL Cache
  });
}

// ---------------------------------------------------------------------------
// 2. Summary Hook
// ---------------------------------------------------------------------------

export function useHydrationSummary() {
  const userId = useAuthStore((s) => s.user?.uid);

  return useQuery({
    queryKey: ['hydration', 'ai', 'summary', userId],
    queryFn: async () => {
      if (!userId) throw new Error('User not authenticated');
      const context = await hydrationAIRepository.compileContext(userId);
      const res = await hydrationAIService.getCoachingAdvice(userId, context);
      if (!res.success) throw res.error;
      return res.data;
    },
    enabled: !!userId,
    staleTime: 24 * 60 * 60 * 1000, // 24 Hour TTL Cache
  });
}

// ---------------------------------------------------------------------------
// 3. Insights Hook
// ---------------------------------------------------------------------------

export function useHydrationInsights() {
  const userId = useAuthStore((s) => s.user?.uid);

  return useQuery({
    queryKey: ['hydration', 'ai', 'insights', userId],
    queryFn: async () => {
      if (!userId) throw new Error('User not authenticated');
      const context = await hydrationAIRepository.compileContext(userId);
      // Fallback or mapped insights from analytics builder
      return [
        { id: '1', title: 'Consistency Trend', detail: `Current consistency factor: ${context.hydrationScore}/10`, score: context.hydrationScore, trend: 'stable' as const },
      ];
    },
    enabled: !!userId,
    staleTime: 30 * 60 * 1000,
  });
}

// ---------------------------------------------------------------------------
// 4. Recommendations Hook
// ---------------------------------------------------------------------------

export function useHydrationRecommendations() {
  const userId = useAuthStore((s) => s.user?.uid);

  return useQuery({
    queryKey: ['hydration', 'ai', 'recommendations', userId],
    queryFn: async () => {
      if (!userId) throw new Error('User not authenticated');
      const context = await hydrationAIRepository.compileContext(userId);
      return [
        { id: 'rec_1', title: 'Electrolyte intake', summary: 'Consider adding electrolyte beverages during high temperature climate cycles.', targetConcern: 'climate', actionableSteps: ['Drink 250mL of sports drink'], confidenceScore: 0.9 },
      ];
    },
    enabled: !!userId,
    staleTime: 10 * 60 * 1000,
  });
}
