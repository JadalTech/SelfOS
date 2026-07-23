/**
 * Reusable Auth Guard Hook
 *
 * Checks authentication status and coordinates redirection using Expo Router.
 * Emits loading state during initial session check or redirects.
 *
 * Safe for layouts to reuse, preventing navigation duplication.
 */

import { useEffect } from 'react';
import { useRouter, useSegments } from 'expo-router';
import { useAuthStore } from '@/shared/stores';

interface RequireAuthResult {
  status: 'unknown' | 'checking' | 'authenticated' | 'unauthenticated';
  isLoading: boolean;
}

export function useRequireAuth(): RequireAuthResult {
  const router = useRouter();
  const segments = useSegments();
  const user = useAuthStore((state) => state.user);
  const status = useAuthStore((state) => state.status);
  const isInitialized = useAuthStore((state) => state.isInitialized);

  const isLoading = !isInitialized || status === 'unknown';

  useEffect(() => {
    if (!isInitialized) return;

    const inAppGroup = segments[0] === '(app)';
    const inAuthGroup = segments[0] === '(auth)';

    if (status === 'authenticated') {
      // If user is authenticated and verified, and trying to access auth screens, redirect to app root
      if (inAuthGroup) {
        router.replace('/(app)');
      }
    } else {
      // Status is unauthenticated or checking
      if (inAppGroup) {
        if (user && !user.emailVerified) {
          // Logged in but email not verified
          router.replace('/(auth)/verify-email');
        } else {
          // Not logged in
          router.replace('/(auth)/login');
        }
      }
    }
  }, [user, status, isInitialized, segments, router]);

  return {
    status,
    isLoading,
  };
}
