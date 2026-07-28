import type { IHydrationAIProvider } from './IHydrationAIProvider';
import type { HydrationAIContext, HydrationAIResponse } from '../types/hydrationAI.types';

export class MockHydrationAIProvider implements IHydrationAIProvider {
  readonly name = 'mock';

  async askCoach(
    context: HydrationAIContext,
    prompt: string
  ): Promise<HydrationAIResponse<any>> {
    const startTime = Date.now();

    const responsePayload = {
      text: 'Mock coaching advice: Make sure to take sips of electrolyte water after workout routines.',
      severity: 'info',
      suggestedML: 250,
      expectedFinalIntakeML: 2500,
      goalCompletionProbability: 0.9,
      expectedNextDrinkTime: '16:30',
      riskScore: 1,
    };

    return {
      data: responsePayload,
      metadata: {
        provider: 'mock',
        confidence: 0.5,
        reasoningSource: 'Mock hardcoded dataset',
        generatedAt: new Date(),
        responseVersion: '1.0.0',
        processingTimeMs: Date.now() - startTime,
        cacheHit: false,
        requestId: `req_mock_${Math.random().toString(36).substring(7)}`,
      },
    };
  }
}
export const mockHydrationAIProvider = new MockHydrationAIProvider();
