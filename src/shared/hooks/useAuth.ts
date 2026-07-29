/**
 * useAuth Hook
 *
 * Primary application hook for consuming authentication state from the Zustand store.
 * Pure selector hook with zero framework side effects.
 */

import { useAuthStore } from '@/shared/stores/auth.store';
import type { AppUser, AuthStatus } from '@/shared/stores/auth.store';

export interface UseAuthReturn {
  readonly user: AppUser | null;
  readonly authStatus: AuthStatus;
  readonly isAuthenticated: boolean;
  readonly isInitializing: boolean;
  readonly isEmailVerificationRequired: boolean;
  readonly error: string | null;
}

export function useAuth(): UseAuthReturn {
  const user = useAuthStore((state) => state.user);
  const authStatus = useAuthStore((state) => state.authStatus);
  const error = useAuthStore((state) => state.error);

  return {
    user,
    authStatus,
    isAuthenticated: authStatus === 'authenticated',
    isInitializing: authStatus === 'initializing',
    isEmailVerificationRequired: authStatus === 'email_verification_required',
    error,
  };
}
