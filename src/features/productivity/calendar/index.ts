/**
 * Calendar Feature Public API Barrel Export
 * SelfOS v3.1.0 — Batch 14B
 */

export * from './domain';
export * from './repositories/CalendarRepository';
export * from './services/CalendarService';
export * from './events/CalendarEventBus';
export * from './recurrence/RecurrenceEngine';
export * from './timeblocks/TimeBlockingEngine';
export * from './timeblocks/ScheduleTemplateEngine';
export * from './availability/AvailabilityManager';
export * from './scheduling/SchedulingEngine';
export * from './scheduling/SchedulingPolicyEngine';
export * from './scheduling/ScheduleSimulationEngine';
export * from './scheduling/ScheduleScoreEngine';
export * from './scheduling/ScheduleOptimisationEngine';
export * from './conflicts/ConflictDetectionEngine';
export * from './focus/FocusSessionEngine';
export * from './analytics/CalendarAnalyticsEngine';
export * from './ai/CalendarContextBuilder';
export * from './ai/CalendarAICoordinator';
export * from './presentation/services/CalendarDashboardService';
export * from './presentation/components/Components';
export * from './presentation/viewmodels/ViewModels';
export * from './presentation/screens/CalendarScreens';
export * from './hooks/useCalendar';
