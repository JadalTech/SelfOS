/**
 * Focus Session Engine
 * SelfOS v3.1.0 — Batch 14B
 */

import type { FocusSession } from '../domain/calendar.types';
import { calendarEventBus } from '../events/CalendarEventBus';

export class FocusSessionEngine {
  static startSession(userId: string, durationMinutes = 25): FocusSession {
    const session: FocusSession = {
      sessionId: `focus_${Date.now()}`,
      userId,
      durationMinutes,
      completedMinutes: 0,
      distractionCount: 0,
      status: 'active',
      startedAt: new Date(),
    };

    calendarEventBus.emit('FocusSessionStarted', { sessionId: session.sessionId });
    return session;
  }

  static recordDistraction(session: FocusSession): FocusSession {
    return {
      ...session,
      distractionCount: session.distractionCount + 1,
    };
  }

  static completeSession(session: FocusSession): FocusSession {
    const completed = {
      ...session,
      completedMinutes: session.durationMinutes,
      status: 'completed' as const,
    };

    calendarEventBus.emit('FocusSessionCompleted', { sessionId: session.sessionId });
    return completed;
  }
}
export default FocusSessionEngine;
