/**
 * Request Manager for Hydration AICoach
 * SelfOS v1.4.0 — Batch 11C Revision
 */

export interface RequestOptions {
  readonly priority?: 'low' | 'high';
  readonly timeoutMs?: number;
  readonly retries?: number;
}

export class HydrationAIRequestManager {
  private readonly pendingRequests = new Map<string, Promise<any>>();

  async execute<T>(
    key: string,
    action: () => Promise<T>,
    options: RequestOptions = {}
  ): Promise<T> {
    const { timeoutMs = 8000, retries = 2 } = options;

    // Deduplication check
    const existing = this.pendingRequests.get(key);
    if (existing) return existing;

    const promise = this.executeWithRetry(action, retries, timeoutMs, key);
    this.pendingRequests.set(key, promise);

    try {
      return await promise;
    } finally {
      this.pendingRequests.delete(key);
    }
  }

  private async executeWithRetry<T>(
    action: () => Promise<T>,
    retriesLeft: number,
    timeoutMs: number,
    key: string
  ): Promise<T> {
    try {
      return await this.withTimeout(action(), timeoutMs);
    } catch (err) {
      if (retriesLeft > 0) {
        console.warn(`Action failed for key ${key}, retrying. Retries left: ${retriesLeft}`);
        // Exponential backoff delay
        await new Promise((res) => setTimeout(res, (3 - retriesLeft) * 1000));
        return this.executeWithRetry(action, retriesLeft - 1, timeoutMs, key);
      }
      throw err;
    }
  }

  private withTimeout<T>(promise: Promise<T>, ms: number): Promise<T> {
    return Promise.race([
      promise,
      new Promise<T>((_, reject) =>
        setTimeout(() => reject(new Error('AI Request Timeout exceeded')), ms)
      ),
    ]);
  }
}
export const hydrationAIRequestManager = new HydrationAIRequestManager();
export default hydrationAIRequestManager;
