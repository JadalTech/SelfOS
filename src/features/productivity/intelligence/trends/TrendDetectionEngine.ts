/**
 * Trend Detection Engine
 * SelfOS v3.3.0 — Batch 14D
 */

export interface TrendResult {
  readonly metricName: string;
  readonly direction: 'improving' | 'stable' | 'declining';
  readonly percentageChange: number;
}

export class TrendDetectionEngine {
  static detectTrend(metricName: string, currentVal: number, previousVal: number): TrendResult {
    if (previousVal === 0) return { metricName, direction: 'stable', percentageChange: 0 };
    const pct = Math.round(((currentVal - previousVal) / previousVal) * 100);

    let direction: 'improving' | 'stable' | 'declining' = 'stable';
    if (pct > 5) direction = 'improving';
    if (pct < -5) direction = 'declining';

    return { metricName, direction, percentageChange: pct };
  }
}
export default TrendDetectionEngine;
