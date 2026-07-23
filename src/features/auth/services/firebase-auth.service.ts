/**
 * Firebase Auth Service
 *
 * Communicates directly with the Firebase JS SDK.
 * Lazily fetches the Auth instance to avoid eager initialization.
 */

import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut as firebaseSignOut,
  sendPasswordResetEmail,
  sendEmailVerification,
  updateProfile,
} from 'firebase/auth';
import type { User, UserCredential } from 'firebase/auth';
import { getFirebaseAuth } from '@/shared/firebase';
import { LoginFields, RegisterFields } from '../validation/auth.schemas';

export class FirebaseAuthService {
  /**
   * Logs in a user with email and password.
   */
  async signIn({ email, password }: LoginFields): Promise<UserCredential> {
    const auth = getFirebaseAuth();
    return signInWithEmailAndPassword(auth, email, password);
  }

  /**
   * Registers a new user and updates their display name.
   */
  async signUp({ email, password, displayName }: RegisterFields): Promise<User> {
    const auth = getFirebaseAuth();
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;

    // Update the profile display name immediately after registration
    await updateProfile(user, { displayName });
    return user;
  }

  /**
   * Logs out the current user.
   */
  async signOut(): Promise<void> {
    const auth = getFirebaseAuth();
    await firebaseSignOut(auth);
  }

  /**
   * Sends a password reset email.
   */
  async sendPasswordReset(email: string): Promise<void> {
    const auth = getFirebaseAuth();
    await sendPasswordResetEmail(auth, email);
  }

  /**
   * Sends a verification email to the currently logged in user.
   */
  async sendVerificationEmail(): Promise<void> {
    const auth = getFirebaseAuth();
    const user = auth.currentUser;
    if (user) {
      await sendEmailVerification(user);
    } else {
      throw new Error('No user currently authenticated to send verification email to.');
    }
  }

  /**
   * Reloads the current user profile from Firebase to fetch updated status (e.g. email verification).
   */
  async reloadCurrentUser(): Promise<User | null> {
    const auth = getFirebaseAuth();
    const user = auth.currentUser;
    if (user) {
      await user.reload();
      return auth.currentUser;
    }
    return null;
  }
}

export const firebaseAuthService = new FirebaseAuthService();
