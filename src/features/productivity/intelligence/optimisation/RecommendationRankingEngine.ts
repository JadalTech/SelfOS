/**
 * Recommendation Ranking Engine
 * SelfOS v3.3.0 — Batch 14D
 */

export interface RankedRecommendation {
  readonly title: string;
  readonly score: number;
  readonly rationale: string;
}

export class RecommendationRankingEngine {
  static rankRecommendations(recs: readonly RankedRecommendation[]): RankedRecommendation[] {
    return [...recs].sort((a, b) => b.score - a.score);
  }
}
export default RecommendationRankingEngine;
