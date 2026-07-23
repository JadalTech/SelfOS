import React from 'react';
import { View, Text } from 'react-native';
import type { ProgressVM } from '../types';

interface TodayProgressCardProps {
  readonly progress: ProgressVM;
}

export const TodayProgressCard: React.FC<TodayProgressCardProps> = React.memo(
  function TodayProgressCard({ progress }) {
    return (
      <View className="bg-zinc-900/90 border border-zinc-800/80 rounded-2xl p-4 gap-3 shadow-md">
        <View className="flex-row items-center justify-between">
          <View className="gap-0.5">
            <Text className="text-zinc-400 text-xs font-semibold uppercase tracking-wider">
              Today&apos;s Focus
            </Text>
            <Text className="text-zinc-100 text-base font-extrabold">
              {progress.statusText}
            </Text>
          </View>

          <View className="items-end">
            <Text className="text-emerald-400 text-2xl font-black">{progress.percentage}%</Text>
            <Text className="text-zinc-500 text-[10px] uppercase font-bold tracking-widest">
              Completed
            </Text>
          </View>
        </View>

        {/* Visual Progress Bar Track */}
        <View className="h-2.5 bg-zinc-800 rounded-full overflow-hidden w-full">
          <View
            className="h-full bg-emerald-500 rounded-full"
            style={{ width: `${Math.min(Math.max(progress.percentage, 0), 100)}%` }}
          />
        </View>
      </View>
    );
  }
);
