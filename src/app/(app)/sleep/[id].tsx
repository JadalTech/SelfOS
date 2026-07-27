import React from 'react';
import { useLocalSearchParams } from 'expo-router';
import { SleepDetailsScreen } from '@/features/sleep/screens';

export default function SleepDetailsRoute() {
  const { id } = useLocalSearchParams<{ id: string }>();
  return <SleepDetailsScreen entryId={id || ''} />;
}
