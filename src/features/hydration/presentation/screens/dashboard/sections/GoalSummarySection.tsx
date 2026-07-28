import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';

export interface GoalSummarySectionProps {
  readonly goalLabel: string;
  readonly recommendedLabel: string;
  readonly isCustom: boolean;
  readonly onEditPress: () => void;
}

export const GoalSummarySection: React.FC<GoalSummarySectionProps> = React.memo(function GoalSummarySection({
  goalLabel,
  recommendedLabel,
  isCustom,
  onEditPress,
}) {
  return (
    <View className="bg-zinc-950 border border-zinc-900 rounded-3xl p-5 gap-3 my-2 flex-row justify-between items-center">
      <View className="gap-1 flex-1">
        <Text className="text-zinc-500 text-[10px] uppercase font-bold tracking-widest">Daily Goal</Text>
        <Text className="text-zinc-100 font-extrabold text-lg">{goalLabel}</Text>
        <Text className="text-zinc-400 text-xs mt-1">
          Recommended target: <Text className="text-zinc-200 font-semibold">{recommendedLabel}</Text>
        </Text>
        <Text className="text-zinc-500 text-[10px] mt-0.5">
          Source: <Text className="text-blue-400 font-semibold">{isCustom ? 'User Set' : 'AI Dynamic Plan'}</Text>
        </Text>
      </View>
      <TouchableOpacity
        activeOpacity={0.8}
        onPress={onEditPress}
        className="px-4 py-2 bg-zinc-900 border border-zinc-800 rounded-xl"
        accessibilityRole="button"
        accessibilityLabel="Edit hydration daily goal target"
      >
        <Text className="text-zinc-300 font-bold text-xs">Edit</Text>
      </TouchableOpacity>
    </View>
  );
});
