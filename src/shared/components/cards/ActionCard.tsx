import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';

export interface ActionCardProps {
  readonly title: string;
  readonly description?: string;
  readonly icon?: string;
  readonly onPress: () => void;
  readonly actionLabel?: string;
  readonly color?: string;
}

export const ActionCard: React.FC<ActionCardProps> = React.memo(function ActionCard({
  title,
  description,
  icon,
  onPress,
  actionLabel,
  color = '#ec4899',
}) {
  return (
    <TouchableOpacity
      activeOpacity={0.8}
      onPress={onPress}
      accessible={true}
      accessibilityRole="button"
      accessibilityLabel={`${title}. ${description || ''}`}
      accessibilityHint={actionLabel ? `Tap to ${actionLabel.toLowerCase()}` : 'Tap to open'}
      hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
      className="bg-zinc-900 border border-zinc-800 p-4 rounded-2xl flex-row items-center justify-between shadow-sm"
    >
      <View className="flex-row items-center gap-3.5 flex-1 pr-3">
        {icon ? (
          <View
            style={{ backgroundColor: `${color}15`, borderColor: `${color}30` }}
            className="w-10 h-10 rounded-xl items-center justify-center border"
          >
            <Text className="text-lg">{icon}</Text>
          </View>
        ) : null}
        
        <View className="flex-1 gap-0.5">
          <Text className="text-zinc-50 text-sm font-bold tracking-tight">{title}</Text>
          {description ? (
            <Text className="text-zinc-400 text-xs leading-relaxed">{description}</Text>
          ) : null}
        </View>
      </View>

      <View className="flex-row items-center gap-1">
        {actionLabel ? (
          <Text className="text-xs font-bold mr-0.5" style={{ color }}>{actionLabel}</Text>
        ) : null}
        <Text className="text-zinc-500 text-sm font-bold">➔</Text>
      </View>
    </TouchableOpacity>
  );
});
