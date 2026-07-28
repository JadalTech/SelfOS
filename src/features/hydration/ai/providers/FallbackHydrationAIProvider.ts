import type { IHydrationAIProvider } from './IHydrationAIProvider';
import type { HydrationAIContext, HydrationAIResponse } from '../types/hydrationAI.types';

export class FallbackHydrationAIProvider implements IHydrationAIProvider {
  readonly name = 'fallback';

  async askCoach(
    context: HydrationAIContext,
    prompt: string
  ): Promise<HydrationAIResponse<any>> {
    const startTime = Date.now();

    let text = 'Maintain steady hydration throughout the day.';
    let severity: 'info' | 'warning' | 'critical' = 'info';
    let suggestedML = 250;

    const remainingPercent = context.goalML > 0 ? (context.consumedML / context.goalML) * 100 : 0;

    // Heuristics
    if (remainingPercent < 40) {
      text = 'You have consumed less than 40% of your daily hydration goal. Consider drinking a glass of water now.';
      severity = 'warning';
      suggestedML = 350;
    } else if (remainingPercent >= 100) {
      text = 'Fantastic! You have completed your daily target. Keep it up for tomorrow!';
      severity = 'info';
      suggestedML = 0;
    } else if (context.drinkTypeBreakdown['coffee'] && context.drinkTypeBreakdown['coffee'] > 300) {
      text = 'High caffeine intake detected. Balance your fluid retention by drinking an extra 500 mL of water.';
      severity = 'warning';
      suggestedML = 500;
    }

    // Default structure matching prompts
    const responsePayload = {
      text,
      severity,
      suggestedML,
      // Predictions fallback payload mapping
      expectedFinalIntakeML: context.consumedML + 500,
      goalCompletionProbability: remainingPercent >= 100 ? 1.0 : 0.6,
      expectedNextDrinkTime: '15:00',
      riskScore: remainingPercent < 40 ? 7 : 2,
    };

    return {
      data: responsePayload,
      metadata: {
        provider: 'fallback',
        confidence: 0.7,
        reasoningSource: 'Rule-based heuristic analytics engine',
        generatedAt: new Date(),
        responseVersion: '1.0.0',
        processingTimeMs: Date.now() - startTime,
        cacheHit: false,
        requestId: `req_fallback_${Math.random().toString(36).substring(7)}`,
      },
    };
  }
}
export const fallbackHydrationAIProvider = new FallbackHydrationAIProvider();
