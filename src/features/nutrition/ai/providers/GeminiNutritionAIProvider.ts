import type { INutritionAIProvider } from './INutritionAIProvider';
import type { NutritionAIContext } from '../types/nutritionAI.types';
import type { AIRecommendation, AIWeeklyReview } from '../../../../shared/types/ai.types';
import { FallbackHeuristicNutritionAIProvider } from './FallbackHeuristicNutritionAIProvider';
import { NutritionPromptBuilder } from '../prompts/templates/NutritionPrompts';

export class GeminiNutritionAIProvider implements INutritionAIProvider {
  readonly name = 'gemini';
  private readonly fallbackProvider = new FallbackHeuristicNutritionAIProvider();
  private readonly apiKey: string;

  constructor(apiKey?: string) {
    this.apiKey = apiKey || process.env.EXPO_PUBLIC_FIREBASE_API_KEY || process.env.EXPO_PUBLIC_GEMINI_API_KEY || '';
  }

  async askCoach(question: string, context: NutritionAIContext): Promise<string> {
    if (!this.apiKey) {
      return this.fallbackProvider.askCoach(question, context);
    }

    try {
      const prompt = NutritionPromptBuilder.buildChatPrompt(question, context);
      const systemPrompt = NutritionPromptBuilder.buildSystemPrompt();

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

      return `${text}\n\n(Dietitian Disclaimer: Educational advice only. Please consult a registered dietitian or healthcare provider for medical nutritional guidance.)`;
    } catch {
      return this.fallbackProvider.askCoach(question, context);
    }
  }

  async generateRecommendations(context: NutritionAIContext): Promise<AIRecommendation[]> {
    if (!this.apiKey) {
      return this.fallbackProvider.generateRecommendations(context);
    }

    try {
      const prompt = NutritionPromptBuilder.buildRecommendationsPrompt(context);
      const systemPrompt = NutritionPromptBuilder.buildSystemPrompt();

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
            generationConfig: {
              responseMimeType: 'application/json',
            },
          }),
        }
      );

      if (!response.ok) {
        return this.fallbackProvider.generateRecommendations(context);
      }

      const data = await response.json();
      const text = data?.candidates?.[0]?.content?.parts?.[0]?.text;

      if (!text) {
        return this.fallbackProvider.generateRecommendations(context);
      }

      const parsed = JSON.parse(text);
      if (Array.isArray(parsed?.recommendations)) {
        return parsed.recommendations;
      }

      return this.fallbackProvider.generateRecommendations(context);
    } catch {
      return this.fallbackProvider.generateRecommendations(context);
    }
  }

  async generateWeeklyReview(context: NutritionAIContext): Promise<AIWeeklyReview> {
    if (!this.apiKey) {
      return this.fallbackProvider.generateWeeklyReview(context);
    }

    try {
      const prompt = NutritionPromptBuilder.buildWeeklyReviewPrompt(context);
      const systemPrompt = NutritionPromptBuilder.buildSystemPrompt();

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
            generationConfig: {
              responseMimeType: 'application/json',
            },
          }),
        }
      );

      if (!response.ok) {
        return this.fallbackProvider.generateWeeklyReview(context);
      }

      const data = await response.json();
      const text = data?.candidates?.[0]?.content?.parts?.[0]?.text;

      if (!text) {
        return this.fallbackProvider.generateWeeklyReview(context);
      }

      const parsed = JSON.parse(text);
      if (parsed?.summary && Array.isArray(parsed?.highlights)) {
        return parsed;
      }

      return this.fallbackProvider.generateWeeklyReview(context);
    } catch {
      return this.fallbackProvider.generateWeeklyReview(context);
    }
  }
}
