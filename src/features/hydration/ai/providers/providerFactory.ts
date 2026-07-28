import type { IHydrationAIProvider } from './IHydrationAIProvider';
import { geminiHydrationAIProvider } from './GeminiHydrationAIProvider';
import { fallbackHydrationAIProvider } from './FallbackHydrationAIProvider';
import { mockHydrationAIProvider } from './MockHydrationAIProvider';

export type ProviderType = 'gemini' | 'fallback' | 'mock';

export class HydrationAIProviderFactory {
  static getProvider(type?: ProviderType): IHydrationAIProvider {
    if (type === 'gemini') return geminiHydrationAIProvider;
    if (type === 'fallback') return fallbackHydrationAIProvider;
    if (type === 'mock') return mockHydrationAIProvider;

    // Default Selection Strategy: Try Gemini (if Key exists in environment) else Fallback to offline heuristics
    const apiKey =
      process.env.EXPO_PUBLIC_FIREBASE_API_KEY ||
      process.env.EXPO_PUBLIC_GEMINI_API_KEY ||
      '';

    if (apiKey) {
      return geminiHydrationAIProvider;
    }
    return fallbackHydrationAIProvider;
  }
}
