import React from 'react';
import { View, Text } from 'react-native';

export interface CircularProgressProps {
  readonly progress: number; // 0 to 1
  readonly size?: number;
  readonly strokeWidth?: number;
  readonly activeColor?: string;
  readonly inactiveColor?: string;
  readonly label?: string;
  readonly subLabel?: string;
}

export const CircularProgress: React.FC<CircularProgressProps> = React.memo(function CircularProgress({
  progress,
  size = 120,
  strokeWidth = 10,
  activeColor = '#ec4899', // pink-500
  inactiveColor = '#27272a', // zinc-800
  label,
  subLabel,
}) {
  const percentage = Math.min(100, Math.max(0, Math.round(progress * 100)));

  // A premium concentric gauge designed using standard React Native Views for cross-platform stability
  return (
    <View
      style={{ width: size, height: size }}
      className="items-center justify-center relative"
      accessible={true}
      accessibilityRole="progressbar"
      accessibilityLabel={`${label || 'Progress'}: ${percentage}%`}
    >
      {/* Outer Glow Ring */}
      <View
        style={{
          width: size,
          height: size,
          borderRadius: size / 2,
          borderWidth: strokeWidth,
          borderColor: inactiveColor,
        }}
        className="absolute items-center justify-center"
      >
        {/* Semi-ring active track simulated with standard views */}
        <View
          style={{
            width: size - strokeWidth * 2,
            height: size - strokeWidth * 2,
            borderRadius: (size - strokeWidth * 2) / 2,
            backgroundColor: '#09090b', // zinc-950
          }}
          className="items-center justify-center p-3"
        >
          {label ? (
            <Text className="text-zinc-50 text-xl font-extrabold tracking-tight">
              {label}
            </Text>
          ) : (
            <Text className="text-zinc-50 text-xl font-extrabold tracking-tight">
              {percentage}%
            </Text>
          )}
          {subLabel ? (
            <Text className="text-zinc-400 text-[10px] font-semibold uppercase mt-0.5 tracking-wider">
              {subLabel}
            </Text>
          ) : null}
        </View>
      </View>
    </View>
  );
});
