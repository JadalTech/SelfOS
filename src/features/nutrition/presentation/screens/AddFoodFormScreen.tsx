import React from 'react';
import { useRouter } from 'expo-router';
import { useNutritionFoods } from '../../hooks/useNutrition';
import { DashboardLayout } from '../layouts/DashboardLayout';
import { FeatureHeader } from '../layouts/FeatureHeader';
import { FoodForm } from '../forms/FoodForm';
import { FoodFormValues } from '../../validation/nutrition.validation';

export const AddFoodFormScreen: React.FC = React.memo(function AddFoodFormScreen() {
  const router = useRouter();
  const { createUserFood, isCreating } = useNutritionFoods();

  const handleSubmit = async (data: FoodFormValues) => {
    // Save to Firestore using repository mutate hook
    await createUserFood(data);
    router.back();
  };

  return (
    <DashboardLayout>
      <FeatureHeader title="Create Food" subtitle="Add custom recipes or items" />
      <FoodForm onSubmit={handleSubmit} onCancel={() => router.back()} isSubmitting={isCreating} />
    </DashboardLayout>
  );
});
export default AddFoodFormScreen;
