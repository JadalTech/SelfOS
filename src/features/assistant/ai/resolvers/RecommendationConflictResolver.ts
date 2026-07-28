/**
 * Recommendation Conflict Resolver
 * SelfOS v2.0.0 — Batch 13C
 */

export class RecommendationConflictResolver {
  static resolveConflicts(recommendations: string[]): string[] {
    // Remove duplicates
    const unique = Array.from(new Set(recommendations));
    return unique;
  }
}
export default RecommendationConflictResolver;
