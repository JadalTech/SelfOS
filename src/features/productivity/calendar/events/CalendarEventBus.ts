/**
 * Calendar Event Bus
 * SelfOS v3.1.0 — Batch 14B
 */

export type CalendarEventType =
  | 'EventCreated'
  | 'EventUpdated'
  | 'ConflictDetected'
  | 'FocusSessionStarted'
  | 'FocusSessionCompleted'
  | 'ScheduleOptimized';

export interface CalendarEventPayload {
  readonly type: CalendarEventType;
  readonly data: Record<string, any>;
  readonly timestamp: Date;
}

export type CalendarEventListener = (event: CalendarEventPayload) => void;

export class CalendarEventBus {
  private readonly listeners: CalendarEventListener[] = [];

  subscribe(listener: CalendarEventListener): () => void {
    this.listeners.push(listener);
    return () => {
      const idx = this.listeners.indexOf(listener);
      if (idx >= 0) this.listeners.splice(idx, 1);
    };
  }

  emit(type: CalendarEventType, data: Record<string, any>): void {
    const payload: CalendarEventPayload = { type, data, timestamp: new Date() };
    this.listeners.forEach((listener) => listener(payload));
  }
}

export const calendarEventBus = new CalendarEventBus();
export default calendarEventBus;
