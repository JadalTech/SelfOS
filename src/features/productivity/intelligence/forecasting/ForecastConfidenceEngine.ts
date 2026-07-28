/**
 * Forecast Confidence Engine
 * SelfOS v3.3.0 — Batch 14D
 */

import type { ForecastConfidence } from '../domain/intelligence.types';

export class ForecastConfidenceEngine {
  static computeConfidence(sampleCount: number): ForecastConfidence {
    if (sampleCount >= 10) {
      return { score: 90, rationale: 'High historical sample count (10+ data points)' };
    }
    if (sampleCount >= 5) {
      return { score: 75, rationale: 'Moderate data history' };
    }
    return { score: 50, rationale: 'Low sample count; predictions may vary' };
  }
}
export default ForecastConfidenceEngine;
