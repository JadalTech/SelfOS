/**
 * Proactive Recommendation Engine & Policy Controls
 * SelfOS v2.0.0 — Batch 13C
 */

export interface ProactivePolicy {
  readonly maxPerDay: number;
  readonly quietHoursStart: number; // e.g. 22 for 10 PM
  readonly quietHoursEnd: number;   // e.g. 7 for 7 AM
}

export class ProactiveRecommendationEngine {
  private readonly policy: ProactivePolicy = {
    maxPerDay: 3,
    quietHoursStart: 22,
    quietHoursEnd: 7,
  };

  generateProactiveTips(currentHour: number, currentDailyCount: number): string[] {
    if (currentDailyCount >= this.policy.maxPerDay) {
      return []; // Daily limit reached
    }

    if (currentHour >= this.policy.quietHoursStart || currentHour < this.policy.quietHoursEnd) {
      return []; // Quiet hours active
    }

    return ['Proactive Tip: Drink 250mL water to hit your afternoon hydration target.'];
  }
}

export const proactiveRecommendationEngine = new ProactiveRecommendationEngine();
export default proactiveRecommendationEngine;
