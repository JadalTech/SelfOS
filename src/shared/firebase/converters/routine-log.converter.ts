/**
 * Firestore Data Converter for RoutineLog documents
 *
 * Handles automatic Date ⇄ Timestamp conversion and payload typing.
 */

import {
  Timestamp,
  type FirestoreDataConverter,
  type DocumentData,
  type QueryDocumentSnapshot,
  type SnapshotOptions,
} from 'firebase/firestore';
import type { RoutineLog } from '@/features/routine/types';

export const routineLogConverter: FirestoreDataConverter<RoutineLog> = {
  toFirestore(log: RoutineLog): DocumentData {
    return {
      routineId: log.routineId,
      type: log.type,
      date: log.date,
      time: log.time,
      status: log.status,
      payload: log.payload ?? null,
      timestamp: Timestamp.fromDate(log.timestamp ?? new Date()),
    };
  },

  fromFirestore(snapshot: QueryDocumentSnapshot, options?: SnapshotOptions): RoutineLog {
    const data = snapshot.data(options);
    const timestampObj = data.timestamp as Timestamp | undefined;

    return {
      id: snapshot.id,
      routineId: data.routineId ?? '',
      type: data.type ?? 'custom',
      date: data.date ?? '',
      time: data.time ?? '',
      status: data.status ?? 'completed',
      payload: (data.payload as Record<string, unknown> | null) ?? undefined,
      timestamp: timestampObj ? timestampObj.toDate() : new Date(),
    };
  },
};
