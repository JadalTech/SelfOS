/**
 * Productivity Recommendation Engine
 * SelfOS v3.0.0 — Batch 14A
 */

export interface RankedProductivityRecommendation {
  readonly title: string;
  readonly category: 'workload' | 'recovery' | 'deadline';
  readonly score: number;
}

export class ProductivityRecommendationEngine {
  static generateRecommendations(capacityMultiplier: number): RankedProductivityRecommendation[] {
    const list: RankedProductivityRecommendation[] = [];

    if (capacityMultiplier < 0.7) {
      list.push({
        title: 'Sleep quality is low: Reschedule deep work tasks to afternoon.',
        category: 'workload',
        score: 95,
      });
      list.push({
        title: 'Insert a 20-min recovery break after morning focus sessions.',
        category: 'recovery',
        score: 90,
      });
    } else {
      list.push({
        title: 'Energy capacity optimal: Focus on high-priority goals today.',
        category: 'workload',
        score: 88,
      });
    }

    return list.sort((a, b) => b.score - a.score);
  }
}
export default ProductivityRecommendationEngine;
