/**
 * Authentication Feature Module
 */

export { default as LoginScreen } from './screens/LoginScreen';
export { default as RegisterScreen } from './screens/RegisterScreen';
export { default as ForgotPasswordScreen } from './screens/ForgotPasswordScreen';
export { default as VerifyEmailScreen } from './screens/VerifyEmailScreen';

export { useAuthState } from './hooks/useAuthState';
export { useRequireAuth } from './hooks/useRequireAuth';
export { authRepository } from './repository/auth.repository';

export type { AppUser, AuthStatus } from './types';
export type { LoginFields, RegisterFields, ForgotPasswordFields } from './validation/auth.schemas';
