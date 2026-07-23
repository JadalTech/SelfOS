/**
 * AppError — Structured Application Error
 *
 * Custom error class that provides structured error information
 * for consistent error handling throughout the application.
 *
 * Named constructors simplify creation for common error categories.
 */

export type AppErrorCode =
  | 'NETWORK_ERROR'
  | 'AUTH_ERROR'
  | 'VALIDATION_ERROR'
  | 'STORAGE_ERROR'
  | 'FIREBASE_ERROR'
  | 'NOT_FOUND'
  | 'PERMISSION_DENIED'
  | 'UNKNOWN_ERROR';

export class AppError extends Error {
  readonly code: AppErrorCode;
  readonly statusCode?: number;
  readonly originalError?: unknown;

  constructor(
    code: AppErrorCode,
    message: string,
    options?: {
      statusCode?: number;
      originalError?: unknown;
    },
  ) {
    super(message);
    this.name = 'AppError';
    this.code = code;
    this.statusCode = options?.statusCode;
    this.originalError = options?.originalError;

    // Fix prototype chain for instanceof checks
    Object.setPrototypeOf(this, AppError.prototype);
  }

  // ---------------------------------------------------------------------------
  // Named Constructors
  // ---------------------------------------------------------------------------

  static network(message = 'A network error occurred. Please check your connection.'): AppError {
    return new AppError('NETWORK_ERROR', message, { statusCode: 0 });
  }

  static auth(message = 'Authentication failed. Please sign in again.'): AppError {
    return new AppError('AUTH_ERROR', message, { statusCode: 401 });
  }

  static validation(message: string): AppError {
    return new AppError('VALIDATION_ERROR', message, { statusCode: 400 });
  }

  static notFound(message = 'The requested resource was not found.'): AppError {
    return new AppError('NOT_FOUND', message, { statusCode: 404 });
  }

  static permissionDenied(message = 'You do not have permission to perform this action.'): AppError {
    return new AppError('PERMISSION_DENIED', message, { statusCode: 403 });
  }

  static unknown(originalError?: unknown): AppError {
    return new AppError(
      'UNKNOWN_ERROR',
      'An unexpected error occurred. Please try again.',
      { originalError },
    );
  }
}
