/**
 * Firebase Authentication
 *
 * Exports a lazily-initialized Auth instance.
 * Uses `getReactNativePersistence` with AsyncStorage for auth state persistence.
 *
 * Note: Firebase v12 exports `getReactNativePersistence` from the
 * `firebase/auth/react-native` subpath for React Native projects.
 * If that subpath is unavailable, we fall back to importing from
 * `firebase/auth` with a type assertion (the function exists at runtime
 * even though the default .d.ts does not declare it).
 */

import { initializeAuth, getAuth } from 'firebase/auth';
import type { Auth } from 'firebase/auth';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { getFirebaseApp } from './app';

// Firebase JS SDK v10.12+ / v12 ships getReactNativePersistence in the
// main firebase/auth bundle but the TS typings don't always expose it.
// We import the entire module and extract it to avoid the TS2305 error.
// eslint-disable-next-line @typescript-eslint/no-require-imports
const { getReactNativePersistence } = require('firebase/auth') as {
  getReactNativePersistence: (
    storage: typeof AsyncStorage,
  ) => import('firebase/auth').Persistence;
};

let _auth: Auth | null = null;

/**
 * Returns the Firebase Auth instance, initializing it on first call.
 *
 * Configures auth state persistence with AsyncStorage so that
 * the user's session survives app restarts.
 */
export function getFirebaseAuth(): Auth {
  if (_auth) {
    return _auth;
  }

  const app = getFirebaseApp();

  try {
    // Initialize with React Native persistence on first call
    _auth = initializeAuth(app, {
      persistence: getReactNativePersistence(AsyncStorage),
    });
  } catch {
    // If auth was already initialized (e.g., hot reload), retrieve existing
    _auth = getAuth(app);
  }

  return _auth;
}

