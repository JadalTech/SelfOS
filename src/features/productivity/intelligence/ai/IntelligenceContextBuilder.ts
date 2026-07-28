/**
 * Intelligence Context Builder for AI Assistant
 * SelfOS v3.3.0 — Batch 14D
 */

import type { LifeInsight, Forecast, WeeklyReview } from '../domain/intelligence.types';

export interface AIExecutiveContext {
  readonly currentLifeScore: number;
  readonly activeForecastSummary?: string;
  readonly lastWeeklyReviewTitle?: string;
}

export class IntelligenceContextBuilder {
  static buildContext(lifeInsight?: LifeInsight, forecast?: Forecast, weeklyReview?: WeeklyReview): AIExecutiveContext {
    return {
      currentLifeScore: lifeInsight?.lifeScore || 80,
      activeForecastSummary: forecast?.description,
      lastWeeklyReviewTitle: weeklyReview?.title,
    };
  }
}
export default IntelligenceContextBuilder;
