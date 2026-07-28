import React from 'react';
import { View, Text } from 'react-native';
import Svg, { Circle } from 'react-native-svg';

export interface ProgressRingProps {
  readonly size?: number;
  readonly strokeWidth?: number;
  readonly progress: number; // 0 to 1
  readonly color?: string;
  readonly backgroundColor?: string;
  readonly children?: React.ReactNode;
}

export const ProgressRing: React.FC<ProgressRingProps> = React.memo(function ProgressRing({
  size = 180,
  strokeWidth = 14,
  progress,
  color = '#3b82f6',
  backgroundColor = '#18181b',
  children,
}) {
  const radius = (size - strokeWidth) / 2;
  const circumference = radius * 2 * Math.PI;
  const strokeDashoffset = circumference - Math.min(1, Math.max(0, progress)) * circumference;

  return (
    <View style={{ width: size, height: size }} className="justify-center items-center relative">
      <Svg width={size} height={size} style={{ transform: [{ rotate: '-90deg' }] }}>
        {/* Background Circle */}
        <Circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke={backgroundColor}
          strokeWidth={strokeWidth}
          fill="transparent"
        />
        {/* Progress Circle */}
        <Circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke={color}
          strokeWidth={strokeWidth}
          fill="transparent"
          strokeDasharray={circumference}
          strokeDashoffset={strokeDashoffset}
          strokeLinecap="round"
        />
      </Svg>
      {children ? (
        <View className="absolute items-center justify-center">
          {children}
        </View>
      ) : null}
    </View>
  );
});
