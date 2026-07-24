import type { ISkinAIProvider } from './ISkinAIProvider';
import type { SkinAIContext, SkinRecommendation, SkinWeeklyReview } from '../types/ai.types';
import { SkinPromptBuilder } from '../utils/SkinPromptBuilder';
import { FallbackHeuristicSkinAIProvider } from './FallbackHeuristicSkinAIProvider';

export class GeminiSkinAIProvider implements ISkinAIProvider {
  readonly name = 'gemini';
  private readonly fallbackProvider = new FallbackHeuristicSkinAIProvider();
  private readonly apiKey: string;

  constructor(apiKey?: string) {
    this.apiKey = apiKey || process.env.EXPO_PUBLIC_FIREBASE_API_KEY || process.env.EXPO_PUBLIC_GEMINI_API_KEY || '';
  }

  async askCoach(question: string, context: SkinAIContext): Promise<string> {
    if (!this.apiKey) {
      return this.fallbackProvider.askCoach(question, context);
    }

    try {
      const prompt = SkinPromptBuilder.buildChatPrompt(question, context);
      const systemPrompt = SkinPromptBuilder.buildSystemPrompt();

      const response = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${this.apiKey}`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            contents: [
              {
                role: 'user',
                parts: [{ text: `${systemPrompt}\n\n${prompt}` }],
              },
            ],
          }),
        }
      );

      if (!response.ok) {
        return this.fallbackProvider.askCoach(question, context);
      }

      const data = await response.json();
      const text = data?.candidates?.[0]?.content?.parts?.[0]?.text;

      if (!text) {
        return this.fallbackProvider.askCoach(question, context);
      }

      return `${text}\n\n(Medical Disclaimer: Educational advice only. Please consult a board-certified dermatologist for medical skin conditions.)`;
    } catch {
      return this.fallbackProvider.askCoach(question, context);
    }
  }

  async streamResponse(
    question: string,
    context: SkinAIContext,
    onChunk: (chunkText: string) => void
  ): Promise<string> {
    const fullText = await this.askCoach(question, context);
    const words = fullText.split(' ');
    let current = '';

    for (const word of words) {
      current += (current ? ' ' : '') + word;
      onChunk(current);
      await new Promise((resolve) => setTimeout(resolve, 20));
    }

    return fullText;
  }

  async generateRecommendations(
    context: SkinAIContext,
    ruleRecommendations?: SkinRecommendation[]
  ): Promise<SkinRecommendation[]> {
    return this.fallbackProvider.generateRecommendations(context, ruleRecommendations);
  }

  async generateWeeklyReview(context: SkinAIContext): Promise<SkinWeeklyReview> {
    return this.fallbackProvider.generateWeeklyReview(context);
  }
}
