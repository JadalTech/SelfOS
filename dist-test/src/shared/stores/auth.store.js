"use strict";
/**
 * Auth Store
 *
 * State-only store for authentication status.
 * Contains no Firebase logic.
 *
 * Supports four states to prevent UI flickering:
 * - unknown: App startup, token not yet verified
 * - checking: Explicit auth action in progress (login/register/refresh)
 * - authenticated: User is logged in and email is verified
 * - unauthenticated: User is logged out or email is unverified
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.useAuthStore = void 0;
const zustand_1 = require("zustand");
// ---------------------------------------------------------------------------
// Initial State
// ---------------------------------------------------------------------------
const initialState = {
    user: null,
    status: 'unknown',
    isInitialized: false,
};
// ---------------------------------------------------------------------------
// Store
// ---------------------------------------------------------------------------
exports.useAuthStore = (0, zustand_1.create)()((set) => ({
    ...initialState,
    setUser: (user) => set({
        user,
        status: user ? (user.emailVerified ? 'authenticated' : 'unauthenticated') : 'unauthenticated',
        isInitialized: true,
    }),
    setChecking: () => set({
        status: 'checking',
    }),
    reset: () => set({
        user: null,
        status: 'unauthenticated',
        isInitialized: true,
    }),
}));
