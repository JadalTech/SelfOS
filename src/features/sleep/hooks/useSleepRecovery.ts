import { useQuery } from '@tanstack/react-query';
import { useAuthStore } from '../../../shared/stores';
import { sleepRepository, sleepScheduleRepository } from '../repository/sleep.repository';
import { sleepRecoveryService } from '../services/sleepRecovery.service';
import * as SleepEngine from '../engine/sleepEngine';
import type { SleepRecovery } from '../types/sleep.types';
import { sleepKeys } from './queryKeys';

export function useSleepRecovery() {
  const user = useAuthStore((state) => state.user);
  const userId = user?.uid;
  const todayStr = new Date().toISOString().split('T')[0];

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

  const entries = entriesQuery.data ?? [];
  const activeSchedule = schedulesQuery.data?.find((s) => s.isActive) ?? null;
  const todayEntry = entries.find((e) => e.date === todayStr) ?? entries[0] ?? null;

  const recoveryQuery = useQuery<SleepRecovery | null, Error>({
    queryKey: sleepKeys.recovery(),
    queryFn: async () => {
      if (!userId || !todayEntry || !activeSchedule) return null;

      // 1. Consistency calculated over the last 7 entries
      const recentEntries = entries.slice(0, 7);
      const consistency = SleepEngine.calculateScheduleConsistency(recentEntries, activeSchedule);

      // 2. Sleep debt calculated over the last 7 entries
      const targetDuration = activeSchedule.targetDurationMinutes || 480;
      const debt = SleepEngine.calculateSleepDebt(recentEntries, targetDuration);

      // 3. Compute recovery using service
      return sleepRecoveryService.calculateRecovery(
        userId,
        todayEntry,
        activeSchedule,
        debt,
        consistency
      );
    },
    // Triggers execution when entries and schedules data are available
    enabled: Boolean(userId) && !entriesQuery.isLoading && !schedulesQuery.isLoading && Boolean(todayEntry) && Boolean(activeSchedule),
    staleTime: 5 * 60 * 1000,
  });

  return {
    recovery: recoveryQuery.data ?? null,
    isLoading: entriesQuery.isLoading || schedulesQuery.isLoading || recoveryQuery.isLoading,
    isError: entriesQuery.isError || schedulesQuery.isError || recoveryQuery.isError,
    error: entriesQuery.error || schedulesQuery.error || recoveryQuery.error,
    refetch: recoveryQuery.refetch,
  };
}
