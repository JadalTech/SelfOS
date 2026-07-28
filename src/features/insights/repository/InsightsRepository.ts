/**
 * Unified Repository Facade for Insights Engine
 * SelfOS v1.5.0 — Batch 12A
 */

import { ok, err } from '../../../shared/types';
import type { Result } from '../../../shared/types';
import { AppError } from '../../../shared/errors/AppError';
import type {
  HealthScore,
  Insight,
  Correlation,
  Trend,
  HealthRecommendation,
  Prediction,
} from '../types/insights.types';
import { AnalyticsAggregator } from '../utils/AnalyticsAggregator';
import { InsightPipeline, PipelineOutput } from '../pipeline/InsightPipeline';

export class InsightsRepository {
  private lastCalculation: PipelineOutput | null = null;
  private lastCalculatedAt = 0;

  constructor() {}

  private isCacheValid(): boolean {
    // Cache is valid for 1 hour
    return this.lastCalculation !== null && Date.now() - this.lastCalculatedAt < 60 * 60 * 1000;
  }

  async calculatePipeline(userId: string, force = false): Promise<Result<PipelineOutput, AppError>> {
    try {
      if (!force && this.isCacheValid() && this.lastCalculation) {
        return ok(this.lastCalculation);
      }

      // 1. Gather all sub module analytics
      const analyticsPackage = await AnalyticsAggregator.aggregate(userId);

      // 2. Feed package sequentially through engines pipeline
      const output = InsightPipeline.execute(analyticsPackage);

      // 3. Cache results
      this.lastCalculation = output;
      this.lastCalculatedAt = Date.now();

      return ok(output);
    } catch (error) {
      return err(
        new AppError('UNKNOWN_ERROR', 'Failed to calculate insights pipeline', {
          originalError: error,
        })
      );
    }
  }

  // ---------------------------------------------------------------------------
  // Interface Queries
  // ---------------------------------------------------------------------------

  async getLatestHealthScore(userId: string): Promise<Result<HealthScore | null, AppError>> {
    const res = await this.calculatePipeline(userId);
    return res.success ? ok(res.data.score) : err(res.error);
  }

  async getLatestInsights(userId: string): Promise<Result<Insight[], AppError>> {
    const res = await this.calculatePipeline(userId);
    return res.success ? ok(res.data.insights) : err(res.error);
  }

  async getCorrelations(userId: string): Promise<Result<Correlation[], AppError>> {
    const res = await this.calculatePipeline(userId);
    return res.success ? ok(res.data.correlations) : err(res.error);
  }

  async getTrends(userId: string): Promise<Result<Trend[], AppError>> {
    const res = await this.calculatePipeline(userId);
    return res.success ? ok(res.data.trends) : err(res.error);
  }

  async getRecommendations(userId: string): Promise<Result<HealthRecommendation[], AppError>> {
    const res = await this.calculatePipeline(userId);
    return res.success ? ok(res.data.recommendations) : err(res.error);
  }

  async getPredictions(userId: string): Promise<Result<Prediction | null, AppError>> {
    const res = await this.calculatePipeline(userId);
    return res.success ? ok(res.data.prediction) : err(res.error);
  }

  // ---------------------------------------------------------------------------
  // Cache Management
  // ---------------------------------------------------------------------------

  invalidateCache(): void {
    this.lastCalculation = null;
    this.lastCalculatedAt = 0;
  }
}

export const insightsRepository = new InsightsRepository();
export default insightsRepository;
