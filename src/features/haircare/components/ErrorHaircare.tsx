import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';

interface ErrorHaircareProps {
  readonly errorMessage?: string;
  readonly onRetry?: () => void;
}

export const ErrorHaircare: React.FC<ErrorHaircareProps> = React.memo(
  function ErrorHaircare({ errorMessage = 'Unable to load haircare data.', onRetry }) {
    return (
      <View className="flex-1 items-center justify-center p-6 gap-3">
        <Text className="text-3xl">⚠️</Text>
        <Text className="text-zinc-100 text-base font-bold text-center">Haircare Sync Error</Text>
        <Text className="text-zinc-400 text-xs text-center">{errorMessage}</Text>
        {onRetry ? (
          <TouchableOpacity
            className="px-5 py-2.5 bg-zinc-900 border border-zinc-800 rounded-xl"
            onPress={onRetry}
            accessibilityRole="button"
          >
            <Text className="text-zinc-200 font-bold text-xs">Retry Connection</Text>
          </TouchableOpacity>
        ) : null}
      </View>
    );
  }
);
