import React from 'react';
import { View, Text, TouchableOpacity, SafeAreaView } from 'react-native';
import { useRouter } from 'expo-router';
import { useSkinAssessments } from '../hooks/useSkinAssessments';
import { AssessmentForm } from '../components/AssessmentForm';
import type { SkinAssessmentFormValues } from '../validation/skincare.validation';

export function SkinAssessmentFormScreen() {
  const router = useRouter();
  const { createAssessment, isCreating } = useSkinAssessments();

  const handleSubmit = async (values: SkinAssessmentFormValues) => {
    await createAssessment(values);
    router.back();
  };

  return (
    <SafeAreaView className="flex-1 bg-zinc-950">
      <View className="flex-1 p-4 gap-4">
        {/* Header */}
        <View className="flex-row items-center justify-between border-b border-zinc-800 pb-3">
          <View className="flex-row items-center gap-3">
            <TouchableOpacity onPress={() => router.back()} className="p-1">
              <Text className="text-zinc-400 text-lg font-bold">← Back</Text>
            </TouchableOpacity>
            <Text className="text-zinc-50 text-xl font-extrabold">New Skin Assessment</Text>
          </View>
        </View>

        <AssessmentForm
          isSubmitting={isCreating}
          onSubmit={handleSubmit}
        />
      </View>
    </SafeAreaView>
  );
}
