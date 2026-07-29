/**
 * Firebase User Mapper
 *
 * Infrastructure layer mapper converting raw Firebase SDK User instances
 * into pure AppUser domain entities.
 */

import type { User } from 'firebase/auth';
import type { AppUser } from '../../domain/entities/AppUser';

/**
 * Maps a Firebase SDK User object into the domain AppUser entity.
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
