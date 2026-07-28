/**
 * Generic Card & Assistant Widget Registry
 * SelfOS v2.0.0 — Batch 13B
 */

export interface CardRegistryEntry {
  readonly id: string;
  readonly cardName: string;
  readonly cardVersion: string;
  readonly featureFlagEnabled: boolean;
  readonly defaultOrder: number;
}

export class AssistantWidgetRegistry {
  private static readonly CARDS: Record<string, CardRegistryEntry> = {
    'health-score-card': { id: 'health-score-card', cardName: 'HealthScoreCard', cardVersion: '1.0', featureFlagEnabled: true, defaultOrder: 1 },
    'recommendation-card': { id: 'recommendation-card', cardName: 'RecommendationCard', cardVersion: '1.0', featureFlagEnabled: true, defaultOrder: 2 },
    'prediction-card': { id: 'prediction-card', cardName: 'PredictionCard', cardVersion: '1.0', featureFlagEnabled: true, defaultOrder: 3 },
  };

  getRegisteredCards(): CardRegistryEntry[] {
    return Object.values(AssistantWidgetRegistry.CARDS)
      .filter((c) => c.featureFlagEnabled)
      .sort((a, b) => a.defaultOrder - b.defaultOrder);
  }
}

export const assistantWidgetRegistry = new AssistantWidgetRegistry();
export default assistantWidgetRegistry;
