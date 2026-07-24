import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';

export interface StatTileProps {
  readonly label: string;
  readonly value: string | number;
  readonly icon?: string;
  readonly trend?: string;
  readonly badgeColor?: string;
  readonly onPress?: () => void;
}

export const StatTile: React.FC<StatTileProps> = React.memo(function StatTile({
  label,
  value,
  icon,
  trend,
  badgeColor = '#ec4899',
  onPress,
}) {
  const content = (
    <View className="bg-zinc-900 border border-zinc-800 p-3.5 rounded-2xl flex-1 min-w-[130px] justify-between shadow-sm">
      <View className="flex-row items-center justify-between mb-1">
        <Text className="text-zinc-400 text-xs font-medium">{label}</Text>
        {icon ? <Text className="text-base">{icon}</Text> : null}
      </View>
      <View className="flex-row items-baseline justify-between mt-1">
        <Text className="text-zinc-50 text-xl font-bold">{value}</Text>
        {trend ? (
          <Text className="text-xs font-semibold" style={{ color: badgeColor }}>
            {trend}
          </Text>
        ) : null}
      </View>
    </View>
  );

  if (onPress) {
    return (
      <TouchableOpacity
        activeOpacity={0.8}
        onPress={onPress}
        className="flex-1"
        accessible={true}
        accessibilityRole="button"
        accessibilityLabel={`${label}: ${value}`}
        accessibilityHint={`Tap to open ${label} details`}
        hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
      >
        {content}
      </TouchableOpacity>
    );
  }

  return (
    <View
      accessible={true}
      accessibilityRole="text"
      accessibilityLabel={`${label}: ${value}`}
      className="flex-1"
    >
      {content}
    </View>
  );
});
