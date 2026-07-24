import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import type { SkinRecommendation } from '../types/ai.types';

export interface SkinRecommendationCardProps {
  readonly recommendation: SkinRecommendation;
  readonly onApply?: (rec: SkinRecommendation) => void;
}

export const SkinRecommendationCard: React.FC<SkinRecommendationCardProps> = function SkinRecommendationCard({
  recommendation,
  onApply,
}) {
  const confidencePct = Math.round((recommendation.confidenceScore || 0.9) * 100);

  return (
    <View className="bg-zinc-900 border border-zinc-800 rounded-2xl p-4 gap-3 shadow-sm my-1.5">
      <View className="flex-row items-center justify-between">
        <View className="flex-row items-center gap-2 flex-1 pr-2">
          <Text className="text-base">💡</Text>
          <Text className="text-zinc-50 font-bold text-sm flex-1">{recommendation.title}</Text>
        </View>
        <View className="bg-pink-500/10 border border-pink-500/30 px-2.5 py-0.5 rounded-full">
          <Text className="text-pink-400 text-[10px] font-semibold">{confidencePct}% Match</Text>
        </View>
      </View>

      <Text className="text-zinc-400 text-xs leading-5">{recommendation.summary}</Text>

      {recommendation.actionableSteps && recommendation.actionableSteps.length > 0 ? (
        <View className="bg-zinc-950/80 p-3 rounded-xl gap-1.5 border border-zinc-800/80">
          <Text className="text-zinc-300 text-[11px] font-bold uppercase tracking-wider">Actionable Steps</Text>
          {recommendation.actionableSteps.map((step, idx) => (
            <View key={idx} className="flex-row items-start gap-2">
              <Text className="text-pink-400 text-xs font-bold">•</Text>
              <Text className="text-zinc-300 text-xs flex-1">{step}</Text>
            </View>
          ))}
        </View>
      ) : null}

      {onApply ? (
        <TouchableOpacity
          activeOpacity={0.8}
          onPress={() => onApply(recommendation)}
          className="bg-pink-600/20 border border-pink-500/40 py-2 px-3 rounded-xl items-center justify-center mt-1"
        >
          <Text className="text-pink-400 text-xs font-bold">Apply Recommendation to Vanity</Text>
        </TouchableOpacity>
      ) : null}
    </View>
  );
};
