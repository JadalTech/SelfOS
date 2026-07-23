/**
 * Firebase Firestore
 *
 * Exports a lazily-initialized Firestore instance.
 * No collections or queries — initialization only.
 */

import { getFirestore as _getFirestore } from 'firebase/firestore';
import type { Firestore } from 'firebase/firestore';
import { getFirebaseApp } from './app';

let _firestore: Firestore | null = null;

/**
 * Returns the Firestore instance, initializing it on first call.
 */
export function getFirebaseFirestore(): Firestore {
  if (_firestore) {
    return _firestore;
  }

  _firestore = _getFirestore(getFirebaseApp());
  return _firestore;
}
