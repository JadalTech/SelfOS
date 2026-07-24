import React from 'react';
import { View, Text } from 'react-native';
import type { SkincareLogVM } from '../types';

export interface SkincareLogCardProps {
  readonly log: SkincareLogVM;
}

export const SkincareLogCard: React.FC<SkincareLogCardProps> = React.memo(function SkincareLogCard({
  log,
}) {
  return (
    <View className="bg-zinc-900 border border-zinc-800 p-4 rounded-2xl gap-2 shadow-sm">
      <View className="flex-row items-center justify-between">
        <View className="flex-row items-center gap-2">
          <Text className="text-zinc-50 text-sm font-bold">{log.dateFormatted}</Text>
          <Text className="text-zinc-500 text-xs">• {log.timeFormatted}</Text>
        </View>
        <View className="bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/30">
          <Text className="text-emerald-400 text-[10px] font-semibold">
            {log.completedStepsCount} / {log.totalStepsCount} Steps Logged
          </Text>
        </View>
      </View>

      <View className="flex-row items-center gap-3 mt-1">
        {log.weatherLabel ? (
          <View className="bg-zinc-950 px-2 py-0.5 rounded border border-zinc-800">
            <Text className="text-zinc-400 text-[10px]">🌤️ {log.weatherLabel}</Text>
          </View>
        ) : null}
        {log.skinFeelingLabel ? (
          <View className="bg-zinc-950 px-2 py-0.5 rounded border border-zinc-800">
            <Text className="text-zinc-400 text-[10px]">Rating: {log.skinFeelingLabel}</Text>
          </View>
        ) : null}
      </View>

      {log.notes ? (
        <Text className="text-zinc-400 text-xs italic mt-1 bg-zinc-950/60 p-2 rounded-lg">
          {`"${log.notes}"`}
        </Text>
      ) : null}
    </View>
  );
});
