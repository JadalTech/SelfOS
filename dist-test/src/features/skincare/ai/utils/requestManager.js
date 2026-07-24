"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.aiRequestManager = exports.RequestManager = void 0;
class RequestManager {
    activeControllers = new Map();
    lastRequestTimestamps = new Map();
    defaultCooldownMs = 1500; // 1.5 second cooldown between AI requests
    getOrCreateSignal(requestId) {
        if (this.activeControllers.has(requestId)) {
            this.cancelRequest(requestId);
        }
        const controller = new AbortController();
        this.activeControllers.set(requestId, controller);
        return controller.signal;
    }
    cancelRequest(requestId) {
        const controller = this.activeControllers.get(requestId);
        if (controller) {
            controller.abort();
            this.activeControllers.delete(requestId);
        }
    }
    checkCooldown(key, cooldownMs = this.defaultCooldownMs) {
        const now = Date.now();
        const last = this.lastRequestTimestamps.get(key) || 0;
        if (now - last < cooldownMs) {
            return false; // Cooldown active, reject request
        }
        this.lastRequestTimestamps.set(key, now);
        return true;
    }
    clearRequest(requestId) {
        this.activeControllers.delete(requestId);
    }
}
exports.RequestManager = RequestManager;
exports.aiRequestManager = new RequestManager();
