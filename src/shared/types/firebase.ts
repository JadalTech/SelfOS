/**
 * Firebase Shared Types
 *
 * Base types for Firestore documents.
 * Feature models extend these in their own modules.
 */

import type { Timestamp } from 'firebase/firestore';

/**
 * Base fields present on every Firestore document.
 * Feature models should extend this interface.
 *
 * Example:
 *   interface User extends FirestoreDocument {
 *     email: string;
 *     displayName: string;
 *   }
 */
export interface FirestoreDocument {
  /** Firestore document ID (auto-generated or custom) */
  id: string;
  /** Server timestamp when the document was created */
  createdAt: Timestamp;
  /** Server timestamp when the document was last updated */
  updatedAt: Timestamp;
}

/**
 * Generic type for documents being created (before server timestamps).
 * Omits server-managed fields that Firestore will populate.
 */
export type CreateDocument<T extends FirestoreDocument> = Omit<
  T,
  'id' | 'createdAt' | 'updatedAt'
>;

/**
 * Generic type for document update payloads.
 * All fields are optional except those the caller specifies.
 */
export type UpdateDocument<T extends FirestoreDocument> = Partial<
  Omit<T, 'id' | 'createdAt' | 'updatedAt'>
>;
