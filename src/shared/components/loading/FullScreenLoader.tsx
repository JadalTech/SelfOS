/**
 * FullScreenLoader
 *
 * Full-screen overlay with a centered activity indicator.
 * Used during app initialization, auth state resolution, etc.
 */

import React from 'react';
import { View, ActivityIndicator, Text } from 'react-native';

interface FullScreenLoaderProps {
  /** Optional message displayed below the spinner */
  message?: string;
}

export function FullScreenLoader({ message }: FullScreenLoaderProps): React.JSX.Element {
  return (
    <View className="flex-1 bg-background items-center justify-center">
      <ActivityIndicator size="large" color="#6366f1" />
      {message ? (
        <Text className="text-muted-foreground text-sm mt-4">{message}</Text>
      ) : null}
    </View>
  );
}
