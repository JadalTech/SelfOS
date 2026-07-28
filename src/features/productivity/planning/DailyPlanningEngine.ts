/**
 * Daily Planning Engine
 * SelfOS v3.0.0 — Batch 14A
 */

import type { DailyPlan, Task, PlannedTimeSlot } from '../domain/productivity.types';
import { SchedulingPolicy, type HealthContextInput } from './SchedulingPolicy';
import { DependencyGraphEngine } from '../graph/DependencyGraphEngine';

export class DailyPlanningEngine {
  static generateDailyPlan(
    userId: string,
    date: string,
    tasks: readonly Task[],
    health: HealthContextInput
  ): DailyPlan {
    const capacityMultiplier = SchedulingPolicy.calculateCapacityMultiplier(health);
    const blockedIds = DependencyGraphEngine.getBlockedTaskIds(tasks);

    // Filter available actionable tasks (not blocked, priority sorted)
    const actionableTasks = tasks
      .filter((t) => !blockedIds.has(t.id) && t.status !== 'completed')
      .sort((a, b) => (a.priority === 'urgent' ? -1 : 1));

    const slots: PlannedTimeSlot[] = [
      { slotId: 'slot_1', timeLabel: '08:00 - 08:30', activityTitle: 'Morning Routine & Water Intake', type: 'routine' },
    ];

    if (capacityMultiplier >= 0.8 && actionableTasks.length > 0) {
      slots.push({
        slotId: 'slot_2',
        timeLabel: '09:00 - 10:30',
        taskId: actionableTasks[0].id,
        activityTitle: `Deep Work: ${actionableTasks[0].title}`,
        type: 'deep_work',
      });
    } else {
      slots.push({
        slotId: 'slot_2',
        timeLabel: '09:00 - 10:00',
        activityTitle: 'Light Focus Work (Reduced Workload)',
        type: 'deep_work',
      });
      slots.push({
        slotId: 'slot_break',
        timeLabel: '10:00 - 10:30',
        activityTitle: 'Hydration & Recovery Break',
        type: 'recovery',
      });
    }

    slots.push({ slotId: 'slot_3', timeLabel: '17:00 - 18:00', activityTitle: 'Exercise & Movement Session', type: 'exercise' });
    slots.push({ slotId: 'slot_4', timeLabel: '21:30 - 22:00', activityTitle: 'Sleep Preparation Routine', type: 'routine' });

    return {
      id: `plan_${date}`,
      userId,
      date,
      slots,
      healthAdjustedCapacity: capacityMultiplier,
      createdAt: new Date(),
    };
  }
}
export default DailyPlanningEngine;
