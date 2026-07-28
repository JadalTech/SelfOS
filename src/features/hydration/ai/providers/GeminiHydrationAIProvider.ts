import type { IHydrationAIProvider } from './IHydrationAIProvider';
import type { HydrationAIContext, HydrationAIResponse } from '../types/hydrationAI.types';
import { AppError } from '../../../../shared/errors/AppError';

export class GeminiHydrationAIProvider implements IHydrationAIProvider {
  readonly name = 'gemini';
  private readonly apiKey: string;

  constructor(apiKey?: string) {
    this.apiKey =
      apiKey ||
      process.env.EXPO_PUBLIC_FIREBASE_API_KEY ||
      process.env.EXPO_PUBLIC_GEMINI_API_KEY ||
      '';
  }

  async askCoach(
    context: HydrationAIContext,
    prompt: string
  ): Promise<HydrationAIResponse<any>> {
    if (!this.apiKey) {
      throw new AppError('AI_SERVICE_ERROR', 'Gemini API key is not configured.');
    }

    const startTime = Date.now();
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${this.apiKey}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [
            {
              role: 'user',
              parts: [{ text: prompt }],
            },
          ],
          generationConfig: {
            responseMimeType: 'application/json',
          },
        }),
      }
    );

    if (!response.ok) {
      throw new AppError('AI_SERVICE_ERROR', `Gemini request failed: ${response.status}`);
    }

    const data = await response.json();
    const text = data?.candidates?.[0]?.content?.parts?.[0]?.text;

    if (!text) {
      throw new AppError('AI_SERVICE_ERROR', 'Gemini returned empty payload.');
    }

    const parsed = JSON.parse(text);

    return {
      data: parsed,
      metadata: {
        provider: 'gemini',
        confidence: 0.9,
        reasoningSource: 'Gemini LLM inference parameters',
        generatedAt: new Date(),
        responseVersion: '1.0.0',
        processingTimeMs: Date.now() - startTime,
        cacheHit: false,
        requestId: `req_${Math.random().toString(36).substring(7)}`,
      },
    };
  }
}
export const geminiHydrationAIProvider = new GeminiHydrationAIProvider();
