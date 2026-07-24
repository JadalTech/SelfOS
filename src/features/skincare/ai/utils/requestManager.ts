export class RequestManager {
  private activeControllers: Map<string, AbortController> = new Map();
  private lastRequestTimestamps: Map<string, number> = new Map();
  private readonly defaultCooldownMs = 1500; // 1.5 second cooldown between AI requests

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
      return false; // Cooldown active, reject request
    }
    this.lastRequestTimestamps.set(key, now);
    return true;
  }

  clearRequest(requestId: string): void {
    this.activeControllers.delete(requestId);
  }
}

export const aiRequestManager = new RequestManager();
