/**
 * FirebaseAuthRepository
 *
 * Implements `IAuthRepository` using `FirebaseAuthService`.
 * Translates Firebase SDK objects (`User`) to domain models (`AppUser`).
 * Wraps all failures into normalized application errors (`AppError`).
 *
 * Prevents Firebase SDK leaking into Domain/Presentation layers.
 */

import { ok, err } from '@/shared/types';
import type { Result } from '@/shared/types';
import { normalizeFirebaseError } from '@/shared/errors';
import { firebaseAuthService, FirebaseAuthService } from '../services/firebase-auth.service';
import type { AppUser } from '../domain/entities/AppUser';
import { mapFirebaseUser } from '../infrastructure/mappers/firebase-user.mapper';
import type { LoginFields, RegisterFields } from '../validation/auth.schemas';
import type {
  IAuthRepository,
  AuthStateChangeCallback,
  UnsubscribeAuthListener,
} from '../domain/auth.repository.interface';

export class FirebaseAuthRepository implements IAuthRepository {
  constructor(private readonly authService: FirebaseAuthService = firebaseAuthService) {}

  /**
   * Log in user, map response to AppUser, and catch errors.
   */
  async signIn(credentials: LoginFields): Promise<Result<AppUser>> {
    try {
      const userCredential = await this.authService.signIn(credentials);
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
      const user = await this.authService.signUp(credentials);
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
      await this.authService.signOut();
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
      await this.authService.sendPasswordReset(email);
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
      await this.authService.sendVerificationEmail();
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
      const user = await this.authService.reloadCurrentUser();
      if (!user) {
        return ok(null);
      }
      const appUser = mapFirebaseUser(user);
      return ok(appUser);
    } catch (error) {
      return err(normalizeFirebaseError(error));
    }
  }

  /**
   * Returns current authenticated domain user synchronously.
   */
  getCurrentUser(): AppUser | null {
    const firebaseUser = this.authService.getCurrentUser();
    return firebaseUser ? mapFirebaseUser(firebaseUser) : null;
  }

  /**
   * Listens to auth state changes, converting raw SDK user objects to AppUser.
   */
  onAuthStateChanged(callback: AuthStateChangeCallback): UnsubscribeAuthListener {
    return this.authService.onAuthStateChanged((user) => {
      callback(user ? mapFirebaseUser(user) : null);
    });
  }
}

export const authRepository: IAuthRepository = new FirebaseAuthRepository();
