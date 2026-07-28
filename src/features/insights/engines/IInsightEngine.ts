/**
 * Reusable Engine Contract Interface
 * SelfOS v1.5.0 — Batch 12A
 */

import type { UnifiedAnalyticsPackage } from '../types/aggregator.types';

export interface IInsightEngine<TOutput> {
  calculate(analytics: UnifiedAnalyticsPackage): TOutput;
}
export default IInsightEngine;
