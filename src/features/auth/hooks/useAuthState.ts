/**
 * Auth State Listener Hook
 *
 * Listens for Firebase Auth state changes and syncs them to the Zustand store.
 * Mounted once at the application root layout to avoid duplicate listeners.
 */

import { useEffect } from 'react';
import { onAuthStateChanged } from 'firebase/auth';
import { getFirebaseAuth } from '@/shared/firebase';
import { useAuthStore } from '@/shared/stores';
import { mapFirebaseUser } from '../repository/auth.repository';
import { logger } from '@/shared/utils';

export function useAuthState(): void {
  const setUser = useAuthStore((state) => state.setUser);

  useEffect(() => {
    logger.info('AuthStateListener', 'Subscribing to Firebase Auth state changes...');
    const auth = getFirebaseAuth();

    const unsubscribe = onAuthStateChanged(
      auth,
      (user) => {
        if (user) {
          logger.info('AuthStateListener', `User session changed: ${user.email} (Verified: ${user.emailVerified})`);
          setUser(mapFirebaseUser(user));
        } else {
          logger.info('AuthStateListener', 'User session changed: signed out');
          setUser(null);
        }
      },
      (error) => {
        logger.error('AuthStateListener', 'Listener error caught', error);
        setUser(null);
      }
    );

    return () => {
      logger.info('AuthStateListener', 'Unsubscribing from state changes...');
      unsubscribe();
    };
  }, [setUser]);
}
