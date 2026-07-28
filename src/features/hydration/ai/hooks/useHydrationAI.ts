import { useHydrationCoach } from './useHydrationCoach';
import {
  useHydrationSummary,
  useHydrationInsights,
  useHydrationRecommendations,
  useHydrationPredictions,
} from './secondaryHooks';

export function useHydrationAI(conversationId = 'default') {
  const coach = useHydrationCoach(conversationId);
  const summary = useHydrationSummary();
  const insights = useHydrationInsights();
  const recommendations = useHydrationRecommendations();
  const predictions = useHydrationPredictions();

  const loading =
    coach.loading ||
    summary.isLoading ||
    insights.isLoading ||
    recommendations.isLoading ||
    predictions.isLoading;

  const error =
    coach.error ||
    summary.error ||
    insights.error ||
    recommendations.error ||
    predictions.error;

  const refreshAll = () => {
    summary.refetch();
    insights.refetch();
    recommendations.refetch();
    predictions.refetch();
  };

  return {
    loading,
    error,
    refreshAll,
    conversation: coach.messages,
    coach,
    summary: summary.data ?? null,
    recommendations: recommendations.data ?? [],
    predictions: predictions.data ?? null,
    insights: insights.data ?? [],
  };
}
export default useHydrationAI;
