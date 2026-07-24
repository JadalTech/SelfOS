import React from 'react';
import { View, Text } from 'react-native';
import type { AIWeeklyReview } from '../../../../shared/types/ai.types';

export interface NutritionWeeklyReviewCardProps {
  readonly review: AIWeeklyReview;
}

export const NutritionWeeklyReviewCard: React.FC<NutritionWeeklyReviewCardProps> = React.memo(function NutritionWeeklyReviewCard({
  review,
}) {
  return (
    <View className="bg-zinc-900 border border-zinc-800 p-5 rounded-2xl shadow-sm gap-4">
      <View className="flex-row items-center justify-between border-b border-zinc-850 pb-3">
        <View>
          <Text className="text-zinc-500 text-[10px] font-bold uppercase tracking-wider">Weekly Review</Text>
          <Text className="text-zinc-50 text-base font-extrabold tracking-tight mt-0.5">{review.dateRange}</Text>
        </View>
        <View className="bg-pink-500/10 border border-pink-500/20 px-3 py-1 rounded-full">
          <Text className="text-pink-400 text-xs font-bold uppercase tracking-wider">
            {review.scoreChangeLabel}
          </Text>
        </View>
      </View>

      <Text className="text-zinc-300 text-xs leading-relaxed">{review.summary}</Text>

      {/* Highlights */}
      <View className="gap-2.5">
        <Text className="text-zinc-500 text-[10px] font-bold uppercase tracking-wider">Highlights:</Text>
        {review.highlights.map((highlight, idx) => (
          <View key={idx} className="flex-row gap-2.5 items-start pl-1">
            <Text className="text-emerald-400 text-xs font-bold mt-0.5">✓</Text>
            <Text className="text-zinc-300 text-xs leading-relaxed flex-1">{highlight}</Text>
          </View>
        ))}
      </View>

      {/* Areas of Improvement */}
      <View className="gap-2.5 border-t border-zinc-850 pt-3">
        <Text className="text-zinc-500 text-[10px] font-bold uppercase tracking-wider">Areas to Improve:</Text>
        {review.areasToImprove.map((area, idx) => (
          <View key={idx} className="flex-row gap-2.5 items-start pl-1">
            <Text className="text-amber-400 text-xs font-bold mt-0.5">⚠</Text>
            <Text className="text-zinc-300 text-xs leading-relaxed flex-1">{area}</Text>
          </View>
        ))}
      </View>
    </View>
  );
});
