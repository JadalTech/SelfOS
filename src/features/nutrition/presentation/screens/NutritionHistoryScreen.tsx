import React from 'react';
import { useNutritionAnalytics, useNutritionLogs } from '../../hooks/useNutrition';
import { DashboardLayout } from '../layouts/DashboardLayout';
import { FeatureHeader } from '../layouts/FeatureHeader';
import { SectionLayout } from '../layouts/SectionLayout';
import { MetricGrid } from '../layouts/MetricGrid';
import {
  LineTrendChart,
  DistributionChart,
  TrendCard,
  LoadingState,
  RetryCard,
} from '../../../../shared/components';

export const NutritionHistoryScreen: React.FC = React.memo(function NutritionHistoryScreen() {
  const { analyticsRecords, isLoading, isError, error, refetch } = useNutritionAnalytics(30);
  const { dailyNutritionVMs } = useNutritionLogs();

  if (isLoading) {
    return <LoadingState message="Loading nutrition history..." />;
  }

  if (isError) {
    return <RetryCard onRetry={refetch} message={error?.message} />;
  }

  // Map analytics metrics to ViewModels
  const calorieRecord = analyticsRecords.find((r) => r.metric === 'calorie-intake');
  const qualityRecord = analyticsRecords.find((r) => r.metric === 'quality-score');
  const consistencyRecord = analyticsRecords.find((r) => r.metric === 'consistency');

  // Calorie trends chart data (convert daily logs to point arrays)
  const chartData = dailyNutritionVMs.slice(0, 7).map((log) => ({
    label: log.date.split('-')[2], // Day of month
    value: log.totalCalories,
  })).reverse();

  // Macro distribution split mock segments for chart
  const macroSegments = [
    { label: 'Protein', percentage: 30, color: '#f43f5e' },
    { label: 'Carbs', percentage: 50, color: '#0ea5e9' },
    { label: 'Fats', percentage: 20, color: '#10b981' },
  ];

  return (
    <DashboardLayout onRefresh={refetch}>
      <FeatureHeader title="Analytics & History" subtitle="Track progress over past 30 days" />

      {/* Metric Cards Grid */}
      <MetricGrid>
        <TrendCard
          title="Average Calories"
          value={calorieRecord ? `${calorieRecord.value}` : '0'}
          metricUnit="kcal"
          changePercent={calorieRecord?.trend === 'improving' ? 5 : -4}
        />
        <TrendCard
          title="Nutrition Score"
          value={qualityRecord ? `${qualityRecord.value}` : '0'}
          metricUnit="/10"
          changePercent={qualityRecord?.trend === 'improving' ? 12 : 0}
        />
        <TrendCard
          title="Consistency Ratio"
          value={consistencyRecord ? `${consistencyRecord.value}%` : '0%'}
        />
      </MetricGrid>

      {/* Calorie Trend Line Chart */}
      <SectionLayout title="Calorie Trend (Past 7 Logs)">
        <LineTrendChart data={chartData} unit=" kcal" color="#ec4899" />
      </SectionLayout>

      {/* Macronutrient Distribution Chart */}
      <SectionLayout title="Macronutrients Balance Ratio">
        <DistributionChart segments={macroSegments} />
      </SectionLayout>
    </DashboardLayout>
  );
});
export default NutritionHistoryScreen;
