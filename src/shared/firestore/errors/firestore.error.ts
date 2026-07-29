/**
 * Firestore Error Normalizer
 */

import { AppError } from '@/shared/errors/AppError';

interface FirestoreErrorLike {
  code: string;
  message: string;
}

function isFirestoreError(error: unknown): error is FirestoreErrorLike {
  return (
    typeof error === 'object' &&
    error !== null &&
    'code' in error &&
    typeof (error as FirestoreErrorLike).code === 'string'
  );
}

/**
 * Normalizes raw Firestore SDK errors into structured AppErrors.
 */
export function normalizeFirestoreError(error: unknown): AppError {
  if (error instanceof AppError) {
    return error;
  }

  if (isFirestoreError(error)) {
    switch (error.code) {
      case 'permission-denied':
        return new AppError('PERMISSION_DENIED', 'Access denied. You do not have permission to perform this operation.', {
          originalError: error,
        });

      case 'not-found':
        return new AppError('NOT_FOUND', 'The requested record was not found.', {
          originalError: error,
        });

      case 'already-exists':
        return new AppError('VALIDATION_ERROR', 'A document with this ID already exists.', {
          originalError: error,
        });

      case 'resource-exhausted':
        return new AppError('NETWORK_ERROR', 'Quota exceeded or system busy. Please try again later.', {
          originalError: error,
        });

      case 'unavailable':
        return new AppError('NETWORK_ERROR', 'Firestore service is currently offline or unreachable.', {
          originalError: error,
        });

      default:
        return new AppError('FIREBASE_ERROR', error.message || 'A database error occurred.', {
          originalError: error,
        });
    }
  }

  return new AppError('UNKNOWN_ERROR', 'An unexpected database error occurred.', {
    originalError: error,
  });
}
