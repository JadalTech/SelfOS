import React, { useState } from 'react';
import { View, Text, TouchableOpacity, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { useCreateRoutine } from '../hooks/useRoutineMutations';
import { RoutineForm } from '../components/RoutineForm';
import type { RoutineFormValues } from '../validation/routine.validation';

export const CreateRoutineScreen: React.FC = function CreateRoutineScreen() {
  const router = useRouter();
  const createMutation = useCreateRoutine();
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleSubmit = async (values: RoutineFormValues) => {
    setErrorMessage(null);
    try {
      await createMutation.mutateAsync(values);
      router.back();
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Failed to create routine';
      setErrorMessage(msg);
      Alert.alert('Create Routine Error', msg);
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-zinc-950">
      {/* Navigation Header */}
      <View className="flex-row items-center justify-between px-4 py-3 border-b border-zinc-900">
        <TouchableOpacity
          className="px-3 py-1.5 rounded-xl bg-zinc-900 border border-zinc-800"
          onPress={() => router.back()}
          accessibilityRole="button"
          accessibilityLabel="Go back"
        >
          <Text className="text-zinc-300 font-semibold text-xs">← Back</Text>
        </TouchableOpacity>

        <Text className="text-zinc-100 font-extrabold text-lg">Create Routine</Text>

        <View className="w-16" />
      </View>

      {errorMessage ? (
        <View className="mx-4 mt-3 bg-rose-950/80 border border-rose-800/60 p-3 rounded-xl">
          <Text className="text-rose-400 text-xs font-semibold">{errorMessage}</Text>
        </View>
      ) : null}

      <RoutineForm
        submitLabel="Create Routine"
        isSubmitting={createMutation.isPending}
        onSubmit={handleSubmit}
      />
    </SafeAreaView>
  );
};
