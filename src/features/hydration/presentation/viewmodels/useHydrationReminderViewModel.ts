import { useMemo } from 'react';
import { useHydrationGoal } from '../../hooks/useHydration';
import { calculateReminderSchedule } from '../../engine/hydrationEngine';

export function useHydrationReminderViewModel() {
  const { goal, isLoading } = useHydrationGoal();

  const reminderSchedule = useMemo(() => {
    if (!goal || !goal.reminderEnabled) return [];
    return calculateReminderSchedule({
      start: goal.wakeTime,
      end: goal.sleepTime,
      intervalMinutes: goal.reminderIntervalMinutes,
    });
  }, [goal]);

  return {
    reminderEnabled: goal?.reminderEnabled ?? false,
    reminderIntervalMinutes: goal?.reminderIntervalMinutes ?? 60,
    startTime: goal?.wakeTime ?? '07:00',
    endTime: goal?.sleepTime ?? '23:00',
    schedule: reminderSchedule,
    isLoading,
  };
}
