import React from 'react';
import { View, Text } from 'react-native';
import type { ConditionTrendVM } from '../types/analytics.types';

interface ConditionTrendChartProps {
  readonly trend: ConditionTrendVM;
}

export const ConditionTrendChart: React.FC<ConditionTrendChartProps> = React.memo(
  function ConditionTrendChart({ trend }) {
    const trendColor =
      trend.trendDirection === 'improving'
        ? 'text-emerald-400 border-emerald-500/40 bg-emerald-500/10'
        : trend.trendDirection === 'declining'
        ? 'text-rose-400 border-rose-500/40 bg-rose-500/10'
        : 'text-amber-400 border-amber-500/40 bg-amber-500/10';

    return (
      <View className="bg-zinc-900 border border-zinc-800 p-4 rounded-2xl gap-3 shadow-md">
        <View className="flex-row items-center justify-between">
          <View>
            <Text className="text-zinc-400 text-xs font-semibold uppercase tracking-wider">
              Scalp & Hair Health Trend
            </Text>
            <Text className="text-zinc-100 text-lg font-extrabold mt-0.5">
              Average Score: {trend.avgOverallHealth}/10
            </Text>
          </View>

          <View className={`px-2.5 py-1 rounded-lg border ${trendColor}`}>
            <Text className="text-xs font-black uppercase">{trend.trendDirection}</Text>
          </View>
        </View>

        {/* Symptom Level Averages */}
        <View className="gap-2 pt-2 border-t border-zinc-800">
          <View className="gap-1">
            <View className="flex-row justify-between">
              <Text className="text-zinc-400 text-xs">Shedding Rating</Text>
              <Text className="text-amber-400 text-xs font-bold">{trend.avgShedding}/5</Text>
            </View>
            <View className="w-full h-2 bg-zinc-950 rounded-full overflow-hidden">
              <View className="h-full bg-amber-500" style={{ width: `${(trend.avgShedding / 5) * 100}%` }} />
            </View>
          </View>

          <View className="gap-1">
            <View className="flex-row justify-between">
              <Text className="text-zinc-400 text-xs">Dandruff Rating</Text>
              <Text className="text-amber-400 text-xs font-bold">{trend.avgDandruff}/5</Text>
            </View>
            <View className="w-full h-2 bg-zinc-950 rounded-full overflow-hidden">
              <View className="h-full bg-amber-500" style={{ width: `${(trend.avgDandruff / 5) * 100}%` }} />
            </View>
          </View>

          <View className="gap-1">
            <View className="flex-row justify-between">
              <Text className="text-zinc-400 text-xs">Scalp Itchiness</Text>
              <Text className="text-amber-400 text-xs font-bold">{trend.avgItchiness}/5</Text>
            </View>
            <View className="w-full h-2 bg-zinc-950 rounded-full overflow-hidden">
              <View className="h-full bg-amber-500" style={{ width: `${(trend.avgItchiness / 5) * 100}%` }} />
            </View>
          </View>

          <View className="gap-1">
            <View className="flex-row justify-between">
              <Text className="text-zinc-400 text-xs">Scalp Oiliness</Text>
              <Text className="text-amber-400 text-xs font-bold">{trend.avgOiliness}/5</Text>
            </View>
            <View className="w-full h-2 bg-zinc-950 rounded-full overflow-hidden">
              <View className="h-full bg-amber-500" style={{ width: `${(trend.avgOiliness / 5) * 100}%` }} />
            </View>
          </View>
        </View>
      </View>
    );
  }
);
