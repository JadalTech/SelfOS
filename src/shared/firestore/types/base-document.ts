/**
 * Base Firestore Document Interface
 *
 * Provides standard audit metadata fields for every document stored in Firestore.
 */

export interface BaseFirestoreDocument {
  /** Unique document identifier */
  readonly id: string;
  /** ISO Date timestamp when document was created */
  readonly createdAt: Date;
  readonly updatedAt: Date;
}

/**
 * Tenant-scoped document model extending base document with user ownership ID.
 */
export interface BaseUserOwnedDocument extends BaseFirestoreDocument {
  /** User identifier owning this document */
  readonly uid: string;
}
