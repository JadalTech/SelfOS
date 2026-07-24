import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useNutritionLogs } from '../../hooks/useNutrition';
import { DashboardLayout } from '../layouts/DashboardLayout';
import { FeatureHeader } from '../layouts/FeatureHeader';
import { SectionLayout } from '../layouts/SectionLayout';
import {
  VirtualizedList,
  LoadingState,
  ActionCard,
} from '../../../../shared/components';
import type { MealType } from '../../types/nutrition.types';

export const MealDetailsScreen: React.FC = React.memo(function MealDetailsScreen() {
  const router = useRouter();
  const { mealType, date } = useLocalSearchParams<{ mealType: MealType; date: string }>();
  const dateStr = date || new Date().toISOString().split('T')[0];

  const { activeDailyLogVM, isLoadingDate, removeFoodFromMeal } = useNutritionLogs(dateStr);

  if (isLoadingDate) {
    return <LoadingState message="Loading meal details..." />;
  }

  const mealData = activeDailyLogVM?.meals.find((m) => m.mealType === mealType);
  const foods = mealData?.foods || [];

  return (
    <DashboardLayout>
      <FeatureHeader
        title={`${mealData?.mealTypeLabel || 'Meal'} Summary`}
        subtitle={`${activeDailyLogVM?.dateFormatted || dateStr} • ${mealData?.totalCaloriesLabel || '0 kcal'}`}
      />

      <ActionCard
        title="Add Food Items"
        description="Search global catalog or custom foods"
        icon="➕"
        actionLabel="Log Food"
        onPress={() => router.push({ pathname: '/(app)/nutrition/search', params: { mealType, date: dateStr } })}
      />

      <SectionLayout title="Logged Foods">
        <VirtualizedList
          data={foods}
          keyExtractor={(item) => item.id}
          emptyTitle="Meal is Empty"
          emptyDescription="You haven't logged any food items to this meal yet."
          renderItem={({ item }) => (
            <View className="bg-zinc-900 border border-zinc-800 p-4 rounded-2xl flex-row items-center justify-between mb-2 shadow-sm">
              <View className="flex-1 pr-3">
                <Text className="text-zinc-50 text-sm font-bold tracking-tight">{item.foodName}</Text>
                {item.foodBrand ? (
                  <Text className="text-zinc-400 text-xs mt-0.5">{item.foodBrand}</Text>
                ) : null}
                <Text className="text-zinc-500 text-xs mt-1">
                  {item.quantity} {item.servingUnit} ({item.caloriesLabel})
                </Text>
              </View>

              <TouchableOpacity
                onPress={() => removeFoodFromMeal({ date: dateStr, mealType, entryId: item.id })}
                accessible={true}
                accessibilityRole="button"
                accessibilityLabel={`Remove ${item.foodName}`}
                hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
                className="w-8 h-8 rounded-full bg-rose-500/10 border border-rose-500/25 items-center justify-center"
              >
                <Text className="text-rose-400 text-xs font-bold">✕</Text>
              </TouchableOpacity>
            </View>
          )}
        />
      </SectionLayout>
    </DashboardLayout>
  );
});
export default MealDetailsScreen;
