/**
 * Custom Hook for Forgot Password Screen Logic
 *
 * Coordinates React Hook Form and dispatches password reset recovery links
 * via the AuthRepository. Tracks success feedback.
 */

import { useState } from 'react';
import { useForm, UseFormReturn } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { forgotPasswordSchema, ForgotPasswordFields } from '../validation/auth.schemas';
import { authRepository } from '../repository/auth.repository';

interface UseForgotPasswordResult {
  form: UseFormReturn<ForgotPasswordFields>;
  isLoading: boolean;
  isSent: boolean;
  error: string | null;
  onSubmit: (e?: any) => Promise<void>;
  resetForm: () => void;
}

export function useForgotPassword(): UseForgotPasswordResult {
  const [isLoading, setIsLoading] = useState(false);
  const [isSent, setIsSent] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const form = useForm<ForgotPasswordFields>({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: {
      email: '',
    },
  });

  const onSubmit = async (data: ForgotPasswordFields) => {
    setIsLoading(false);
    setError(null);
    setIsSent(false);
    setIsLoading(true);

    const result = await authRepository.sendPasswordReset(data.email);

    if (result.success) {
      setIsSent(true);
    } else {
      setError(result.error.message);
    }
    setIsLoading(false);
  };

  const resetForm = () => {
    form.reset();
    setIsSent(false);
    setError(null);
  };

  return {
    form,
    isLoading,
    isSent,
    error,
    onSubmit: form.handleSubmit(onSubmit),
    resetForm,
  };
}
