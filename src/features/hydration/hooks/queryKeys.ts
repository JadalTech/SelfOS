/**
 * Hydration Query Keys Factory for React Query
 * SelfOS v1.4.0 — Batch 11A
 */

export const hydrationKeys = {
  all: ['hydration'] as const,
  today: () => [...hydrationKeys.all, 'today'] as const,
  entries: (date?: string) => [...hydrationKeys.all, 'entries', { date }] as const,
  summary: (date?: string) => [...hydrationKeys.all, 'summary', { date }] as const,
  goal: () => [...hydrationKeys.all, 'goal'] as const,
  statistics: () => [...hydrationKeys.all, 'statistics'] as const,
  history: (days?: number) => [...hydrationKeys.all, 'history', { days }] as const,
  analytics: () => [...hydrationKeys.all, 'analytics'] as const,
} as const;
