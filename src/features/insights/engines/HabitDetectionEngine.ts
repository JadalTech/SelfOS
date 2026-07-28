/**
 * Habit Detection Engine
 * SelfOS v1.5.0 — Batch 12A
 */

import type { IInsightEngine } from './IInsightEngine';
import type { HabitPattern } from '../types/insights.types';
import type { UnifiedAnalyticsPackage } from '../types/aggregator.types';

export class HabitDetectionEngine implements IInsightEngine<HabitPattern[]> {
  calculate(analytics: UnifiedAnalyticsPackage): HabitPattern[] {
    const { userId, sleep, hydration, workout } = analytics;
    const habits: HabitPattern[] = [];

    // 1. Consistent Hydration habit
    if (hydration && hydration.consistencyRate > 80) {
      habits.push({
        id: `habit_hydration_${Date.now()}`,
        userId,
        habitName: 'High Hydration consistency',
        frequency: 'daily',
        consistency: hydration.consistencyRate / 100,
        score: Math.min(10, Math.round(hydration.consistencyRate / 10)),
        detectedPattern: 'You regularly hit your fluid consumption goals on both weekdays and weekends.',
        recommendation: 'Maintain current intake frequency. Add electrolytes during hot weather cycles.',
        calculatedAt: new Date(),
      });
    }

    // 2. Consistent Training habit
    if (workout && workout.consistencyRate > 75) {
      habits.push({
        id: `habit_training_${Date.now()}`,
        userId,
        habitName: 'Consistent Training Schedule',
        frequency: 'weekly',
        consistency: workout.consistencyRate / 100,
        score: Math.min(10, Math.round(workout.consistencyRate / 10)),
        detectedPattern: 'Workouts are completed regularly with minimal skipped sessions.',
        recommendation: 'Incorporate progressive overload strategies to avoid plateau cycles.',
        calculatedAt: new Date(),
      });
    }

    return habits;
  }
}
export const habitDetectionEngine = new HabitDetectionEngine();
export default habitDetectionEngine;
