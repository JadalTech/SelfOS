import { useMemo } from 'react';
import { useHydration } from '../../hooks/useHydration';
import { HydrationDashboardMapper, HydrationEntryMapper } from '../../mappers/hydration.mapper';
import { calculateDetailedHydrationScore } from '../../engine/hydrationEngine';

export function useHydrationDashboardViewModel() {
  const {
    today,
    todayEntries,
    goal,
    loading,
    refresh,
    createEntry,
    deleteEntry,
    isCreating,
    isDeleting,
  } = useHydration();

  const formattedDashboard = useMemo(() => {
    return HydrationDashboardMapper.toVM(today);
  }, [today]);

  const formattedEntries = useMemo(() => {
    return HydrationEntryMapper.toVMList(todayEntries);
  }, [todayEntries]);

  const detailedScore = useMemo(() => {
    const dailyTarget = goal?.dailyTargetML ?? 2500;
    const streak = today.streak;
    const wakeTime = goal?.wakeTime ?? '07:00';
    const sleepTime = goal?.sleepTime ?? '23:00';
    return calculateDetailedHydrationScore(todayEntries, dailyTarget, streak, wakeTime, sleepTime);
  }, [todayEntries, goal, today.streak]);

  const handleQuickAdd = async (amountML: number) => {
    try {
      const now = new Date();
      const dateStr = now.toISOString().split('T')[0];
      const timeStr = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false });
      
      await createEntry({
        date: dateStr,
        time: timeStr,
        timestamp: now,
        amountML,
        drinkType: 'water',
        temperature: 'normal',
        source: 'quick-add',
      });
    } catch (err) {
      console.error('Quick Add failed:', err);
    }
  };

  return {
    dashboard: formattedDashboard,
    entries: formattedEntries,
    detailedScore,
    isLoading: loading,
    isSaving: isCreating || isDeleting,
    refresh,
    quickAdd: handleQuickAdd,
    deleteEntry,
  };
}
