/**
 * Provider-Agnostic AI Interface
 * SelfOS v1.5.0 — Batch 12C
 */

export interface AIProviderRequest {
  readonly systemPrompt: string;
  readonly userPrompt: string;
  readonly jsonMode?: boolean;
}

export interface AIProviderResponse {
  readonly text: string;
  readonly tokenUsage?: {
    readonly promptTokens: number;
    readonly completionTokens: number;
  };
  readonly latencyMs: number;
}

export interface IAIProvider {
  readonly name: 'gemini' | 'openai' | 'claude' | 'mock';
  generate(request: AIProviderRequest): Promise<AIProviderResponse>;
}
export default IAIProvider;
