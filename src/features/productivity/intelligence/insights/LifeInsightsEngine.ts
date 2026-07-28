/**
 * Life Insights Engine
 * SelfOS v3.3.0 — Batch 14D
 */

import type { LifeInsight } from '../domain/intelligence.types';

export class LifeInsightsEngine {
  static computeLifeInsight(
    healthScore: number,
    productivityScore: number,
    writingStreak: number
  ): LifeInsight {
    const lifeScore = Math.round(healthScore * 0.4 + productivityScore * 0.5 + Math.min(10, writingStreak) * 1);
    const growthScore = Math.min(100, Math.round(productivityScore * 1.1));
    const balanceScore = Math.round((healthScore + productivityScore) / 2);
    const wellbeingScore = Math.round(healthScore * 0.95);

    return {
      id: `li_${Date.now()}`,
      type: 'insight',
      title: 'Unified Life Performance Score',
      description: `Overall Life Score: ${lifeScore}/100`,
      lifeScore: Math.min(100, lifeScore),
      growthScore,
      balanceScore,
      wellbeingScore,
      timestamp: new Date(),
    };
  }
}
export default LifeInsightsEngine;
