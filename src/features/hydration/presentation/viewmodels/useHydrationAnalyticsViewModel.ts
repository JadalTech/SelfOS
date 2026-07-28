import { useMemo } from 'react';
import { useHydrationHistory, useHydrationGoal } from '../../hooks/useHydration';
import {
  buildHydrationStatistics,
  buildHydrationTrends,
  calculatePreferredDrinkingWindow,
  calculateWeekdayVsWeekendPerformance,
} from '../../analytics/hydrationAnalytics';
import { calculateDetailedHydrationScore, calculateStreak } from '../../engine/hydrationEngine';
import { HydrationStatisticsMapper, HydrationChartMapper } from '../../mappers/hydration.mapper';

export function useHydrationAnalyticsViewModel() {
  const { history, isLoading, refetch } = useHydrationHistory(90);
  const { goal } = useHydrationGoal();

  const goalML = goal?.dailyTargetML ?? 2500;

  const statistics = useMemo(() => {
    return buildHydrationStatistics(history, goalML);
  }, [history, goalML]);

  const formattedStats = useMemo(() => {
    return HydrationStatisticsMapper.toVM(statistics);
  }, [statistics]);

  const trends = useMemo(() => {
    return buildHydrationTrends(history, goalML);
  }, [history, goalML]);

  const preferredWindow = useMemo(() => {
    return calculatePreferredDrinkingWindow(history);
  }, [history]);

  const weekdayWeekend = useMemo(() => {
    // Requires daily summaries to compute
    const byDate = new Map<string, number>();
    for (const e of history) {
      byDate.set(e.date, (byDate.get(e.date) ?? 0) + e.amountML);
    }
    const summaries = [...byDate.entries()].map(([date, consumedML]) => ({
      date,
      consumedML,
      goalML,
      completionPercent: Math.min(100, Math.round((consumedML / goalML) * 100)),
      remainingML: Math.max(0, goalML - consumedML),
      drinksCount: 0,
      largestDrink: 0,
      averageDrink: 0,
      streak: 0,
      status: 'good' as const,
    }));
    return calculateWeekdayVsWeekendPerformance(summaries);
  }, [history, goalML]);

  const chartDataPoints = useMemo(() => {
    return HydrationChartMapper.toDailyIntakePoints(history.slice(0, 10));
  }, [history]);

  return {
    statistics: formattedStats,
    trends,
    preferredWindow,
    weekdayWeekend,
    chartDataPoints,
    isLoading,
    refresh: refetch,
  };
}
