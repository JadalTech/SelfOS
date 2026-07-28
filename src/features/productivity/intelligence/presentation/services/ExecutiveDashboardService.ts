/**
 * Executive Dashboard Service
 * SelfOS v3.3.0 — Batch 14D
 */

import { ExecutiveDashboardAggregator } from './ExecutiveDashboardAggregator';
import type { ExecutiveSummary } from '../../domain/intelligence.types';

export class ExecutiveDashboardService {
  static async getExecutiveDashboard(userId: string): Promise<ExecutiveSummary> {
    return ExecutiveDashboardAggregator.aggregate(userId);
  }
}
export default ExecutiveDashboardService;
