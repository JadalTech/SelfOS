/**
 * Firestore Utilities
 *
 * Generic helpers for server timestamps, document ID generation, and query building.
 */

import { serverTimestamp, doc, collection, type FieldValue } from 'firebase/firestore';
import { getFirebaseFirestore } from '@/shared/firebase';

/**
 * Returns a server-generated Timestamp sentinel for audit fields (`createdAt`, `updatedAt`).
 */
export function getFieldValueServerTimestamp(): FieldValue {
  return serverTimestamp();
}

/**
 * Generates an auto-assigned unique Firestore document ID client-side.
 */
export function generateFirestoreId(collectionPath: string): string {
  const db = getFirebaseFirestore();
  const ref = doc(collection(db, collectionPath));
  return ref.id;
}
