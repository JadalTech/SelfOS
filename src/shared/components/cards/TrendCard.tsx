import React from 'react';
import { View, Text } from 'react-native';

export interface TrendCardProps {
  readonly title: string;
  readonly value: string | number;
  readonly targetValue?: string | number;
  readonly changePercent?: number; // e.g. 15 for +15%, -8 for -8%
  readonly metricUnit?: string;
  readonly isBetterLower?: boolean;
}

export const TrendCard: React.FC<TrendCardProps> = React.memo(function TrendCard({
  title,
  value,
  targetValue,
  changePercent,
  metricUnit,
  isBetterLower = false,
}) {
  const hasChange = changePercent !== undefined;
  const isPositive = hasChange ? changePercent > 0 : false;
  
  // Decide color representation
  const isGoodChange = hasChange
    ? (isPositive && !isBetterLower) || (!isPositive && isBetterLower)
    : false;

  const changeColorClass = isGoodChange ? 'text-emerald-400' : 'text-rose-400';
  const changePrefix = isPositive ? '+' : '';

  return (
    <View
      className="bg-zinc-900 border border-zinc-800 p-4 rounded-2xl shadow-sm justify-between gap-2"
      accessible={true}
      accessibilityRole="text"
      accessibilityLabel={`${title}: ${value}. ${hasChange ? `Trend ${changePrefix}${changePercent}%` : ''}`}
    >
      <Text className="text-zinc-500 text-[10px] font-bold uppercase tracking-wider">{title}</Text>
      
      <View className="flex-row items-baseline gap-1.5 mt-1">
        <Text className="text-zinc-50 text-2xl font-bold tracking-tight">{value}</Text>
        {metricUnit ? (
          <Text className="text-zinc-400 text-xs font-semibold">{metricUnit}</Text>
        ) : null}
      </View>

      <View className="flex-row items-center justify-between border-t border-zinc-800/60 pt-2.5 mt-1">
        {targetValue ? (
          <Text className="text-zinc-400 text-xs font-medium">
            Goal: <Text className="text-zinc-300 font-bold">{targetValue}</Text>
          </Text>
        ) : <View />}

        {hasChange ? (
          <Text className={`text-xs font-bold ${changeColorClass}`}>
            {changePrefix}{changePercent}%
          </Text>
        ) : null}
      </View>
    </View>
  );
});
