/**
 * Pure Scheduling Engine
 *
 * Implements timezone-aware date parsing and schedule frequency evaluation.
 * Decoupled from all databases, UI, and side effects.
 */

import type { Routine } from '../types';

/**
 * Returns the current date string (YYYY-MM-DD) relative to a given IANA timezone.
 * Uses Intl.DateTimeFormat to prevent local device timezone interference.
 */
export function getLocalDateInTimezone(timezone: string, date = new Date()): string {
  try {
    const formatter = new Intl.DateTimeFormat('en-CA', {
      timeZone: timezone,
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
    });
    return formatter.format(date); // Output format: YYYY-MM-DD
  } catch {
    // Fallback if timezone is invalid or unsupported
    const y = date.getFullYear();
    const m = String(date.getMonth() + 1).padStart(2, '0');
    const d = String(date.getDate()).padStart(2, '0');
    return `${y}-${m}-${d}`;
  }
}

/**
 * Safe day difference calculation using UTC midnights.
 * Prevents daylight saving time shifts from creating fractional day calculations.
 */
export function getDaysDiff(d1: Date, d2: Date): number {
  const utc1 = Date.UTC(d1.getFullYear(), d1.getMonth(), d1.getDate());
  const utc2 = Date.UTC(d2.getFullYear(), d2.getMonth(), d2.getDate());
  return Math.floor((utc2 - utc1) / (1000 * 60 * 60 * 24));
}

/**
 * Safe week difference calculation by aligning both dates to their preceding Sundays.
 */
export function getWeeksDiff(d1: Date, d2: Date): number {
  const s1 = new Date(d1.getFullYear(), d1.getMonth(), d1.getDate());
  s1.setDate(s1.getDate() - s1.getDay());

  const s2 = new Date(d2.getFullYear(), d2.getMonth(), d2.getDate());
  s2.setDate(s2.getDate() - s2.getDay());

  return Math.floor(getDaysDiff(s1, s2) / 7);
}

/**
 * Safe month difference calculation.
 */
export function getMonthsDiff(d1: Date, d2: Date): number {
  return (d2.getFullYear() - d1.getFullYear()) * 12 + (d2.getMonth() - d1.getMonth());
}

/**
 * Parses a YYYY-MM-DD string into a local Date object.
 */
export function parseLocalDateString(dateStr: string): Date {
  const parts = dateStr.split('-');
  const year = parseInt(parts[0], 10);
  const month = parseInt(parts[1], 10) - 1;
  const day = parseInt(parts[2], 10);
  return new Date(year, month, day);
}

/**
 * Core scheduling algorithm checking if a routine should be performed on a target date.
 */
export function isRoutineScheduledForDate(routine: Routine, targetDate: Date): boolean {
  const schedule = routine.schedule;
  
  // Guard 1: Paused or Archived routines are never scheduled
  if (routine.status !== 'active') {
    return false;
  }

  const start = parseLocalDateString(schedule.startDate);
  
  // Align target date to local midnight for clean date comparisons
  const target = new Date(targetDate.getFullYear(), targetDate.getMonth(), targetDate.getDate());

  // Guard 2: Date is before start date
  if (target < start) {
    return false;
  }

  // Guard 3: Date is after end date (if specified)
  if (schedule.endDate) {
    const end = parseLocalDateString(schedule.endDate);
    if (target > end) {
      return false;
    }
  }

  const diffDays = getDaysDiff(start, target);

  switch (schedule.frequency) {
    case 'daily':
      return diffDays % schedule.interval === 0;

    case 'weekly': {
      const targetDayOfWeek = target.getDay(); // 0 (Sun) to 6 (Sat)
      
      // If specific days of week are configured, target day must match
      if (schedule.daysOfWeek && schedule.daysOfWeek.length > 0) {
        if (!schedule.daysOfWeek.includes(targetDayOfWeek)) {
          return false;
        }
      } else {
        // If not specified, default to matching the start date's day of week
        if (targetDayOfWeek !== start.getDay()) {
          return false;
        }
      }

      const diffWeeks = getWeeksDiff(start, target);
      return diffWeeks % schedule.interval === 0;
    }

    case 'monthly': {
      const targetDayOfMonth = target.getDate();

      // If specific days of month are configured, target date must match
      if (schedule.daysOfMonth && schedule.daysOfMonth.length > 0) {
        if (!schedule.daysOfMonth.includes(targetDayOfMonth)) {
          return false;
        }
      } else {
        // If not specified, default to matching the start date's day of month
        if (targetDayOfMonth !== start.getDate()) {
          return false;
        }
      }

      const diffMonths = getMonthsDiff(start, target);
      return diffMonths % schedule.interval === 0;
    }

    case 'custom':
      // Custom frequency behaves as an interval-in-days check
      return diffDays % schedule.interval === 0;

    default:
      return false;
  }
}

/**
 * Timezone-aware check determining if a routine is scheduled for today.
 */
export function isScheduledTodayInTimezone(routine: Routine, referenceDate = new Date()): boolean {
  const localDateStr = getLocalDateInTimezone(routine.schedule.timezone, referenceDate);
  const targetDate = parseLocalDateString(localDateStr);
  return isRoutineScheduledForDate(routine, targetDate);
}
