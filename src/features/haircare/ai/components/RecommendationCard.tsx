import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import type { HairRecommendation } from '../types/ai.types';

interface RecommendationCardProps {
  readonly recommendation: HairRecommendation;
}

const PRIORITY_BADGES: Record<HairRecommendation['priority'], string> = {
  high: 'bg-rose-500/20 border-rose-500/40 text-rose-400',
  medium: 'bg-amber-500/20 border-amber-500/40 text-amber-400',
  low: 'bg-emerald-500/20 border-emerald-500/40 text-emerald-400',
};

export const RecommendationCard: React.FC<RecommendationCardProps> = React.memo(
  function RecommendationCard({ recommendation }) {
    const router = useRouter();

    return (
      <View className="bg-zinc-900 border border-zinc-800 p-4 rounded-2xl gap-2.5 shadow-md">
        <View className="flex-row items-center justify-between">
          <View className="flex-row items-center gap-2">
            <Text className="text-xl">💡</Text>
            <Text className="text-zinc-100 text-sm font-extrabold">{recommendation.title}</Text>
          </View>

          <View className={`px-2 py-0.5 rounded-md border ${PRIORITY_BADGES[recommendation.priority]}`}>
            <Text className="text-[10px] font-bold uppercase">{recommendation.priority} priority</Text>
          </View>
        </View>

        <Text className="text-zinc-400 text-xs leading-relaxed">{recommendation.description}</Text>

        {recommendation.actionLabel && recommendation.actionRoute ? (
          <TouchableOpacity
            className="self-start bg-zinc-950 border border-zinc-800 px-3 py-1.5 rounded-xl mt-1"
            onPress={() => router.push(recommendation.actionRoute as any)}
            accessibilityRole="button"
          >
            <Text className="text-amber-400 text-xs font-bold">{recommendation.actionLabel} →</Text>
          </TouchableOpacity>
        ) : null}
      </View>
    );
  }
);
