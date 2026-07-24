import React from 'react';
import { View, Text } from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import { useNutritionLogs } from '../../hooks/useNutrition';
import { DashboardLayout } from '../layouts/DashboardLayout';
import { FeatureHeader } from '../layouts/FeatureHeader';
import { SectionLayout } from '../layouts/SectionLayout';
import {
  SummaryCard,
  LoadingState,
  NoDataCard,
} from '../../../../shared/components';

export const DailyLogScreen: React.FC = React.memo(function DailyLogScreen() {
  const { date } = useLocalSearchParams<{ date: string }>();
  const dateStr = date || new Date().toISOString().split('T')[0];

  const { activeDailyLogVM, isLoadingDate } = useNutritionLogs(dateStr);

  if (isLoadingDate) {
    return <LoadingState message="Loading daily log..." />;
  }

  const totals = activeDailyLogVM;

  const macroMetrics = [
    { label: 'Protein', value: totals ? totals.totalProteinLabel : '0g' },
    { label: 'Carbs', value: totals ? totals.totalCarbsLabel : '0g' },
    { label: 'Fats', value: totals ? totals.totalFatsLabel : '0g' },
  ];

  return (
    <DashboardLayout>
      <FeatureHeader title="Daily Summary" subtitle={totals?.dateFormatted || dateStr} />

      {totals ? (
        <View className="gap-5">
          <SummaryCard title="Day's Total Consumption" metrics={macroMetrics} footerText={`Calories: ${totals.totalCaloriesLabel}`} />

          <SectionLayout title="Meals Logged">
            <View className="gap-3.5">
              {totals.meals.map((meal) => (
                <View key={meal.id} className="bg-zinc-900 border border-zinc-800 p-4 rounded-2xl gap-2 shadow-sm">
                  <View className="flex-row items-center justify-between">
                    <Text className="text-zinc-100 text-sm font-bold">{meal.mealTypeLabel}</Text>
                    <Text className="text-pink-400 text-xs font-bold">{meal.totalCaloriesLabel}</Text>
                  </View>
                  <View className="gap-1 mt-1">
                    {meal.foods.map((food) => (
                      <View key={food.id} className="flex-row items-center justify-between">
                        <Text className="text-zinc-400 text-xs">{food.foodName}</Text>
                        <Text className="text-zinc-500 text-xs">{food.quantity}g</Text>
                      </View>
                    ))}
                  </View>
                </View>
              ))}
            </View>
          </SectionLayout>
        </View>
      ) : (
        <NoDataCard title="Empty Log" description="No food has been tracked for this date yet." />
      )}
    </DashboardLayout>
  );
});
export default DailyLogScreen;
