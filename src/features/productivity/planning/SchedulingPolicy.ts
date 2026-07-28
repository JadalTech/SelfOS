/**
 * Health-Aware Scheduling Policy
 * SelfOS v3.0.0 — Batch 14A
 */

export interface HealthContextInput {
  readonly sleepQualityScore?: number; // 0-100
  readonly workoutFatigueScore?: number; // 0-100
  readonly hydrationIndexScore?: number; // 0-100
}

export class SchedulingPolicy {
  /**
   * Calculates a capacity multiplier (0.4 to 1.0) based on health indicators.
   */
  static calculateCapacityMultiplier(health: HealthContextInput): number {
    let capacity = 1.0;

    // Poor sleep reduces deep work capacity by 30%
    if (health.sleepQualityScore !== undefined && health.sleepQualityScore < 60) {
      capacity -= 0.3;
    }

    // High workout fatigue reduces workload by 20%
    if (health.workoutFatigueScore !== undefined && health.workoutFatigueScore > 75) {
      capacity -= 0.2;
    }

    // Low hydration reduces capacity by 10%
    if (health.hydrationIndexScore !== undefined && health.hydrationIndexScore < 50) {
      capacity -= 0.1;
    }

    return Math.max(0.4, Math.round(capacity * 100) / 100);
  }
}
export default SchedulingPolicy;
