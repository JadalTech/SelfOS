import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';

export interface NoDataCardProps {
  readonly title: string;
  readonly description: string;
  readonly icon?: string;
  readonly actionLabel?: string;
  readonly onAction?: () => void;
  readonly color?: string;
}

export const NoDataCard: React.FC<NoDataCardProps> = React.memo(function NoDataCard({
  title,
  description,
  icon = '📂',
  actionLabel,
  onAction,
  color = '#ec4899',
}) {
  return (
    <View
      className="bg-zinc-900 border border-zinc-800 p-5 rounded-2xl items-center text-center gap-3"
      accessible={true}
      accessibilityRole="summary"
      accessibilityLabel={`${title}. ${description}`}
    >
      <Text className="text-3xl">{icon}</Text>
      
      <View className="items-center gap-0.5">
        <Text className="text-zinc-50 text-sm font-bold text-center">{title}</Text>
        <Text className="text-zinc-400 text-xs text-center max-w-[240px] leading-relaxed">
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
          className="mt-1 px-3.5 py-1.5 rounded-xl border"
          style={{ backgroundColor: `${color}15`, borderColor: `${color}30` }}
        >
          <Text className="text-xs font-bold" style={{ color }}>
            {actionLabel}
          </Text>
        </TouchableOpacity>
      ) : null}
    </View>
  );
});
