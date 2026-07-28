import { useMemo } from 'react';
import { useHydrationGoal } from '../../hooks/useHydration';
import { HydrationGoalMapper } from '../../mappers/hydration.mapper';
import { calculateFullTarget } from '../../engine/hydrationEngine';
import type { ActivityLevel, ClimateType } from '../../types/hydration.types';

export function useHydrationGoalViewModel() {
  const { goal, saveGoal, isLoading, isSaving } = useHydrationGoal();

  const formattedGoal = useMemo(() => {
    return goal ? HydrationGoalMapper.toVM(goal) : null;
  }, [goal]);

  const handleCalculateRecommended = (weight: number, activity: ActivityLevel, climate: ClimateType) => {
    return calculateFullTarget(weight, activity, climate);
  };

  const handleSave = async (data: {
    dailyTargetML: number;
    customTargetEnabled: boolean;
    weightKg?: number;
    activityLevel: ActivityLevel;
    climate: ClimateType;
    wakeTime: string;
    sleepTime: string;
    reminderEnabled: boolean;
    reminderIntervalMinutes: number;
    smartAdjustments: boolean;
  }) => {
    await saveGoal(data);
  };

  return {
    goal: formattedGoal,
    isLoading,
    isSaving,
    calculateRecommended: handleCalculateRecommended,
    saveGoal: handleSave,
  };
}
