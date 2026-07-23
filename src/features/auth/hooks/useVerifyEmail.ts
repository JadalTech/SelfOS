/**
 * Custom Hook for Email Verification Screen Logic
 *
 * Coordinates verification resend actions, manages a resend button
 * cooldown timer, and runs explicit reloads to verify if the session
 * verification status changed.
 */

import { useState, useEffect, useRef } from 'react';
import { authRepository } from '../repository/auth.repository';
import { useAuthStore } from '@/shared/stores';

interface UseVerifyEmailResult {
  email: string | null;
  isChecking: boolean;
  isResending: boolean;
  cooldownSeconds: number;
  error: string | null;
  resendSuccess: boolean;
  handleResend: () => Promise<void>;
  handleRefresh: () => Promise<void>;
  handleSignOut: () => Promise<void>;
}

export function useVerifyEmail(): UseVerifyEmailResult {
  const user = useAuthStore((state) => state.user);
  const setUser = useAuthStore((state) => state.setUser);
  const resetStore = useAuthStore((state) => state.reset);

  const [isChecking, setIsChecking] = useState(false);
  const [isResending, setIsResending] = useState(false);
  const [cooldownSeconds, setCooldownSeconds] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [resendSuccess, setResendSuccess] = useState(false);

  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (cooldownSeconds > 0) {
      timerRef.current = setTimeout(() => {
        setCooldownSeconds((prev) => prev - 1);
      }, 1000);
    } else {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }
    }

    return () => {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }
    };
  }, [cooldownSeconds]);

  const handleResend = async () => {
    if (cooldownSeconds > 0 || isResending) return;

    setIsResending(true);
    setError(null);
    setResendSuccess(false);

    const result = await authRepository.sendVerificationEmail();

    if (result.success) {
      setResendSuccess(true);
      setCooldownSeconds(60); // 60 seconds cooldown
    } else {
      setError(result.error.message);
    }
    setIsResending(false);
  };

  const handleRefresh = async () => {
    if (isChecking) return;

    setIsChecking(true);
    setError(null);

    const result = await authRepository.reloadCurrentUser();

    if (result.success) {
      const updatedUser = result.data;
      if (updatedUser) {
        setUser(updatedUser); // Update Zustand store with the reloaded verification status
      }
    } else {
      setError(result.error.message);
    }
    setIsChecking(false);
  };

  const handleSignOut = async () => {
    setError(null);
    const result = await authRepository.signOut();
    if (result.success) {
      resetStore();
    } else {
      setError(result.error.message);
    }
  };

  return {
    email: user?.email ?? null,
    isChecking,
    isResending,
    cooldownSeconds,
    error,
    resendSuccess,
    handleResend,
    handleRefresh,
    handleSignOut,
  };
}
