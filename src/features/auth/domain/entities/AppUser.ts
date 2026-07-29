/**
 * AppUser Domain Entity
 *
 * Single source of truth for the authenticated user domain entity.
 * Pure domain model with zero framework or SDK dependencies.
 */

export interface AppUser {
  readonly uid: string;
  readonly email: string | null;
  readonly displayName: string | null;
  readonly photoURL: string | null;
  readonly emailVerified: boolean;
}
