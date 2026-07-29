/**
 * Auth Domain Repository Interface & Contracts
 *
 * Defines the abstract interface for authentication capabilities.
 * Pure domain contracts — NO Firebase SDK imports allowed here.
 */

import type { Result } from '@/shared/types';
import type { AppUser } from './entities/AppUser';
import type { LoginFields, RegisterFields } from '../validation/auth.schemas';

export type UnsubscribeAuthListener = () => void;
export type AuthStateChangeCallback = (user: AppUser | null) => void;

export interface IAuthRepository {
  /** Logs in user with email/password credentials */
  signIn(credentials: LoginFields): Promise<Result<AppUser>>;
  
  /** Registers a new user with email/password and sets display name */
  signUp(credentials: RegisterFields): Promise<Result<AppUser>>;
  
  /** Logs out current session */
  signOut(): Promise<Result<void>>;
  
  /** Triggers password reset email */
  sendPasswordReset(email: string): Promise<Result<void>>;
  
  /** Sends email verification link to active user */
  sendVerificationEmail(): Promise<Result<void>>;
  
  /** Reloads user state from remote session */
  reloadCurrentUser(): Promise<Result<AppUser | null>>;

  /** Returns current authenticated domain user sync */
  getCurrentUser(): AppUser | null;

  /** Listens to session changes across native app life cycle */
  onAuthStateChanged(callback: AuthStateChangeCallback): UnsubscribeAuthListener;
}
