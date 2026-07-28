import React from 'react';
import { View, Text } from 'react-native';
import { useHydrationAnalyticsViewModel } from '../viewmodels/useHydrationAnalyticsViewModel';
import { FeatureLayout } from '../layouts/FeatureLayout';
import { AnalyticsLayout } from '../layouts/AnalyticsLayout';
import {
  DailyChart,
  WeeklyChart,
  DrinkDistributionChart,
  MonthlyChart,
  ConsistencyChart,
  HydrationScoreTrendChart,
  GoalAchievementChart,
  PeakDrinkingHoursChart,
  DrinkQualityBreakdownChart,
} from '../charts';
import { LoadingState } from '../components';

export const HydrationAnalyticsScreen: React.FC = React.memo(function HydrationAnalyticsScreen() {
  const { statistics, preferredWindow, weekdayWeekend, chartDataPoints, isLoading } = useHydrationAnalyticsViewModel();

  if (isLoading) return <LoadingState />;

  return (
    <FeatureLayout title="Hydration Insights" showBackButton={true}>
      <AnalyticsLayout>
        {/* Top summary card */}
        <View className="bg-zinc-950 border border-zinc-900 rounded-3xl p-5 gap-2 my-2">
          <Text className="text-zinc-500 text-[10px] uppercase font-bold tracking-widest">Preferred Window</Text>
          <Text className="text-zinc-100 font-extrabold text-lg capitalize">{preferredWindow} drinking</Text>
          <Text className="text-zinc-400 text-xs mt-1 leading-relaxed">
            Your peak consumption occurs during the {preferredWindow} hours. Standardized intake tracking helps analyze quality parameters.
          </Text>
        </View>

        {/* Charts Grid */}
        <DailyChart data={chartDataPoints} />
        <WeeklyChart data={[]} />
        <MonthlyChart />
        <DrinkDistributionChart data={[]} />
        <ConsistencyChart />
        <HydrationScoreTrendChart />
        <GoalAchievementChart />
        <PeakDrinkingHoursChart />
        <DrinkQualityBreakdownChart />
      </AnalyticsLayout>
    </FeatureLayout>
  );
});
export default HydrationAnalyticsScreen;
