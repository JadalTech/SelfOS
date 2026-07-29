/**
 * Shared Generic Firestore Converters
 *
 * Provides factory functions for creating Firestore `DataConverter<T>` instances
 * handling Date ⇄ Timestamp transformations safely.
 */

import {
  Timestamp,
  type FirestoreDataConverter,
  type DocumentData,
  type QueryDocumentSnapshot,
  type SnapshotOptions,
  type SetOptions,
} from 'firebase/firestore';
import type { BaseFirestoreDocument } from '../types/base-document';

/**
 * Recursively transforms raw Firestore objects:
 * Converts all Firestore Timestamp instances into JavaScript Date objects.
 */
export function convertTimestampsToDates<T>(obj: unknown): T {
  if (obj === null || obj === undefined) {
    return obj as T;
  }

  if (obj instanceof Timestamp) {
    return obj.toDate() as unknown as T;
  }

  if (Array.isArray(obj)) {
    return obj.map((item) => convertTimestampsToDates(item)) as unknown as T;
  }

  if (typeof obj === 'object') {
    const converted: Record<string, unknown> = {};
    for (const [key, value] of Object.entries(obj)) {
      converted[key] = convertTimestampsToDates(value);
    }
    return converted as T;
  }

  return obj as T;
}

/**
 * Creates a strongly-typed FirestoreDataConverter for any domain model extending BaseFirestoreDocument.
 */
export function createFirestoreConverter<T extends BaseFirestoreDocument>(): FirestoreDataConverter<T> {
  return {
    toFirestore(modelObject: T, options?: SetOptions): DocumentData {
      const copy: Record<string, unknown> = { ...modelObject };
      // Strip ID field before writing to Firestore document body
      delete copy.id;

      // Transform Date objects back to Timestamp if needed
      if (copy.createdAt instanceof Date) {
        copy.createdAt = Timestamp.fromDate(copy.createdAt);
      }
      if (copy.updatedAt instanceof Date) {
        copy.updatedAt = Timestamp.fromDate(copy.updatedAt);
      }

      return copy;
    },

    fromFirestore(snapshot: QueryDocumentSnapshot, options?: SnapshotOptions): T {
      const data = snapshot.data(options);
      const convertedData = convertTimestampsToDates<Omit<T, 'id'>>(data);

      return {
        id: snapshot.id,
        ...convertedData,
      } as T;
    },
  };
}
