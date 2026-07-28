/**
 * Calendar Context Builder for AI Assistant
 * SelfOS v3.1.0 — Batch 14B
 */

import type { CalendarEvent, TimeBlock } from '../domain/calendar.types';

export interface AICalendarContext {
  readonly totalEventsToday: number;
  readonly deepWorkBlocksCount: number;
  readonly nextFreeSlotTime?: string;
}

export class CalendarContextBuilder {
  static buildContext(events: readonly CalendarEvent[], blocks: readonly TimeBlock[]): AICalendarContext {
    return {
      totalEventsToday: events.length,
      deepWorkBlocksCount: blocks.filter((b) => b.type === 'deep_work').length,
      nextFreeSlotTime: '14:00 - 15:00',
    };
  }
}
export default CalendarContextBuilder;
