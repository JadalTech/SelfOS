import React from 'react';
import { View, Text } from 'react-native';
import { WorkoutExerciseVM } from '../../types/viewmodel.types';
import { MuscleGroupBadge } from './MuscleGroupBadge';

export interface ExerciseRowProps {
  readonly exercise: WorkoutExerciseVM;
  readonly index: number;
}

export const ExerciseRow: React.FC<ExerciseRowProps> = React.memo(function ExerciseRow({
  exercise,
  index,
}) {
  return (
    <View
      className="flex-row items-start justify-between py-2 border-b border-zinc-800/40"
      accessible={true}
      accessibilityLabel={`Exercise ${index + 1}: ${exercise.name}. ${exercise.setsCountLabel}.`}
    >
      <View className="flex-row gap-3 flex-1">
        <View className="w-6 h-6 rounded-lg bg-zinc-900 border border-zinc-800 items-center justify-center">
          <Text className="text-zinc-400 text-xs font-bold">{index + 1}</Text>
        </View>
        <View className="flex-1 gap-1">
          <Text className="text-zinc-100 text-sm font-semibold tracking-tight">
            {exercise.name}
          </Text>
          <View className="flex-row items-center gap-2">
            <MuscleGroupBadge muscleGroup={exercise.primaryMuscleGroup} size="sm" />
            <Text className="text-zinc-500 text-[10px] capitalize">
              {exercise.equipmentLabel}
            </Text>
          </View>
        </View>
      </View>

      <View className="items-end gap-1">
        <Text className="text-zinc-300 text-xs font-bold">
          {exercise.setsCountLabel}
        </Text>
        <Text className="text-zinc-500 text-[9px] font-semibold">
          {exercise.setsSummaryLabel || 'No sets defined'}
        </Text>
      </View>
    </View>
  );
});
