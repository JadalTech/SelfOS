import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';

export interface EmptyStateProps {
  readonly title: string;
  readonly description: string;
  readonly actionLabel?: string;
  readonly onAction?: () => void;
}

export const EmptyState: React.FC<EmptyStateProps> = React.memo(function EmptyState({
  title,
  description,
  actionLabel,
  onAction,
}) {
  return (
    <View className="flex-1 bg-black justify-center items-center p-6 gap-3">
      <View className="w-16 h-16 rounded-full bg-zinc-900 border border-zinc-800 items-center justify-center">
        <Text className="text-3xl">💧</Text>
      </View>
      <Text className="text-zinc-100 font-bold text-lg text-center mt-2">{title}</Text>
      <Text className="text-zinc-400 text-xs text-center max-w-[280px] leading-relaxed">
        {description}
      </Text>
      {actionLabel && onAction ? (
        <TouchableOpacity
          activeOpacity={0.8}
          onPress={onAction}
          className="mt-4 px-5 py-2.5 rounded-xl bg-blue-600 active:bg-blue-700"
          accessibilityRole="button"
          accessibilityLabel={actionLabel}
        >
          <Text className="text-zinc-100 font-bold text-xs">{actionLabel}</Text>
        </TouchableOpacity>
      ) : null}
    </View>
  );
});
