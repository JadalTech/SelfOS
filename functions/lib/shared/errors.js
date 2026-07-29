"use strict";
/**
 * Shared Error Handlers
 *
 * Normalizes internal errors and throws standard HttpsError instances.
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.createHttpsError = createHttpsError;
exports.normalizeCallableError = normalizeCallableError;
/* eslint-disable @typescript-eslint/no-explicit-any */
let HttpsErrorClass;
try {
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    HttpsErrorClass = require('firebase-functions/v2/https').HttpsError;
}
catch {
    // Mock fallback HttpsError class for standalone test runner
    HttpsErrorClass = class MockHttpsError extends Error {
        code;
        details;
        constructor(code, message, details) {
            super(message);
            this.code = code;
            this.details = details;
        }
    };
}
function createHttpsError(code, message, details) {
    return new HttpsErrorClass(code, message, details);
}
function normalizeCallableError(error, contextName) {
    if (error && typeof error === 'object' && 'code' in error && 'message' in error) {
        return error;
    }
    const message = error instanceof Error ? error.message : 'An internal error occurred.';
    return new HttpsErrorClass('internal', message);
}
//# sourceMappingURL=errors.js.map