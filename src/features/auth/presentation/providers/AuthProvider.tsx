/**
 * Authentication Context Provider
 *
 * Listens to session changes via `authRepository.onAuthStateChanged()`
 * and updates the Zustand `useAuthStore`.
 *
 * Ensures exactly one subscription is maintained across the component tree lifecycle.
 */

import React, { useEffect } from 'react';
import { authRepository } from '../repository/auth.repository';
import { useAuthStore } from '@/shared/stores/auth.store';
import { queryClient } from '@/shared/react-query/client';

interface AuthProviderProps {
  children: React.ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const setUser = useAuthStore((state) => state.setUser);
  const setError = useAuthStore((state) => state.setError);

  useEffect(() => {
    // Register exactly one listener via repository abstraction
    const unsubscribe = authRepository.onAuthStateChanged((user) => {
      try {
        if (!user) {
          // Clear query cache on logout to prevent session data leaks
          queryClient.clear();
        }
        setUser(user);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to update authentication state');
      }
    });

    return () => {
      unsubscribe();
    };
  }, [setUser, setError]);

  return <>{children}</>;
};
