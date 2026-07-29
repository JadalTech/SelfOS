/**
 * Re-export shared Auth types for feature scoping.
 */
export type { AppUser } from '../domain/entities/AppUser';
export type { AuthStatus } from '@/shared/stores/auth.store';
export type { LoginFields, RegisterFields, ForgotPasswordFields } from '../validation/auth.schemas';

