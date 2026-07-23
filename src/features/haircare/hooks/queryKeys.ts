export const haircareKeys = {
  all: ['haircare'] as const,
  products: () => [...haircareKeys.all, 'products'] as const,
  routines: () => [...haircareKeys.all, 'routines'] as const,
  logs: () => [...haircareKeys.all, 'logs'] as const,
  photos: () => [...haircareKeys.all, 'photos'] as const,
  conditions: () => [...haircareKeys.all, 'conditions'] as const,
  ai: () => [...haircareKeys.all, 'ai'] as const,
} as const;
