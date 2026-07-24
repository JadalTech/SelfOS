import React from 'react';
import { View, Text } from 'react-native';
import { CircularProgress } from '../loaders/CircularProgress';
import { LinearProgress } from '../loaders/LinearProgress';

export interface ProgressCardProps {
  readonly title: string;
  readonly value: string | number;
  readonly progress: number; // 0 to 1
  readonly type?: 'linear' | 'circular';
  readonly activeColor?: string;
  readonly subLabel?: string;
}

export const ProgressCard: React.FC<ProgressCardProps> = React.memo(function ProgressCard({
  title,
  value,
  progress,
  type = 'linear',
  activeColor = '#ec4899',
  subLabel,
}) {
  const percentage = Math.min(100, Math.max(0, Math.round(progress * 100)));

  return (
    <View
      className="bg-zinc-900 border border-zinc-800 p-4 rounded-2xl shadow-sm justify-between gap-3"
      accessible={true}
      accessibilityRole="summary"
      accessibilityLabel={`${title}: ${value}. ${percentage}% complete.`}
    >
      <View className="flex-row items-center justify-between">
        <Text className="text-zinc-400 text-xs font-medium uppercase tracking-wider">{title}</Text>
        {subLabel ? (
          <Text className="text-zinc-500 text-[10px] font-medium">{subLabel}</Text>
        ) : null}
      </View>

      {type === 'circular' ? (
        <View className="items-center py-2">
          <CircularProgress
            progress={progress}
            label={value.toString()}
            subLabel={`${percentage}%`}
            activeColor={activeColor}
          />
        </View>
      ) : (
        <View className="gap-2">
          <Text className="text-zinc-50 text-2xl font-bold tracking-tight">{value}</Text>
          <LinearProgress progress={progress} activeColor={activeColor} />
        </View>
      )}
    </View>
  );
});
