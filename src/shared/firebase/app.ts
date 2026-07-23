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

import { initializeApp, getApps, getApp } from 'firebase/app';
import type { FirebaseApp } from 'firebase/app';
import { config } from '@/shared/config';

let _app: FirebaseApp | null = null;

/**
 * Returns the Firebase app instance, initializing it on first call.
 *
 * - Singleton: always returns the same instance.
 * - Safe to call from multiple modules/files.
 * - Guards against duplicate initialization via `getApps()`.
 */
export function getFirebaseApp(): FirebaseApp {
  if (_app) {
    return _app;
  }

  // Guard: if Firebase was already initialized elsewhere (e.g., hot reload),
  // reuse the existing app instead of creating a duplicate.
  if (getApps().length > 0) {
    _app = getApp();
    return _app;
  }

  _app = initializeApp({
    apiKey: config.firebase.apiKey,
    authDomain: config.firebase.authDomain,
    projectId: config.firebase.projectId,
    storageBucket: config.firebase.storageBucket,
    messagingSenderId: config.firebase.messagingSenderId,
    appId: config.firebase.appId,
    measurementId: config.firebase.measurementId,
  });

  return _app;
}
