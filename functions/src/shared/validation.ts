/**
 * Validation Helpers
 *
 * Input payload and authentication validation utilities for callable functions.
 */

import { createHttpsError } from './errors';

export interface CallableContextAuth {
  uid: string;
  token?: Record<string, unknown>;
}

export interface GenericCallableRequest<T = unknown> {
  auth?: CallableContextAuth | null;
  data: T;
}

export function validateAuth(request: GenericCallableRequest): string {
  if (!request.auth || !request.auth.uid) {
    throw createHttpsError('unauthenticated', 'Authentication is required to perform this action.');
  }
  return request.auth.uid;
}

export function validateRequiredFields<T extends object>(data: unknown, requiredKeys: (keyof T)[]): T {
  if (!data || typeof data !== 'object') {
    throw createHttpsError('invalid-argument', 'Request payload must be a non-null object.');
  }

  const record = data as Record<string, unknown>;
  for (const key of requiredKeys as string[]) {
    if (!(key in record) || record[key] === undefined || record[key] === null) {
      throw createHttpsError('invalid-argument', `Missing required parameter: "${key}"`);
    }
  }

  return data as T;
}
