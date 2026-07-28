/**
 * Hydration Module Public API Barrel Export
 * SelfOS v1.4.0 — Batch 11A
 */

// Domain Types
export * from './types';

// Constants
export * from './constants/hydration.constants';

// Validation Schemas
export * from './validation/hydration.validation';

// Pure Engine
export * from './engine/hydrationEngine';

// Analytics
export * from './analytics/hydrationAnalytics';

// Repository Contracts & Implementation
export * from './repository/contracts';
export * from './repository/hydration.repository';

// Mappers
export * from './mappers';

// Firestore Converters
export * from './firestore/converters';

// React Query Hooks
export * from './hooks/queryKeys';
export * from './hooks/useHydration';

// Services
export { hydrationService, HydrationService } from './services/hydration.service';

// Presentation Layer
export * from './presentation';

// AI Coach Layer
export * from './ai';
