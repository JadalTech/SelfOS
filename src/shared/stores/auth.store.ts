/**
 * Auth Store
 *
 * State-only store for authentication status.
 * Does NOT contain any Firebase logic — that belongs in
 * the auth feature service layer (future batch).
 */

import { create } from 'zustand';
import type { Nullable } from '@/shared/types';

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

/** Minimal user representation for the store */
export interface AuthUser {
  uid: string;
  email: Nullable<string>;
  displayName: Nullable<string>;
  photoURL: Nullable<string>;
}

interface AuthState {
  /** Current authenticated user, or null if signed out */
  user: Nullable<AuthUser>;
  /** Whether an auth operation is in progress */
  isLoading: boolean;
  /** Whether the initial auth state has been determined */
  isInitialized: boolean;
  /** Whether a user is currently authenticated */
  isAuthenticated: boolean;
}

interface AuthActions {
  setUser: (user: Nullable<AuthUser>) => void;
  setLoading: (isLoading: boolean) => void;
  setInitialized: (isInitialized: boolean) => void;
  reset: () => void;
}

// ---------------------------------------------------------------------------
// Initial State
// ---------------------------------------------------------------------------

const initialState: AuthState = {
  user: null,
  isLoading: true,
  isInitialized: false,
  isAuthenticated: false,
};

// ---------------------------------------------------------------------------
// Store
// ---------------------------------------------------------------------------

export const useAuthStore = create<AuthState & AuthActions>()((set) => ({
  ...initialState,

  setUser: (user) =>
    set({
      user,
      isAuthenticated: user !== null,
      isLoading: false,
    }),

  setLoading: (isLoading) => set({ isLoading }),

  setInitialized: (isInitialized) => set({ isInitialized }),

  reset: () => set(initialState),
}));
