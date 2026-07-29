/**
 * User Profile Firestore Service
 *
 * Handles direct Firestore collection operations for `users/{uid}`.
 */

import {
  getDoc,
  setDoc,
  updateDoc,
  serverTimestamp,
} from 'firebase/firestore';
import { getUserDocRef } from '@/shared/firestore';
import type { UserDocument } from '@/shared/firestore';

export class UserProfileFirestoreService {
  /**
   * Fetches user profile document by UID.
   */
  async getProfile(uid: string): Promise<UserDocument | null> {
    const docRef = getUserDocRef(uid);
    const snapshot = await getDoc(docRef);
    return snapshot.exists() ? snapshot.data() : null;
  }

  /**
   * Creates a new user profile document.
   */
  async createProfile(document: UserDocument): Promise<UserDocument> {
    const docRef = getUserDocRef(document.uid);
    await setDoc(docRef, document);
    return document;
  }

  /**
   * Updates fields on an existing user document.
   */
  async updateProfile(uid: string, data: Partial<UserDocument>): Promise<void> {
    const docRef = getUserDocRef(uid);
    await updateDoc(docRef, {
      ...data,
      updatedAt: serverTimestamp(),
    });
  }

  /**
   * Updates `updatedAt` / `lastActive` timestamp.
   */
  async updateLastActive(uid: string): Promise<void> {
    const docRef = getUserDocRef(uid);
    await updateDoc(docRef, {
      updatedAt: serverTimestamp(),
    });
  }
}

export const userProfileFirestoreService = new UserProfileFirestoreService();
