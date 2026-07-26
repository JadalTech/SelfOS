/**
 * Gemini REST Integration for Workout AI Provider
 */

import type { IWorkoutAIProvider } from './IWorkoutAIProvider';
import type { WorkoutAIContext } from '../types/workoutAI.types';
import type { AIRecommendation, AIWeeklyReview } from '../../../../shared/types/ai.types';
import { FallbackHeuristicWorkoutAIProvider } from './FallbackHeuristicWorkoutAIProvider';
import { WorkoutPromptBuilder } from '../prompts/templates/WorkoutPrompts';

export class GeminiWorkoutAIProvider implements IWorkoutAIProvider {
  readonly name = 'gemini';
  private readonly fallbackProvider = new FallbackHeuristicWorkoutAIProvider();
  private readonly apiKey: string;

  constructor(apiKey?: string) {
    this.apiKey = apiKey || process.env.EXPO_PUBLIC_FIREBASE_API_KEY || process.env.EXPO_PUBLIC_GEMINI_API_KEY || '';
  }

  async askCoach(question: string, context: WorkoutAIContext): Promise<string> {
    if (!this.apiKey) {
      return this.fallbackProvider.askCoach(question, context);
    }

    try {
      const prompt = WorkoutPromptBuilder.buildChatPrompt(question, context);
      const systemPrompt = WorkoutPromptBuilder.buildSystemPrompt();

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

      return `${text}\n\nTrainer Disclaimer: Educational coaching advice only. Consult a physician, certified trainer, or physical therapist before starting any new exercise split or training plan.`;
    } catch {
      return this.fallbackProvider.askCoach(question, context);
    }
  }

  async generateRecommendations(context: WorkoutAIContext): Promise<AIRecommendation[]> {
    if (!this.apiKey) {
      return this.fallbackProvider.generateRecommendations(context);
    }

    try {
      const prompt = WorkoutPromptBuilder.buildRecommendationsPrompt(context);
      const systemPrompt = WorkoutPromptBuilder.buildSystemPrompt();

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

  async generateWeeklyReview(context: WorkoutAIContext): Promise<AIWeeklyReview> {
    if (!this.apiKey) {
      return this.fallbackProvider.generateWeeklyReview(context);
    }

    try {
      const prompt = WorkoutPromptBuilder.buildWeeklyReviewPrompt(context);
      const systemPrompt = WorkoutPromptBuilder.buildSystemPrompt();

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

      return JSON.parse(text);
    } catch {
      return this.fallbackProvider.generateWeeklyReview(context);
    }
  }
}
