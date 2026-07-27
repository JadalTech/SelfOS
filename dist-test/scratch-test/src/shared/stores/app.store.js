"use strict";
/**
 * App Store
 *
 * Application-level state that isn't feature-specific.
 * Tracks readiness, connectivity, and other global concerns.
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.useAppStore = void 0;
const zustand_1 = require("zustand");
// ---------------------------------------------------------------------------
// Store
// ---------------------------------------------------------------------------
exports.useAppStore = (0, zustand_1.create)()((set) => ({
    isReady: false,
    isOnline: true,
    setReady: (isReady) => set({ isReady }),
    setOnline: (isOnline) => set({ isOnline }),
}));
