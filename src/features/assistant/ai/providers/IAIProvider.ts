/**
 * Decoupled Provider Contract Interface
 * SelfOS v2.0.0 — Batch 13A
 */

export interface AIProviderRequest {
  readonly systemPrompt: string;
  readonly userPrompt: string;
  readonly jsonMode?: boolean;
}

export interface AIProviderResponse {
  readonly text: string;
  readonly latencyMs: number;
}

export interface IAIProvider {
  readonly name: 'gemini' | 'openai' | 'claude' | 'mock';
  generate(request: AIProviderRequest): Promise<AIProviderResponse>;
}
export default IAIProvider;
