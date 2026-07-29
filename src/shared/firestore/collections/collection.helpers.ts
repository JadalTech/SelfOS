/**
 * Typed Firestore Collection Helpers
 *
 * Provides factory functions for obtaining typed `CollectionReference` and `DocumentReference`
 * objects, ensuring collection path strings remain strictly centralized.
 */

import {
  collection,
  doc,
  type CollectionReference,
  type DocumentReference,
  type FirestoreDataConverter,
} from 'firebase/firestore';
import { getFirebaseFirestore } from '@/shared/firebase';
import { COLLECTIONS } from '@/shared/constants';
import type { UserDocument } from '../types/user-document';
import { userDocumentConverter } from '../converters/user.converter';

/**
 * Returns a typed collection reference for the root `users` collection.
 */
export function getUsersCollection(): CollectionReference<UserDocument> {
  const db = getFirebaseFirestore();
  return collection(db, COLLECTIONS.USERS).withConverter(userDocumentConverter);
}

/**
 * Returns a typed document reference for a specific user document (`users/{uid}`).
 */
export function getUserDocRef(uid: string): DocumentReference<UserDocument> {
  const db = getFirebaseFirestore();
  return doc(db, COLLECTIONS.USERS, uid).withConverter(userDocumentConverter);
}

/**
 * Returns a typed subcollection reference under a specific user document (`users/{uid}/{subcollection}`).
 */
export function getUserSubcollection<T extends { id: string }>(
  uid: string,
  subcollectionName: string,
  converter: FirestoreDataConverter<T>,
): CollectionReference<T> {
  const db = getFirebaseFirestore();
  return collection(db, COLLECTIONS.USERS, uid, subcollectionName).withConverter(converter);
}
