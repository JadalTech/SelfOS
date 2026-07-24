import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';

export interface RetryCardProps {
  readonly title?: string;
  readonly message?: string;
  readonly onRetry: () => void;
  readonly color?: string;
}

export const RetryCard: React.FC<RetryCardProps> = React.memo(function RetryCard({
  title = 'Connection Issue',
  message = 'Unable to refresh metrics. Please verify your connection and try again.',
  onRetry,
  color = '#ec4899',
}) {
  return (
    <View
      className="bg-zinc-900 border border-zinc-800 p-5 rounded-2xl items-center text-center gap-3.5"
      accessible={true}
      accessibilityRole="alert"
      accessibilityLabel={`${title}. ${message}`}
    >
      <View className="w-10 h-10 rounded-xl bg-zinc-950 items-center justify-center border border-zinc-800">
        <Text className="text-zinc-400 text-lg font-bold">🔁</Text>
      </View>
      
      <View className="items-center gap-0.5">
        <Text className="text-zinc-50 text-sm font-bold">{title}</Text>
        <Text className="text-zinc-400 text-xs text-center max-w-[240px] leading-relaxed">
          {message}
        </Text>
      </View>

      <TouchableOpacity
        activeOpacity={0.8}
        onPress={onRetry}
        accessible={true}
        accessibilityRole="button"
        accessibilityLabel="Retry loading data"
        accessibilityHint="Tap to retry the failed network operation"
        hitSlop={{ top: 10, bottom: 10, left: 14, right: 14 }}
        className="mt-1 px-4 py-2 rounded-xl border"
        style={{ backgroundColor: `${color}15`, borderColor: `${color}40` }}
      >
        <Text className="text-xs font-bold" style={{ color }}>
          Try Again
        </Text>
      </TouchableOpacity>
    </View>
  );
});
