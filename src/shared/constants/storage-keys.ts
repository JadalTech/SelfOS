/**
 * Storage Key Constants
 *
 * Centralized keys for the StorageService.
 * Prevents magic strings and enables easy refactoring.
 */

export const STORAGE_KEYS = {
  // Auth
  AUTH_TOKEN: '@selfos/auth-token',
  AUTH_USER: '@selfos/auth-user',

  // Settings & Preferences
  SETTINGS: '@selfos/settings',
  THEME_MODE: '@selfos/theme-mode',
  NOTIFICATIONS_ENABLED: '@selfos/notifications-enabled',
  HAPTIC_ENABLED: '@selfos/haptic-enabled',

  // Onboarding
  ONBOARDING_COMPLETE: '@selfos/onboarding-complete',

  // Cache
  LAST_SYNC: '@selfos/last-sync',
} as const;

export type StorageKey = (typeof STORAGE_KEYS)[keyof typeof STORAGE_KEYS];
