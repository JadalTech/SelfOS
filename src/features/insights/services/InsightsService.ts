/**
 * Orchestrator Service for Insights Engine
 * SelfOS v1.5.0 — Batch 12A
 */

import { insightsRepository, InsightsRepository } from '../repository/InsightsRepository';
import type { Result } from '../../../shared/types';
import type { AppError } from '../../../shared/errors/AppError';
import type {
  HealthScore,
  Insight,
  Correlation,
  Trend,
  HealthRecommendation,
  Prediction,
} from '../types/insights.types';
import type { PipelineOutput } from '../pipeline/InsightPipeline';

export class InsightsService {
  constructor(private readonly repository: InsightsRepository = insightsRepository) {}

  async calculatePipeline(userId: string, force = false): Promise<Result<PipelineOutput, AppError>> {
    return this.repository.calculatePipeline(userId, force);
  }

  async getLatestHealthScore(userId: string): Promise<Result<HealthScore | null, AppError>> {
    return this.repository.getLatestHealthScore(userId);
  }

  async getLatestInsights(userId: string): Promise<Result<Insight[], AppError>> {
    return this.repository.getLatestInsights(userId);
  }

  async getCorrelations(userId: string): Promise<Result<Correlation[], AppError>> {
    return this.repository.getCorrelations(userId);
  }

  async getTrends(userId: string): Promise<Result<Trend[], AppError>> {
    return this.repository.getTrends(userId);
  }

  async getRecommendations(userId: string): Promise<Result<HealthRecommendation[], AppError>> {
    return this.repository.getRecommendations(userId);
  }

  async getPredictions(userId: string): Promise<Result<Prediction | null, AppError>> {
    return this.repository.getPredictions(userId);
  }

  invalidateCache(): void {
    this.repository.invalidateCache();
  }
}

export const insightsService = new InsightsService();
export default insightsService;
