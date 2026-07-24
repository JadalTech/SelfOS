import React from 'react';
import { View, Text } from 'react-native';
import type { SkinWeeklyReview } from '../types/ai.types';

export const SkinWeeklyReviewCard: React.FC<{ readonly review: SkinWeeklyReview }> = function SkinWeeklyReviewCard({
  review,
}) {
  return (
    <View className="bg-zinc-900 border border-zinc-800 rounded-2xl p-4 gap-4 shadow-sm my-2">
      <View className="flex-row items-center justify-between border-b border-zinc-800/80 pb-3">
        <View>
          <Text className="text-zinc-500 text-[10px] font-bold uppercase tracking-wider">Weekly AI Analysis</Text>
          <Text className="text-zinc-50 text-base font-bold">{review.dateRange}</Text>
        </View>
        <View className="bg-emerald-500/10 border border-emerald-500/30 px-3 py-1 rounded-full">
          <Text className="text-emerald-400 text-xs font-bold">{review.scoreChangeLabel}</Text>
        </View>
      </View>

      <Text className="text-zinc-300 text-xs leading-5 bg-zinc-950 p-3 rounded-xl border border-zinc-800/60">
        {review.summary}
      </Text>

      {/* Highlights */}
      <View className="gap-1.5">
        <Text className="text-emerald-400 text-xs font-bold uppercase tracking-wide">Key Highlights</Text>
        {review.highlights.map((h, idx) => (
          <View key={idx} className="flex-row items-center gap-2">
            <Text className="text-emerald-400 text-xs">✓</Text>
            <Text className="text-zinc-300 text-xs flex-1">{h}</Text>
          </View>
        ))}
      </View>

      {/* Areas to Improve */}
      <View className="gap-1.5">
        <Text className="text-amber-400 text-xs font-bold uppercase tracking-wide">Areas of Focus</Text>
        {review.areasToImprove.map((a, idx) => (
          <View key={idx} className="flex-row items-center gap-2">
            <Text className="text-amber-400 text-xs">🎯</Text>
            <Text className="text-zinc-300 text-xs flex-1">{a}</Text>
          </View>
        ))}
      </View>
    </View>
  );
};
