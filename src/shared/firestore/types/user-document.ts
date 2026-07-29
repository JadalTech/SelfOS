/**
 * User Document Schema Definition
 *
 * Primary Firestore document stored at `users/{uid}`.
 */

import type { BaseFirestoreDocument } from './base-document';

export interface UserPreferences {
  readonly theme: 'light' | 'dark' | 'system';
  readonly notificationsEnabled: boolean;
  readonly dailyReminderTime: string | null;
  readonly timezone: string;
}

export interface UserSubscription {
  readonly plan: 'free' | 'pro' | 'tier';
  readonly status: 'active' | 'inactive' | 'trialing';
  readonly expiresAt: Date | null;
}

export interface UserDocument extends BaseFirestoreDocument {
  readonly uid: string;
  readonly email: string;
  readonly displayName: string | null;
  readonly photoURL: string | null;
  readonly onboardingCompleted: boolean;
  readonly preferences: UserPreferences;
  readonly subscription: UserSubscription;
}
