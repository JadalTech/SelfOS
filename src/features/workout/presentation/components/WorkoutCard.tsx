import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { WorkoutPlanVM } from '../../types/viewmodel.types';

export interface WorkoutCardProps {
  readonly plan: WorkoutPlanVM;
  readonly onPress: () => void;
  readonly onStartPress: () => void;
}

export const WorkoutCard: React.FC<WorkoutCardProps> = React.memo(function WorkoutCard({
  plan,
  onPress,
  onStartPress,
}) {
  return (
    <View
      className="bg-zinc-900 border border-zinc-800 p-4 rounded-2xl gap-3.5 shadow-sm"
      accessible={true}
      accessibilityLabel={`Workout plan: ${plan.name}. ${plan.scheduleLabel}. ${plan.exercisesCountLabel}.`}
    >
      <TouchableOpacity activeOpacity={0.7} onPress={onPress} className="gap-1.5">
        <View className="flex-row items-center justify-between">
          <Text className="text-zinc-50 text-base font-bold tracking-tight">
            {plan.name}
          </Text>
          <View className="bg-violet-500/10 border border-violet-500/30 px-2 py-0.5 rounded-md">
            <Text className="text-violet-400 text-[10px] font-extrabold uppercase tracking-wide">
              {plan.scheduleLabel}
            </Text>
          </View>
        </View>

        {plan.description ? (
          <Text className="text-zinc-400 text-xs leading-relaxed" numberOfLines={2}>
            {plan.description}
          </Text>
        ) : null}

        <View className="flex-row flex-wrap gap-1.5 mt-1.5">
          {plan.muscleGroupLabels.map((lbl, idx) => (
            <View key={idx} className="bg-zinc-950 px-2 py-0.5 rounded-full border border-zinc-800/60">
              <Text className="text-zinc-400 text-[10px] font-medium capitalize">{lbl}</Text>
            </View>
          ))}
        </View>
      </TouchableOpacity>

      <View className="flex-row gap-2 pt-2.5 border-t border-zinc-800/60 items-center justify-between">
        <Text className="text-zinc-500 text-[10px] font-bold uppercase tracking-wider">
          {plan.exercisesCountLabel}
        </Text>

        <View className="flex-row gap-2">
          <TouchableOpacity
            className="bg-zinc-950 border border-zinc-800 px-3 py-1.5 rounded-xl"
            onPress={onPress}
            accessibilityRole="button"
            accessibilityLabel={`View plan details for ${plan.name}`}
          >
            <Text className="text-zinc-300 text-xs font-bold">Details</Text>
          </TouchableOpacity>

          <TouchableOpacity
            className="bg-violet-600 px-3.5 py-1.5 rounded-xl shadow-sm shadow-violet-600/10"
            onPress={onStartPress}
            accessibilityRole="button"
            accessibilityLabel={`Start workout session from ${plan.name}`}
          >
            <Text className="text-zinc-50 text-xs font-extrabold">Start Session</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
});
