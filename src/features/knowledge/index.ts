/**
 * Knowledge Management Feature Public API Barrel Export
 * SelfOS v3.2.0 — Batch 14C
 */

export * from './domain';
export * from './lifecycle/DocumentLifecycle';
export * from './graph/KnowledgeGraphEngine';
export * from './repositories/NoteRepository';
export * from './repositories/JournalRepository';
export * from './notes/NoteEngine';
export * from './services/NoteService';
export * from './services/JournalService';
export * from './vault/KnowledgeVaultService';
export * from './journal/ReflectionEngine';
export * from './journal/ReflectionInsightEngine';
export * from './collections/CollectionManager';
export * from './search/SearchRankingEngine';
export * from './search/KnowledgeSearchEngine';
export * from './recommendations/KnowledgeRecommendationEngine';
export * from './analytics/KnowledgeAnalyticsEngine';
export * from './ai/KnowledgeContextBuilder';
export * from './ai/KnowledgeCoordinator';
export * from './presentation/services/KnowledgeDashboardService';
export * from './presentation/components/Components';
export * from './presentation/viewmodels/ViewModels';
export * from './presentation/screens/KnowledgeScreens';
export * from './hooks/useKnowledge';
