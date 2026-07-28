/**
 * Conflict Detection Engine
 * SelfOS v3.1.0 — Batch 14B
 */

import type { CalendarEvent, ScheduleConflict } from '../domain/calendar.types';
import { calendarEventBus } from '../events/CalendarEventBus';

export class ConflictDetectionEngine {
  static detectConflicts(events: readonly CalendarEvent[]): ScheduleConflict[] {
    const conflicts: ScheduleConflict[] = [];

    for (let i = 0; i < events.length; i++) {
      for (let j = i + 1; j < events.length; j++) {
        const e1 = events[i];
        const e2 = events[j];

        // Check time overlap
        if (e1.startTime < e2.endTime && e1.endTime > e2.startTime) {
          const conflict: ScheduleConflict = {
            conflictId: `conf_${e1.id}_${e2.id}`,
            eventId1: e1.id,
            eventId2: e2.id,
            reason: `Overlap detected between "${e1.title}" and "${e2.title}"`,
            severity: 'high',
          };
          conflicts.push(conflict);
          calendarEventBus.emit('ConflictDetected', { conflictId: conflict.conflictId });
        }
      }
    }

    return conflicts;
  }
}
export default ConflictDetectionEngine;
