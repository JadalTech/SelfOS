import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import type { HairRecommendation } from '../types/ai.types';

interface AICoachCardProps {
  readonly topRecommendation: HairRecommendation | null;
  readonly onOpenCoach: () => void;
}

export const AICoachCard: React.FC<AICoachCardProps> = React.memo(
  function AICoachCard({ topRecommendation, onOpenCoach }) {
    return (
      <View className="bg-gradient-to-r from-amber-950/40 to-zinc-900 border border-amber-500/30 p-4 rounded-2xl gap-3 shadow-md">
        <View className="flex-row items-center justify-between">
          <View className="flex-row items-center gap-2">
            <View className="w-8 h-8 rounded-xl bg-amber-500/20 border border-amber-500/40 items-center justify-center">
              <Text className="text-base">🤖</Text>
            </View>
            <Text className="text-zinc-50 text-sm font-extrabold">AI Hair Coach</Text>
          </View>

          <TouchableOpacity
            className="bg-amber-500 active:bg-amber-600 px-3 py-1.5 rounded-xl shadow-sm"
            onPress={onOpenCoach}
            accessibilityRole="button"
          >
            <Text className="text-zinc-950 font-extrabold text-xs">Ask AI →</Text>
          </TouchableOpacity>
        </View>

        {topRecommendation ? (
          <View className="bg-zinc-950/70 border border-zinc-800 p-3 rounded-xl gap-1">
            <Text className="text-amber-400 text-xs font-bold">Today&apos;s Highlight Recommendation:</Text>
            <Text className="text-zinc-200 text-xs font-semibold">{topRecommendation.title}</Text>
            <Text className="text-zinc-400 text-[11px]" numberOfLines={2}>
              {topRecommendation.description}
            </Text>
          </View>
        ) : (
          <Text className="text-zinc-400 text-xs italic">
            Ask your personal AI Coach for advice on your routines, products, or growth progress.
          </Text>
        )}
      </View>
    );
  }
);
