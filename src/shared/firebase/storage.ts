/**
 * Firebase Cloud Storage
 *
 * Exports a lazily-initialized Storage instance.
 * No upload/download logic — initialization only.
 */

import { getStorage as _getStorage } from 'firebase/storage';
import { getFirebaseApp } from './app';
import type { FirebaseStorageInstance } from './types';

let _storage: FirebaseStorageInstance | null = null;

/**
 * Returns the Firebase Storage instance, initializing it on first call.
 */
export function getFirebaseStorage(): FirebaseStorageInstance {
  if (_storage) {
    return _storage;
  }

  _storage = _getStorage(getFirebaseApp());
  return _storage;
}
