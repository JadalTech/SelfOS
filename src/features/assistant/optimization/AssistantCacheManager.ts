/**
 * Assistant Cache Manager
 * SelfOS v2.0.0 — Batch 13D
 */

export class AssistantCacheManager {
  private readonly cache = new Map<string, any>();

  set<T>(key: string, value: T): void {
    this.cache.set(key, value);
  }

  get<T>(key: string): T | undefined {
    return this.cache.get(key) as T | undefined;
  }

  clear(): void {
    this.cache.clear();
  }
}

export const assistantCacheManager = new AssistantCacheManager();
export default assistantCacheManager;
