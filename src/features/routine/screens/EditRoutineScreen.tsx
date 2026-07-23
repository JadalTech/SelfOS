import React, { useState } from 'react';
import { View, Text, TouchableOpacity, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { useRoutine } from '../hooks/useRoutine';
import {
  useUpdateRoutine,
  useArchiveRoutine,
  useRestoreRoutine,
} from '../hooks/useRoutineMutations';
import { RoutineForm } from '../components/RoutineForm';
import { ArchiveRoutineDialog } from '../components/ArchiveRoutineDialog';
import { FullScreenLoader } from '@/shared/components';
import type { RoutineFormValues } from '../validation/routine.validation';

export const EditRoutineScreen: React.FC = function EditRoutineScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();
  const routineId = id ?? '';

  const { routine, isLoading, isError, error } = useRoutine(routineId);
  const updateMutation = useUpdateRoutine();
  const archiveMutation = useArchiveRoutine();
  const restoreMutation = useRestoreRoutine();

  const [showArchiveDialog, setShowArchiveDialog] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  if (isLoading) {
    return <FullScreenLoader message="Loading routine configuration..." />;
  }

  if (isError || !routine) {
    return (
      <SafeAreaView className="flex-1 bg-zinc-950 items-center justify-center p-6 gap-4">
        <Text className="text-rose-500 font-bold text-lg">Routine Not Found</Text>
        <Text className="text-zinc-400 text-xs text-center">
          {error?.message ?? 'The requested routine does not exist.'}
        </Text>
        <TouchableOpacity
          className="px-5 py-2.5 bg-zinc-900 border border-zinc-800 rounded-xl"
          onPress={() => router.back()}
        >
          <Text className="text-zinc-200 font-semibold text-xs">Go Back</Text>
        </TouchableOpacity>
      </SafeAreaView>
    );
  }

  const isArchived = routine.status === 'archived';

  const handleSubmit = async (values: RoutineFormValues) => {
    setErrorMessage(null);
    try {
      await updateMutation.mutateAsync({
        routineId,
        formValues: values,
      });
      router.back();
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Failed to update routine';
      setErrorMessage(msg);
      Alert.alert('Update Error', msg);
    }
  };

  const handleArchiveConfirm = async () => {
    try {
      if (isArchived) {
        await restoreMutation.mutateAsync(routineId);
      } else {
        await archiveMutation.mutateAsync(routineId);
      }
      setShowArchiveDialog(false);
      router.back();
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Action failed';
      Alert.alert('Archive Error', msg);
    }
  };

  const initialFormValues: Partial<RoutineFormValues> = {
    title: routine.title,
    description: routine.description,
    type: routine.type,
    status: routine.status,
    schedule: routine.schedule,
    reminders: routine.reminders,
  };

  return (
    <SafeAreaView className="flex-1 bg-zinc-950">
      {/* Header */}
      <View className="flex-row items-center justify-between px-4 py-3 border-b border-zinc-900">
        <TouchableOpacity
          className="px-3 py-1.5 rounded-xl bg-zinc-900 border border-zinc-800"
          onPress={() => router.back()}
          accessibilityRole="button"
          accessibilityLabel="Cancel edit"
        >
          <Text className="text-zinc-300 font-semibold text-xs">Cancel</Text>
        </TouchableOpacity>

        <Text className="text-zinc-100 font-extrabold text-lg">Edit Routine</Text>

        <TouchableOpacity
          className="px-3 py-1.5 rounded-xl bg-zinc-900 border border-zinc-800"
          onPress={() => setShowArchiveDialog(true)}
          accessibilityRole="button"
          accessibilityLabel={isArchived ? 'Restore routine' : 'Archive routine'}
        >
          <Text
            className={`font-semibold text-xs ${
              isArchived ? 'text-emerald-400' : 'text-amber-400'
            }`}
          >
            {isArchived ? 'Restore' : 'Archive'}
          </Text>
        </TouchableOpacity>
      </View>

      {errorMessage ? (
        <View className="mx-4 mt-3 bg-rose-950/80 border border-rose-800/60 p-3 rounded-xl">
          <Text className="text-rose-400 text-xs font-semibold">{errorMessage}</Text>
        </View>
      ) : null}

      <RoutineForm
        initialValues={initialFormValues}
        submitLabel="Save Changes"
        isSubmitting={updateMutation.isPending}
        onSubmit={handleSubmit}
      />

      <ArchiveRoutineDialog
        visible={showArchiveDialog}
        routineTitle={routine.title}
        isArchived={isArchived}
        isLoading={archiveMutation.isPending || restoreMutation.isPending}
        onConfirm={handleArchiveConfirm}
        onCancel={() => setShowArchiveDialog(false)}
      />
    </SafeAreaView>
  );
};
