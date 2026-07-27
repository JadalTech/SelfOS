"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.forgotPasswordSchema = exports.registerSchema = exports.loginSchema = void 0;
const zod_1 = require("zod");
const validation_1 = require("@/shared/utils/validation");
/**
 * Validation schema for Login credentials.
 */
exports.loginSchema = zod_1.z.object({
    email: validation_1.emailSchema,
    password: zod_1.z.string().min(1, 'Password is required'), // Let the backend check correctness, but require input locally
});
/**
 * Validation schema for Registration credentials.
 */
exports.registerSchema = zod_1.z
    .object({
    displayName: validation_1.displayNameSchema,
    email: validation_1.emailSchema,
    password: validation_1.passwordSchema,
    confirmPassword: zod_1.z.string().min(1, 'Please confirm your password'),
})
    .refine((data) => data.password === data.confirmPassword, {
    message: 'Passwords do not match',
    path: ['confirmPassword'],
});
/**
 * Validation schema for Forgot Password requests.
 */
exports.forgotPasswordSchema = zod_1.z.object({
    email: validation_1.emailSchema,
});
