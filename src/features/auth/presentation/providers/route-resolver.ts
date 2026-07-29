/**
 * Route Resolver Utility
 *
 * Pure function determining target navigation path from current state & segment.
 * Single Responsibility: Decision logic only — NO side effects or navigation executions.
 */

import type { AuthStatus } from '@/shared/stores/auth.store';

export type RouteTarget = '/(auth)/login' | '/(auth)/verify-email' | '/(app)' | null;

/**
 * Resolves the destination route based on active AuthStatus and current active segment.
 * Returns `null` if the user is already on the correct route (avoids duplicate redirects).
 */
export function determineDestination(
  authStatus: AuthStatus,
  currentSegment?: string,
): RouteTarget {
  if (authStatus === 'initializing') {
    return null;
  }

  const inAuthGroup = currentSegment === '(auth)';
  const inAppGroup = currentSegment === '(app)';

  switch (authStatus) {
    case 'authenticated':
      // Authenticated users should never stay in (auth) group
      return inAuthGroup || !inAppGroup ? '/(app)' : null;

    case 'email_verification_required':
      // Users pending email verification belong on verify-email screen
      return '/(auth)/verify-email';

    case 'unauthenticated':
      // Unauthenticated users belong in (auth) group
      return inAppGroup || !inAuthGroup ? '/(auth)/login' : null;

    default:
      return null;
  }
}
