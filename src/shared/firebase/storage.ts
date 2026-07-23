/**
 * Firebase Cloud Storage
 *
 * Exports a lazily-initialized Storage instance.
 * No upload/download logic — initialization only.
 */

import { getStorage as _getStorage } from 'firebase/storage';
import type { FirebaseStorage } from 'firebase/storage';
import { getFirebaseApp } from './app';

let _storage: FirebaseStorage | null = null;

/**
 * Returns the Firebase Storage instance, initializing it on first call.
 */
export function getFirebaseStorage(): FirebaseStorage {
  if (_storage) {
    return _storage;
  }

  _storage = _getStorage(getFirebaseApp());
  return _storage;
}
