/**
 * Presentation ViewModels for Calendar Feature
 * SelfOS v3.1.0 — Batch 14B
 */

import { useState } from 'react';
import { useAuthStore } from '../../../../../shared/stores/auth.store';
import { calendarService } from '../../services/CalendarService';
import { FocusSessionEngine } from '../../focus/FocusSessionEngine';
import type { CalendarEvent, FocusSession } from '../../domain/calendar.types';

export function useCalendarViewModel() {
  const userId = useAuthStore((s) => s.user?.uid);
  const [events, setEvents] = useState<CalendarEvent[]>([]);

  const addEvent = async (title: string, start: Date, end: Date) => {
    if (!userId) return;
    const newEvt = await calendarService.createEvent(userId, title, start, end);
    setEvents((prev) => [...prev, newEvt]);
  };

  return { events, addEvent };
}

export function useFocusSessionViewModel() {
  const userId = useAuthStore((s) => s.user?.uid);
  const [session, setSession] = useState<FocusSession | undefined>();

  const startFocus = () => {
    if (!userId) return;
    const newSession = FocusSessionEngine.startSession(userId, 25);
    setSession(newSession);
  };

  return { session, startFocus };
}
