import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { ExerciseVM } from '../../types/viewmodel.types';
import { MuscleGroupBadge } from './MuscleGroupBadge';

export interface ExerciseCardProps {
  readonly exercise: ExerciseVM;
  readonly onPress: () => void;
}

export const ExerciseCard: React.FC<ExerciseCardProps> = React.memo(function ExerciseCard({
  exercise,
  onPress,
}) {
  return (
    <TouchableOpacity
      activeOpacity={0.7}
      onPress={onPress}
      className="bg-zinc-900 border border-zinc-800 p-4 rounded-2xl gap-2.5 shadow-sm"
      accessible={true}
      accessibilityRole="button"
      accessibilityLabel={`Exercise: ${exercise.name}. Target: ${exercise.primaryMuscleGroupLabel}. Equipment: ${exercise.equipmentLabel}.`}
    >
      <View className="flex-row items-start justify-between">
        <View className="flex-1 gap-1">
          <Text className="text-zinc-50 text-base font-bold tracking-tight" numberOfLines={1}>
            {exercise.name}
          </Text>
          <View className="flex-row items-center gap-2 mt-0.5">
            <MuscleGroupBadge muscleGroup={exercise.primaryMuscleGroup} size="sm" />
            <View className="bg-zinc-950 px-2 py-0.5 rounded-full border border-zinc-800/60">
              <Text className="text-zinc-400 text-[10px] font-semibold capitalize">
                {exercise.categoryLabel}
              </Text>
            </View>
          </View>
        </View>

        {exercise.isCustom ? (
          <View className="bg-violet-500/10 border border-violet-500/30 px-1.5 py-0.5 rounded-md">
            <Text className="text-violet-400 text-[9px] font-bold uppercase tracking-wider">Custom</Text>
          </View>
        ) : null}
      </View>

      <View className="flex-row items-center justify-between pt-2 border-t border-zinc-800/40">
        <View className="flex-row gap-4">
          <View>
            <Text className="text-zinc-500 text-[9px] font-bold uppercase tracking-wider">Equipment</Text>
            <Text className="text-zinc-300 text-xs font-semibold mt-0.5 capitalize">
              {exercise.equipmentLabel}
            </Text>
          </View>
          <View>
            <Text className="text-zinc-500 text-[9px] font-bold uppercase tracking-wider">Difficulty</Text>
            <Text className="text-zinc-300 text-xs font-semibold mt-0.5 capitalize">
              {exercise.difficultyLabel}
            </Text>
          </View>
        </View>

        <Text className="text-zinc-500 text-xs font-bold">→</Text>
      </View>
    </TouchableOpacity>
  );
});
