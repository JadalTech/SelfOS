/**
 * Common Shared Types
 *
 * Infrastructure-only types used across the application.
 * Feature-specific models belong in their respective feature modules.
 */

// ---------------------------------------------------------------------------
// Result Type — Discriminated union for success/error handling
// ---------------------------------------------------------------------------

export type Result<T, E = Error> =
  | { success: true; data: T }
  | { success: false; error: E };

/** Create a successful Result */
export function ok<T>(data: T): Result<T, never> {
  return { success: true, data };
}

/** Create a failed Result */
export function err<E = Error>(error: E): Result<never, E> {
  return { success: false, error };
}

// ---------------------------------------------------------------------------
// Async State — For tracking async operation state
// ---------------------------------------------------------------------------

export interface AsyncState<T> {
  data: T | null;
  isLoading: boolean;
  error: Error | null;
}

/** Initial async state factory */
export function createAsyncState<T>(initialData: T | null = null): AsyncState<T> {
  return {
    data: initialData,
    isLoading: false,
    error: null,
  };
}

// ---------------------------------------------------------------------------
// Utility Types
// ---------------------------------------------------------------------------

/** Make a type nullable */
export type Nullable<T> = T | null;

/** Make a type nullable or undefined */
export type Optional<T> = T | null | undefined;

/** Theme mode preference */
export type ThemeMode = 'light' | 'dark' | 'system';
