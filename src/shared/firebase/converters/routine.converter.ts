/**
 * Firestore Data Converter for Routine documents
 *
 * Handles automatic Date ⇄ Timestamp conversion and default field population.
 */

import {
  Timestamp,
  type FirestoreDataConverter,
  type DocumentData,
  type QueryDocumentSnapshot,
  type SnapshotOptions,
} from 'firebase/firestore';
import type { Routine } from '@/features/routine/types';

export const routineConverter: FirestoreDataConverter<Routine> = {
  toFirestore(routine: Routine): DocumentData {
    return {
      userId: routine.userId,
      title: routine.title,
      description: routine.description ?? null,
      type: routine.type,
      status: routine.status,
      schedule: {
        frequency: routine.schedule.frequency,
        interval: routine.schedule.interval,
        daysOfWeek: routine.schedule.daysOfWeek ?? null,
        daysOfMonth: routine.schedule.daysOfMonth ?? null,
        startDate: routine.schedule.startDate,
        endDate: routine.schedule.endDate ?? null,
        timezone: routine.schedule.timezone,
      },
      reminders: routine.reminders.map((r) => ({
        id: r.id,
        time: r.time,
        enabled: r.enabled,
      })),
      currentStreak: routine.currentStreak,
      longestStreak: routine.longestStreak,
      lastCompletedDate: routine.lastCompletedDate ?? null,
      createdAt: Timestamp.fromDate(routine.createdAt ?? new Date()),
      updatedAt: Timestamp.fromDate(new Date()),
    };
  },

  fromFirestore(snapshot: QueryDocumentSnapshot, options?: SnapshotOptions): Routine {
    const data = snapshot.data(options);

    const createdAtTimestamp = data.createdAt as Timestamp | undefined;
    const updatedAtTimestamp = data.updatedAt as Timestamp | undefined;

    return {
      id: snapshot.id,
      userId: data.userId ?? '',
      title: data.title ?? '',
      description: data.description ?? undefined,
      type: data.type ?? 'custom',
      status: data.status ?? 'active',
      schedule: {
        frequency: data.schedule?.frequency ?? 'daily',
        interval: data.schedule?.interval ?? 1,
        daysOfWeek: data.schedule?.daysOfWeek ?? undefined,
        daysOfMonth: data.schedule?.daysOfMonth ?? undefined,
        startDate: data.schedule?.startDate ?? '',
        endDate: data.schedule?.endDate ?? undefined,
        timezone: data.schedule?.timezone ?? 'UTC',
      },
      reminders: Array.isArray(data.reminders)
        ? data.reminders.map((r: { id?: string; time?: string; enabled?: boolean }) => ({
            id: r.id ?? '',
            time: r.time ?? '09:00',
            enabled: r.enabled ?? true,
          }))
        : [],
      currentStreak: data.currentStreak ?? 0,
      longestStreak: data.longestStreak ?? 0,
      lastCompletedDate: data.lastCompletedDate ?? undefined,
      createdAt: createdAtTimestamp ? createdAtTimestamp.toDate() : new Date(),
      updatedAt: updatedAtTimestamp ? updatedAtTimestamp.toDate() : new Date(),
    };
  },
};
