"use strict";
/**
 * Validation Utilities
 *
 * Common Zod schemas and a typed validation helper.
 * Used by React Hook Form and direct validation.
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.displayNameSchema = exports.passwordSchema = exports.emailSchema = void 0;
exports.validateWith = validateWith;
const zod_1 = require("zod");
const types_1 = require("@/shared/types");
// ---------------------------------------------------------------------------
// Common Schemas
// ---------------------------------------------------------------------------
exports.emailSchema = zod_1.z
    .string()
    .trim()
    .min(1, 'Email is required')
    .email('Please enter a valid email address');
exports.passwordSchema = zod_1.z
    .string()
    .min(6, 'Password must be at least 6 characters');
exports.displayNameSchema = zod_1.z
    .string()
    .trim()
    .min(1, 'Name is required')
    .max(100, 'Name is too long');
// ---------------------------------------------------------------------------
// Validation Helper
// ---------------------------------------------------------------------------
/**
 * Validate data against a Zod schema, returning a Result.
 *
 * Usage:
 *   const result = validateWith(emailSchema, userInput);
 *   if (result.success) {
 *     sendEmail(result.data);
 *   } else {
 *     showError(result.error.message);
 *   }
 */
function validateWith(schema, data) {
    const parsed = schema.safeParse(data);
    if (parsed.success) {
        return (0, types_1.ok)(parsed.data);
    }
    return (0, types_1.err)(parsed.error);
}
