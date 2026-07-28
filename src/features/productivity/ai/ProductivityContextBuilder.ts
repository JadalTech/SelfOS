/**
 * Productivity Context Builder for AI Assistant
 * SelfOS v3.0.0 — Batch 14A
 */

import type { Goal, Task, Project, DailyPlan } from '../domain/productivity.types';

export interface AIProductivityContext {
  readonly activeGoalsCount: number;
  readonly openTasksCount: number;
  readonly activeProjectsCount: number;
  readonly todayPlanSlotsCount: number;
}

export class ProductivityContextBuilder {
  static buildContext(
    goals: readonly Goal[],
    tasks: readonly Task[],
    projects: readonly Project[],
    dailyPlan?: DailyPlan
  ): AIProductivityContext {
    return {
      activeGoalsCount: goals.filter((g) => g.status === 'active').length,
      openTasksCount: tasks.filter((t) => t.status !== 'completed').length,
      activeProjectsCount: projects.filter((p) => p.status === 'active').length,
      todayPlanSlotsCount: dailyPlan?.slots.length || 0,
    };
  }
}
export default ProductivityContextBuilder;
