import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';

export interface ErrorStateCardProps {
  readonly title?: string;
  readonly message?: string;
  readonly onRetry?: () => void;
}

export const ErrorStateCard: React.FC<ErrorStateCardProps> = React.memo(function ErrorStateCard({
  title = 'Something went wrong',
  message = 'Failed to load content. Please try again.',
  onRetry,
}) {
  return (
    <View
      className="bg-rose-500/10 border border-rose-500/30 p-5 rounded-2xl items-center text-center gap-2.5"
      accessible={true}
      accessibilityRole="alert"
      accessibilityLabel={`${title}. ${message}`}
    >
      <View className="w-10 h-10 rounded-xl bg-rose-500/20 items-center justify-center">
        <Text className="text-rose-400 text-lg font-bold">⚠️</Text>
      </View>
      <View className="items-center gap-0.5">
        <Text className="text-rose-200 text-sm font-bold">{title}</Text>
        <Text className="text-rose-300/80 text-xs text-center">{message}</Text>
      </View>
      {onRetry ? (
        <TouchableOpacity
          activeOpacity={0.8}
          onPress={onRetry}
          accessible={true}
          accessibilityRole="button"
          accessibilityLabel="Retry loading data"
          accessibilityHint="Tap to retry the failed network operation"
          hitSlop={{ top: 8, bottom: 8, left: 12, right: 12 }}
          className="mt-1 bg-rose-500/20 border border-rose-500/40 px-3.5 py-1.5 rounded-xl"
        >
          <Text className="text-rose-300 text-xs font-bold">Try Again</Text>
        </TouchableOpacity>
      ) : null}
    </View>
  );
});
