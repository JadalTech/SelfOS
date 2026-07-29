import React from 'react';
import { Stack } from 'expo-router';

export default function AppGroupLayout() {
  return (
    <Stack
      screenOptions={{
        headerShown: false,
        contentStyle: { backgroundColor: '#09090b' },
      }}
    />
  );
}

