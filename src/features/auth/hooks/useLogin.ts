/**
 * Custom Hook for Login Screen Logic
 *
 * Coordinates React Hook Form, local submission states, and calls the
 * AuthRepository. Relies on the root router guard for successful redirects.
 */

import { useState } from 'react';
import { useForm, UseFormReturn } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { loginSchema, LoginFields } from '../validation/auth.schemas';
import { authRepository } from '../repository/auth.repository';
import { useAuthStore } from '@/shared/stores';

interface UseLoginResult {
  form: UseFormReturn<LoginFields>;
  isLoading: boolean;
  error: string | null;
  onSubmit: (e?: any) => Promise<void>;
}

export function useLogin(): UseLoginResult {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const setChecking = useAuthStore((state) => state.setChecking);

  const form = useForm<LoginFields>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  });

  const onSubmit = async (data: LoginFields) => {
    setIsLoading(false);
    setError(null);
    setIsLoading(true);
    setChecking(); // Transition store status to checking

    const result = await authRepository.signIn(data);

    if (result.success) {
      // The root onAuthStateChanged listener will automatically detect the
      // new session, update the Zustand store, and trigger the layout redirects.
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
