/**
 * Workout AI Request Manager for Cooldowns and Cancellations
 */

export class RequestManager {
  private activeControllers: Map<string, AbortController> = new Map();
  private lastRequestTimestamps: Map<string, number> = new Map();
  private readonly defaultCooldownMs = 1500; // 1.5s cooldown
  private readonly defaultTimeoutMs = 10000; // 10s timeout

  getOrCreateSignal(requestId: string): AbortSignal {
    if (this.activeControllers.has(requestId)) {
      this.cancelRequest(requestId);
    }

    const controller = new AbortController();
    this.activeControllers.set(requestId, controller);
    return controller.signal;
  }

  cancelRequest(requestId: string): void {
    const controller = this.activeControllers.get(requestId);
    if (controller) {
      controller.abort();
      this.activeControllers.delete(requestId);
    }
  }

  checkCooldown(key: string, cooldownMs: number = this.defaultCooldownMs): boolean {
    const now = Date.now();
    const last = this.lastRequestTimestamps.get(key) || 0;
    if (now - last < cooldownMs) {
      return false; // Cooldown active
    }
    this.lastRequestTimestamps.set(key, now);
    return true;
  }

  clearRequest(requestId: string): void {
    this.activeControllers.delete(requestId);
  }

  /**
   * Wraps a promise with a timeout rejection
   */
  async withTimeout<T>(promise: Promise<T>, timeoutMs: number = this.defaultTimeoutMs): Promise<T> {
    let timeoutId: any;
    const timeoutPromise = new Promise<never>((_, reject) => {
      timeoutId = setTimeout(() => {
        reject(new Error(`AI Request timed out after ${timeoutMs}ms`));
      }, timeoutMs);
    });

    try {
      return await Promise.race([promise, timeoutPromise]);
    } finally {
      clearTimeout(timeoutId);
    }
  }
}

export const aiRequestManager = new RequestManager();
