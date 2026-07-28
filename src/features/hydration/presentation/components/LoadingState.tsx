import React from 'react';
import { View, ActivityIndicator, Text } from 'react-native';

export const LoadingState: React.FC = React.memo(function LoadingState() {
  return (
    <View className="flex-1 bg-black justify-center items-center p-6" accessibilityRole="progressbar" accessibilityLabel="Loading hydration module">
      <ActivityIndicator size="large" color="#3b82f6" />
      <Text className="text-zinc-400 text-xs mt-3">Loading hydration...</Text>
    </View>
  );
});
