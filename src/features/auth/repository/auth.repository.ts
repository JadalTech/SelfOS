/**
 * Authentication Repository
 *
 * Implements the domain boundary for authentication.
 * Responsible for mapping Firebase SDK results to domain models (AppUser),
 * catching and normalizing database errors, and returning Result wrappers.
 *
 * Has NO knowledge of navigation, stores, alerts, or UI state.
 */

import type { User } from 'firebase/auth';
import { ok, err } from '@/shared/types';
import type { Result } from '@/shared/types';
import { normalizeFirebaseError } from '@/shared/errors';
import { firebaseAuthService } from '../services/firebase-auth.service';
import type { AppUser } from '../types';
import type { LoginFields, RegisterFields } from '../validation/auth.schemas';

/**
 * Maps a Firebase SDK User object into the lightweight AppUser type.
 */
export function mapFirebaseUser(user: User): AppUser {
  return {
    uid: user.uid,
    email: user.email,
    displayName: user.displayName,
    photoURL: user.photoURL,
    emailVerified: user.emailVerified,
  };
}

export class AuthRepository {
  /**
   * Log in user, map response to AppUser, and catch errors.
   */
  async signIn(credentials: LoginFields): Promise<Result<AppUser>> {
    try {
      const userCredential = await firebaseAuthService.signIn(credentials);
      const appUser = mapFirebaseUser(userCredential.user);
      return ok(appUser);
    } catch (error) {
      return err(normalizeFirebaseError(error));
    }
  }

  /**
   * Register a new user, update display name, and return AppUser.
   */
  async signUp(credentials: RegisterFields): Promise<Result<AppUser>> {
    try {
      const user = await firebaseAuthService.signUp(credentials);
      const appUser = mapFirebaseUser(user);
      return ok(appUser);
    } catch (error) {
      return err(normalizeFirebaseError(error));
    }
  }

  /**
   * Log out the current user.
   */
  async signOut(): Promise<Result<void>> {
    try {
      await firebaseAuthService.signOut();
      return ok(undefined);
    } catch (error) {
      return err(normalizeFirebaseError(error));
    }
  }

  /**
   * Send a recovery email.
   */
  async sendPasswordReset(email: string): Promise<Result<void>> {
    try {
      await firebaseAuthService.sendPasswordReset(email);
      return ok(undefined);
    } catch (error) {
      return err(normalizeFirebaseError(error));
    }
  }

  /**
   * Send verification link.
   */
  async sendVerificationEmail(): Promise<Result<void>> {
    try {
      await firebaseAuthService.sendVerificationEmail();
      return ok(undefined);
    } catch (error) {
      return err(normalizeFirebaseError(error));
    }
  }

  /**
   * Reload current user to verify email verification status change.
   */
  async reloadCurrentUser(): Promise<Result<AppUser | null>> {
    try {
      const user = await firebaseAuthService.reloadCurrentUser();
      if (!user) {
        return ok(null);
      }
      const appUser = mapFirebaseUser(user);
      return ok(appUser);
    } catch (error) {
      return err(normalizeFirebaseError(error));
    }
  }
}

export const authRepository = new AuthRepository();
