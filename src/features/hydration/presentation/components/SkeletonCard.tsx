import React, { useEffect, useRef } from 'react';
import { View, Animated } from 'react-native';

export interface SkeletonCardProps {
  readonly height?: number;
  readonly className?: string;
}

export const SkeletonCard: React.FC<SkeletonCardProps> = React.memo(function SkeletonCard({
  height = 120,
  className = 'w-full rounded-2xl bg-zinc-900 border border-zinc-800/80 p-4 justify-between',
}) {
  const opacity = useRef(new Animated.Value(0.3)).current;

  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(opacity, {
          toValue: 0.7,
          duration: 800,
          useNativeDriver: true,
        }),
        Animated.timing(opacity, {
          toValue: 0.3,
          duration: 800,
          useNativeDriver: true,
        }),
      ])
    ).start();
  }, [opacity]);

  return (
    <Animated.View
      style={{ opacity, height }}
      className={className}
      accessible={true}
      accessibilityRole="image"
      accessibilityLabel="Loading content skeleton placeholder"
    >
      <View className="h-4 bg-zinc-800 rounded-md w-1/3" />
      <View className="h-6 bg-zinc-800 rounded-md w-3/4" />
      <View className="h-3 bg-zinc-800 rounded-md w-1/2" />
    </Animated.View>
  );
});
