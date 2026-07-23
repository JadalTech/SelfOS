import React from 'react';
import { View, Text } from 'react-native';
import type { StatsVM } from '../types';

interface StreakOverviewCardProps {
  readonly stats: StatsVM;
}

export const StreakOverviewCard: React.FC<StreakOverviewCardProps> = React.memo(
  function StreakOverviewCard({ stats }) {
    return (
      <View className="bg-amber-950/30 border border-amber-800/50 rounded-2xl p-4 gap-2">
        <View className="flex-row items-center justify-between">
          <Text className="text-amber-500 text-xs font-semibold uppercase tracking-wider">
            Best Active Streak
          </Text>
          <Text className="text-amber-400 text-xs font-bold">🔥 Longest Record</Text>
        </View>

        <View className="flex-row items-baseline gap-2">
          <Text className="text-amber-400 text-3xl font-black">{stats.topStreakCount}</Text>
          <Text className="text-zinc-400 text-sm font-medium">consecutive days</Text>
        </View>

        <Text className="text-zinc-400 text-xs" numberOfLines={1}>
          Top performer: <Text className="text-zinc-200 font-bold">{stats.topStreakTitle}</Text>
        </Text>
      </View>
    );
  }
);
