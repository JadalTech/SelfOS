/**
 * Recommendation Lifecycle Manager
 * SelfOS v2.0.0 — Batch 13C
 */

export type RecommendationState = 'New' | 'Accepted' | 'Dismissed' | 'Snoozed' | 'Completed' | 'Expired';

export interface ManagedRecommendation {
  readonly id: string;
  readonly title: string;
  readonly state: RecommendationState;
  readonly updatedAt: Date;
}

export class RecommendationLifecycleManager {
  private readonly states = new Map<string, ManagedRecommendation>();

  track(id: string, title: string): ManagedRecommendation {
    const item: ManagedRecommendation = {
      id,
      title,
      state: 'New',
      updatedAt: new Date(),
    };
    this.states.set(id, item);
    return item;
  }

  updateState(id: string, newState: RecommendationState): ManagedRecommendation | null {
    const item = this.states.get(id);
    if (!item) return null;

    const updated = {
      ...item,
      state: newState,
      updatedAt: new Date(),
    };
    this.states.set(id, updated);
    return updated;
  }
}

export const recommendationLifecycleManager = new RecommendationLifecycleManager();
export default recommendationLifecycleManager;
