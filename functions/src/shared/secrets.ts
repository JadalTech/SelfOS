/**
 * Secret Manager Wrapper
 *
 * Centralized secret management for Cloud Functions v2.
 */

import { defineSecret, SecretParam } from 'firebase-functions/params';

// Define centralized secret parameters
export const API_SECRET_KEY: SecretParam = defineSecret('API_SECRET_KEY');

export function getSecretValue(secret: SecretParam): string {
  return secret.value();
}
