import type { INutritionAIProvider } from './INutritionAIProvider';
import { GeminiNutritionAIProvider } from './GeminiNutritionAIProvider';
import { FallbackHeuristicNutritionAIProvider } from './FallbackHeuristicNutritionAIProvider';
import { MockNutritionAIProvider } from './MockNutritionAIProvider';

export type ProviderType = 'gemini' | 'heuristic' | 'mock';

export class NutritionAIProviderFactory {
  private static cachedProvider: INutritionAIProvider | null = null;

  static getProvider(type: ProviderType = 'heuristic'): INutritionAIProvider {
    if (this.cachedProvider && this.cachedProvider.name === type) {
      return this.cachedProvider;
    }

    switch (type) {
      case 'gemini':
        this.cachedProvider = new GeminiNutritionAIProvider();
        break;
      case 'mock':
        this.cachedProvider = new MockNutritionAIProvider();
        break;
      case 'heuristic':
      default:
        this.cachedProvider = new FallbackHeuristicNutritionAIProvider();
        break;
    }

    return this.cachedProvider;
  }
}
