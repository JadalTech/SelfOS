/**
 * Productivity Feature Public API Barrel Export
 * SelfOS v3.0.0 — Batch 14A
 */

export * from './domain';
export * from './graph/DependencyGraphEngine';
export * from './events/ProductivityEventBus';
export * from './lifecycle/ProductivityLifecycles';
export * from './goals/GoalService';
export * from './tasks/TaskService';
export * from './projects/ProjectService';
export * from './planning/DailyPlanningEngine';
export * from './planning/SchedulingPolicy';
export * from './planning/PlanningSessionManager';
export * from './recommendations/ProductivityRecommendationEngine';
export * from './analytics/ProductivityAnalyticsEngine';
export * from './search/ProductivitySearchService';
export * from './notifications/NotificationPolicy';
export * from './ai/ProductivityContextBuilder';
export * from './ai/ProductivityCoordinator';
export * from './presentation/services/ProductivityDashboardService';
export * from './presentation/components/Components';
export * from './presentation/viewmodels/ViewModels';
export * from './presentation/screens/ProductivityScreens';
export * from './hooks/useProductivity';

// Calendar Sub-Feature
export * from './calendar';

// Intelligence Sub-Feature
export * from './intelligence';
