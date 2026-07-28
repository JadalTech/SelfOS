/**
 * Firestore Custom Converters for Hydration Module
 * SelfOS v1.4.0 — Batch 11A Revision
 */

import {
  QueryDocumentSnapshot,
  SnapshotOptions,
  Timestamp,
  DocumentData,
  WithFieldValue,
} from 'firebase/firestore';
import type { HydrationEntry, HydrationGoal, HydrationGoalVersion, HydrationReminder } from '../types/hydration.types';

// ---------------------------------------------------------------------------
// Hydration Entry Converter
// ---------------------------------------------------------------------------

export const hydrationEntryConverter = {
  toFirestore(entry: WithFieldValue<HydrationEntry>): DocumentData {
    return {
      userId: entry.userId,
      date: entry.date,
      time: entry.time,
      timestamp:
        entry.timestamp instanceof Date
          ? Timestamp.fromDate(entry.timestamp)
          : Timestamp.now(),
      amountML: entry.amountML,
      drinkType: entry.drinkType,
      temperature: entry.temperature ?? 'normal',
      source: entry.source ?? 'manual',
      notes: entry.notes ?? null,
      createdAt:
        entry.createdAt instanceof Date
          ? Timestamp.fromDate(entry.createdAt)
          : Timestamp.now(),
      updatedAt: Timestamp.now(),
    };
  },
  fromFirestore(
    snapshot: QueryDocumentSnapshot,
    options?: SnapshotOptions
  ): HydrationEntry {
    const data = snapshot.data(options);
    return {
      id: snapshot.id,
      userId: data.userId || '',
      date: data.date || '',
      time: data.time || '00:00',
      timestamp:
        data.timestamp instanceof Timestamp
          ? data.timestamp.toDate()
          : new Date(),
      amountML: typeof data.amountML === 'number' ? data.amountML : 0,
      drinkType: data.drinkType || 'water',
      temperature: data.temperature || 'normal',
      source: data.source || 'manual',
      notes: data.notes || undefined,
      createdAt:
        data.createdAt instanceof Timestamp
          ? data.createdAt.toDate()
          : new Date(),
      updatedAt:
        data.updatedAt instanceof Timestamp
          ? data.updatedAt.toDate()
          : new Date(),
    };
  },
};

// ---------------------------------------------------------------------------
// Hydration Goal Converter
// ---------------------------------------------------------------------------

export const hydrationGoalConverter = {
  toFirestore(goal: WithFieldValue<HydrationGoal>): DocumentData {
    return {
      userId: goal.userId,
      dailyTargetML: goal.dailyTargetML,
      customTargetEnabled: goal.customTargetEnabled ?? false,
      weightKg: goal.weightKg ?? null,
      activityLevel: goal.activityLevel ?? 'moderate',
      climate: goal.climate ?? 'normal',
      wakeTime: goal.wakeTime ?? '07:00',
      sleepTime: goal.sleepTime ?? '23:00',
      reminderEnabled: goal.reminderEnabled ?? true,
      reminderIntervalMinutes: goal.reminderIntervalMinutes ?? 60,
      smartAdjustments: goal.smartAdjustments ?? true,
      createdAt:
        goal.createdAt instanceof Date
          ? Timestamp.fromDate(goal.createdAt)
          : Timestamp.now(),
      updatedAt: Timestamp.now(),
    };
  },
  fromFirestore(
    snapshot: QueryDocumentSnapshot,
    options?: SnapshotOptions
  ): HydrationGoal {
    const data = snapshot.data(options);
    return {
      id: snapshot.id,
      userId: data.userId || '',
      dailyTargetML:
        typeof data.dailyTargetML === 'number' ? data.dailyTargetML : 2500,
      customTargetEnabled: data.customTargetEnabled ?? false,
      weightKg:
        typeof data.weightKg === 'number' ? data.weightKg : undefined,
      activityLevel: data.activityLevel || 'moderate',
      climate: data.climate || 'normal',
      wakeTime: data.wakeTime || '07:00',
      sleepTime: data.sleepTime || '23:00',
      reminderEnabled: data.reminderEnabled ?? true,
      reminderIntervalMinutes:
        typeof data.reminderIntervalMinutes === 'number'
          ? data.reminderIntervalMinutes
          : 60,
      smartAdjustments: data.smartAdjustments ?? true,
      createdAt:
        data.createdAt instanceof Timestamp
          ? data.createdAt.toDate()
          : new Date(),
      updatedAt:
        data.updatedAt instanceof Timestamp
          ? data.updatedAt.toDate()
          : new Date(),
    };
  },
};

// ---------------------------------------------------------------------------
// Hydration Goal Version Converter
// ---------------------------------------------------------------------------

export const hydrationGoalVersionConverter = {
  toFirestore(version: WithFieldValue<HydrationGoalVersion>): DocumentData {
    return {
      userId: version.userId,
      previousTargetML: version.previousTargetML,
      newTargetML: version.newTargetML,
      reason: version.reason,
      effectiveDate: version.effectiveDate,
      createdAt:
        version.createdAt instanceof Date
          ? Timestamp.fromDate(version.createdAt)
          : Timestamp.now(),
    };
  },
  fromFirestore(
    snapshot: QueryDocumentSnapshot,
    options?: SnapshotOptions
  ): HydrationGoalVersion {
    const data = snapshot.data(options);
    return {
      versionId: snapshot.id,
      userId: data.userId || '',
      previousTargetML: typeof data.previousTargetML === 'number' ? data.previousTargetML : 0,
      newTargetML: typeof data.newTargetML === 'number' ? data.newTargetML : 0,
      reason: data.reason || 'manual',
      effectiveDate: data.effectiveDate || '',
      createdAt:
        data.createdAt instanceof Timestamp
          ? data.createdAt.toDate()
          : new Date(),
    };
  },
};

// ---------------------------------------------------------------------------
// Hydration Reminder Converter
// ---------------------------------------------------------------------------

export const hydrationReminderConverter = {
  toFirestore(reminder: WithFieldValue<HydrationReminder>): DocumentData {
    return {
      userId: reminder.userId,
      enabled: reminder.enabled ?? true,
      reminderType: reminder.reminderType ?? 'push',
      scheduleType: reminder.scheduleType ?? 'interval',
      reminderTimes: reminder.reminderTimes ?? [],
      intervalMinutes: reminder.intervalMinutes ?? 60,
      startTime: reminder.startTime ?? '07:00',
      endTime: reminder.endTime ?? '23:00',
      weekdays: reminder.weekdays ?? [1, 2, 3, 4, 5, 6, 7],
      smartReminderEnabled: reminder.smartReminderEnabled ?? false,
      snoozeMinutes: reminder.snoozeMinutes ?? 10,
      maxSnoozes: reminder.maxSnoozes ?? 3,
      lastTriggered:
        reminder.lastTriggered instanceof Date
          ? Timestamp.fromDate(reminder.lastTriggered)
          : null,
      nextTrigger:
        reminder.nextTrigger instanceof Date
          ? Timestamp.fromDate(reminder.nextTrigger)
          : null,
      skippedCount: reminder.skippedCount ?? 0,
      completedCount: reminder.completedCount ?? 0,
      status: reminder.status ?? 'active',
      createdAt:
        reminder.createdAt instanceof Date
          ? Timestamp.fromDate(reminder.createdAt)
          : Timestamp.now(),
      updatedAt: Timestamp.now(),
    };
  },
  fromFirestore(
    snapshot: QueryDocumentSnapshot,
    options?: SnapshotOptions
  ): HydrationReminder {
    const data = snapshot.data(options);
    return {
      id: snapshot.id,
      userId: data.userId || '',
      enabled: data.enabled ?? true,
      reminderType: data.reminderType || 'push',
      scheduleType: data.scheduleType || 'interval',
      reminderTimes: data.reminderTimes || [],
      intervalMinutes: typeof data.intervalMinutes === 'number' ? data.intervalMinutes : 60,
      startTime: data.startTime || '07:00',
      endTime: data.endTime || '23:00',
      weekdays: data.weekdays || [1, 2, 3, 4, 5, 6, 7],
      smartReminderEnabled: data.smartReminderEnabled ?? false,
      snoozeMinutes: typeof data.snoozeMinutes === 'number' ? data.snoozeMinutes : 10,
      maxSnoozes: typeof data.maxSnoozes === 'number' ? data.maxSnoozes : 3,
      lastTriggered:
        data.lastTriggered instanceof Timestamp ? data.lastTriggered.toDate() : null,
      nextTrigger:
        data.nextTrigger instanceof Timestamp ? data.nextTrigger.toDate() : null,
      skippedCount: typeof data.skippedCount === 'number' ? data.skippedCount : 0,
      completedCount: typeof data.completedCount === 'number' ? data.completedCount : 0,
      status: data.status || 'active',
      createdAt:
        data.createdAt instanceof Timestamp ? data.createdAt.toDate() : new Date(),
      updatedAt:
        data.updatedAt instanceof Timestamp ? data.updatedAt.toDate() : new Date(),
    };
  },
};
