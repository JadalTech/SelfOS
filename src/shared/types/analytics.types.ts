/**
 * Shared Analytics Contracts & Types
 */

export interface FeatureAnalytics {
  readonly feature: 'nutrition' | 'workout' | 'sleep' | 'hydration' | 'haircare' | 'skincare';
  readonly metric: string;
  readonly value: number;
  readonly score: number; // 0.0 to 1.0 or 1-10
  readonly trend: 'improving' | 'declining' | 'stable';
  readonly timestamp: Date;
}
