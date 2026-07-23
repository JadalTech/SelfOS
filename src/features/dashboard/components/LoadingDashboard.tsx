import React from 'react';
import { View } from 'react-native';

export const LoadingDashboard: React.FC = React.memo(function LoadingDashboard() {
  return (
    <View
      className="flex-1 bg-zinc-950 p-4 gap-4 animate-pulse"
      accessibilityLabel="Loading dashboard summary"
    >
      {/* Header skeleton */}
      <View className="flex-row items-center justify-between pb-2">
        <View className="gap-2">
          <View className="w-24 h-3 bg-zinc-800 rounded" />
          <View className="w-36 h-4 bg-zinc-800 rounded" />
          <View className="w-48 h-6 bg-zinc-800 rounded" />
        </View>
        <View className="w-12 h-12 rounded-full bg-zinc-800" />
      </View>

      {/* Progress card skeleton */}
      <View className="h-24 bg-zinc-900 border border-zinc-800 rounded-2xl p-4 gap-3">
        <View className="w-32 h-4 bg-zinc-800 rounded" />
        <View className="w-full h-3 bg-zinc-800 rounded-full" />
      </View>

      {/* Routine list skeleton */}
      <View className="h-36 bg-zinc-900 border border-zinc-800 rounded-2xl p-4 gap-3">
        <View className="w-40 h-4 bg-zinc-800 rounded" />
        <View className="w-full h-12 bg-zinc-800/60 rounded-xl" />
      </View>

      {/* Stats grid skeleton */}
      <View className="flex-row gap-3">
        <View className="flex-1 h-20 bg-zinc-900 border border-zinc-800 rounded-2xl" />
        <View className="flex-1 h-20 bg-zinc-900 border border-zinc-800 rounded-2xl" />
      </View>
    </View>
  );
});
