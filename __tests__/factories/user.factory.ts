/**
 * User Test Factory
 * SelfOS Testing Infrastructure
 *
 * Provides reusable, customizable user model instances for unit and integration testing.
 */

export interface AppUserTestModel {
  uid: string;
  email: string;
  displayName: string;
  photoURL?: string;
  emailVerified: boolean;
  createdAt: string;
  lastLoginAt: string;
  role?: 'user' | 'admin';
}

export function buildUser(overrides: Partial<AppUserTestModel> = {}): AppUserTestModel {
  const timestamp = new Date().toISOString();
  return {
    uid: `user_${Math.random().toString(36).substring(2, 9)}`,
    email: 'testuser@selfos.app',
    displayName: 'Test User',
    photoURL: 'https://selfos.app/avatar.jpg',
    emailVerified: true,
    createdAt: timestamp,
    lastLoginAt: timestamp,
    role: 'user',
    ...overrides,
  };
}

export function buildUnverifiedUser(overrides: Partial<AppUserTestModel> = {}): AppUserTestModel {
  return buildUser({
    emailVerified: false,
    ...overrides,
  });
}
