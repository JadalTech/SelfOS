/**
 * Insight Explanation Engine
 * SelfOS v3.3.0 — Batch 14D
 */

export class InsightExplanationEngine {
  static explainRecommendation(recTitle: string, sleepScore?: number): string {
    if (sleepScore !== undefined && sleepScore < 60) {
      return `We recommended "${recTitle}" because your sleep quality score was low (${sleepScore}/100), reducing morning focus capacity.`;
    }
    return `We recommended "${recTitle}" to optimize your goal completion velocity.`;
  }
}
export default InsightExplanationEngine;
