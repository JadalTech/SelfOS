import { z } from 'zod';
import { emailSchema, passwordSchema, displayNameSchema } from '@/shared/utils/validation';

/**
 * Validation schema for Login credentials.
 */
export const loginSchema = z.object({
  email: emailSchema,
  password: z.string().min(1, 'Password is required'), // Let the backend check correctness, but require input locally
});

export type LoginFields = z.infer<typeof loginSchema>;

/**
 * Validation schema for Registration credentials.
 */
export const registerSchema = z
  .object({
    displayName: displayNameSchema,
    email: emailSchema,
    password: passwordSchema,
    confirmPassword: z.string().min(1, 'Please confirm your password'),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'Passwords do not match',
    path: ['confirmPassword'],
  });

export type RegisterFields = z.infer<typeof registerSchema>;

/**
 * Validation schema for Forgot Password requests.
 */
export const forgotPasswordSchema = z.object({
  email: emailSchema,
});

export type ForgotPasswordFields = z.infer<typeof forgotPasswordSchema>;
