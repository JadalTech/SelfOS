export const sleepKeys = {
  all: ['sleep'] as const,
  entries: () => [...sleepKeys.all, 'entries'] as const,
  today: () => [...sleepKeys.all, 'today'] as const,
  schedule: () => [...sleepKeys.all, 'schedule'] as const,
  goals: () => [...sleepKeys.all, 'goals'] as const,
  analytics: () => [...sleepKeys.all, 'analytics'] as const,
  recovery: () => [...sleepKeys.all, 'recovery'] as const,
};
