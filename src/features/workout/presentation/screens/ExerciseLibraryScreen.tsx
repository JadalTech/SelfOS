import React, { useState, useMemo, useCallback } from 'react';
import { View, Text, TextInput, ScrollView, TouchableOpacity, SafeAreaView } from 'react-native';
import { useRouter } from 'expo-router';
import { useWorkoutExercises } from '../../hooks/useWorkout';
import { ExerciseCard } from '../components';
import { SkeletonLoader, ErrorStateCard } from '../../../../shared/components';
import { MUSCLE_GROUP_OPTIONS, EXERCISE_CATEGORY_OPTIONS } from '../../constants/workout.constants';
import { MuscleGroup, ExerciseCategory } from '../../types/workout.types';

export const ExerciseLibraryScreen: React.FC = function ExerciseLibraryScreen() {
  const router = useRouter();

  const [searchTerm, setSearchTerm] = useState('');
  const [selectedMuscle, setSelectedMuscle] = useState<MuscleGroup | 'all'>('all');
  const [selectedCategory, setSelectedCategory] = useState<ExerciseCategory | 'all'>('all');

  const { exercisesVM, isLoading, isError, refetch } = useWorkoutExercises(searchTerm);

  const handleCreateExercise = useCallback(() => {
    router.push('/(app)/workout/exercises/new');
  }, [router]);

  const filteredExercises = useMemo(() => {
    return exercisesVM.filter((ex) => {
      const matchesMuscle = selectedMuscle === 'all' || ex.primaryMuscleGroup === selectedMuscle;
      const matchesCategory = selectedCategory === 'all' || ex.category === selectedCategory;
      return matchesMuscle && matchesCategory;
    });
  }, [exercisesVM, selectedMuscle, selectedCategory]);

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
                Reference Catalog
              </Text>
              <Text className="text-zinc-50 text-xl font-extrabold tracking-tight">
                Exercise Library
              </Text>
            </View>
          </View>

          <TouchableOpacity
            onPress={handleCreateExercise}
            className="bg-violet-600 px-4 py-2 rounded-xl shadow-sm shadow-violet-600/10"
          >
            <Text className="text-zinc-50 text-xs font-extrabold">+ Custom</Text>
          </TouchableOpacity>
        </View>

        {/* Search */}
        <TextInput
          value={searchTerm}
          onChangeText={setSearchTerm}
          placeholder="Search exercises by name..."
          placeholderTextColor="#71717a"
          className="bg-zinc-900 border border-zinc-800 rounded-xl px-4 py-3 text-zinc-100 text-sm"
        />

        {/* Filters Grid */}
        <View className="gap-2.5">
          {/* Muscle Group Chips */}
          <View className="h-8">
            <ScrollView horizontal showsHorizontalScrollIndicator={false} className="flex-row gap-2">
              <TouchableOpacity
                onPress={() => setSelectedMuscle('all')}
                className={`px-3 py-1 rounded-full border items-center justify-center ${
                  selectedMuscle === 'all'
                    ? 'bg-violet-600 border-violet-500'
                    : 'bg-zinc-900 border-zinc-800'
                }`}
              >
                <Text className={`text-[10px] font-bold ${selectedMuscle === 'all' ? 'text-zinc-50' : 'text-zinc-400'}`}>
                  All Muscles
                </Text>
              </TouchableOpacity>
              {MUSCLE_GROUP_OPTIONS.map((opt) => (
                <TouchableOpacity
                  key={opt.value}
                  onPress={() => setSelectedMuscle(opt.value as MuscleGroup)}
                  className={`px-3 py-1 rounded-full border items-center justify-center ${
                    selectedMuscle === opt.value
                      ? 'bg-violet-600 border-violet-500'
                      : 'bg-zinc-900 border-zinc-800'
                  }`}
                >
                  <Text className={`text-[10px] font-bold ${selectedMuscle === opt.value ? 'text-zinc-50' : 'text-zinc-400'}`}>
                    {opt.label}
                  </Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>

          {/* Category Chips */}
          <View className="h-8">
            <ScrollView horizontal showsHorizontalScrollIndicator={false} className="flex-row gap-2">
              <TouchableOpacity
                onPress={() => setSelectedCategory('all')}
                className={`px-3 py-1 rounded-full border items-center justify-center ${
                  selectedCategory === 'all'
                    ? 'bg-violet-600 border-violet-500'
                    : 'bg-zinc-900 border-zinc-800'
                }`}
              >
                <Text className={`text-[10px] font-bold ${selectedCategory === 'all' ? 'text-zinc-50' : 'text-zinc-400'}`}>
                  All Categories
                </Text>
              </TouchableOpacity>
              {EXERCISE_CATEGORY_OPTIONS.map((opt) => (
                <TouchableOpacity
                  key={opt.value}
                  onPress={() => setSelectedCategory(opt.value as ExerciseCategory)}
                  className={`px-3 py-1 rounded-full border items-center justify-center ${
                    selectedCategory === opt.value
                      ? 'bg-violet-600 border-violet-500'
                      : 'bg-zinc-900 border-zinc-800'
                  }`}
                >
                  <Text className={`text-[10px] font-bold ${selectedCategory === opt.value ? 'text-zinc-50' : 'text-zinc-400'}`}>
                    {opt.label}
                  </Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>
        </View>

        {/* Exercises Scroll Container */}
        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ gap: 12, paddingBottom: 32 }}>
          {isLoading ? (
            <View className="gap-3">
              <SkeletonLoader height={90} />
              <SkeletonLoader height={90} />
              <SkeletonLoader height={90} />
            </View>
          ) : isError ? (
            <ErrorStateCard message="Failed to load exercise catalog" onRetry={refetch} />
          ) : (
            <>
              {filteredExercises.map((ex) => (
                <ExerciseCard
                  key={ex.id}
                  exercise={ex}
                  onPress={() => router.push(`/(app)/workout/exercises/${ex.id}`)}
                />
              ))}

              {filteredExercises.length === 0 ? (
                <View className="py-16 items-center justify-center bg-zinc-900/30 border border-dashed border-zinc-800 rounded-2xl">
                  <Text className="text-zinc-500 text-sm font-semibold">No exercises found</Text>
                  <Text className="text-zinc-600 text-xs mt-1">Try resetting search or filters</Text>
                </View>
              ) : null}
            </>
          )}
        </ScrollView>
      </View>
    </SafeAreaView>
  );
};
