import React from 'react';
import { View } from 'react-native';

export interface SkeletonLoaderProps {
  readonly width?: number | `${number}%`;
  readonly height?: number;
  readonly borderRadius?: number;
  readonly className?: string;
}

export const SkeletonLoader: React.FC<SkeletonLoaderProps> = React.memo(function SkeletonLoader({
  width = '100%',
  height = 20,
  borderRadius = 8,
  className = '',
}) {
  return (
    <View
      className={`bg-zinc-800/60 animate-pulse ${className}`}
      style={{
        width,
        height,
        borderRadius,
      }}
    />
  );
});
