import React, { useCallback, useMemo } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { useSleepToday } from '../hooks/useSleepToday';
import { useSleepEntries } from '../hooks/useSleepEntries';
import { useSleepSchedule } from '../hooks/useSleepSchedule';
import { useSleepGoals } from '../hooks/useSleepGoals';
import { useSleepRecovery } from '../hooks/useSleepRecovery';
import { DashboardLayout } from '../components/layouts/DashboardLayout';
import { buildSleepDashboardVM } from '../mappers/sleep.mapper';
import * as SleepEngine from '../engine/sleepEngine';
import { MetricCard } from '@/shared/components/cards/MetricCard';
import { ProgressCard } from '@/shared/components/cards/ProgressCard';
import { EmptyStateCard } from '@/shared/components/feedback/EmptyStateCard';

export const SleepDashboardScreen: React.FC = () => {
  const router = useRouter();

  // Load domain states via React Query hooks
  const { isLoading: isTodayLoading, refetch: refetchToday } = useSleepToday();
  const { entries, isLoading: isEntriesLoading, refetch: refetchEntries } = useSleepEntries();
  const { activeSchedule, isLoading: isScheduleLoading, refetch: refetchSchedule } = useSleepSchedule();
  const { activeGoals, isLoading: isGoalsLoading, refetch: refetchGoals } = useSleepGoals();
  const { recovery, isLoading: isRecoveryLoading, refetch: refetchRecovery } = useSleepRecovery();

  const isLoading = isTodayLoading || isEntriesLoading || isScheduleLoading || isGoalsLoading || isRecoveryLoading;

  const handleRefetchAll = useCallback(async () => {
    await Promise.all([
      refetchToday(),
      refetchEntries(),
      refetchSchedule(),
      refetchGoals(),
      refetchRecovery(),
    ]);
  }, [refetchToday, refetchEntries, refetchSchedule, refetchGoals, refetchRecovery]);

  // Compute metrics & map ViewModel inside useMemo
  const viewModel = useMemo(() => {
    if (isLoading) return null;

    const targetMinutes = activeSchedule?.targetDurationMinutes || 480;
    const streak = SleepEngine.calculateSleepStreaks(entries, targetMinutes);
    const debt = SleepEngine.calculateSleepDebt(entries, targetMinutes);

    // Consistency score (last 7 entries)
    const recentEntries = entries.slice(0, 7);
    const consistency = activeSchedule ? SleepEngine.calculateScheduleConsistency(recentEntries, activeSchedule) : 100;

    // Goal progress (latest entry)
    let goalProgress = 0;
    const latest = entries[0];
    if (latest && activeGoals.length > 0 && activeSchedule) {
      goalProgress = SleepEngine.calculateGoalCompletionPercentage(
        latest,
        activeGoals,
        activeSchedule,
        consistency
      );
    }

    return buildSleepDashboardVM(
      latest || null,
      activeSchedule,
      recovery,
      streak,
      debt,
      consistency,
      goalProgress
    );
  }, [isLoading, entries, activeSchedule, activeGoals, recovery]);

  // Navigation callbacks
  const handleLogPress = useCallback(() => {
    router.push('/sleep/log');
  }, [router]);

  const handleHistoryPress = useCallback(() => {
    router.push('/sleep/history');
  }, [router]);

  const handleSchedulePress = useCallback(() => {
    router.push('/sleep/schedule');
  }, [router]);

  const handleGoalsPress = useCallback(() => {
    router.push('/sleep/goals');
  }, [router]);

  const handleInsightsPress = useCallback(() => {
    router.push('/sleep/insights');
  }, [router]);

  if (!isLoading && !viewModel) {
    return (
      <DashboardLayout title="Sleep" isLoading={false}>
        <EmptyStateCard
          icon="🌙"
          title="Setup Sleep Module"
          description="Establish your Sleep schedule and log your first night's rest to compute recovery scores."
          actionLabel="Log Sleep Now"
          onAction={handleLogPress}
          accentColor="#6366f1"
        />
      </DashboardLayout>
    );
  }

  const recoveryValue = viewModel?.recovery?.recoveryScore ?? 0;
  const recoveryStatusLabel = viewModel?.recovery?.statusLabel ?? 'No Data';
  const recoveryColor = viewModel?.recovery?.statusColor ?? '#a1a1aa';

  return (
    <DashboardLayout
      title="Sleep"
      subtitle="Sleep tracking & biological recovery"
      isLoading={isLoading}
      onRetry={handleRefetchAll}
      headerRight={
        <TouchableOpacity
          style={styles.quickLogBtn}
          onPress={handleLogPress}
          accessible={true}
          accessibilityRole="button"
          accessibilityLabel="Log Sleep Entry"
          hitSlop={{ top: 8, bottom: 8, left: 12, right: 12 }}
        >
          <Text style={styles.quickLogBtnText}>+ Log Night</Text>
        </TouchableOpacity>
      }
    >
      {/* Prominent Recovery ring indicator */}
      <View style={styles.recoverySection}>
        <ProgressCard
          title="Daily Recovery"
          value={recoveryValue > 0 ? `${recoveryValue}%` : 'N/A'}
          progress={recoveryValue / 100}
          type="circular"
          activeColor={recoveryColor}
          subLabel={recoveryValue > 0 ? `${recoveryStatusLabel} Recovery` : 'No Log Today'}
        />
      </View>

      {/* Grid containing core metrics */}
      <View style={styles.metricGrid}>
        <MetricCard
          label="Last Sleep"
          value={viewModel?.latestEntry?.durationLabel ?? 'None'}
          subLabel={viewModel?.latestEntry?.formattedDate ?? 'No log'}
          icon="⏳"
          color="#818cf8"
        />
        <MetricCard
          label="Quality"
          value={viewModel?.latestEntry?.qualityRating ? `${viewModel.latestEntry.qualityRating}/10` : 'None'}
          subLabel={viewModel?.latestEntry?.qualityLabel ?? 'No quality'}
          icon="✨"
          color="#a78bfa"
        />
      </View>

      <View style={styles.metricGrid}>
        <MetricCard
          label="Sleep Debt"
          value={viewModel?.sleepDebtLabel ?? '0.0 hrs'}
          subLabel={viewModel?.sleepDebtMinutes && viewModel.sleepDebtMinutes > 0 ? 'Accumulated debt' : 'Sleep surplus'}
          icon="⚖️"
          color="#f43f5e"
        />
        <MetricCard
          label="Log Streak"
          value={viewModel?.streakLabel ?? '0 days'}
          subLabel="Consecutive target nights"
          icon="🔥"
          color="#fb923c"
        />
      </View>

      {/* Goal completion & consistency sliders */}
      <View style={styles.section}>
        <ProgressCard
          title="Schedule Consistency"
          value={`${viewModel?.weeklyConsistencyPercent ?? 0}%`}
          progress={(viewModel?.weeklyConsistencyPercent ?? 0) / 100}
          type="linear"
          activeColor="#818cf8"
          subLabel="Target schedule alignment"
        />
      </View>

      <View style={styles.section}>
        <ProgressCard
          title="Goal Completion"
          value={`${viewModel?.goalProgressPercent ?? 0}%`}
          progress={(viewModel?.goalProgressPercent ?? 0) / 100}
          type="linear"
          activeColor="#10b981"
          subLabel="Sleep goal parameters satisfied"
        />
      </View>

      {/* Navigation options link items */}
      <View style={styles.navRow}>
        <TouchableOpacity
          style={styles.navBtn}
          onPress={handleHistoryPress}
          accessible={true}
          accessibilityRole="button"
          accessibilityLabel="View Sleep History Logs"
          accessibilityHint="Opens your past sleep entries"
          hitSlop={{ top: 4, bottom: 4, left: 4, right: 4 }}
        >
          <Text style={styles.navBtnIcon}>📊</Text>
          <Text style={styles.navBtnText}>History Logs</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.navBtn}
          onPress={handleSchedulePress}
          accessible={true}
          accessibilityRole="button"
          accessibilityLabel="Configure Sleep Schedule"
          accessibilityHint="Opens your bedtime and wake time settings"
          hitSlop={{ top: 4, bottom: 4, left: 4, right: 4 }}
        >
          <Text style={styles.navBtnIcon}>📅</Text>
          <Text style={styles.navBtnText}>Schedule Settings</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.navRow}>
        <TouchableOpacity
          style={styles.navBtn}
          onPress={handleGoalsPress}
          accessible={true}
          accessibilityRole="button"
          accessibilityLabel="Manage Sleep Goals"
          accessibilityHint="Opens your sleep goal targets"
          hitSlop={{ top: 4, bottom: 4, left: 4, right: 4 }}
        >
          <Text style={styles.navBtnIcon}>🎯</Text>
          <Text style={styles.navBtnText}>Sleep Goals</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.navBtn}
          onPress={handleInsightsPress}
          accessible={true}
          accessibilityRole="button"
          accessibilityLabel="View Sleep Insights and Trends"
          accessibilityHint="Opens charts and analytics for your sleep"
          hitSlop={{ top: 4, bottom: 4, left: 4, right: 4 }}
        >
          <Text style={styles.navBtnIcon}>💡</Text>
          <Text style={styles.navBtnText}>Insights & Trends</Text>
        </TouchableOpacity>
      </View>
    </DashboardLayout>
  );
};

const styles = StyleSheet.create({
  quickLogBtn: {
    backgroundColor: '#6366f1',
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 10,
  },
  quickLogBtnText: {
    color: '#ffffff',
    fontSize: 12,
    fontWeight: 'bold',
  },
  recoverySection: {
    marginVertical: 4,
  },
  metricGrid: {
    flexDirection: 'row',
    gap: 16,
  },
  section: {
    gap: 12,
  },
  navRow: {
    flexDirection: 'row',
    gap: 16,
  },
  navBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#18181b',
    borderWidth: 1,
    borderColor: '#27272a',
    padding: 16,
    borderRadius: 16,
    gap: 12,
  },
  navBtnIcon: {
    fontSize: 20,
  },
  navBtnText: {
    color: '#fafafa',
    fontSize: 14,
    fontWeight: 'bold',
  },
});
