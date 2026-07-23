import React from 'react';
import { View, Text } from 'react-native';
import type { WeeklyAnalyticsVM } from '../types/analytics.types';

interface CompletionBarChartProps {
  readonly weekly: WeeklyAnalyticsVM;
}

const DAY_LABELS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

export const CompletionBarChart: React.FC<CompletionBarChartProps> = React.memo(
  function CompletionBarChart({ weekly }) {
    const maxVal = Math.max(...Object.values(weekly.dailyCompletionMap), 1);

    return (
      <View className="bg-zinc-900 border border-zinc-800 p-4 rounded-2xl gap-3 shadow-md">
        <View className="flex-row items-center justify-between">
          <View>
            <Text className="text-zinc-400 text-xs font-semibold uppercase tracking-wider">
              Weekly Wash Frequency Breakdown
            </Text>
            <Text className="text-zinc-100 text-sm font-extrabold mt-0.5">
              Most Active Day: <Text className="text-amber-400">{weekly.mostActiveDayLabel}</Text>
            </Text>
          </View>
          <View className="bg-amber-500/10 border border-amber-500/30 px-2.5 py-1 rounded-lg">
            <Text className="text-amber-400 text-xs font-black">{weekly.completionRate}% Adherence</Text>
          </View>
        </View>

        <View className="flex-row items-end justify-between h-32 pt-4 border-b border-zinc-800 pb-2">
          {DAY_LABELS.map((dayLabel, index) => {
            const count = weekly.dailyCompletionMap[index] || 0;
            const heightPercent = Math.min(100, Math.max(12, (count / maxVal) * 100));
            const hasData = count > 0;

            return (
              <View key={dayLabel} className="items-center flex-1 gap-1.5 h-full justify-end">
                <Text className="text-zinc-400 text-[10px] font-bold">{count}</Text>
                <View
                  className={`w-full max-w-[24px] rounded-t-lg transition-all ${
                    hasData ? 'bg-amber-500' : 'bg-zinc-800/60'
                  }`}
                  style={{ height: `${heightPercent}%` }}
                />
                <Text className="text-zinc-500 text-[10px] font-medium">{dayLabel}</Text>
              </View>
            );
          })}
        </View>
      </View>
    );
  }
);
