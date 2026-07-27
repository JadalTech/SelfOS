import type { ISleepAIProvider } from './ISleepAIProvider';
import type { SleepAIContext, SleepRecommendation, SleepWeeklyReview } from '../types/sleepAI.types';
import { SleepPromptBuilder } from '../prompts/SleepPromptBuilder';
import { AppError } from '@/shared/errors/AppError';

export class GeminiSleepAIProvider implements ISleepAIProvider {
  readonly name = 'gemini';
  private readonly apiKey: string;

  constructor(apiKey?: string) {
    this.apiKey =
      apiKey ||
      process.env.EXPO_PUBLIC_FIREBASE_API_KEY ||
      process.env.EXPO_PUBLIC_GEMINI_API_KEY ||
      '';
  }

  async askCoach(question: string, context: SleepAIContext): Promise<string> {
    if (!this.apiKey) {
      throw new AppError('AI_SERVICE_ERROR', 'Gemini API key is not configured.');
    }

    const prompt = SleepPromptBuilder.buildChatPrompt(question, context);
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
        }),
      }
    );

    if (!response.ok) {
      throw new AppError('AI_SERVICE_ERROR', `Gemini request failed with status: ${response.status}`);
    }

    const data = await response.json();
    const text = data?.candidates?.[0]?.content?.parts?.[0]?.text;

    if (!text) {
      throw new AppError('AI_SERVICE_ERROR', 'Gemini returned an empty response.');
    }

    return `${text.trim()}\n\n(Coach Disclaimer: Educational advice only. Consult a physician for chronic sleep problems.)`;
  }

  async generateRecommendations(context: SleepAIContext): Promise<SleepRecommendation[]> {
    if (!this.apiKey) {
      throw new AppError('AI_SERVICE_ERROR', 'Gemini API key is not configured.');
    }

    const prompt = SleepPromptBuilder.buildRecommendationsPrompt(context);
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
      throw new AppError('AI_SERVICE_ERROR', `Gemini recommendations failed with status: ${response.status}`);
    }

    const data = await response.json();
    const text = data?.candidates?.[0]?.content?.parts?.[0]?.text;

    if (!text) {
      throw new AppError('AI_SERVICE_ERROR', 'Gemini returned empty recommendations.');
    }

    const parsed = JSON.parse(text);
    if (Array.isArray(parsed?.recommendations)) {
      return parsed.recommendations;
    }

    throw new AppError('AI_SERVICE_ERROR', 'Failed to parse Gemini recommendations array.');
  }

  async generateWeeklyReview(context: SleepAIContext): Promise<SleepWeeklyReview> {
    if (!this.apiKey) {
      throw new AppError('AI_SERVICE_ERROR', 'Gemini API key is not configured.');
    }

    const prompt = SleepPromptBuilder.buildWeeklyReviewPrompt(context);
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
      throw new AppError('AI_SERVICE_ERROR', `Gemini weekly review failed with status: ${response.status}`);
    }

    const data = await response.json();
    const text = data?.candidates?.[0]?.content?.parts?.[0]?.text;

    if (!text) {
      throw new AppError('AI_SERVICE_ERROR', 'Gemini returned empty weekly review.');
    }

    const parsed = JSON.parse(text);
    if (parsed?.summary && Array.isArray(parsed?.highlights)) {
      return parsed;
    }

    throw new AppError('AI_SERVICE_ERROR', 'Failed to parse Gemini weekly review structure.');
  }
}
