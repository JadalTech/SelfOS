/**
 * Recurrence Engine
 * SelfOS v3.1.0 — Batch 14B
 */

import type { CalendarEvent } from '../domain/calendar.types';

export class RecurrenceEngine {
  static expandRecurrences(event: CalendarEvent, occurrencesCount = 7): CalendarEvent[] {
    if (!event.isRecurring) return [event];

    const events: CalendarEvent[] = [];
    const durationMs = event.endTime.getTime() - event.startTime.getTime();

    for (let i = 0; i < occurrencesCount; i++) {
      const nextStart = new Date(event.startTime);
      nextStart.setDate(nextStart.getDate() + i);

      const nextEnd = new Date(nextStart.getTime() + durationMs);

      events.push({
        ...event,
        id: `${event.id}_occ_${i}`,
        startTime: nextStart,
        endTime: nextEnd,
      });
    }

    return events;
  }
}
export default RecurrenceEngine;
