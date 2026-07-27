import { AppError } from '@/shared/errors/AppError';

export interface RequestOptions {
  readonly cooldownMs?: number;
  readonly timeoutMs?: number;
  readonly maxRetries?: number;
}

export class RequestManager {
  private readonly activeRequests = new Map<string, AbortController>();
  private readonly cooldowns = new Map<string, number>();

  /**
   * Executes a task with rate limiting, timeouts, concurrency checks, and retries.
   */
  async execute<T>(
    key: string,
    action: (signal: AbortSignal) => Promise<T>,
    options: RequestOptions = {}
  ): Promise<T> {
    const { cooldownMs = 2000, timeoutMs = 15000, maxRetries = 2 } = options;

    // 1. Cooldown Rate-Limit check
    const now = Date.now();
    const lastRequest = this.cooldowns.get(key) || 0;
    if (now - lastRequest < cooldownMs) {
      throw new AppError(
        'AI_COOLDOWN',
        'Request rate limit exceeded. Please wait a moment before sending another request.',
        { statusCode: 429 }
      );
    }
    this.cooldowns.set(key, now);

    // 2. Duplicate Concurrency check
    if (this.activeRequests.has(key)) {
      const oldController = this.activeRequests.get(key);
      oldController?.abort();
      this.activeRequests.delete(key);
    }

    const controller = new AbortController();
    this.activeRequests.set(key, controller);

    let retryCount = 0;
    let delay = 500;

    while (true) {
      const timeoutId = setTimeout(() => {
        controller.abort();
      }, timeoutMs);

      try {
        if (controller.signal.aborted) {
          throw new AppError('NETWORK_ERROR', 'Request aborted.', { statusCode: 499 });
        }

        const result = await action(controller.signal);
        clearTimeout(timeoutId);
        this.activeRequests.delete(key);
        return result;
      } catch (err: any) {
        clearTimeout(timeoutId);

        const isAbort =
          controller.signal.aborted ||
          err.name === 'AbortError' ||
          err.message?.toLowerCase().includes('abort') ||
          err.code === 'NETWORK_ERROR';
        const isNetwork = err.message?.toLowerCase().includes('network') || err.message?.toLowerCase().includes('fetch');

        if (isNetwork && retryCount < maxRetries && !isAbort) {
          retryCount++;
          await new Promise((resolve) => setTimeout(resolve, delay));
          delay *= 2;
          continue;
        }

        this.activeRequests.delete(key);
        if (isAbort) {
          throw new AppError('NETWORK_ERROR', 'AI Coach request timed out or cancelled.', { statusCode: 408 });
        }
        throw err;
      }
    }
  }

  cancelRequest(key: string): void {
    const controller = this.activeRequests.get(key);
    if (controller) {
      controller.abort();
      this.activeRequests.delete(key);
    }
  }

  cancelAll(): void {
    for (const key of this.activeRequests.keys()) {
      this.cancelRequest(key);
    }
  }
}

export const sleepAIRequestManager = new RequestManager();
