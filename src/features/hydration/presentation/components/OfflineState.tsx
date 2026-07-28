import React from 'react';
import { View, Text } from 'react-native';

export const OfflineState: React.FC = React.memo(function OfflineState() {
  return (
    <View className="flex-1 bg-black justify-center items-center p-6 gap-2" accessibilityRole="summary" accessibilityLabel="Offline state">
      <Text className="text-3xl">📡</Text>
      <Text className="text-zinc-100 font-bold text-sm text-center">You are currently offline</Text>
      <Text className="text-zinc-400 text-xs text-center max-w-[240px]">
        Please check your connection. Hydration data will sync once reconnected.
      </Text>
    </View>
  );
});
