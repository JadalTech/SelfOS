/**
 * Nutrition Query Keys Factory for React Query
 */

export const nutritionKeys = {
  all: ['nutrition'] as const,
  foods: () => [...nutritionKeys.all, 'foods'] as const,
  foodSearch: (searchTerm: string) => [...nutritionKeys.foods(), { searchTerm }] as const,
  logs: () => [...nutritionKeys.all, 'logs'] as const,
  logByDate: (date: string) => [...nutritionKeys.logs(), { date }] as const,
  goals: () => [...nutritionKeys.all, 'goals'] as const,
  templates: () => [...nutritionKeys.all, 'templates'] as const,
  analytics: () => [...nutritionKeys.all, 'analytics'] as const,
} as const;
