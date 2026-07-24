import React from 'react';
import { View, Text, ActivityIndicator } from 'react-native';

export interface LoadingStateProps {
  readonly message?: string;
  readonly inline?: boolean;
  readonly color?: string;
}

export const LoadingState: React.FC<LoadingStateProps> = React.memo(function LoadingState({
  message = 'Loading...',
  inline = false,
  color = '#ec4899',
}) {
  if (inline) {
    return (
      <View className="flex-row items-center justify-center p-4 gap-2.5">
        <ActivityIndicator size="small" color={color} />
        <Text className="text-zinc-400 text-xs font-semibold">{message}</Text>
      </View>
    );
  }

  return (
    <View
      className="flex-1 bg-zinc-950 items-center justify-center p-6 gap-3.5"
      accessible={true}
      accessibilityRole="image"
      accessibilityLabel={message}
    >
      <ActivityIndicator size="large" color={color} />
      <Text className="text-zinc-400 text-sm font-bold tracking-tight">{message}</Text>
    </View>
  );
});
