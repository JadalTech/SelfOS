import { useQuery } from '@tanstack/react-query';
import { useAuthStore } from '../../../shared/stores';
import {
  sleepRepository,
  sleepScheduleRepository,
  sleepGoalRepository,
  sleepAnalyticsRepository,
} from '../repository/sleep.repository';
import { sleepAnalyticsService } from '../services/sleepAnalytics.service';
import type { WeeklySleepSummary, MonthlySleepSummary } from '../types/sleep.types';
import type { FeatureAnalytics } from '../../../shared/types/analytics.types';
import { sleepKeys } from './queryKeys';

export function useSleepAnalytics() {
  const user = useAuthStore((state) => state.user);
  const userId = user?.uid;

  // 1. Fetch entries
  const entriesQuery = useQuery({
    queryKey: sleepKeys.entries(),
    queryFn: async () => {
      if (!userId) return [];
      const res = await sleepRepository.fetchEntries(userId);
      if (!res.success) throw res.error;
      return res.data;
    },
    enabled: Boolean(userId),
    staleTime: 5 * 60 * 1000,
  });

  // 2. Fetch schedules
  const schedulesQuery = useQuery({
    queryKey: sleepKeys.schedule(),
    queryFn: async () => {
      if (!userId) return [];
      const res = await sleepScheduleRepository.fetchSchedules(userId);
      if (!res.success) throw res.error;
      return res.data;
    },
    enabled: Boolean(userId),
    staleTime: 5 * 60 * 1000,
  });

  // 3. Fetch goals
  const goalsQuery = useQuery({
    queryKey: sleepKeys.goals(),
    queryFn: async () => {
      if (!userId) return [];
      const res = await sleepGoalRepository.fetchGoals(userId);
      if (!res.success) throw res.error;
      return res.data;
    },
    enabled: Boolean(userId),
    staleTime: 5 * 60 * 1000,
  });

  // 4. Fetch DB analytics records (FeatureAnalytics contract representation)
  const analyticsRecordsQuery = useQuery<FeatureAnalytics[], Error>({
    queryKey: sleepKeys.analytics(),
    queryFn: async () => {
      if (!userId) return [];
      const res = await sleepAnalyticsRepository.fetchAnalyticsRecords(userId);
      if (!res.success) throw res.error;
      return res.data;
    },
    enabled: Boolean(userId),
    staleTime: 5 * 60 * 1000,
    gcTime: 15 * 60 * 1000,
  });

  const entries = entriesQuery.data ?? [];
  const activeSchedule = schedulesQuery.data?.find((s) => s.isActive) ?? null;
  const activeGoals = goalsQuery.data?.filter((g) => g.isActive) ?? [];

  // Helper to generate a weekly summary for a given range
  const getWeeklySummary = (weekStartDate: string, weekEndDate: string): WeeklySleepSummary | null => {
    if (!userId || !activeSchedule) return null;
    return sleepAnalyticsService.calculateWeeklySummary(
      userId,
      entries,
      activeSchedule,
      activeGoals,
      weekStartDate,
      weekEndDate
    );
  };

  // Helper to generate a monthly summary for a given month
  const getMonthlySummary = (year: number, month: number): MonthlySleepSummary | null => {
    if (!userId || !activeSchedule) return null;
    return sleepAnalyticsService.calculateMonthlySummary(
      userId,
      entries,
      activeSchedule,
      activeGoals,
      year,
      month
    );
  };

  const isLoading =
    entriesQuery.isLoading ||
    schedulesQuery.isLoading ||
    goalsQuery.isLoading ||
    analyticsRecordsQuery.isLoading;

  return {
    analyticsRecords: analyticsRecordsQuery.data ?? [],
    getWeeklySummary,
    getMonthlySummary,
    isLoading,
    isError:
      entriesQuery.isError ||
      schedulesQuery.isError ||
      goalsQuery.isError ||
      analyticsRecordsQuery.isError,
    error:
      entriesQuery.error ||
      schedulesQuery.error ||
      goalsQuery.error ||
      analyticsRecordsQuery.error,
    refetch: async () => {
      await Promise.all([
        entriesQuery.refetch(),
        schedulesQuery.refetch(),
        goalsQuery.refetch(),
        analyticsRecordsQuery.refetch(),
      ]);
    },
  };
}
