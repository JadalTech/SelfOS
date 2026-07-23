/**
 * Validation Utilities
 *
 * Common Zod schemas and a typed validation helper.
 * Used by React Hook Form and direct validation.
 */

import { z } from 'zod';
import type { Result } from '@/shared/types';
import { ok, err } from '@/shared/types';

// ---------------------------------------------------------------------------
// Common Schemas
// ---------------------------------------------------------------------------

export const emailSchema = z
  .string()
  .trim()
  .min(1, 'Email is required')
  .email('Please enter a valid email address');

export const passwordSchema = z
  .string()
  .min(6, 'Password must be at least 6 characters');

export const displayNameSchema = z
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
export function validateWith<T>(
  schema: z.ZodSchema<T>,
  data: unknown,
): Result<T, z.ZodError> {
  const parsed = schema.safeParse(data);
  if (parsed.success) {
    return ok(parsed.data);
  }
  return err(parsed.error);
}
