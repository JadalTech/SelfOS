/**
 * General-Purpose Helpers
 *
 * Only utilities that are immediately reusable across multiple features.
 * No speculative helpers — add when a real need arises.
 */

import { Platform } from 'react-native';

/**
 * Clamp a number between a minimum and maximum value.
 */
export function clamp(value: number, min: number, max: number): number {
  return Math.min(Math.max(value, min), max);
}

/**
 * Capitalize the first letter of a string.
 */
export function capitalize(str: string): string {
  if (str.length === 0) return str;
  return str.charAt(0).toUpperCase() + str.slice(1);
}

/**
 * Truncate a string to a given length, appending '…' if truncated.
 */
export function truncate(str: string, maxLength: number): string {
  if (str.length <= maxLength) return str;
  return str.slice(0, maxLength - 1) + '…';
}

/**
 * Promise-based delay.
 */
export function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

/**
 * Type guard to filter out null and undefined values.
 *
 * Usage:
 *   const items = [1, null, 2, undefined].filter(isNonNullable);
 *   // items: number[]
 */
export function isNonNullable<T>(value: T): value is NonNullable<T> {
  return value !== null && value !== undefined;
}

/**
 * Check if the current platform is iOS.
 */
export const isIOS = Platform.OS === 'ios';

/**
 * Check if the current platform is Android.
 */
export const isAndroid = Platform.OS === 'android';

/**
 * Check if the current platform is web.
 */
export const isWeb = Platform.OS === 'web';
