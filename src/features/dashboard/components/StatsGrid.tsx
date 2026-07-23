import React from 'react';
import { View, Text } from 'react-native';
import type { StatsVM } from '../types';

interface StatsGridProps {
  readonly stats: StatsVM;
}

export const StatsGrid: React.FC<StatsGridProps> = React.memo(function StatsGrid({ stats }) {
  return (
    <View className="flex-row flex-wrap gap-3">
      {/* Active Routines */}
      <View className="flex-1 min-w-[140px] bg-zinc-900/90 border border-zinc-800/80 rounded-2xl p-4 gap-1">
        <Text className="text-zinc-500 text-[10px] font-bold uppercase tracking-wider">
          Active Routines
        </Text>
        <Text className="text-zinc-100 text-2xl font-extrabold">{stats.activeRoutinesCount}</Text>
        <Text className="text-zinc-500 text-[10px]">Tracked foundations</Text>
      </View>

      {/* 30-Day Completion Rate */}
      <View className="flex-1 min-w-[140px] bg-zinc-900/90 border border-zinc-800/80 rounded-2xl p-4 gap-1">
        <Text className="text-zinc-500 text-[10px] font-bold uppercase tracking-wider">
          30-Day Rate
        </Text>
        <Text className="text-emerald-400 text-2xl font-extrabold">
          {stats.completionRate30Days}%
        </Text>
        <Text className="text-zinc-500 text-[10px]">Consistency score</Text>
      </View>

      {/* Total Completions */}
      <View className="flex-1 min-w-[140px] bg-zinc-900/90 border border-zinc-800/80 rounded-2xl p-4 gap-1">
        <Text className="text-zinc-500 text-[10px] font-bold uppercase tracking-wider">
          Total Logs
        </Text>
        <Text className="text-zinc-100 text-2xl font-extrabold">
          {stats.totalCompletionsAllTime}
        </Text>
        <Text className="text-zinc-500 text-[10px]">Completed tasks</Text>
      </View>
    </View>
  );
});
