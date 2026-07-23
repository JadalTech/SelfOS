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

import { create } from 'zustand';
import type { Nullable } from '@/shared/types';

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export interface AppUser {
  readonly uid: string;
  readonly email: string | null;
  readonly displayName: string | null;
  readonly photoURL: string | null;
  readonly emailVerified: boolean;
}

export type AuthStatus = 'unknown' | 'checking' | 'authenticated' | 'unauthenticated';

interface AuthState {
  /** Current authenticated user, or null if signed out/unverified */
  user: Nullable<AppUser>;
  /** The current authentication status */
  status: AuthStatus;
  /** Whether the initial session check has finished */
  isInitialized: boolean;
}

interface AuthActions {
  /** Sets the user and transitions the status accordingly */
  setUser: (user: Nullable<AppUser>) => void;
  /** Explicitly sets the checking status */
  setChecking: () => void;
  /** Reset the store to initial unauthenticated state */
  reset: () => void;
}

// ---------------------------------------------------------------------------
// Initial State
// ---------------------------------------------------------------------------

const initialState: AuthState = {
  user: null,
  status: 'unknown',
  isInitialized: false,
};

// ---------------------------------------------------------------------------
// Store
// ---------------------------------------------------------------------------

export const useAuthStore = create<AuthState & AuthActions>()((set) => ({
  ...initialState,

  setUser: (user) =>
    set({
      user,
      status: user ? (user.emailVerified ? 'authenticated' : 'unauthenticated') : 'unauthenticated',
      isInitialized: true,
    }),

  setChecking: () =>
    set({
      status: 'checking',
    }),

  reset: () =>
    set({
      user: null,
      status: 'unauthenticated',
      isInitialized: true,
    }),
}));

