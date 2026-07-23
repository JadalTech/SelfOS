/**
 * Custom Hook for Registration Screen Logic
 *
 * Coordinates React Hook Form and signs up a new user via AuthRepository.
 * Redirects directly to verify-email on successful user creation.
 */

import { useState } from 'react';
import { useForm, UseFormReturn } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter } from 'expo-router';
import { registerSchema, RegisterFields } from '../validation/auth.schemas';
import { authRepository } from '../repository/auth.repository';
import { useAuthStore } from '@/shared/stores';

interface UseRegisterResult {
  form: UseFormReturn<RegisterFields>;
  isLoading: boolean;
  error: string | null;
  onSubmit: (e?: any) => Promise<void>;
}

export function useRegister(): UseRegisterResult {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const setChecking = useAuthStore((state) => state.setChecking);

  const form = useForm<RegisterFields>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      displayName: '',
      email: '',
      password: '',
      confirmPassword: '',
    },
  });

  const onSubmit = async (data: RegisterFields) => {
    setIsLoading(false);
    setError(null);
    setIsLoading(true);
    setChecking(); // Transition store status to checking

    const result = await authRepository.signUp(data);

    if (result.success) {
      // Trigger verification email send-out immediately after registration
      await authRepository.sendVerificationEmail();
      // Redirect to email verification page
      router.replace('/(auth)/verify-email');
    } else {
      setError(result.error.message);
      setIsLoading(false);
    }
  };

  return {
    form,
    isLoading,
    error,
    onSubmit: form.handleSubmit(onSubmit),
  };
}
