import React from 'react';
import { View } from 'react-native';

export const LoadingRoutineCard: React.FC = React.memo(function LoadingRoutineCard() {
  return (
    <View
      className="bg-zinc-900/90 border border-zinc-800/80 rounded-2xl p-4 mb-3 gap-3 animate-pulse"
      accessibilityLabel="Loading routine details"
    >
      <View className="flex-row items-center justify-between">
        <View className="flex-row items-center gap-3">
          {/* Icon skeleton */}
          <View className="w-10 h-10 rounded-xl bg-zinc-800" />
          <View className="gap-1.5">
            {/* Title skeleton */}
            <View className="w-32 h-4 rounded bg-zinc-800" />
            {/* Frequency skeleton */}
            <View className="w-20 h-3 rounded bg-zinc-800/60" />
          </View>
        </View>

        {/* Badge skeleton */}
        <View className="w-16 h-6 rounded-full bg-zinc-800" />
      </View>

      <View className="flex-row items-center justify-between pt-2 border-t border-zinc-800/60">
        {/* Streak skeleton */}
        <View className="w-24 h-3 rounded bg-zinc-800/60" />
        {/* Reminder skeleton */}
        <View className="w-16 h-3 rounded bg-zinc-800/60" />
      </View>
    </View>
  );
});
