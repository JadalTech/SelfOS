import React from 'react';
import { View, Text } from 'react-native';

export interface InsightsPreviewSectionProps {
  readonly score: number;
  readonly momentum: number;
}

export const InsightsPreviewSection: React.FC<InsightsPreviewSectionProps> = React.memo(function InsightsPreviewSection({
  score,
  momentum,
}) {
  const getInsightText = () => {
    if (momentum > 1.2) return 'Excellent pacing! You are currently drinking faster than your average hourly requirement.';
    if (momentum < 0.8) return 'You are falling slightly behind schedule. Take a few sips of water to restore momentum.';
    return 'Great job! Your hydration schedule is perfectly balanced for your current climate setting.';
  };

  return (
    <View className="bg-zinc-950 border border-zinc-900 rounded-3xl p-5 gap-3 my-2 border-l-4 border-l-blue-500">
      <Text className="text-zinc-100 font-bold text-sm">AI Hydration Insight</Text>
      <Text className="text-zinc-300 text-xs leading-relaxed">{getInsightText()}</Text>
      <View className="flex-row gap-3 mt-1">
        <View className="bg-zinc-900 px-2.5 py-1 rounded-full border border-zinc-800">
          <Text className="text-[10px] text-zinc-400 font-semibold">Momentum: {momentum.toFixed(2)}x</Text>
        </View>
        <View className="bg-zinc-900 px-2.5 py-1 rounded-full border border-zinc-800">
          <Text className="text-[10px] text-zinc-400 font-semibold">Quality Index: {score.toFixed(1)}/10</Text>
        </View>
      </View>
    </View>
  );
});
