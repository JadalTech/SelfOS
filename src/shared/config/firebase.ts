/**
 * Firebase Environment Configuration
 *
 * Validates and exports strongly-typed Firebase configuration read from `process.env`.
 */

import { validateEnvKeys } from './env';

export interface FirebaseConfig {
  readonly apiKey: string;
  readonly authDomain: string;
  readonly projectId: string;
  readonly storageBucket: string;
  readonly messagingSenderId: string;
  readonly appId: string;
}

const FIREBASE_REQUIRED_KEYS = [
  'EXPO_PUBLIC_FIREBASE_API_KEY',
  'EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN',
  'EXPO_PUBLIC_FIREBASE_PROJECT_ID',
  'EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET',
  'EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID',
  'EXPO_PUBLIC_FIREBASE_APP_ID',
] as const;

function loadFirebaseConfig(): FirebaseConfig {
  const envValues = validateEnvKeys(FIREBASE_REQUIRED_KEYS, 'Firebase');

  return Object.freeze({
    apiKey: envValues['EXPO_PUBLIC_FIREBASE_API_KEY'],
    authDomain: envValues['EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN'],
    projectId: envValues['EXPO_PUBLIC_FIREBASE_PROJECT_ID'],
    storageBucket: envValues['EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET'],
    messagingSenderId: envValues['EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID'],
    appId: envValues['EXPO_PUBLIC_FIREBASE_APP_ID'],
  });
}

/**
 * Validated, frozen Firebase configuration object.
 */
export const firebaseConfig: FirebaseConfig = loadFirebaseConfig();
