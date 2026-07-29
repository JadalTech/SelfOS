/**
 * Auth Store
 *
 * State-only Zustand store for authentication state management.
 * Contains ZERO Firebase SDK logic or direct API calls.
 */

import { create } from 'zustand';
import type { Nullable } from '@/shared/types';
import type { AppUser } from '@/features/auth/domain/entities/AppUser';

export type { AppUser };

/**
 * Single source of truth for authentication lifecycle states.
 * Guarantees mutually exclusive, non-ambiguous state transitions:
 * - initializing: Restoring persistent session on app boot
 * - unauthenticated: User is logged out or session expired
 * - email_verification_required: Authenticated but email verification is pending
 * - authenticated: Fully authenticated user session
 */
export type AuthStatus =
  | 'initializing'
  | 'unauthenticated'
  | 'email_verification_required'
  | 'authenticated';

interface AuthState {
  /** Current authenticated domain user, or null if signed out */
  readonly user: Nullable<AppUser>;
  /** The current authentication status */
  readonly authStatus: AuthStatus;
  /** Optional error message */
  readonly error: Nullable<string>;
}

interface AuthActions {
  /** Sets the active domain user and derives the exact AuthStatus */
  setUser: (user: Nullable<AppUser>) => void;
  /** Clears the user session */
  clearUser: () => void;
  /** Sets or clears an error message */
  setError: (error: Nullable<string>) => void;
  /** Reset store state */
  reset: () => void;
}

const initialState: AuthState = {
  user: null,
  authStatus: 'initializing',
  error: null,
};

export const useAuthStore = create<AuthState & AuthActions>()((set) => ({
  ...initialState,

  setUser: (user) => {
    let status: AuthStatus = 'unauthenticated';

    if (user) {
      status = user.emailVerified ? 'authenticated' : 'email_verification_required';
    }

    set({
      user,
      authStatus: status,
      error: null,
    });
  },

  clearUser: () =>
    set({
      user: null,
      authStatus: 'unauthenticated',
      error: null,
    }),

  setError: (error: Nullable<string>) =>
    set({
      error,
    }),

  reset: () =>
    set({
      user: null,
      authStatus: 'unauthenticated',
      error: null,
    }),
}));
