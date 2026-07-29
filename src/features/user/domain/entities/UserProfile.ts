/**
 * UserProfile Domain Entity
 *
 * Single source of truth for the complete user profile domain entity.
 * Pure domain model with zero framework or database dependencies.
 */

export interface UserPreferencesDomain {
  readonly theme: 'light' | 'dark' | 'system';
  readonly notificationsEnabled: boolean;
  readonly dailyReminderTime: string | null;
  readonly timezone: string;
}

export interface UserSubscriptionDomain {
  readonly plan: 'free' | 'pro' | 'tier';
  readonly status: 'active' | 'inactive' | 'trialing';
  readonly expiresAt: Date | null;
}

export interface UserProfile {
  readonly uid: string;
  readonly email: string;
  readonly displayName: string | null;
  readonly photoURL: string | null;
  readonly preferences: UserPreferencesDomain;
  readonly subscription: UserSubscriptionDomain;
  readonly timezone: string;
  readonly language: string;
  readonly onboardingCompleted: boolean;
  readonly createdAt: Date;
  readonly updatedAt: Date;
  readonly lastActiveAt: Date;
}
