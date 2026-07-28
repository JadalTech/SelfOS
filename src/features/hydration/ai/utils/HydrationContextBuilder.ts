import type { HydrationEntry, HydrationGoal } from '../../types/hydration.types';
import type { HydrationAIContext } from '../types/hydrationAI.types';
import {
  calculateTodayTotal,
  remainingWater,
  hydrationStatus,
  calculatePeakHour,
  aggregateDrinkTypes,
  calculateStreak,
} from '../../engine/hydrationEngine';
import { buildDailySummaries } from '../../analytics/hydrationAnalytics';

export class HydrationContextBuilder {
  static buildContext(params: {
    readonly entries: HydrationEntry[];
    readonly goal: HydrationGoal | null;
    readonly allEntriesForStreak?: HydrationEntry[];
  }): HydrationAIContext {
    const { entries, goal, allEntriesForStreak = [] } = params;

    const goalML = goal?.dailyTargetML ?? 2500;
    const consumed = calculateTodayTotal(entries);
    const remaining = remainingWater(consumed, goalML);

    const completionPercent = goalML > 0 ? Math.min(100, Math.round((consumed / goalML) * 100)) : 0;
    const status = hydrationStatus(completionPercent);

    // Compute Streak
    const summaries = buildDailySummaries(allEntriesForStreak.length > 0 ? allEntriesForStreak : entries, goalML);
    const streak = calculateStreak(summaries);

    // Intake stats
    const avgDrink = entries.length > 0 ? Math.round(consumed / entries.length) : 0;
    const peakHour = calculatePeakHour(entries);
    const breakdown = aggregateDrinkTypes(entries);

    return {
      date: new Date().toISOString().split('T')[0],
      consumedML: consumed,
      goalML,
      remainingML: remaining,
      hydrationScore: status === 'excellent' ? 10 : status === 'good' ? 8 : status === 'normal' ? 5 : 2,
      currentStreak: streak,
      averageDrinkSize: avgDrink,
      peakHour,
      drinkTypeBreakdown: breakdown,
      activityLevel: goal?.activityLevel ?? 'moderate',
      climate: goal?.climate ?? 'normal',
    };
  }
}
export default HydrationContextBuilder;
