/**
 * Insights Module Public API Barrel Export
 * SelfOS v1.5.0 — Batch 12A
 */

export * from './types';
export * from './validation';
export * from './engines';
export * from './pipeline/InsightPipeline';
export * from './repository';
export * from './services';
export * from './hooks';
export * from './utils/AnalyticsAggregator';

// Presentation Layer
export * from './presentation';

// AI Coach Layer
export * from './ai';
