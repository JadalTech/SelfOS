import React from 'react';
import { View, Text } from 'react-native';

export interface LinearProgressProps {
  readonly progress: number; // 0 to 1
  readonly height?: number;
  readonly activeColor?: string;
  readonly inactiveColor?: string;
  readonly label?: string;
  readonly valueLabel?: string;
}

export const LinearProgress: React.FC<LinearProgressProps> = React.memo(function LinearProgress({
  progress,
  height = 8,
  activeColor = '#ec4899',
  inactiveColor = '#27272a',
  label,
  valueLabel,
}) {
  const percentage = Math.min(100, Math.max(0, Math.round(progress * 100)));

  return (
    <View
      className="w-full gap-1.5"
      accessible={true}
      accessibilityRole="progressbar"
      accessibilityLabel={`${label || 'Progress'}: ${percentage}%`}
    >
      {label || valueLabel ? (
        <View className="flex-row items-center justify-between">
          {label ? (
            <Text className="text-zinc-400 text-xs font-semibold">{label}</Text>
          ) : null}
          {valueLabel ? (
            <Text className="text-zinc-200 text-xs font-bold">{valueLabel}</Text>
          ) : null}
        </View>
      ) : null}

      <View
        style={{ height, backgroundColor: inactiveColor }}
        className="w-full rounded-full overflow-hidden"
      >
        <View
          style={{
            height: '100%',
            width: `${percentage}%`,
            backgroundColor: activeColor,
          }}
          className="rounded-full"
        />
      </View>
    </View>
  );
});
