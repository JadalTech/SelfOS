import type { ISleepAIProvider } from './ISleepAIProvider';
import { GeminiSleepAIProvider } from './GeminiSleepAIProvider';
import { FallbackHeuristicSleepAIProvider } from './FallbackHeuristicSleepAIProvider';
import { MockSleepAIProvider } from './MockSleepAIProvider';

export type ProviderType = 'gemini' | 'heuristic' | 'mock';

export class SleepAIProviderFactory {
  private static instances: Map<ProviderType, ISleepAIProvider> = new Map();

  static getProvider(type: ProviderType = 'heuristic', apiKey?: string): ISleepAIProvider {
    if (this.instances.has(type)) {
      return this.instances.get(type)!;
    }

    let instance: ISleepAIProvider;
    switch (type) {
      case 'gemini':
        instance = new GeminiSleepAIProvider(apiKey);
        break;
      case 'mock':
        instance = new MockSleepAIProvider();
        break;
      case 'heuristic':
      default:
        instance = new FallbackHeuristicSleepAIProvider();
        break;
    }

    this.instances.set(type, instance);
    return instance;
  }

  static clearCache(): void {
    this.instances.clear();
  }
}
