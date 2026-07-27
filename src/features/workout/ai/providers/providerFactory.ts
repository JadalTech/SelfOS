/**
 * Workout AI Provider Factory
 */

import type { IWorkoutAIProvider } from './IWorkoutAIProvider';
import { GeminiWorkoutAIProvider } from './GeminiWorkoutAIProvider';
import { FallbackHeuristicWorkoutAIProvider } from './FallbackHeuristicWorkoutAIProvider';
import { MockWorkoutAIProvider } from './MockWorkoutAIProvider';

export type ProviderType = 'gemini' | 'heuristic' | 'mock';

export class WorkoutAIProviderFactory {
  private static cachedProvider: IWorkoutAIProvider | null = null;

  static getProvider(type: ProviderType = 'heuristic'): IWorkoutAIProvider {
    if (this.cachedProvider && this.cachedProvider.name === type) {
      return this.cachedProvider;
    }

    switch (type) {
      case 'gemini':
        this.cachedProvider = new GeminiWorkoutAIProvider();
        break;
      case 'mock':
        this.cachedProvider = new MockWorkoutAIProvider();
        break;
      case 'heuristic':
      default:
        this.cachedProvider = new FallbackHeuristicWorkoutAIProvider();
        break;
    }

    return this.cachedProvider;
  }
}
