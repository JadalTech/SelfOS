/**
 * Authentication Feature Module
 */

export { default as LoginScreen } from './screens/LoginScreen';
export { default as RegisterScreen } from './screens/RegisterScreen';
export { default as ForgotPasswordScreen } from './screens/ForgotPasswordScreen';
export { default as VerifyEmailScreen } from './screens/VerifyEmailScreen';

export { useAuthState } from './hooks/useAuthState';
export { useRequireAuth } from './hooks/useRequireAuth';
export { AuthProvider } from './presentation/providers/AuthProvider';
export { RouteGuard } from './presentation/providers/RouteGuard';
export { authRepository, FirebaseAuthRepository } from './repository/auth.repository';
export type { IAuthRepository } from './domain/auth.repository.interface';
export type { AppUser } from './domain/entities/AppUser';

export type { AppUser, AuthStatus } from './types';
export type { LoginFields, RegisterFields, ForgotPasswordFields } from './validation/auth.schemas';

