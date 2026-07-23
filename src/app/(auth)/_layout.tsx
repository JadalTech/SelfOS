import React from 'react';
import { Stack } from 'expo-router';
import { useRequireAuth } from '@/features/auth/hooks/useRequireAuth';
import { FullScreenLoader } from '@/shared/components';

export default function AuthGroupLayout() {
  const { isLoading } = useRequireAuth();

  // Show loader during the initial auth check to prevent UI flashing
  if (isLoading) {
    return <FullScreenLoader message="Checking authentication status..." />;
  }

  return (
    <Stack
      screenOptions={{
        headerShown: false,
        contentStyle: { backgroundColor: '#09090b' },
      }}
    />
  );
}
