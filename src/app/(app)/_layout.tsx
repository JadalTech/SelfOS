import React from 'react';
import { Stack } from 'expo-router';
import { useRequireAuth } from '@/features/auth/hooks/useRequireAuth';
import { FullScreenLoader } from '@/shared/components';

export default function AppGroupLayout() {
  const { status, isLoading } = useRequireAuth();

  // Block rendering protected screens until authorized
  if (isLoading || status !== 'authenticated') {
    return <FullScreenLoader message="Checking authorization..." />;
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
