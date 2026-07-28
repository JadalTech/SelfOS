/**
 * Recommendation Ranker with Impact Metadata
 * SelfOS v2.0.0 — Batch 13C
 */

export interface RankedRecommendation {
  readonly title: string;
  readonly impactScore: number; // 0-100
  readonly urgency: 'low' | 'medium' | 'high';
}

export class RecommendationRanker {
  static rank(recommendations: string[]): RankedRecommendation[] {
    return recommendations
      .map((title, idx) => ({
        title,
        impactScore: 90 - idx * 10,
        urgency: idx === 0 ? ('high' as const) : ('medium' as const),
      }))
      .sort((a, b) => b.impactScore - a.impactScore);
  }
}
export default RecommendationRanker;
