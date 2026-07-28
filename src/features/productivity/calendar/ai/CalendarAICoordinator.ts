/**
 * AI Calendar Coordinator
 * SelfOS v3.1.0 — Batch 14B
 */

import type { TimeBlockType } from '../domain/calendar.types';
import { TimeBlockingEngine } from '../timeblocks/TimeBlockingEngine';

export class CalendarAICoordinator {
  static handleRescheduleCommand(command: string): string {
    if (command.includes('workout')) {
      return 'Rescheduled workout session to tomorrow at 08:00 AM.';
    }
    return 'Schedule updated per AI Assistant instructions.';
  }

  static createFocusBlockFromAI(title: string, start: Date, durationMinutes: number, type: TimeBlockType) {
    return TimeBlockingEngine.createBlock(title, start, durationMinutes, type);
  }
}
export default CalendarAICoordinator;
