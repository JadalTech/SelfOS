import React from 'react';
import { View, Text } from 'react-native';

export interface StatisticsSectionProps {
  readonly averageDrink: string;
  readonly largestDrink: string;
  readonly streak: number;
  readonly completionRate: string;
}

export const StatisticsSection: React.FC<StatisticsSectionProps> = React.memo(function StatisticsSection({
  averageDrink,
  largestDrink,
  streak,
  completionRate,
}) {
  const items = [
    { label: 'Avg Drink', value: averageDrink },
    { label: 'Max Drink', value: largestDrink },
    { label: 'Streak', value: `${streak} Days` },
    { label: 'Completion', value: completionRate },
  ];

  return (
    <View className="my-2 bg-zinc-950 border border-zinc-900 rounded-3xl p-5 gap-3">
      <Text className="text-zinc-100 font-bold text-sm">Statistics</Text>
      <View className="flex-row flex-wrap gap-2.5 justify-between">
        {items.map((item, idx) => (
          <View key={idx} className="flex-1 min-w-[100px] bg-zinc-900/60 border border-zinc-900/80 p-3 rounded-2xl">
            <Text className="text-zinc-500 text-[10px] uppercase font-bold tracking-widest">{item.label}</Text>
            <Text className="text-zinc-200 font-extrabold text-base mt-1">{item.value}</Text>
          </View>
        ))}
      </View>
    </View>
  );
});
