import React, { useState, useMemo, useCallback } from 'react';
import { View, Text, ScrollView, TextInput, TouchableOpacity, SafeAreaView } from 'react-native';
import { useRouter } from 'expo-router';
import { useWorkoutPlans, useWorkoutSession } from '../../hooks/useWorkout';
import { WorkoutCard } from '../components';
import { SkeletonLoader, ErrorStateCard } from '../../../../shared/components';
import { MUSCLE_GROUP_OPTIONS } from '../../constants/workout.constants';
import { MuscleGroup } from '../../types/workout.types';

export const WorkoutPlansScreen: React.FC = function WorkoutPlansScreen() {
  const router = useRouter();
  const { plansVM, rawPlans, isLoading, isError, refetch } = useWorkoutPlans();
  const { startSession } = useWorkoutSession();

  const [searchTerm, setSearchTerm] = useState('');
  const [selectedMuscle, setSelectedMuscle] = useState<MuscleGroup | 'all'>('all');

  const handleCreatePlan = useCallback(() => {
    router.push('/(app)/workout/plans/new');
  }, [router]);

  const handleStartPlan = useCallback(
    async (planId: string) => {
      const rawPlan = rawPlans.find((p) => p.id === planId);
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
      } catch {
        // Error already logged/handled
      }
    },
    [rawPlans, startSession, router]
  );

  const filteredPlans = useMemo(() => {
    return plansVM.filter((p) => {
      const matchesSearch = p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (p.description || '').toLowerCase().includes(searchTerm.toLowerCase());

      const rawPlan = rawPlans.find((rp) => rp.id === p.id);
      const matchesMuscle =
        selectedMuscle === 'all' ||
        (rawPlan?.exercises.some((ex) => ex.primaryMuscleGroup === selectedMuscle) ?? false);

      return matchesSearch && matchesMuscle;
    });
  }, [plansVM, rawPlans, searchTerm, selectedMuscle]);

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
                Workout Splits
              </Text>
              <Text className="text-zinc-50 text-xl font-extrabold tracking-tight">
                Training Plans
              </Text>
            </View>
          </View>

          <TouchableOpacity
            onPress={handleCreatePlan}
            className="bg-violet-600 px-4 py-2 rounded-xl shadow-sm shadow-violet-600/10"
          >
            <Text className="text-zinc-50 text-xs font-extrabold">+ Create Plan</Text>
          </TouchableOpacity>
        </View>

        {/* Search Bar */}
        <TextInput
          value={searchTerm}
          onChangeText={setSearchTerm}
          placeholder="Search split plans..."
          placeholderTextColor="#71717a"
          className="bg-zinc-900 border border-zinc-800 rounded-xl px-4 py-3 text-zinc-100 text-sm"
        />

        {/* Muscle group filter chips */}
        <View className="h-9">
          <ScrollView horizontal showsHorizontalScrollIndicator={false} className="flex-row gap-2">
            <TouchableOpacity
              onPress={() => setSelectedMuscle('all')}
              className={`px-3.5 py-1.5 rounded-full border items-center justify-center ${
                selectedMuscle === 'all'
                  ? 'bg-violet-600 border-violet-500'
                  : 'bg-zinc-900 border-zinc-800'
              }`}
            >
              <Text className={`text-xs font-bold ${selectedMuscle === 'all' ? 'text-zinc-50' : 'text-zinc-400'}`}>
                All Muscles
              </Text>
            </TouchableOpacity>
            {MUSCLE_GROUP_OPTIONS.map((opt) => (
              <TouchableOpacity
                key={opt.value}
                onPress={() => setSelectedMuscle(opt.value as MuscleGroup)}
                className={`px-3.5 py-1.5 rounded-full border items-center justify-center ${
                  selectedMuscle === opt.value
                    ? 'bg-violet-600 border-violet-500'
                    : 'bg-zinc-900 border-zinc-800'
                }`}
              >
                <Text className={`text-xs font-bold ${selectedMuscle === opt.value ? 'text-zinc-50' : 'text-zinc-400'}`}>
                  {opt.label}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        {/* Plans Catalog */}
        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ gap: 12, paddingBottom: 32 }}>
          {isLoading ? (
            <View className="gap-3">
              <SkeletonLoader height={140} />
              <SkeletonLoader height={140} />
            </View>
          ) : isError ? (
            <ErrorStateCard message="Failed to load workout plans" onRetry={refetch} />
          ) : (
            <>
              {filteredPlans.map((plan) => (
                <WorkoutCard
                  key={plan.id}
                  plan={plan}
                  onPress={() => router.push(`/(app)/workout/plans/${plan.id}`)}
                  onStartPress={() => void handleStartPlan(plan.id)}
                />
              ))}

              {filteredPlans.length === 0 ? (
                <View className="py-16 items-center justify-center bg-zinc-900/30 border border-dashed border-zinc-800 rounded-2xl">
                  <Text className="text-zinc-500 text-sm font-semibold">No split plans found</Text>
                  <Text className="text-zinc-600 text-xs mt-1">Tap &apos;+ Create Plan&apos; to set up your splits</Text>
                </View>
              ) : null}
            </>
          )}
        </ScrollView>
      </View>
    </SafeAreaView>
  );
};
