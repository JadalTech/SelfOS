/**
 * Firestore User Profile Mapper
 *
 * Converts between Firestore `UserDocument` and domain `UserProfile` entity.
 */

import type { UserDocument } from '@/shared/firestore';
import type { UserProfile } from '../../domain/entities/UserProfile';

/**
 * Maps a Firestore `UserDocument` to the domain `UserProfile` entity.
 */
export function mapFirestoreToUserProfile(doc: UserDocument): UserProfile {
  return {
    uid: doc.uid,
    email: doc.email,
    displayName: doc.displayName,
    photoURL: doc.photoURL,
    preferences: {
      theme: doc.preferences?.theme ?? 'system',
      notificationsEnabled: doc.preferences?.notificationsEnabled ?? true,
      dailyReminderTime: doc.preferences?.dailyReminderTime ?? '09:00',
      timezone: doc.preferences?.timezone ?? 'UTC',
    },
    subscription: {
      plan: doc.subscription?.plan ?? 'free',
      status: doc.subscription?.status ?? 'active',
      expiresAt: doc.subscription?.expiresAt ?? null,
    },
    timezone: doc.preferences?.timezone ?? 'UTC',
    language: 'en',
    onboardingCompleted: doc.onboardingCompleted ?? false,
    createdAt: doc.createdAt ?? new Date(),
    updatedAt: doc.updatedAt ?? new Date(),
    lastActiveAt: doc.updatedAt ?? new Date(),
  };
}

/**
 * Creates default `UserDocument` payload for new user profiles.
 */
export function createDefaultUserDocument(
  uid: string,
  email: string,
  displayName?: string | null,
  photoURL?: string | null,
): UserDocument {
  const now = new Date();
  return {
    id: uid,
    uid,
    email,
    displayName: displayName ?? null,
    photoURL: photoURL ?? null,
    onboardingCompleted: false,
    preferences: {
      theme: 'system',
      notificationsEnabled: true,
      dailyReminderTime: '09:00',
      timezone: Intl.DateTimeFormat().resolvedOptions().timeZone || 'UTC',
    },
    subscription: {
      plan: 'free',
      status: 'active',
      expiresAt: null,
    },
    createdAt: now,
    updatedAt: now,
  };
}
