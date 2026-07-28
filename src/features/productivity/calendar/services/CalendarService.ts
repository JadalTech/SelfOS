/**
 * Calendar Service
 * SelfOS v3.1.0 — Batch 14B
 */

import { calendarRepository } from '../repositories/CalendarRepository';
import type { CalendarEvent, TimeBlockType } from '../domain/calendar.types';
import { calendarEventBus } from '../events/CalendarEventBus';

export class CalendarService {
  async createEvent(
    userId: string,
    title: string,
    startTime: Date,
    endTime: Date,
    type: TimeBlockType = 'deep_work'
  ): Promise<CalendarEvent> {
    const event: CalendarEvent = {
      id: `evt_${Date.now()}`,
      userId,
      title,
      startTime,
      endTime,
      type,
      isRecurring: false,
      color: '#FF4081',
    };

    await calendarRepository.save(event);
    calendarEventBus.emit('EventCreated', { eventId: event.id, title });
    return event;
  }
}

export const calendarService = new CalendarService();
