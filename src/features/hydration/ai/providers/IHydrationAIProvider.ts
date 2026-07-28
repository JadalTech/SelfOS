import type { HydrationAIContext, HydrationAIResponse } from '../types/hydrationAI.types';

export interface IHydrationAIProvider {
  readonly name: 'gemini' | 'fallback' | 'mock';

  askCoach(
    context: HydrationAIContext,
    prompt: string
  ): Promise<HydrationAIResponse<any>>;
}
