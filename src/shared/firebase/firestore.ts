/**
 * Firebase Firestore
 *
 * Exports a lazily-initialized Firestore instance.
 * No collections or queries — initialization only.
 */

import { getFirestore as _getFirestore } from 'firebase/firestore';
import { getFirebaseApp } from './app';
import type { FirestoreDbInstance } from './types';

let _firestore: FirestoreDbInstance | null = null;

/**
 * Returns the Firestore instance, initializing it on first call.
 */
export function getFirebaseFirestore(): FirestoreDbInstance {
  if (_firestore) {
    return _firestore;
  }

  _firestore = _getFirestore(getFirebaseApp());
  return _firestore;
}
