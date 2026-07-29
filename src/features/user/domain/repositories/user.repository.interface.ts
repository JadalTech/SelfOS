/**
 * User Profile Repository Domain Interface
 */

import type { Result } from '@/shared/types';
import type { UserProfile } from '../entities/UserProfile';

export interface UpdateUserProfilePayload {
  readonly displayName?: string | null;
  readonly photoURL?: string | null;
  readonly timezone?: string;
  readonly language?: string;
  readonly onboardingCompleted?: boolean;
  readonly preferences?: Partial<UserProfile['preferences']>;
}

export interface IUserRepository {
  /** Gets user profile by UID */
  getProfile(uid: string): Promise<Result<UserProfile | null>>;

  /** Ensures user profile exists, creating default profile if absent */
  ensureProfileExists(
    uid: string,
    email: string,
    displayName?: string | null,
    photoURL?: string | null,
  ): Promise<Result<UserProfile>>;

  /** Updates user profile */
  updateProfile(uid: string, payload: UpdateUserProfilePayload): Promise<Result<UserProfile>>;

  /** Updates last active timestamp */
  updateLastActive(uid: string): Promise<Result<void>>;
}
