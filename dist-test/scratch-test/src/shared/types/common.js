"use strict";
/**
 * Common Shared Types
 *
 * Infrastructure-only types used across the application.
 * Feature-specific models belong in their respective feature modules.
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.ok = ok;
exports.err = err;
exports.createAsyncState = createAsyncState;
/** Create a successful Result */
function ok(data) {
    return { success: true, data };
}
/** Create a failed Result */
function err(error) {
    return { success: false, error };
}
/** Initial async state factory */
function createAsyncState(initialData = null) {
    return {
        data: initialData,
        isLoading: false,
        error: null,
    };
}
