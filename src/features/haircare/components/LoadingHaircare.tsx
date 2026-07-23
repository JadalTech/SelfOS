import React from 'react';
import { View } from 'react-native';

export const LoadingHaircare: React.FC = React.memo(function LoadingHaircare() {
  return (
    <View className="flex-1 bg-zinc-950 p-4 gap-4 animate-pulse">
      <View className="h-32 bg-zinc-900 border border-zinc-800 rounded-2xl" />
      <View className="h-24 bg-zinc-900 border border-zinc-800 rounded-2xl" />
      <View className="h-40 bg-zinc-900 border border-zinc-800 rounded-2xl" />
    </View>
  );
});
