import React from 'react';
import { View, Text } from 'react-native';

export interface OfflineStateProps {
  readonly message?: string;
}

export const OfflineState: React.FC<OfflineStateProps> = React.memo(function OfflineState({
  message = 'You are currently offline. Viewing cached local data.',
}) {
  return (
    <View
      className="bg-amber-500/10 border-b border-amber-500/20 px-4 py-2 flex-row items-center justify-center gap-2"
      accessible={true}
      accessibilityRole="alert"
      accessibilityLabel={message}
    >
      <Text className="text-amber-400 text-xs">⚠️</Text>
      <Text className="text-amber-300 text-[10px] font-bold uppercase tracking-wider text-center">
        {message}
      </Text>
    </View>
  );
});
