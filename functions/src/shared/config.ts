/**
 * Cloud Functions Centralized Configuration
 *
 * Single source of truth for Cloud Functions v2 region, memory limits,
 * runtime options, and emulator environment detection.
 */

export interface CloudFunctionConfig {
  readonly region: string;
  readonly defaultMemory: '128MiB' | '256MiB' | '512MiB' | '1GiB';
  readonly defaultTimeoutSeconds: number;
  readonly isEmulator: boolean;
  readonly environment: string;
}

export const FUNCTION_CONFIG: CloudFunctionConfig = {
  region: process.env.LOCATION_ID || 'asia-south1',
  defaultMemory: '256MiB',
  defaultTimeoutSeconds: 60,
  isEmulator: process.env.FUNCTIONS_EMULATOR === 'true' || Boolean(process.env.FIREBASE_EMULATOR_HUB),
  environment: process.env.NODE_ENV || 'development',
};
