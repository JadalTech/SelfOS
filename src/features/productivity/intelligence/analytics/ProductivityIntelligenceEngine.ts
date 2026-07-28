/**
 * Deep Productivity Intelligence Analytics Engine
 * SelfOS v3.3.0 — Batch 14D
 */

import type { ProductivityHealth } from '../domain/intelligence.types';

export class ProductivityIntelligenceEngine {
  static evaluateProductivityHealth(completedTasks: number, totalTasks: number): ProductivityHealth {
    const rate = totalTasks > 0 ? completedTasks / totalTasks : 1.0;
    const score = Math.round(rate * 100);

    let status: 'optimal' | 'balanced' | 'overloaded' = 'balanced';
    if (score >= 80) status = 'optimal';
    if (totalTasks > 12 && rate < 0.5) status = 'overloaded';

    return { score, status };
  }
}
export default ProductivityIntelligenceEngine;
