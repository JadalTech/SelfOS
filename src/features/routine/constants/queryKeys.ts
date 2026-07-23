/**
 * Query Keys Factory for Routine Feature
 *
 * Provides type-safe, hierarchical Query Keys for React Query cache management.
 * Prevents string duplication and inline array errors.
 */

export const routineKeys = {
  all: ['routines'] as const,
  lists: () => [...routineKeys.all, 'list'] as const,
  list: (filters?: { type?: string; status?: string }) =>
    [...routineKeys.lists(), filters] as const,
  details: () => [...routineKeys.all, 'detail'] as const,
  detail: (id: string) => [...routineKeys.details(), id] as const,
  logs: (routineId: string) => [...routineKeys.all, 'logs', routineId] as const,
  logsByDate: (routineId: string, startDate?: string, endDate?: string) =>
    [...routineKeys.logs(routineId), { startDate, endDate }] as const,
} as const;
