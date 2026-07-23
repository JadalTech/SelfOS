import React, { useMemo } from 'react';
import { View, ScrollView, Text, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { useHairConditions } from '../hooks/useHairConditions';
import { useCreateHairCondition } from '../hooks/useCreateHairCondition';
import { useUpdateHairCondition } from '../hooks/useUpdateHairCondition';
import { ConditionForm, LoadingHaircare, ErrorHaircare } from '../components';

export const HairConditionFormScreen: React.FC = function HairConditionFormScreen() {
  const router = useRouter();
  const params = useLocalSearchParams<{ id?: string }>();
  const conditionId = params.id;

  const { conditions, isLoading, isError, error } = useHairConditions();
  const { createCondition, isCreating } = useCreateHairCondition();
  const { updateCondition, isUpdating } = useUpdateHairCondition();

  const isEditMode = Boolean(conditionId);

  const existingRecord = useMemo(() => {
    if (!conditionId) return null;
    return conditions.find((c) => c.id === conditionId) || null;
  }, [conditionId, conditions]);

  if (isLoading && isEditMode) {
    return (
      <SafeAreaView className="flex-1 bg-zinc-950">
        <LoadingHaircare />
      </SafeAreaView>
    );
  }

  if (isError && isEditMode) {
    return (
      <SafeAreaView className="flex-1 bg-zinc-950">
        <ErrorHaircare errorMessage={error?.message} />
      </SafeAreaView>
    );
  }

  const initialFormValues = existingRecord
    ? {
        recordDate: existingRecord.recordDate,
        hairType: existingRecord.hairType,
        porosity: existingRecord.porosity,
        scalpType: existingRecord.scalpType,
        hairDensity: existingRecord.hairDensity,
        sheddingLevel: existingRecord.sheddingLevel,
        dandruffLevel: existingRecord.dandruffLevel,
        itchinessLevel: existingRecord.itchinessLevel,
        oilinessLevel: existingRecord.oilinessLevel,
        drynessLevel: existingRecord.drynessLevel,
        breakageLevel: existingRecord.breakageLevel,
        frizzLevel: existingRecord.frizzLevel,
        shineLevel: existingRecord.shineLevel,
        overallHealth: existingRecord.overallHealth,
        notes: existingRecord.notes,
      }
    : undefined;

  return (
    <SafeAreaView className="flex-1 bg-zinc-950">
      <ScrollView className="flex-1" contentContainerStyle={{ padding: 16, gap: 16 }}>
        {/* Header */}
        <View className="flex-row items-center justify-between">
          <View>
            <TouchableOpacity onPress={() => router.back()} accessibilityRole="button">
              <Text className="text-amber-400 text-xs font-semibold mb-1">← Cancel</Text>
            </TouchableOpacity>
            <Text className="text-zinc-50 text-2xl font-extrabold">
              {isEditMode ? 'Edit Assessment' : 'New Health Assessment'}
            </Text>
          </View>
        </View>

        {/* Form Container */}
        <View className="bg-zinc-900 border border-zinc-800 p-4 rounded-2xl">
          <ConditionForm
            initialValues={initialFormValues}
            isSubmitting={isCreating || isUpdating}
            submitLabel={isEditMode ? 'Update Assessment Record' : 'Save Health Assessment'}
            onSubmit={async (vals) => {
              if (isEditMode && conditionId) {
                await updateCondition({
                  id: conditionId,
                  updates: vals,
                });
              } else {
                await createCondition(vals);
              }
              router.back();
            }}
          />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};
