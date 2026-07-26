import React, { useMemo } from 'react';
import { View, Text, ScrollView, TouchableOpacity, SafeAreaView } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useWorkoutExercises, usePersonalRecords } from '../../hooks/useWorkout';
import { STANDARD_EXERCISES } from '../../constants/workout.constants';
import { Exercise } from '../../types/workout.types';
import { MuscleGroupBadge } from '../components/MuscleGroupBadge';
import { SkeletonLoader, ErrorStateCard } from '../../../../shared/components';

export const ExerciseDetailsScreen: React.FC = function ExerciseDetailsScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();

  const { rawExercises, isLoading: exLoading, isError: exError, refetch: refetchEx } = useWorkoutExercises('');
  const { personalRecordsVM, isLoading: prsLoading, refetch: refetchPrs } = usePersonalRecords();

  const exercise = useMemo(() => {
    return rawExercises.find((ex: Exercise) => ex.id === id) || STANDARD_EXERCISES.find((ex: Exercise) => ex.id === id);
  }, [rawExercises, id]);

  const exercisePrs = useMemo(() => {
    return personalRecordsVM.filter((pr) => pr.exerciseId === id);
  }, [personalRecordsVM, id]);

  const handleBack = () => {
    router.back();
  };

  const handleRefetch = async () => {
    await Promise.all([refetchEx(), refetchPrs()]);
  };

  if (exLoading || prsLoading) {
    return (
      <SafeAreaView className="flex-1 bg-zinc-950 p-4">
        <SkeletonLoader height={60} />
        <SkeletonLoader height={180} />
        <SkeletonLoader height={140} />
      </SafeAreaView>
    );
  }

  if (exError || !exercise) {
    return (
      <SafeAreaView className="flex-1 bg-zinc-950 justify-center p-4">
        <ErrorStateCard message="Exercise details not found or failed to load" onRetry={handleRefetch} />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView className="flex-1 bg-zinc-950">
      <View className="flex-1 px-4 pt-4 gap-4">
        {/* Header */}
        <View className="flex-row items-center gap-2">
          <TouchableOpacity onPress={handleBack} className="p-1">
            <Text className="text-zinc-400 text-lg font-bold">←</Text>
          </TouchableOpacity>
          <View className="flex-1">
            <Text className="text-zinc-500 text-[10px] font-bold uppercase tracking-wider">
              Exercise Details
            </Text>
            <Text className="text-zinc-50 text-lg font-extrabold tracking-tight" numberOfLines={1}>
              {exercise.name}
            </Text>
          </View>
        </View>

        {/* Scrollable details */}
        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ gap: 16, paddingBottom: 32 }}>
          {/* Metadata Cards Grid */}
          <View className="bg-zinc-900 border border-zinc-800 p-4 rounded-2xl gap-3">
            <View className="flex-row justify-between items-center">
              <Text className="text-zinc-500 text-xs font-semibold uppercase tracking-wider">Target Muscles</Text>
              <MuscleGroupBadge muscleGroup={exercise.primaryMuscleGroup} size="sm" />
            </View>

            {exercise.secondaryMuscleGroups && exercise.secondaryMuscleGroups.length > 0 ? (
              <View className="flex-row flex-wrap gap-1.5 pt-2 border-t border-zinc-800/40 items-center">
                <Text className="text-zinc-500 text-[10px] font-bold uppercase tracking-wider mr-1">
                  Secondary:
                </Text>
                {exercise.secondaryMuscleGroups.map((m: string, idx: number) => (
                  <View key={idx} className="bg-zinc-950 px-2.5 py-0.5 rounded-full border border-zinc-850">
                    <Text className="text-zinc-400 text-[9px] font-semibold capitalize">{m}</Text>
                  </View>
                ))}
              </View>
            ) : null}

            <View className="flex-row justify-between pt-2.5 border-t border-zinc-800/40 gap-4">
              <View className="flex-1 bg-zinc-950/60 p-2.5 rounded-xl border border-zinc-850 items-center">
                <Text className="text-zinc-500 text-[9px] font-bold uppercase tracking-wider">Equipment</Text>
                <Text className="text-zinc-300 text-xs font-semibold capitalize mt-0.5">
                  {exercise.equipment}
                </Text>
              </View>

              <View className="flex-row flex-1 bg-zinc-950/60 p-2.5 rounded-xl border border-zinc-850 items-center justify-center">
                <View className="items-center">
                  <Text className="text-zinc-500 text-[9px] font-bold uppercase tracking-wider">Category</Text>
                  <Text className="text-zinc-300 text-xs font-semibold capitalize mt-0.5">
                    {exercise.category}
                  </Text>
                </View>
              </View>

              <View className="flex-row flex-1 bg-zinc-950/60 p-2.5 rounded-xl border border-zinc-850 items-center justify-center">
                <View className="items-center">
                  <Text className="text-zinc-500 text-[9px] font-bold uppercase tracking-wider">Difficulty</Text>
                  <Text className="text-zinc-300 text-xs font-semibold capitalize mt-0.5">
                    {exercise.difficulty}
                  </Text>
                </View>
              </View>
            </View>
          </View>

          {/* Instructions section */}
          {exercise.instructions && exercise.instructions.length > 0 ? (
            <View className="gap-3">
              <Text className="text-zinc-200 text-sm font-bold uppercase tracking-wide px-1">
                Instructions
              </Text>
              <View className="bg-zinc-900 border border-zinc-800 p-4 rounded-2xl gap-3">
                {exercise.instructions.map((step: string, idx: number) => (
                  <View key={idx} className="flex-row gap-3">
                    <View className="w-5 h-5 rounded-full bg-violet-500/10 border border-violet-500/30 items-center justify-center">
                      <Text className="text-violet-400 text-[10px] font-bold">{idx + 1}</Text>
                    </View>
                    <Text className="text-zinc-300 text-xs leading-relaxed flex-1">{step}</Text>
                  </View>
                ))}
              </View>
            </View>
          ) : null}

          {/* Personal Records Milestones */}
          <View className="gap-3">
            <Text className="text-zinc-200 text-sm font-bold uppercase tracking-wide px-1">
              Personal Records History
            </Text>
            <View className="bg-zinc-900 border border-zinc-800 p-4 rounded-2xl gap-3">
              {exercisePrs.map((pr) => (
                <View
                  key={pr.id}
                  className="flex-row items-center justify-between py-2 border-b border-zinc-800/40 last:border-b-0"
                >
                  <View className="gap-0.5">
                    <Text className="text-zinc-200 text-sm font-bold">{pr.valueLabel}</Text>
                    <Text className="text-zinc-500 text-[10px] font-medium uppercase tracking-wider">
                      {pr.typeLabel}
                    </Text>
                  </View>
                  <Text className="text-zinc-400 text-xs font-semibold">{pr.dateFormatted}</Text>
                </View>
              ))}

              {exercisePrs.length === 0 ? (
                <View className="py-6 items-center justify-center">
                  <Text className="text-zinc-500 text-xs font-semibold">No personal records achieved yet</Text>
                  <Text className="text-zinc-600 text-[10px] mt-0.5">Your achievements will appear here</Text>
                </View>
              ) : null}
            </View>
          </View>
        </ScrollView>
      </View>
    </SafeAreaView>
  );
};
