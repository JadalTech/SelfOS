/**
 * Calendar Dashboard Aggregator Service
 * SelfOS v3.1.0 — Batch 14B
 */

import { calendarRepository } from '../../repositories/CalendarRepository';
import { SchedulingEngine } from '../../scheduling/SchedulingEngine';
import { ConflictDetectionEngine } from '../../conflicts/ConflictDetectionEngine';
import { CalendarAnalyticsEngine } from '../../analytics/CalendarAnalyticsEngine';
import type { CalendarEvent, TimeBlock, ScheduleConflict, CalendarAnalytics } from '../../domain/calendar.types';

export interface UnifiedCalendarDashboardModel {
  readonly events: readonly CalendarEvent[];
  readonly blocks: readonly TimeBlock[];
  readonly conflicts: readonly ScheduleConflict[];
  readonly analytics: CalendarAnalytics;
}

export class CalendarDashboardService {
  static async getDashboardData(userId: string): Promise<UnifiedCalendarDashboardModel> {
    const eventsRes = await calendarRepository.getAll(userId);
    const events = eventsRes.success ? eventsRes.data : [];

    const blocks = SchedulingEngine.generateSchedule(events);
    const conflicts = ConflictDetectionEngine.detectConflicts(events);
    const analytics = CalendarAnalyticsEngine.computeAnalytics(blocks);

    return {
      events,
      blocks,
      conflicts,
      analytics,
    };
  }
}
export default CalendarDashboardService;
