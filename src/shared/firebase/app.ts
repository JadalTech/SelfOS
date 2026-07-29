/**
 * Firebase App Initialization
 *
 * Lazy singleton pattern — Firebase is NOT initialized at import time.
 * Instead, `getFirebaseApp()` initializes on first call and returns
 * the cached instance on subsequent calls.
 *
 * This avoids eager initialization during app startup and ensures
 * Firebase is only loaded when actually needed.
 */

import { firebaseConfig } from '@/shared/config';
import { getApp, getApps, initializeApp } from 'firebase/app';
import type { FirebaseAppInstance } from './types';

let _app: FirebaseAppInstance | null = null;

/**
 * Returns the Firebase app instance, initializing it on first call.
 *
 * - Singleton: always returns the same instance.
 * - Safe to call from multiple modules/files.
 * - Guards against duplicate initialization via `getApps()`.
 */
export function getFirebaseApp(): FirebaseAppInstance {
  if (_app) {
    return _app;
  }

  // Guard: if Firebase was already initialized elsewhere (e.g., hot reload),
  // reuse the existing app instead of creating a duplicate.
  if (getApps().length > 0) {
    _app = getApp();
    return _app;
  }

  _app = initializeApp(firebaseConfig);

  return _app;
}
