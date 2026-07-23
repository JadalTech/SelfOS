/**
 * Dashboard Mapper Utilities
 *
 * Pure data transformation functions.
 * Converts raw domain entities (Routine, RoutineLog, AppUser) into flat UI View Models.
 * Contains ZERO side effects, ZERO async operations, and ZERO React hooks.
 */

import type { AppUser } from '../../../shared/stores';
import type { Routine, RoutineLog } from '../../routine/types';
import { isRoutineScheduledForDate } from '../../routine/engine/scheduler';
import {
  getRoutineStatusForDate,
  calculateCompletionRate,
} from '../../routine/engine/completion';
import { REGISTERED_MODULES } from '../registry/module.registry';
import type {
  DashboardViewModel,
  GreetingVM,
  ProgressVM,
  RoutineItemVM,
  StatsVM,
  WeeklyProgressVM,
  ActivityVM,
} from '../types';

const DAY_NAMES_SHORT = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

/**
 * Format local date as YYYY-MM-DD string
 */
function toDateString(d: Date): string {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${y}-${m}-${day}`;
}

export function mapGreeting(user: AppUser | null, referenceDate = new Date()): GreetingVM {
  const hours = referenceDate.getHours();
  let greetingText = 'Good Morning ☀️';
  if (hours >= 12 && hours < 17) {
    greetingText = 'Good Afternoon 🌤️';
  } else if (hours >= 17) {
    greetingText = 'Good Evening 🌙';
  }

  const options: Intl.DateTimeFormatOptions = {
    weekday: 'long',
    month: 'short',
    day: 'numeric',
  };
  const formattedDate = referenceDate.toLocaleDateString('en-US', options);

  return {
    name: user?.displayName || 'User',
    email: user?.email || '',
    greetingText,
    formattedDate,
  };
}

export function mapTodayProgress(
  routines: Routine[],
  logs: RoutineLog[],
  referenceDate = new Date()
): ProgressVM {
  const todayStr = toDateString(referenceDate);

  const scheduledToday = routines.filter((r) => isRoutineScheduledForDate(r, referenceDate));
  const scheduledCount = scheduledToday.length;

  let completedCount = 0;
  for (const routine of scheduledToday) {
    const status = getRoutineStatusForDate(routine, logs, todayStr, referenceDate);
    if (status === 'completed') {
      completedCount++;
    }
  }

  const percentage = scheduledCount > 0 ? Math.round((completedCount / scheduledCount) * 100) : 0;
  const statusText =
    scheduledCount === 0
      ? 'No routines scheduled for today'
      : `${completedCount} of ${scheduledCount} routines completed`;

  return {
    scheduledCount,
    completedCount,
    percentage,
    statusText,
  };
}

export function mapTodayRoutines(
  routines: Routine[],
  logs: RoutineLog[],
  referenceDate = new Date()
): RoutineItemVM[] {
  const todayStr = toDateString(referenceDate);
  const scheduledToday = routines.filter((r) => isRoutineScheduledForDate(r, referenceDate));

  return scheduledToday.map((routine) => {
    const status = getRoutineStatusForDate(routine, logs, todayStr, referenceDate);
    const activeReminder = routine.reminders.find((rem) => rem.enabled);

    return {
      id: routine.id,
      title: routine.title,
      type: routine.type,
      time: activeReminder?.time,
      status,
      currentStreak: routine.currentStreak,
      frequencySummary: routine.schedule.frequency,
    };
  });
}

export function mapStats(routines: Routine[], logs: RoutineLog[]): StatsVM {
  const activeRoutines = routines.filter((r) => r.status === 'active');
  const activeRoutinesCount = activeRoutines.length;

  let topStreakCount = 0;
  let topStreakTitle = 'None';

  for (const routine of activeRoutines) {
    if (routine.currentStreak > topStreakCount) {
      topStreakCount = routine.currentStreak;
      topStreakTitle = routine.title;
    }
  }

  // Calculate overall 30-day completion rate across all active routines
  let total30DayCompleted = 0;
  let total30DayScheduled = 0;

  const end = new Date();
  const start = new Date();
  start.setDate(start.getDate() - 30);
  const startStr = toDateString(start);
  const endStr = toDateString(end);

  for (const routine of activeRoutines) {
    const stats = calculateCompletionRate(routine, logs, startStr, endStr);
    total30DayCompleted += stats.completed;
    total30DayScheduled += stats.scheduled;
  }

  const completionRate30Days =
    total30DayScheduled > 0 ? Math.round((total30DayCompleted / total30DayScheduled) * 100) : 0;

  const totalCompletionsAllTime = logs.filter((l) => l.status === 'completed').length;

  return {
    activeRoutinesCount,
    topStreakCount,
    topStreakTitle,
    completionRate30Days,
    totalCompletionsAllTime,
  };
}

export function mapWeeklyProgress(
  routines: Routine[],
  logs: RoutineLog[],
  referenceDate = new Date()
): WeeklyProgressVM {
  const days = [];
  let activeWeeklyDaysCount = 0;

  for (let i = 6; i >= 0; i--) {
    const d = new Date(referenceDate);
    d.setDate(d.getDate() - i);
    const dateStr = toDateString(d);
    const dayName = DAY_NAMES_SHORT[d.getDay()];
    const isToday = i === 0;

    let isScheduled = false;
    let isCompleted = false;

    for (const routine of routines) {
      if (isRoutineScheduledForDate(routine, d)) {
        isScheduled = true;
        const status = getRoutineStatusForDate(routine, logs, dateStr, d);
        if (status === 'completed') {
          isCompleted = true;
        }
      }
    }

    if (isCompleted) {
      activeWeeklyDaysCount++;
    }

    days.push({
      dayName,
      dateStr,
      isScheduled,
      isCompleted,
      isToday,
    });
  }

  return {
    days,
    activeWeeklyDaysCount,
  };
}

export function mapRecentActivities(
  routines: Routine[],
  logs: RoutineLog[],
  limit = 5
): ActivityVM[] {
  // Sort logs by date DESC and time DESC
  const sortedLogs = [...logs].sort((a, b) => {
    const dateComp = b.date.localeCompare(a.date);
    if (dateComp !== 0) return dateComp;
    return b.time.localeCompare(a.time);
  });

  const recent = sortedLogs.slice(0, limit);

  return recent.map((log) => {
    const parentRoutine = routines.find((r) => r.id === log.routineId);
    return {
      id: log.id,
      routineId: log.routineId,
      title: parentRoutine?.title || 'Routine Task',
      type: log.type,
      date: log.date,
      time: log.time,
      status: log.status,
    };
  });
}

/**
 * Master Mapper Function: Combines domain inputs into full DashboardViewModel
 */
export function buildDashboardViewModel(
  user: AppUser | null,
  routines: Routine[],
  logs: RoutineLog[],
  referenceDate = new Date()
): DashboardViewModel {
  const greeting = mapGreeting(user, referenceDate);
  const progress = mapTodayProgress(routines, logs, referenceDate);
  const todayRoutines = mapTodayRoutines(routines, logs, referenceDate);
  const topPendingRoutine = todayRoutines.find((r) => r.status === 'pending');
  const stats = mapStats(routines, logs);
  const weekly = mapWeeklyProgress(routines, logs, referenceDate);
  const recentActivities = mapRecentActivities(routines, logs, 5);

  return {
    greeting,
    progress,
    todayRoutines,
    topPendingRoutine,
    stats,
    weekly,
    recentActivities,
    modules: REGISTERED_MODULES,
    isPartialLoading: false,
    isError: false,
  };
}
