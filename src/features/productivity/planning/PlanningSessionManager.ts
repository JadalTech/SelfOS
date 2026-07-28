/**
 * Planning Session Manager
 * SelfOS v3.0.0 — Batch 14A
 */

import type { DailyPlan } from '../domain/productivity.types';

export class PlanningSessionManager {
  private activePlan: DailyPlan | null = null;

  setActivePlan(plan: DailyPlan): void {
    this.activePlan = plan;
  }

  getActivePlan(): DailyPlan | null {
    return this.activePlan;
  }
}

export const planningSessionManager = new PlanningSessionManager();
export default planningSessionManager;
