import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { useNutritionLogs, useNutritionGoals } from '../../hooks/useNutrition';
import { DashboardLayout } from '../layouts/DashboardLayout';
import { FeatureHeader } from '../layouts/FeatureHeader';
import { SectionLayout } from '../layouts/SectionLayout';
import { MetricGrid } from '../layouts/MetricGrid';
import {
  ProgressCard,
  SummaryCard,
  ActionCard,
  LoadingState,
  RetryCard,
} from '../../../../shared/components';
import { MEAL_TYPE_OPTIONS } from '../../constants/nutrition.constants';

export const NutritionDashboardScreen: React.FC = React.memo(function NutritionDashboardScreen() {
  const router = useRouter();
  const todayStr = new Date().toISOString().split('T')[0];

  // Retrieve data using React Query hooks
  const { activeDailyLogVM, isLoadingDate, refetchLogs, isError, error } = useNutritionLogs(todayStr);
  const { activeGoalVM, isLoading: isLoadingGoal } = useNutritionGoals();

  if (isLoadingDate || isLoadingGoal) {
    return <LoadingState message="Loading dashboard..." />;
  }

  if (isError) {
    return <RetryCard onRetry={() => refetchLogs()} message={error?.message} />;
  }

  // Fallback defaults if log or goals are empty
  const calorieTarget = activeGoalVM?.calorieTarget || 2000;
  const consumedCalories = activeDailyLogVM?.totalCalories || 0;
  const caloriesRatio = consumedCalories / calorieTarget;

  const proteinTarget = activeGoalVM?.proteinTarget || 150;
  const carbTarget = activeGoalVM?.carbTarget || 200;
  const fatTarget = activeGoalVM?.fatTarget || 65;

  const proteinConsumed = activeDailyLogVM?.totalProtein || 0;
  const carbsConsumed = activeDailyLogVM?.totalCarbs || 0;
  const fatsConsumed = activeDailyLogVM?.totalFats || 0;

  const macroMetrics = [
    { label: 'Protein', value: `${proteinConsumed} / ${proteinTarget}g`, progress: proteinConsumed / proteinTarget, color: '#f43f5e' },
    { label: 'Carbs', value: `${carbsConsumed} / ${carbTarget}g`, progress: carbsConsumed / carbTarget, color: '#0ea5e9' },
    { label: 'Fats', value: `${fatsConsumed} / ${fatTarget}g`, progress: fatsConsumed / fatTarget, color: '#10b981' },
  ];

  return (
    <DashboardLayout onRefresh={refetchLogs}>
      {/* Header */}
      <FeatureHeader
        title="Nutrition Tracker"
        subtitle="Fuel your fitness goals"
        showBackButton={true}
        actionIcon="⚙️"
        actionLabel="Goals"
        onAction={() => router.push('/(app)/nutrition/goals')}
      />

      {/* Progress Cards */}
      <MetricGrid>
        <ProgressCard
          title="Daily Calorie Budget"
          value={`${consumedCalories} kcal`}
          progress={caloriesRatio}
          type="circular"
          subLabel={`Goal: ${calorieTarget}`}
        />
        <View className="flex-1 gap-3.5">
          <ActionCard
            title="Search Catalog"
            description="Log standard or custom foods"
            icon="🥗"
            actionLabel="Search"
            onPress={() => router.push('/(app)/nutrition/search')}
          />
          <ActionCard
            title="Saved Templates"
            description="Quickly reuse meal setups"
            icon="📋"
            actionLabel="View"
            onPress={() => router.push('/(app)/nutrition/templates')}
          />
        </View>
      </MetricGrid>

      {/* Macronutrient Distribution Card */}
      <SummaryCard title="Macronutrients Balance" metrics={macroMetrics} />

      {/* Meals Sections */}
      <SectionLayout
        title="Today's Meal Log"
        subtitle="Manage daily logs"
        actionLabel="Full History"
        onAction={() => router.push('/(app)/nutrition/history')}
      >
        <View className="gap-3">
          {MEAL_TYPE_OPTIONS.map((mealType) => {
            const mealData = activeDailyLogVM?.meals.find((m) => m.mealType === mealType.value);
            const mealCalories = mealData?.totalCalories || 0;
            const itemsCount = mealData?.foods.length || 0;

            return (
              <TouchableOpacity
                key={mealType.value}
                activeOpacity={0.8}
                onPress={() =>
                  router.push({
                    pathname: '/(app)/nutrition/meal',
                    params: { mealType: mealType.value, date: todayStr },
                  })
                }
                className="bg-zinc-900 border border-zinc-800 p-4 rounded-2xl flex-row items-center justify-between shadow-sm"
              >
                <View className="flex-row items-center gap-3">
                  <Text className="text-xl">{mealType.icon}</Text>
                  <View>
                    <Text className="text-zinc-50 text-sm font-bold tracking-tight">{mealType.label}</Text>
                    <Text className="text-zinc-400 text-xs font-semibold mt-0.5">
                      {itemsCount} {itemsCount === 1 ? 'food logged' : 'foods logged'}
                    </Text>
                  </View>
                </View>

                <View className="flex-row items-center gap-2">
                  <Text className="text-zinc-200 text-sm font-extrabold">{mealCalories} kcal</Text>
                  <Text className="text-zinc-500 font-bold">➔</Text>
                </View>
              </TouchableOpacity>
            );
          })}
        </View>
      </SectionLayout>
    </DashboardLayout>
  );
});
export default NutritionDashboardScreen;
