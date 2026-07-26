import React, { useMemo, useCallback } from 'react';
import { View, Text, ScrollView, TouchableOpacity, Alert, SafeAreaView } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useWorkoutPlans, useWorkoutSession } from '../../hooks/useWorkout';
import { ExerciseRow } from '../components';
import { SkeletonLoader, ErrorStateCard } from '../../../../shared/components';

export const WorkoutDetailsScreen: React.FC = function WorkoutDetailsScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();
  const { plansVM, rawPlans, isLoading, isError, refetch, deletePlan } = useWorkoutPlans();
  const { startSession } = useWorkoutSession();

  const plan = useMemo(() => plansVM.find((p) => p.id === id), [plansVM, id]);
  const rawPlan = useMemo(() => rawPlans.find((p) => p.id === id), [rawPlans, id]);

  const handleStartWorkout = useCallback(async () => {
    if (!rawPlan) return;
    try {
      await startSession(rawPlan.name, {
        planId: rawPlan.id,
        exercises: rawPlan.exercises.map((ex) => ({
          id: Math.random().toString(36).substring(2, 9),
          exerciseId: ex.exerciseId,
          exerciseName: ex.exerciseName,
          exerciseCategory: ex.exerciseCategory,
          primaryMuscleGroup: ex.primaryMuscleGroup,
          sets: ex.sets.map((s) => ({
            id: Math.random().toString(36).substring(2, 9),
            type: s.type,
            weight: s.weight,
            reps: s.reps,
            completed: false,
          })),
        })),
      });
      router.push('/(app)/workout/session');
    } catch (e) {
      console.error(e);
    }
  }, [rawPlan, startSession, router]);

  const handleEdit = useCallback(() => {
    router.push(`/(app)/workout/plans/${id}/edit`);
  }, [id, router]);

  const handleDelete = useCallback(() => {
    if (!plan) return;
    Alert.alert(
      'Delete Split Plan',
      `Are you sure you want to delete "${plan.name}"?`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            try {
              await deletePlan(plan.id);
              router.back();
            } catch (e) {
              console.error(e);
            }
          },
        },
      ],
      { cancelable: true }
    );
  }, [plan, deletePlan, router]);

  if (isLoading) {
    return (
      <SafeAreaView className="flex-1 bg-zinc-950 p-4">
        <SkeletonLoader height={60} />
        <SkeletonLoader height={200} />
      </SafeAreaView>
    );
  }

  if (isError || !plan) {
    return (
      <SafeAreaView className="flex-1 bg-zinc-950 justify-center p-4">
        <ErrorStateCard message="Plan not found or failed to load details" onRetry={refetch} />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView className="flex-1 bg-zinc-950">
      <View className="flex-1 px-4 pt-4 gap-4">
        {/* Header */}
        <View className="flex-row justify-between items-center">
          <View className="flex-row items-center gap-2">
            <TouchableOpacity onPress={() => router.back()} className="p-1">
              <Text className="text-zinc-400 text-lg font-bold">←</Text>
            </TouchableOpacity>
            <View>
              <Text className="text-zinc-500 text-[10px] font-bold uppercase tracking-wider">
                Plan Details
              </Text>
              <Text className="text-zinc-50 text-xl font-extrabold tracking-tight">
                {plan.name}
              </Text>
            </View>
          </View>

          <View className="flex-row gap-2">
            <TouchableOpacity
              onPress={handleEdit}
              className="bg-zinc-900 border border-zinc-800 px-3.5 py-2 rounded-xl"
            >
              <Text className="text-zinc-300 text-xs font-bold">Edit</Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={handleDelete}
              className="bg-red-500/10 border border-red-500/30 px-3.5 py-2 rounded-xl"
            >
              <Text className="text-red-400 text-xs font-bold">Delete</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Plan split info scrollable */}
        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ gap: 20, paddingBottom: 32 }}>
          {/* Metadata Card */}
          <View className="bg-zinc-900 border border-zinc-800 p-4 rounded-2xl gap-3">
            <View className="flex-row justify-between items-center">
              <Text className="text-zinc-500 text-xs font-semibold uppercase tracking-wider">Target Schedule</Text>
              <View className="bg-violet-500/10 border border-violet-500/30 px-2 py-0.5 rounded-md">
                <Text className="text-violet-400 text-[10px] font-extrabold uppercase tracking-wide">
                  {plan.scheduleLabel}
                </Text>
              </View>
            </View>

            {plan.description ? (
              <Text className="text-zinc-300 text-sm leading-relaxed">{plan.description}</Text>
            ) : null}

            <View className="flex-row flex-wrap gap-1.5 pt-2 border-t border-zinc-800/40">
              {plan.muscleGroupLabels.map((lbl: string, idx: number) => (
                <View key={idx} className="bg-zinc-950 px-2 py-0.5 rounded-full border border-zinc-800/60">
                  <Text className="text-zinc-400 text-[10px] font-semibold capitalize">{lbl}</Text>
                </View>
              ))}
            </View>
          </View>

          {/* Exercises Split */}
          <View className="gap-3">
            <Text className="text-zinc-200 text-sm font-bold uppercase tracking-wide px-1">
              Exercises List ({plan.exercisesCountLabel})
            </Text>

            <View className="bg-zinc-900 border border-zinc-800 p-4 rounded-2xl">
              {plan.exercises.map((ex, idx) => (
                <ExerciseRow key={ex.id || idx} exercise={ex} index={idx} />
              ))}

              {plan.exercises.length === 0 ? (
                <View className="py-6 items-center justify-center">
                  <Text className="text-zinc-500 text-xs font-semibold">No exercises in this split</Text>
                </View>
              ) : null}
            </View>
          </View>

          {/* Start CTA */}
          <TouchableOpacity
            onPress={handleStartWorkout}
            className="bg-violet-600 py-3.5 rounded-xl items-center justify-center shadow-lg shadow-violet-600/10 mt-2"
          >
            <Text className="text-zinc-50 text-sm font-extrabold uppercase tracking-wide">
              ⚡ Start Workout Session
            </Text>
          </TouchableOpacity>
        </ScrollView>
      </View>
    </SafeAreaView>
  );
};
