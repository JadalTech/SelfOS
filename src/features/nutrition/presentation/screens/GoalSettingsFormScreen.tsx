import React from 'react';
import { useRouter } from 'expo-router';
import { useNutritionGoals } from '../../hooks/useNutrition';
import { DashboardLayout } from '../layouts/DashboardLayout';
import { FeatureHeader } from '../layouts/FeatureHeader';
import { GoalForm } from '../forms/GoalForm';
import { NutritionGoalFormValues } from '../../validation/nutrition.validation';

export const GoalSettingsFormScreen: React.FC = React.memo(function GoalSettingsFormScreen() {
  const router = useRouter();
  const { activeGoalVM, saveGoal, isSaving } = useNutritionGoals();

  const handleSubmit = async (data: NutritionGoalFormValues) => {
    await saveGoal({
      ...data,
      isActive: true,
    });
    router.back();
  };

  const defaultValues = activeGoalVM ? {
    calorieTarget: activeGoalVM.calorieTarget,
    proteinTarget: activeGoalVM.proteinTarget,
    carbTarget: activeGoalVM.carbTarget,
    fatTarget: activeGoalVM.fatTarget,
    fiberTarget: activeGoalVM.fiberTarget,
  } : undefined;

  return (
    <DashboardLayout>
      <FeatureHeader title="Nutrition Goals" subtitle="Configure daily calorie & macro targets" />
      <GoalForm
        defaultValues={defaultValues}
        onSubmit={handleSubmit}
        onCancel={() => router.back()}
        isSubmitting={isSaving}
      />
    </DashboardLayout>
  );
});
export default GoalSettingsFormScreen;
