/**
 * Response Fusion Service
 * SelfOS v1.5.0 — Batch 12C
 */

export class ResponseFusionService {
  /**
   * Merges, prioritizes, deduplicates, and resolves conflicts.
   */
  static fuseRecommendations(recs: string[]): string[] {
    const unique = Array.from(new Set(recs));
    // Dynamic prioritizing or conflicting resolutions:
    // e.g. "Rest and recover" overrides "Push harder workouts" if both exist
    const hasFatigue = unique.some((r) => r.toLowerCase().includes('fatigue') || r.toLowerCase().includes('rest'));
    
    if (hasFatigue) {
      return unique.filter((r) => !r.toLowerCase().includes('push harder') && !r.toLowerCase().includes('overload'));
    }
    
    return unique;
  }
}
export default ResponseFusionService;
