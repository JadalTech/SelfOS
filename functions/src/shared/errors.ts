/**
 * Shared Error Handlers
 *
 * Normalizes internal errors and throws standard HttpsError instances.
 */

/* eslint-disable @typescript-eslint/no-explicit-any */
let HttpsErrorClass: any;

try {
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  HttpsErrorClass = require('firebase-functions/v2/https').HttpsError;
} catch {
  // Mock fallback HttpsError class for standalone test runner
  HttpsErrorClass = class MockHttpsError extends Error {
    public code: string;
    public details: any;
    constructor(code: string, message: string, details?: any) {
      super(message);
      this.code = code;
      this.details = details;
    }
  };
}

export function createHttpsError(code: any, message: string, details?: unknown): any {
  return new HttpsErrorClass(code, message, details);
}

export function normalizeCallableError(error: unknown, contextName: string): any {
  if (error && typeof error === 'object' && 'code' in error && 'message' in error) {
    return error;
  }

  const message = error instanceof Error ? error.message : 'An internal error occurred.';
  return new HttpsErrorClass('internal', message);
}
