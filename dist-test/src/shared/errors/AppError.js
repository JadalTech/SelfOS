"use strict";
/**
 * AppError — Structured Application Error
 *
 * Custom error class that provides structured error information
 * for consistent error handling throughout the application.
 *
 * Named constructors simplify creation for common error categories.
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppError = void 0;
class AppError extends Error {
    code;
    statusCode;
    originalError;
    constructor(code, message, options) {
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
    static network(message = 'A network error occurred. Please check your connection.') {
        return new AppError('NETWORK_ERROR', message, { statusCode: 0 });
    }
    static auth(message = 'Authentication failed. Please sign in again.') {
        return new AppError('AUTH_ERROR', message, { statusCode: 401 });
    }
    static validation(message) {
        return new AppError('VALIDATION_ERROR', message, { statusCode: 400 });
    }
    static notFound(message = 'The requested resource was not found.') {
        return new AppError('NOT_FOUND', message, { statusCode: 404 });
    }
    static permissionDenied(message = 'You do not have permission to perform this action.') {
        return new AppError('PERMISSION_DENIED', message, { statusCode: 403 });
    }
    static unknown(originalError) {
        return new AppError('UNKNOWN_ERROR', 'An unexpected error occurred. Please try again.', { originalError });
    }
}
exports.AppError = AppError;
