/**
 * Application Master Configuration
 *
 * Centralized export point for all environment configurations.
 */

import { firebaseConfig, FirebaseConfig } from './firebase';

export interface AppConfig {
  readonly firebase: FirebaseConfig;
  readonly isDev: boolean;
  readonly isProd: boolean;
}

export const appConfig: AppConfig = Object.freeze({
  firebase: firebaseConfig,
  isDev: __DEV__,
  isProd: !__DEV__,
});

// Backward compatibility alias while maintaining new appConfig standard
export const config = appConfig;

export { firebaseConfig };
export type { FirebaseConfig };
export { readEnv, validateEnvKeys } from './env';
