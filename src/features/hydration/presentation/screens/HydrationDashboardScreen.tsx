import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { useHydrationDashboardViewModel } from '../viewmodels/useHydrationDashboardViewModel';
import { ScrollableDashboard } from '../layouts/ScrollableDashboard';
import { FeatureLayout } from '../layouts/FeatureLayout';
import {
  DashboardHeader,
  ProgressSection,
  QuickAddSection,
  GoalSummarySection,
  StatusSection,
  TimelineSection,
  ReminderSummarySection,
  StatisticsSection,
  InsightsPreviewSection,
} from './dashboard/sections';
import { LoadingState, ErrorState } from '../components';

export const HydrationDashboardScreen: React.FC = React.memo(function HydrationDashboardScreen() {
  const router = useRouter();
  const {
    dashboard,
    entries,
    detailedScore,
    isLoading,
    refresh,
    quickAdd,
    deleteEntry,
  } = useHydrationDashboardViewModel();

  if (isLoading) return <LoadingState />;

  const rightAction = (
    <View className="flex-row gap-2">
      <TouchableOpacity
        onPress={() => router.push('/hydration/history')}
        className="px-3 py-1.5 bg-zinc-900 border border-zinc-800 rounded-xl"
      >
        <Text className="text-zinc-300 text-xs font-semibold">History</Text>
      </TouchableOpacity>
      <TouchableOpacity
        onPress={() => router.push('/hydration/analytics')}
        className="px-3 py-1.5 bg-zinc-900 border border-zinc-800 rounded-xl"
      >
        <Text className="text-zinc-300 text-xs font-semibold">Analytics</Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <FeatureLayout title="Hydration" showBackButton={true} rightAction={rightAction}>
      <ScrollableDashboard onRefresh={refresh}>
        <DashboardHeader />
        
        {/* Progress Display */}
        <ProgressSection
          consumedML={dashboard.consumedML}
          goalML={dashboard.goalML}
          percentage={dashboard.completionPercent}
          score={detailedScore.overall}
          statusColor={dashboard.statusColor}
        />

        {/* Quick Add Intake */}
        <QuickAddSection
          onQuickAdd={quickAdd}
          onCustomAdd={() => router.push('/hydration/entry/new')}
        />

        {/* Dynamic Status bar */}
        <StatusSection
          statusLabel={dashboard.statusLabel}
          statusColor={dashboard.statusColor}
          remainingLabel={dashboard.remainingLabel}
        />

        {/* Goal details */}
        <GoalSummarySection
          goalLabel={dashboard.goalLabel}
          recommendedLabel="2500 mL"
          isCustom={true}
          onEditPress={() => router.push('/hydration/goal')}
        />

        {/* Stats segment */}
        <StatisticsSection
          averageDrink={`${Math.round(dashboard.consumedML / Math.max(1, entries.length))} mL`}
          largestDrink={dashboard.consumedLabel}
          streak={dashboard.streak}
          completionRate={`${dashboard.completionPercent}%`}
        />

        {/* AI Insight */}
        <InsightsPreviewSection
          score={detailedScore.overall}
          momentum={1.0}
        />

        {/* Reminder config */}
        <ReminderSummarySection
          reminderEnabled={true}
          intervalMinutes={60}
          wakeTime="07:00"
          sleepTime="23:00"
          nextReminderTime="14:00"
          onPress={() => router.push('/hydration/reminders')}
        />

        {/* Log Timeline */}
        <TimelineSection
          entries={entries}
          onDeleteEntry={deleteEntry}
        />
      </ScrollableDashboard>
    </FeatureLayout>
  );
});
export default HydrationDashboardScreen;
