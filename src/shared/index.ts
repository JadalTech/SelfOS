/**
 * Shared Module — Master Barrel Export
 *
 * Single import point for all shared infrastructure.
 *
 * Usage:
 *   import { logger, config, useAuthStore, colors } from '@/shared';
 */

// Config
export { config } from './config';
export type { AppConfig } from './config';

// Firebase
export {
  getFirebaseApp,
  getFirebaseAuth,
  getFirebaseFirestore,
  getFirebaseStorage,
} from './firebase';

// Storage
export { storage } from './storage';
export type { StorageService } from './storage';

// React Query
export { queryClient } from './query';

// Stores
export { useAuthStore, useAppStore, useSettingsStore } from './stores';
export type { AppUser, AuthStatus } from './stores';

// Theme
export { colors, spacing, typography, fontSizes, fontWeights, lineHeights, radius, shadows, shadow } from './theme';

// Constants
export { APP, PAGINATION, TIMING, COLLECTIONS, STORAGE_KEYS } from './constants';

// Types
export type { Result, AsyncState, Nullable, Optional, ThemeMode } from './types';
export { ok, err, createAsyncState } from './types';
export type { FirestoreDocument, CreateDocument, UpdateDocument } from './types';

// Errors
export { AppError, ErrorBoundary, normalizeError, normalizeFirebaseError, isNetworkError, getErrorMessage } from './errors';

// Utils
export {
  logger,
  formatDate, formatTime, formatRelative, isToday, isYesterday, startOfDay, endOfDay, getDayOfWeek,
  emailSchema, passwordSchema, displayNameSchema, validateWith,
  clamp, capitalize, truncate, sleep, isNonNullable, isIOS, isAndroid, isWeb,
} from './utils';

// Components
export { FullScreenLoader, InlineLoader } from './components';

// Providers
export { Providers } from './providers';
