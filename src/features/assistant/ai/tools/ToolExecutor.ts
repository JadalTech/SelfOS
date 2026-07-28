/**
 * Tool Executor Layer
 * SelfOS v2.0.0 — Batch 13A
 */

import { AppError } from '../../../../shared/errors/AppError';
import { ok, err } from '../../../../shared/types';
import type { Result } from '../../../../shared/types';

export interface IInsightsRepositoryMock {
  getLatestHealthScore(userId: string): Promise<Result<any, AppError>>;
  getTrends(userId: string): Promise<Result<any[], AppError>>;
}

export class ToolExecutor {
  private repository: IInsightsRepositoryMock | null = null;

  setRepository(repo: IInsightsRepositoryMock): void {
    this.repository = repo;
  }

  async executeTool(userId: string, toolName: string): Promise<Result<any, AppError>> {
    if (!this.repository) {
      return err(new AppError('VALIDATION_ERROR', 'Repository dependency not injected in ToolExecutor'));
    }

    switch (toolName) {
      case 'GetHealthScoreTool':
        return this.repository.getLatestHealthScore(userId);
      case 'GetWorkoutSummaryTool':
        return this.repository.getTrends(userId);
      default:
        return err(new AppError('VALIDATION_ERROR', `Unsupported tool: ${toolName}`));
    }
  }
}

export const toolExecutor = new ToolExecutor();
export default toolExecutor;
