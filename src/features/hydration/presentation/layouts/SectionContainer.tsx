import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';

export interface SectionContainerProps {
  readonly title: string;
  readonly actionLabel?: string;
  readonly onAction?: () => void;
  readonly children: React.ReactNode;
}

export const SectionContainer: React.FC<SectionContainerProps> = React.memo(function SectionContainer({
  title,
  actionLabel,
  onAction,
  children,
}) {
  return (
    <View className="bg-zinc-950 border border-zinc-900 rounded-3xl p-5 gap-4 my-2">
      <View className="flex-row justify-between items-center">
        <Text className="text-zinc-100 font-bold text-base tracking-tight">{title}</Text>
        {actionLabel && onAction ? (
          <TouchableOpacity
            activeOpacity={0.7}
            onPress={onAction}
            accessibilityRole="button"
            accessibilityLabel={actionLabel}
            hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
          >
            <Text className="text-blue-500 font-semibold text-xs">{actionLabel}</Text>
          </TouchableOpacity>
        ) : null}
      </View>
      <View className="flex-1">{children}</View>
    </View>
  );
});
