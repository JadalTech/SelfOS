/**
 * Centralized Query Key Factories
 *
 * Provides factory functions for generating structured, type-safe query keys.
 * Eliminates magic string arrays across feature hooks.
 */

export const userKeys = {
  all: ['user'] as const,
  profile: (uid: string) => [...userKeys.all, 'profile', uid] as const,
  preferences: (uid: string) => [...userKeys.all, 'preferences', uid] as const,
  subscription: (uid: string) => [...userKeys.all, 'subscription', uid] as const,
};

export const routineKeys = {
  all: ['routines'] as const,
  lists: (uid: string) => [...routineKeys.all, 'list', uid] as const,
  detail: (uid: string, id: string) => [...routineKeys.all, 'detail', uid, id] as const,
  logs: (uid: string, routineId?: string) => [...routineKeys.all, 'logs', uid, routineId] as const,
};
