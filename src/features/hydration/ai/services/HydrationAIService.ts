/**
 * Hydration AI Service
 * SelfOS v1.4.0 — Batch 11C Revision
 */

import { ok, err } from '../../../../shared/types';
import type { Result } from '../../../../shared/types';
import { AppError } from '../../../../shared/errors/AppError';
import type {
  HydrationAdvice,
  HydrationPrediction,
  HydrationAIContext,
  HydrationMessage,
} from '../types/hydrationAI.types';
import { HydrationAIProviderFactory } from '../providers/providerFactory';
import { HydrationPromptBuilder } from '../prompts/HydrationPromptBuilder';
import { HydrationAIResponseValidator } from '../utils/responseValidator';
import { hydrationAIRequestManager } from '../utils/requestManager';

export class HydrationAIService {
  constructor(
    private readonly requestManager = hydrationAIRequestManager
  ) {}

  /**
   * Generates coaching advice. Includes provider fallback (Gemini -> Heuristics Fallback -> Mock).
   */
  async getCoachingAdvice(
    userId: string,
    context: HydrationAIContext
  ): Promise<Result<HydrationAdvice, AppError>> {
    const cacheKey = `advice_${userId}`;

    return this.requestManager.execute(
      cacheKey,
      async () => {
        // Compose prompt
        const prompt = HydrationPromptBuilder.buildDailyCoachPrompt(context);

        // Selection fallback strategies
        let provider = HydrationAIProviderFactory.getProvider();
        let response;

        try {
          response = await provider.askCoach(context, prompt);
        } catch (error) {
          console.warn(`Gemini Coach request failed. Falling back to heuristic provider.`, error);
          provider = HydrationAIProviderFactory.getProvider('fallback');
          try {
            response = await provider.askCoach(context, prompt);
          } catch (fbError) {
            console.warn(`Heuristic Coach request failed. Falling back to mock provider.`, fbError);
            provider = HydrationAIProviderFactory.getProvider('mock');
            response = await provider.askCoach(context, prompt);
          }
        }

        // Validate and secure
        const validated = HydrationAIResponseValidator.validateAdvice(response.data);
        return ok(validated);
      },
      { priority: 'high' }
    );
  }

  /**
   * Generates future hydration predictions.
   */
  async getPredictions(
    userId: string,
    context: HydrationAIContext
  ): Promise<Result<HydrationPrediction, AppError>> {
    const cacheKey = `predictions_${userId}`;

    return this.requestManager.execute(
      cacheKey,
      async () => {
        const prompt = HydrationPromptBuilder.buildPredictionPrompt(context);

        let provider = HydrationAIProviderFactory.getProvider();
        let response;

        try {
          response = await provider.askCoach(context, prompt);
        } catch (error) {
          console.warn(`Gemini predictions failed. Falling back to heuristic provider.`, error);
          provider = HydrationAIProviderFactory.getProvider('fallback');
          try {
            response = await provider.askCoach(context, prompt);
          } catch (fbError) {
            provider = HydrationAIProviderFactory.getProvider('mock');
            response = await provider.askCoach(context, prompt);
          }
        }

        const validated = HydrationAIResponseValidator.validatePredictions(response.data);
        return ok(validated);
      }
    );
  }
}

export const hydrationAIService = new HydrationAIService();
export default hydrationAIService;
