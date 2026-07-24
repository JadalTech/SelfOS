import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';

export interface EmptyStateCardProps {
  readonly icon?: string;
  readonly title: string;
  readonly description: string;
  readonly actionLabel?: string;
  readonly onAction?: () => void;
  readonly accentColor?: string;
}

export const EmptyStateCard: React.FC<EmptyStateCardProps> = React.memo(function EmptyStateCard({
  icon = '📋',
  title,
  description,
  actionLabel,
  onAction,
  accentColor = '#ec4899',
}) {
  return (
    <View
      className="bg-zinc-900 border border-zinc-800/80 p-6 rounded-2xl items-center text-center gap-3"
      accessible={true}
      accessibilityRole="summary"
      accessibilityLabel={`${title}. ${description}`}
    >
      <View
        className="w-14 h-14 rounded-2xl items-center justify-center border"
        style={{ backgroundColor: `${accentColor}15`, borderColor: `${accentColor}30` }}
      >
        <Text className="text-2xl">{icon}</Text>
      </View>

      <View className="items-center gap-1">
        <Text className="text-zinc-100 text-base font-bold text-center">{title}</Text>
        <Text className="text-zinc-400 text-xs text-center max-w-[260px] leading-relaxed">
          {description}
        </Text>
      </View>

      {actionLabel && onAction ? (
        <TouchableOpacity
          activeOpacity={0.8}
          onPress={onAction}
          accessible={true}
          accessibilityRole="button"
          accessibilityLabel={actionLabel}
          accessibilityHint={`Tap to ${actionLabel.toLowerCase()}`}
          hitSlop={{ top: 8, bottom: 8, left: 12, right: 12 }}
          className="mt-2 px-4 py-2.5 rounded-xl font-semibold text-xs border"
          style={{ backgroundColor: `${accentColor}20`, borderColor: `${accentColor}40` }}
        >
          <Text className="text-xs font-bold" style={{ color: accentColor }}>
            {actionLabel}
          </Text>
        </TouchableOpacity>
      ) : null}
    </View>
  );
});
