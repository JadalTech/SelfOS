import React, { useCallback } from 'react';
import { View, Text, TouchableOpacity, SafeAreaView, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { useWorkoutExercises } from '../../hooks/useWorkout';
import { ExerciseForm } from '../forms/ExerciseForm';

export const ExerciseFormScreen: React.FC = function ExerciseFormScreen() {
  const router = useRouter();
  const { createUserExercise, isCreating } = useWorkoutExercises();

  const handleSubmit = useCallback(
    async (data: any) => {
      try {
        await createUserExercise(data);
        router.push('/(app)/workout/exercises');
      } catch {
        Alert.alert('Creation Failed', 'Could not create custom exercise.');
      }
    },
    [createUserExercise, router]
  );

  const handleCancel = useCallback(() => {
    router.back();
  }, [router]);

  return (
    <SafeAreaView className="flex-1 bg-zinc-950">
      <View className="flex-1">
        {/* Header */}
        <View className="flex-row items-center gap-2 p-4 pb-2 border-b border-zinc-900">
          <TouchableOpacity onPress={handleCancel} className="p-1">
            <Text className="text-zinc-400 text-lg font-bold">←</Text>
          </TouchableOpacity>
          <View>
            <Text className="text-zinc-500 text-[10px] font-bold uppercase tracking-wider">
              Custom Catalog
            </Text>
            <Text className="text-zinc-50 text-xl font-extrabold tracking-tight">
              Create Exercise
            </Text>
          </View>
        </View>

        {/* Exercise Form */}
        <ExerciseForm
          onSubmit={handleSubmit}
          onCancel={handleCancel}
          isSubmitting={isCreating}
        />
      </View>
    </SafeAreaView>
  );
};
