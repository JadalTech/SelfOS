/**
 * App-level Constants
 *
 * Metadata, timing defaults, and shared configuration values.
 */

export const APP = {
  NAME: 'SelfOS',
  VERSION: '1.0.0',
  SCHEME: 'selfos',
  BUNDLE_ID: 'com.jadaltech.selfos',
} as const;

/** Pagination defaults */
export const PAGINATION = {
  DEFAULT_PAGE_SIZE: 20,
  MAX_PAGE_SIZE: 100,
} as const;

/** Timing constants (milliseconds) */
export const TIMING = {
  /** Debounce delay for search inputs */
  SEARCH_DEBOUNCE: 300,
  /** Animation duration for transitions */
  ANIMATION_DURATION: 250,
  /** Toast auto-dismiss duration */
  TOAST_DURATION: 3000,
} as const;
