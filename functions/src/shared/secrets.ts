/**
 * Secret Manager Wrapper
 *
 * Centralized secret management for Cloud Functions v2.
 */

import { defineSecret } from 'firebase-functions/params';

// Define centralized secret parameters
export const API_SECRET_KEY = defineSecret('API_SECRET_KEY');

export function getSecretValue(secret: typeof API_SECRET_KEY): string {
  return secret.value();
}
