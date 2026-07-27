/**
 * Workout Query Keys Factory for React Query
 */

export const workoutKeys = {
  all: ['workout'] as const,
  plans: () => [...workoutKeys.all, 'plans'] as const,
  templates: () => [...workoutKeys.all, 'templates'] as const,
  history: () => [...workoutKeys.all, 'history'] as const,
  personalRecords: () => [...workoutKeys.all, 'personalRecords'] as const,
  analytics: () => [...workoutKeys.all, 'analytics'] as const,
  exercises: (searchTerm = '') => [...workoutKeys.all, 'exercises', { searchTerm }] as const,
} as const;
