import type { ISkinAIProvider } from './ISkinAIProvider';
import { GeminiSkinAIProvider } from './GeminiSkinAIProvider';
import { FallbackHeuristicSkinAIProvider } from './FallbackHeuristicSkinAIProvider';
import { MockSkinAIProvider } from './MockSkinAIProvider';

export type ProviderType = 'gemini' | 'heuristic' | 'mock';

export class SkinAIProviderFactory {
  private static cachedProvider: ISkinAIProvider | null = null;

  static getProvider(type: ProviderType = 'heuristic'): ISkinAIProvider {
    if (this.cachedProvider && this.cachedProvider.name === type) {
      return this.cachedProvider;
    }

    switch (type) {
      case 'gemini':
        this.cachedProvider = new GeminiSkinAIProvider();
        break;
      case 'mock':
        this.cachedProvider = new MockSkinAIProvider();
        break;
      case 'heuristic':
      default:
        this.cachedProvider = new FallbackHeuristicSkinAIProvider();
        break;
    }

    return this.cachedProvider;
  }
}
