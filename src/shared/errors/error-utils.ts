/**
 * Error Utilities
 *
 * Helpers for normalizing arbitrary thrown values and Firebase SDK errors
 * into structured AppError instances.
 */

import { AppError } from './AppError';
import type { AppErrorCode } from './AppError';

// ---------------------------------------------------------------------------
// Firebase Error Code Mapping
// ---------------------------------------------------------------------------

/**
 * Maps Firebase Auth error codes to AppError codes and user-friendly messages.
 * Only the most common codes are mapped; unlisted codes fall through to a
 * generic FIREBASE_ERROR.
 */
const FIREBASE_ERROR_MAP: Record<string, { code: AppErrorCode; message: string }> = {
  // Auth errors
  'auth/invalid-email': {
    code: 'VALIDATION_ERROR',
    message: 'The email address is not valid.',
  },
  'auth/user-disabled': {
    code: 'AUTH_ERROR',
    message: 'This account has been disabled. Please contact support.',
  },
  'auth/user-not-found': {
    code: 'AUTH_ERROR',
    message: 'No account found with this email address.',
  },
  'auth/wrong-password': {
    code: 'AUTH_ERROR',
    message: 'Incorrect password. Please try again.',
  },
  'auth/email-already-in-use': {
    code: 'AUTH_ERROR',
    message: 'An account with this email already exists.',
  },
  'auth/weak-password': {
    code: 'VALIDATION_ERROR',
    message: 'Password is too weak. Please use at least 6 characters.',
  },
  'auth/too-many-requests': {
    code: 'AUTH_ERROR',
    message: 'Too many attempts. Please try again later.',
  },
  'auth/network-request-failed': {
    code: 'NETWORK_ERROR',
    message: 'A network error occurred. Please check your connection.',
  },
  'auth/requires-recent-login': {
    code: 'AUTH_ERROR',
    message: 'This action requires a recent login. Please sign in again.',
  },
  // Firestore errors
  'permission-denied': {
    code: 'PERMISSION_DENIED',
    message: 'You do not have permission to access this data.',
  },
  'not-found': {
    code: 'NOT_FOUND',
    message: 'The requested document was not found.',
  },
  unavailable: {
    code: 'NETWORK_ERROR',
    message: 'The service is currently unavailable. Please try again later.',
  },
};

// ---------------------------------------------------------------------------
// Type Guards
// ---------------------------------------------------------------------------

interface FirebaseErrorLike {
  code: string;
  message: string;
}

function isFirebaseError(error: unknown): error is FirebaseErrorLike {
  return (
    typeof error === 'object' &&
    error !== null &&
    'code' in error &&
    typeof (error as FirebaseErrorLike).code === 'string'
  );
}

// ---------------------------------------------------------------------------
// Normalization
// ---------------------------------------------------------------------------

/**
 * Converts a Firebase SDK error into a structured AppError.
 *
 * Maps known Firebase error codes to user-friendly messages.
 * Unknown Firebase codes are wrapped as FIREBASE_ERROR.
 */
export function normalizeFirebaseError(error: unknown): AppError {
  if (error instanceof AppError) {
    return error;
  }

  if (isFirebaseError(error)) {
    const mapped = FIREBASE_ERROR_MAP[error.code];

    if (mapped) {
      return new AppError(mapped.code, mapped.message, { originalError: error });
    }

    // Unknown Firebase error code — wrap generically
    return new AppError('FIREBASE_ERROR', error.message || 'A Firebase error occurred.', {
      originalError: error,
    });
  }

  return normalizeError(error);
}

/**
 * Converts any thrown value into a structured AppError.
 *
 * Handles: AppError, Error, string, and unknown types.
 */
export function normalizeError(error: unknown): AppError {
  if (error instanceof AppError) {
    return error;
  }

  if (isFirebaseError(error)) {
    return normalizeFirebaseError(error);
  }

  if (error instanceof Error) {
    // Check for common network error patterns
    if (isNetworkError(error)) {
      return AppError.network();
    }

    return new AppError('UNKNOWN_ERROR', error.message, { originalError: error });
  }

  if (typeof error === 'string') {
    return new AppError('UNKNOWN_ERROR', error);
  }

  return AppError.unknown(error);
}

/**
 * Check if an error is a network-related error.
 */
export function isNetworkError(error: unknown): boolean {
  if (error instanceof Error) {
    const message = error.message.toLowerCase();
    return (
      message.includes('network') ||
      message.includes('fetch') ||
      message.includes('timeout') ||
      message.includes('econnrefused') ||
      message.includes('enotfound')
    );
  }
  return false;
}

/**
 * Extract a user-friendly message from any error.
 */
export function getErrorMessage(error: unknown): string {
  const appError = normalizeError(error);
  return appError.message;
}
