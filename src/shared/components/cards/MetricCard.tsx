import React from 'react';
import { View, Text } from 'react-native';

export interface MetricCardProps {
  readonly label: string;
  readonly value: string | number;
  readonly icon?: string;
  readonly color?: string;
  readonly subLabel?: string;
}

export const MetricCard: React.FC<MetricCardProps> = React.memo(function MetricCard({
  label,
  value,
  icon,
  color = '#ec4899',
  subLabel,
}) {
  return (
    <View
      className="bg-zinc-900 border border-zinc-800 p-3.5 rounded-2xl flex-1 min-w-[120px] justify-between shadow-sm"
      accessible={true}
      accessibilityRole="text"
      accessibilityLabel={`${label}: ${value}`}
    >
      <View className="flex-row items-center justify-between gap-1 mb-1">
        <Text className="text-zinc-400 text-xs font-semibold uppercase tracking-wider">{label}</Text>
        {icon ? (
          <Text className="text-sm" style={{ color }}>
            {icon}
          </Text>
        ) : null}
      </View>
      <View className="mt-1">
        <Text className="text-zinc-50 text-lg font-bold tracking-tight">{value}</Text>
        {subLabel ? (
          <Text className="text-zinc-500 text-[10px] font-medium mt-0.5">{subLabel}</Text>
        ) : null}
      </View>
    </View>
  );
});
