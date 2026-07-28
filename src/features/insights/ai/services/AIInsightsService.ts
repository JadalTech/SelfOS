/**
 * AI Insights Coordinator Service
 * SelfOS v1.5.0 — Batch 12C
 */

import { ok, err } from '../../../../shared/types';
import type { Result } from '../../../../shared/types';
import { AppError } from '../../../../shared/errors/AppError';
import { AIProviderFactory } from '../providers/Providers';
import { AIResponseValidator } from '../validators/AIResponseValidator';
import { SystemPrompt, SummaryPrompt } from '../prompts/Prompts';
import { AITelemetry } from '../utils/AITelemetry';
import type { HealthSummary } from '../types/ai.types';

export class AIInsightsService {
  /**
   * Generates coaching health summaries, falling back to mock provider if network fails.
   */
  async getDailySummary(userId: string, contextString: string): Promise<Result<HealthSummary, AppError>> {
    const startTime = Date.now();
    let provider = AIProviderFactory.getProvider();

    try {
      const response = await provider.generate({
        systemPrompt: SystemPrompt,
        userPrompt: `${SummaryPrompt}\nContext: ${contextString}`,
        jsonMode: true,
      });

      const parsed = JSON.parse(response.text);
      const validated = AIResponseValidator.validateHealthSummary(parsed);

      AITelemetry.recordRequest(
        response.tokenUsage?.promptTokens ?? 50,
        response.tokenUsage?.completionTokens ?? 40,
        Date.now() - startTime
      );

      return ok(validated);
    } catch (error) {
      console.warn(`AI Provider ${provider.name} failed. Falling back to mock provider.`, error);
      AITelemetry.recordFallback();

      try {
        const fallbackProvider = AIProviderFactory.getProvider('mock');
        const response = await fallbackProvider.generate({
          systemPrompt: SystemPrompt,
          userPrompt: contextString,
          jsonMode: true,
        });

        const parsed = JSON.parse(response.text);
        const validated = AIResponseValidator.validateHealthSummary(parsed);
        return ok(validated);
      } catch (fallbackError: any) {
        AITelemetry.recordFailure();
        return err(
          new AppError('AI_SERVICE_ERROR', 'All AI providers exhausted.', {
            originalError: fallbackError,
          })
        );
      }
    }
  }
}

export const aiInsightsService = new AIInsightsService();
export default aiInsightsService;
