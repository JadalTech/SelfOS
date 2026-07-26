import React, { useMemo, useCallback } from 'react';
import { View, Text, TouchableOpacity, SafeAreaView, Alert } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useWorkoutPlans, useWorkoutExercises } from '../../hooks/useWorkout';
import { WorkoutPlanForm } from '../forms/WorkoutPlanForm';
import { SkeletonLoader } from '../../../../shared/components';

export const WorkoutPlanFormScreen: React.FC = function WorkoutPlanFormScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id?: string }>();
  const isEdit = !!id;

  const { rawPlans, savePlan, isLoading: plansLoading } = useWorkoutPlans();
  const { isLoading: exLoading } = useWorkoutExercises();

  const planToEdit = useMemo(() => {
    if (!isEdit) return undefined;
    return rawPlans.find((p) => p.id === id);
  }, [rawPlans, id, isEdit]);

  const handleSubmit = useCallback(
    async (data: any) => {
      try {
        const payload = isEdit ? { ...data, id } : data;
        await savePlan(payload);
        router.push('/(app)/workout/plans');
      } catch {
        Alert.alert('Save Failed', 'Could not save the split workout plan.');
      }
    },
    [isEdit, id, savePlan, router]
  );

  const handleCancel = useCallback(() => {
    router.back();
  }, [router]);

  const isLoading = plansLoading || exLoading;

  if (isEdit && isLoading) {
    return (
      <SafeAreaView className="flex-1 bg-zinc-950 p-4">
        <SkeletonLoader height={60} />
        <SkeletonLoader height={240} />
      </SafeAreaView>
    );
  }

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
              {isEdit ? 'Modify Split' : 'New Workout Split'}
            </Text>
            <Text className="text-zinc-50 text-xl font-extrabold tracking-tight">
              {isEdit ? 'Edit Training Plan' : 'Create Training Plan'}
            </Text>
          </View>
        </View>

        {/* Plan Form */}
        <WorkoutPlanForm
          defaultValues={planToEdit}
          onSubmit={handleSubmit}
          onCancel={handleCancel}
          isSubmitting={isLoading}
        />
      </View>
    </SafeAreaView>
  );
};
