/**
 * Consolidated ViewModels for Insights Presentation Screen Layer
 * SelfOS v1.5.0 — Batch 12B
 */

import { useInsightsDashboardContext } from '../contexts/InsightsDashboardContext';
import {
  HealthScoreMapper,
  InsightMapper,
  CorrelationMapper,
  TrendMapper,
  HabitMapper,
  RecommendationMapper,
  PredictionMapper,
} from '../mappers/InsightsMappers';

// =========================================================================
// 1. Dashboard Main ViewModel
// =========================================================================

export function useInsightsDashboardViewModel() {
  const { data, loading, error, refresh, filters, setFilters, resetFilters } =
    useInsightsDashboardContext();

  const activeInsights = (data?.insights || [])
    .filter((ins) => {
      if (filters.module !== 'all' && !ins.sourceModules.includes(filters.module)) return false;
      if (filters.category !== 'all' && ins.category !== filters.category) return false;
      if (filters.priority !== 'all' && ins.priority !== filters.priority) return false;
      if (filters.searchQuery) {
        const query = filters.searchQuery.toLowerCase();
        return (
          ins.title.toLowerCase().includes(query) || ins.description.toLowerCase().includes(query)
        );
      }
      return true;
    })
    .map(InsightMapper.toVM);

  return {
    score: data?.score ? HealthScoreMapper.toVM(data.score) : null,
    rawScore: data?.score || null,
    insights: activeInsights,
    loading,
    error,
    refresh,
    filters,
    setFilters,
    resetFilters,
  };
}

// =========================================================================
// 2. Health Score Details ViewModel
// =========================================================================

export function useHealthScoreViewModel() {
  const { data, loading, error } = useInsightsDashboardContext();
  return {
    score: data?.score ? HealthScoreMapper.toVM(data.score) : null,
    breakdown: data?.score
      ? {
          nutrition: data.score.nutrition,
          workout: data.score.workout,
          sleep: data.score.sleep,
          hydration: data.score.hydration,
        }
      : null,
    loading,
    error,
  };
}

// =========================================================================
// 3. Trends & Timeline ViewModel
// =========================================================================

export function useTrendViewModel() {
  const { data, loading, error } = useInsightsDashboardContext();
  const trends = (data?.trends || []).map(TrendMapper.toVM);
  return {
    trends,
    loading,
    error,
  };
}

// =========================================================================
// 4. Correlations ViewModel
// =========================================================================

export function useCorrelationViewModel() {
  const { data, loading, error } = useInsightsDashboardContext();
  const correlations = (data?.correlations || []).map(CorrelationMapper.toVM);
  return {
    correlations,
    loading,
    error,
  };
}

// =========================================================================
// 5. Habits ViewModel
// =========================================================================

export function useHabitViewModel() {
  const { data, loading, error } = useInsightsDashboardContext();
  const habits = (data?.habits || []).map(HabitMapper.toVM);
  return {
    habits,
    loading,
    error,
  };
}

// =========================================================================
// 6. Recommendations ViewModel
// =========================================================================

export function useRecommendationViewModel() {
  const { data, loading, error } = useInsightsDashboardContext();
  const recommendations = (data?.recommendations || []).map(RecommendationMapper.toVM);
  return {
    recommendations,
    loading,
    error,
  };
}

// =========================================================================
// 7. Predictions ViewModel
// =========================================================================

export function usePredictionViewModel() {
  const { data, loading, error } = useInsightsDashboardContext();
  const prediction = data?.prediction ? PredictionMapper.toVM(data.prediction) : null;
  return {
    prediction,
    rawPrediction: data?.prediction || null,
    loading,
    error,
  };
}
