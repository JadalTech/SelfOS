/**
 * AI Provider Implementations & Selection Factory
 * SelfOS v2.0.0 — Batch 13A
 */

import type { IAIProvider, AIProviderRequest, AIProviderResponse } from './IAIProvider';
import { AppError } from '../../../../shared/errors/AppError';

export class GeminiProvider implements IAIProvider {
  readonly name = 'gemini';

  async generate(request: AIProviderRequest): Promise<AIProviderResponse> {
    const startTime = Date.now();
    const apiKey =
      process.env.EXPO_PUBLIC_FIREBASE_API_KEY ||
      process.env.EXPO_PUBLIC_GEMINI_API_KEY ||
      '';

    if (!apiKey) {
      throw new AppError('AI_SERVICE_ERROR', 'Gemini API key is not configured.');
    }

    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [
            {
              role: 'user',
              parts: [{ text: `${request.systemPrompt}\n\n${request.userPrompt}` }],
            },
          ],
          generationConfig: request.jsonMode
            ? { responseMimeType: 'application/json' }
            : undefined,
        }),
      }
    );

    if (!response.ok) {
      throw new AppError('AI_SERVICE_ERROR', `Gemini API request failed: ${response.status}`);
    }

    const data = await response.json();
    const text = data?.candidates?.[0]?.content?.parts?.[0]?.text;

    if (!text) {
      throw new AppError('AI_SERVICE_ERROR', 'Gemini API returned an empty response.');
    }

    return {
      text,
      latencyMs: Date.now() - startTime,
    };
  }
}

export class OpenAIProvider implements IAIProvider {
  readonly name = 'openai';
  async generate(): Promise<AIProviderResponse> {
    throw new AppError('AI_SERVICE_ERROR', 'OpenAI provider is not configured.');
  }
}

export class ClaudeProvider implements IAIProvider {
  readonly name = 'claude';
  async generate(): Promise<AIProviderResponse> {
    throw new AppError('AI_SERVICE_ERROR', 'Claude provider is not configured.');
  }
}

export class MockProvider implements IAIProvider {
  readonly name = 'mock';

  async generate(request: AIProviderRequest): Promise<AIProviderResponse> {
    const startTime = Date.now();

    const mockResponse = {
      text: 'Hello! I am your SelfOS Assistant. Your unified health index is looking solid. Let me know if you need to optimize workouts.',
      followUpQuestions: ['Should I adjust my sleep schedule?', 'Show my hydration trend details.'],
      actionItems: [{ id: 'act_1', description: 'Drink 250mL water', priority: 'high' }],
      classification: { intentType: 'ask_summary', confidence: 0.95 },
    };

    return {
      text: JSON.stringify(mockResponse),
      latencyMs: Date.now() - startTime,
    };
  }
}

export class AIProviderFactory {
  private static readonly PROVIDERS: Record<'gemini' | 'openai' | 'claude' | 'mock', IAIProvider> = {
    gemini: new GeminiProvider(),
    openai: new OpenAIProvider(),
    claude: new ClaudeProvider(),
    mock: new MockProvider(),
  };

  static getProvider(type?: 'gemini' | 'openai' | 'claude' | 'mock'): IAIProvider {
    if (type && this.PROVIDERS[type]) return this.PROVIDERS[type];

    const apiKey =
      process.env.EXPO_PUBLIC_FIREBASE_API_KEY ||
      process.env.EXPO_PUBLIC_GEMINI_API_KEY ||
      '';

    if (apiKey) return this.PROVIDERS.gemini;
    return this.PROVIDERS.mock;
  }
}
export default AIProviderFactory;
