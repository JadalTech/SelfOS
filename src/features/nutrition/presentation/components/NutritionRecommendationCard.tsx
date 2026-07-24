import React from 'react';
import { View, Text } from 'react-native';
import type { AIRecommendation } from '../../../../shared/types/ai.types';

export interface NutritionRecommendationCardProps {
  readonly recommendation: AIRecommendation;
}

export const NutritionRecommendationCard: React.FC<NutritionRecommendationCardProps> = React.memo(function NutritionRecommendationCard({
  recommendation,
}) {
  return (
    <View className="bg-zinc-900 border border-zinc-800 p-4.5 rounded-2xl shadow-sm gap-3">
      <View className="flex-row items-center justify-between border-b border-zinc-850 pb-2.5">
        <View className="flex-1 pr-2">
          <Text className="text-zinc-50 text-sm font-extrabold tracking-tight">{recommendation.title}</Text>
          <Text className="text-zinc-400 text-xs mt-0.5">{recommendation.targetConcern}</Text>
        </View>
        <View className="bg-emerald-500/10 border border-emerald-500/20 px-2 py-0.5 rounded-lg">
          <Text className="text-emerald-400 text-[9px] font-bold">
            {Math.round(recommendation.confidenceScore * 100)}% Match
          </Text>
        </View>
      </View>

      <Text className="text-zinc-300 text-xs leading-relaxed">{recommendation.summary}</Text>

      <View className="gap-2 mt-1">
        <Text className="text-zinc-500 text-[10px] font-bold uppercase tracking-wider">Action Steps:</Text>
        {recommendation.actionableSteps.map((step, idx) => (
          <View key={idx} className="flex-row gap-2.5 items-start pl-1">
            <Text className="text-pink-400 text-xs font-bold mt-0.5">•</Text>
            <Text className="text-zinc-300 text-xs leading-relaxed flex-1">{step}</Text>
          </View>
        ))}
      </View>
    </View>
  );
});
