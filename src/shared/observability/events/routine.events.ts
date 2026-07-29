/**
 * Routine Domain Analytics Events
 */

import type { IAnalyticsProvider } from '../types';

export const RoutineEvents = {
  routineCreated(analytics: IAnalyticsProvider, routineType: string, frequency: string): void {
    analytics.trackEvent('routine_created', { routineType, frequency });
  },

  routineCompleted(analytics: IAnalyticsProvider, routineType: string, streak: number): void {
    analytics.trackEvent('routine_completed', { routineType, currentStreak: streak });
  },

  routineSkipped(analytics: IAnalyticsProvider, routineType: string): void {
    analytics.trackEvent('routine_skipped', { routineType });
  },

  routineArchived(analytics: IAnalyticsProvider, routineType: string): void {
    analytics.trackEvent('routine_archived', { routineType });
  },
};
