/**
 * UserRepository
 *
 * Implements `IUserRepository`.
 * Coordinates `UserProfileFirestoreService`, maps Firestore documents to `UserProfile`,
 * and normalizes errors into `AppError`.
 */

import { ok, err } from '@/shared/types';
import type { Result } from '@/shared/types';
import { normalizeFirestoreError } from '@/shared/firestore';
import type { UserProfile } from '../../domain/entities/UserProfile';
import type {
  IUserRepository,
  UpdateUserProfilePayload,
} from '../../domain/repositories/user.repository.interface';
import {
  UserProfileFirestoreService,
  userProfileFirestoreService,
} from '../services/user-profile-firestore.service';
import {
  mapFirestoreToUserProfile,
  createDefaultUserDocument,
} from '../mappers/firestore-user-profile.mapper';

export class UserRepository implements IUserRepository {
  constructor(
    private readonly firestoreService: UserProfileFirestoreService = userProfileFirestoreService,
  ) {}

  /**
   * Fetches user profile by UID.
   */
  async getProfile(uid: string): Promise<Result<UserProfile | null>> {
    try {
      const docData = await this.firestoreService.getProfile(uid);
      if (!docData) {
        return ok(null);
      }
      return ok(mapFirestoreToUserProfile(docData));
    } catch (error) {
      return err(normalizeFirestoreError(error));
    }
  }

  /**
   * Ensures user profile exists, creating default document if absent.
   */
  async ensureProfileExists(
    uid: string,
    email: string,
    displayName?: string | null,
    photoURL?: string | null,
  ): Promise<Result<UserProfile>> {
    try {
      const existing = await this.firestoreService.getProfile(uid);
      if (existing) {
        return ok(mapFirestoreToUserProfile(existing));
      }

      // Profile absent — create default document
      const defaultDoc = createDefaultUserDocument(uid, email, displayName, photoURL);
      const createdDoc = await this.firestoreService.createProfile(defaultDoc);
      return ok(mapFirestoreToUserProfile(createdDoc));
    } catch (error) {
      return err(normalizeFirestoreError(error));
    }
  }

  /**
   * Updates user profile document.
   */
  async updateProfile(uid: string, payload: UpdateUserProfilePayload): Promise<Result<UserProfile>> {
    try {
      await this.firestoreService.updateProfile(uid, payload as any);
      const updatedDoc = await this.firestoreService.getProfile(uid);
      if (!updatedDoc) {
        throw new Error(`Profile not found for UID: ${uid} after update.`);
      }
      return ok(mapFirestoreToUserProfile(updatedDoc));
    } catch (error) {
      return err(normalizeFirestoreError(error));
    }
  }

  /**
   * Updates last active timestamp.
   */
  async updateLastActive(uid: string): Promise<Result<void>> {
    try {
      await this.firestoreService.updateLastActive(uid);
      return ok(undefined);
    } catch (error) {
      return err(normalizeFirestoreError(error));
    }
  }
}

export const userRepository: IUserRepository = new UserRepository();
