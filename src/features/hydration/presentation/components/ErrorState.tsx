import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';

export interface ErrorStateProps {
  readonly errorMsg?: string;
  readonly onRetry?: () => void;
}

export const ErrorState: React.FC<ErrorStateProps> = React.memo(function ErrorState({
  errorMsg = 'An unexpected error occurred.',
  onRetry,
}) {
  return (
    <View className="flex-1 bg-black justify-center items-center p-6 gap-3">
      <Text className="text-3xl">⚠️</Text>
      <Text className="text-zinc-100 font-bold text-base text-center">Failed to load data</Text>
      <Text className="text-zinc-400 text-xs text-center max-w-[260px] leading-relaxed">
        {errorMsg}
      </Text>
      {onRetry ? (
        <TouchableOpacity
          activeOpacity={0.8}
          onPress={onRetry}
          className="mt-4 px-4 py-2 border border-zinc-800 rounded-xl bg-zinc-900 active:bg-zinc-800"
          accessibilityRole="button"
          accessibilityLabel="Retry loading data"
        >
          <Text className="text-zinc-300 text-xs font-bold">Retry</Text>
        </TouchableOpacity>
      ) : null}
    </View>
  );
});
