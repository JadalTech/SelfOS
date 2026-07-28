/**
 * Interchangeable AI Providers & Selection Factory
 * SelfOS v1.5.0 — Batch 12C
 */

import type { IAIProvider, AIProviderRequest, AIProviderResponse } from './IAIProvider';
import { AppError } from '../../../../shared/errors/AppError';

// =========================================================================
// 1. Gemini Provider
// =========================================================================

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
      tokenUsage: { promptTokens: 150, completionTokens: 100 },
    };
  }
}

// =========================================================================
// 2. OpenAI Provider
// =========================================================================

export class OpenAIProvider implements IAIProvider {
  readonly name = 'openai';

  async generate(request: AIProviderRequest): Promise<AIProviderResponse> {
    const startTime = Date.now();
    // Simulate OpenAI API call
    return {
      text: '{"openaiMock": true}',
      latencyMs: Date.now() - startTime,
      tokenUsage: { promptTokens: 120, completionTokens: 80 },
    };
  }
}

// =========================================================================
// 3. Claude Provider
// =========================================================================

export class ClaudeProvider implements IAIProvider {
  readonly name = 'claude';

  async generate(request: AIProviderRequest): Promise<AIProviderResponse> {
    const startTime = Date.now();
    // Simulate Anthropic Claude API call
    return {
      text: '{"claudeMock": true}',
      latencyMs: Date.now() - startTime,
      tokenUsage: { promptTokens: 130, completionTokens: 90 },
    };
  }
}

// =========================================================================
// 4. Mock Provider (Deterministic fallbacks)
// =========================================================================

export class MockProvider implements IAIProvider {
  readonly name = 'mock';

  async generate(request: AIProviderRequest): Promise<AIProviderResponse> {
    const startTime = Date.now();

    const mockSummary = {
      overallHealthScore: 8,
      wins: ['You maintained solid hydration goals throughout the week.'],
      areasForImprovement: ['Workout volume is slightly lower than your target.'],
      priorityRecommendation: 'Incorporate 15 minutes of dynamic stretching daily.',
      motivation: 'You are on track to hitting your personal streak targets!',
      explainability: {
        reasoning: 'Derived from active hydration statistics exceeding 2200mL and lower training counts.',
        supportingInsights: ['Hydration is excellent.', 'Workout volume needs focus.'],
        referencedMetrics: { hydrationML: 2200 },
        sourceModules: ['hydration', 'workout'],
        confidence: 0.85,
        generatedFrom: 'score_mock',
      },
      versioning: {
        promptVersion: '1.0',
        templateVersion: '1.0',
        providerVersion: 'mock-1.0',
        generatedAt: new Date(),
      },
    };

    return {
      text: JSON.stringify(mockSummary),
      latencyMs: Date.now() - startTime,
      tokenUsage: { promptTokens: 50, completionTokens: 40 },
    };
  }
}

// =========================================================================
// 5. Provider Selection Factory
// =========================================================================

export class AIProviderFactory {
  private static readonly PROVIDERS: Record<'gemini' | 'openai' | 'claude' | 'mock', IAIProvider> = {
    gemini: new GeminiProvider(),
    openai: new OpenAIProvider(),
    claude: new ClaudeProvider(),
    mock: new MockProvider(),
  };

  static getProvider(type?: 'gemini' | 'openai' | 'claude' | 'mock'): IAIProvider {
    if (type && this.PROVIDERS[type]) return this.PROVIDERS[type];

    // Fallback Selection Strategy: Check Gemini API keys
    const apiKey =
      process.env.EXPO_PUBLIC_FIREBASE_API_KEY ||
      process.env.EXPO_PUBLIC_GEMINI_API_KEY ||
      '';

    if (apiKey) return this.PROVIDERS.gemini;
    return this.PROVIDERS.mock;
  }
}
