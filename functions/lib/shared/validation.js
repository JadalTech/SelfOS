"use strict";
/**
 * Validation Helpers
 *
 * Input payload and authentication validation utilities for callable functions.
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateAuth = validateAuth;
exports.validateRequiredFields = validateRequiredFields;
const errors_1 = require("./errors");
function validateAuth(request) {
    if (!request.auth || !request.auth.uid) {
        throw (0, errors_1.createHttpsError)('unauthenticated', 'Authentication is required to perform this action.');
    }
    return request.auth.uid;
}
function validateRequiredFields(data, requiredKeys) {
    if (!data || typeof data !== 'object') {
        throw (0, errors_1.createHttpsError)('invalid-argument', 'Request payload must be a non-null object.');
    }
    const record = data;
    for (const key of requiredKeys) {
        if (!(key in record) || record[key] === undefined || record[key] === null) {
            throw (0, errors_1.createHttpsError)('invalid-argument', `Missing required parameter: "${key}"`);
        }
    }
    return data;
}
//# sourceMappingURL=validation.js.map