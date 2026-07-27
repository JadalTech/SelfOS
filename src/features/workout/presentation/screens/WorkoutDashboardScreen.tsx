import React, { useMemo, useCallback } from 'react';
import { View, Text, ScrollView, RefreshControl, TouchableOpacity, SafeAreaView } from 'react-native';
import { useRouter } from 'expo-router';
import {
  useWorkoutPlans,
  useWorkoutHistory,
  usePersonalRecords,
  useWorkoutSession,
} from '../../hooks/useWorkout';
import {
  WorkoutHeader,
  WorkoutSummaryCard,
  PersonalRecordCard,
} from '../components';
import {
  LineTrendChart,
  DistributionChart,
  SkeletonLoader,
  ErrorStateCard,
} from '../../../../shared/components';
import { calculateWorkoutStreak, calculateWeeklyFrequency } from '../../engine/workoutEngine';
import { calculateVolumeTrends, calculateMuscleGroupStats } from '../../analytics/utils/workoutAnalytics';

export const WorkoutDashboardScreen: React.FC = function WorkoutDashboardScreen() {
  const router = useRouter();

  // Load data using React Query
  const { plansVM, isLoading: plansLoading, isError: plansError, refetch: refetchPlans } = useWorkoutPlans();
  const { historyVM, rawHistory, isLoading: historyLoading, isError: historyError, refetch: refetchHistory } = useWorkoutHistory(10);
  const { personalRecordsVM, isLoading: prsLoading, isError: prsError, refetch: refetchPrs } = usePersonalRecords();
  const { activeSession, startSession } = useWorkoutSession();

  const isLoading = plansLoading || historyLoading || prsLoading;
  const isError = plansError || historyError || prsError;

  const handleRefetch = useCallback(async () => {
    await Promise.all([refetchPlans(), refetchHistory(), refetchPrs()]);
  }, [refetchPlans, refetchHistory, refetchPrs]);

  // Compute Streak and Volume Trends
  const formattedSessions = useMemo(() => {
    return rawHistory.map((s) => ({
      date: s.startedAt.toISOString().split('T')[0],
    }));
  }, [rawHistory]);

  const streak = useMemo(() => calculateWorkoutStreak(formattedSessions), [formattedSessions]);

  const weeklyFreq = useMemo(() => {
    const today = new Date();
    const currentDay = today.getDay();
    const distance = currentDay === 0 ? 6 : currentDay - 1;
    const monday = new Date(today);
    monday.setDate(today.getDate() - distance);
    const mondayStr = monday.toISOString().split('T')[0];
    return calculateWeeklyFrequency(formattedSessions, mondayStr);
  }, [formattedSessions]);

  const volumeChartData = useMemo(() => {
    const trendPoints = calculateVolumeTrends(rawHistory);
    // Take latest 5 sessions and map to ChartDataPoint format
    return trendPoints.slice(-5).map((pt) => {
      const dateParts = pt.date.split('-');
      const label = dateParts.length > 2 ? `${dateParts[1]}/${dateParts[2]}` : pt.date;
      return {
        label,
        value: pt.volume,
      };
    });
  }, [rawHistory]);

  const muscleFreqChartData = useMemo(() => {
    const stats = calculateMuscleGroupStats(rawHistory);
    const entries = Object.values(stats).filter((st) => st.setPercentage > 0);
    if (entries.length === 0) return [];

    const colors = ['#8b5cf6', '#a78bfa', '#c084fc', '#e879f9', '#f472b6', '#38bdf8', '#34d399', '#facc15'];

    return entries
      .sort((a, b) => b.setPercentage - a.setPercentage)
      .slice(0, 5) // Show top 5
      .map((entry, idx) => {
        return {
          label: entry.muscleGroup.charAt(0).toUpperCase() + entry.muscleGroup.slice(1),
          percentage: entry.setPercentage,
          color: colors[idx % colors.length],
        };
      });
  }, [rawHistory]);

  const recentHistory = useMemo(() => historyVM.slice(0, 3), [historyVM]);
  const topPrs = useMemo(() => personalRecordsVM.slice(0, 2), [personalRecordsVM]);

  const handleQuickWorkout = useCallback(async () => {
    try {
      await startSession('Quick Strength Workout');
      router.push('/(app)/workout/session');
    } catch (e) {
      console.error(e);
    }
  }, [startSession, router]);

  const activeDurationFormatted = useMemo(() => {
    if (!activeSession) return '';
    const secs = activeSession.durationSeconds || 0;
    const mins = Math.floor(secs / 60);
    const hrs = Math.floor(mins / 60);
    const displayMins = mins % 60;
    const displaySecs = secs % 60;
    
    if (hrs > 0) {
      return `${hrs}h ${displayMins}m`;
    }
    return `${displayMins}m ${displaySecs}s`;
  }, [activeSession]);

  return (
    <SafeAreaView className="flex-1 bg-zinc-950">
      <ScrollView
        contentContainerStyle={{ padding: 16, gap: 16, paddingBottom: 40 }}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={isLoading} onRefresh={handleRefetch} tintColor="#8b5cf6" />
        }
      >
        {/* Module Header */}
        <WorkoutHeader
          plansCount={plansVM.length}
          templatesCount={0}
          historyCount={historyVM.length}
          prsCount={personalRecordsVM.length}
          activeSessionId={activeSession?.id}
        />

        {isLoading ? (
          <View className="gap-3">
            <SkeletonLoader height={80} />
            <SkeletonLoader height={140} />
            <SkeletonLoader height={140} />
          </View>
        ) : isError ? (
          <ErrorStateCard message="Failed to load dashboard metrics" onRetry={handleRefetch} />
        ) : (
          <>
            {/* Active Session Spotlight Shortcut */}
            {activeSession ? (
              <TouchableOpacity
                onPress={() => router.push('/(app)/workout/session')}
                className="bg-emerald-500/10 border border-emerald-500/40 p-4 rounded-2xl flex-row items-center justify-between shadow-sm animate-pulse"
                accessible={true}
                accessibilityRole="button"
                accessibilityLabel="Active workout session in progress. Press to resume."
              >
                <View className="gap-1 flex-1">
                  <View className="flex-row items-center gap-1.5">
                    <View className="w-2.5 h-2.5 rounded-full bg-emerald-400" />
                    <Text className="text-emerald-400 text-xs font-bold uppercase tracking-wider">
                      Session in Progress
                    </Text>
                  </View>
                  <Text className="text-zinc-50 text-base font-bold">
                    {activeSession.name}
                  </Text>
                  <Text className="text-zinc-400 text-xs mt-0.5">
                    Time: {activeDurationFormatted}
                  </Text>
                </View>
                <View className="bg-emerald-600 px-4 py-2 rounded-xl">
                  <Text className="text-zinc-50 text-xs font-extrabold">Resume</Text>
                </View>
              </TouchableOpacity>
            ) : null}

            {/* Streak & Frequency Spotlight Grid */}
            <View className="flex-row gap-3">
              <View className="bg-zinc-900 border border-zinc-800 p-4 rounded-2xl flex-1 items-center gap-1">
                <Text className="text-2xl">⚡</Text>
                <Text className="text-zinc-50 text-lg font-black tracking-tight">{streak} Days</Text>
                <Text className="text-zinc-500 text-[10px] font-bold uppercase tracking-wider">
                  Workout Streak
                </Text>
              </View>

              <View className="bg-zinc-900 border border-zinc-800 p-4 rounded-2xl flex-1 items-center gap-1">
                <Text className="text-2xl">📅</Text>
                <Text className="text-zinc-50 text-lg font-black tracking-tight">
                  {weeklyFreq} sessions
                </Text>
                <Text className="text-zinc-500 text-[10px] font-bold uppercase tracking-wider">
                  Completed This Week
                </Text>
              </View>
            </View>

            {/* Volume Progression Trend Chart */}
            {volumeChartData.length > 0 ? (
              <LineTrendChart
                title="Volume Trend (kg)"
                data={volumeChartData}
                color="#8b5cf6"
                unit="k"
              />
            ) : null}

            {/* Muscle Group Distribution Chart */}
            {muscleFreqChartData.length > 0 ? (
              <DistributionChart
                title="Muscle Workload (Top 5)"
                segments={muscleFreqChartData}
              />
            ) : null}

            {/* Recent Workout Logs */}
            <View className="gap-3">
              <View className="flex-row justify-between items-center px-1">
                <Text className="text-zinc-200 text-sm font-bold uppercase tracking-wide">
                  Recent Workouts
                </Text>
                {historyVM.length > 3 ? (
                  <TouchableOpacity onPress={() => router.push('/(app)/workout/history')}>
                    <Text className="text-violet-400 text-xs font-semibold">View All</Text>
                  </TouchableOpacity>
                ) : null}
              </View>

              {recentHistory.map((session) => (
                <WorkoutSummaryCard
                  key={session.id}
                  session={session}
                  onPress={() => router.push(`/(app)/workout/history`)}
                />
              ))}

              {recentHistory.length === 0 ? (
                <View className="py-8 bg-zinc-900/30 border border-dashed border-zinc-800 items-center justify-center rounded-2xl">
                  <Text className="text-zinc-500 text-xs font-semibold">No workouts logged yet</Text>
                  <Text className="text-zinc-600 text-[10px] mt-1">Ready for your first session?</Text>
                </View>
              ) : null}
            </View>

            {/* Top Personal Records */}
            {topPrs.length > 0 ? (
              <View className="gap-3">
                <View className="flex-row justify-between items-center px-1">
                  <Text className="text-zinc-200 text-sm font-bold uppercase tracking-wide">
                    Personal Records
                  </Text>
                  <TouchableOpacity onPress={() => router.push('/(app)/workout/prs')}>
                    <Text className="text-violet-400 text-xs font-semibold">View All</Text>
                  </TouchableOpacity>
                </View>

                <View className="flex-row gap-3">
                  {topPrs.map((pr) => (
                    <PersonalRecordCard key={pr.id} pr={pr} />
                  ))}
                </View>
              </View>
            ) : null}

            {/* Quick Actions */}
            <View className="gap-2.5 pt-4 border-t border-zinc-800/60">
              <TouchableOpacity
                onPress={handleQuickWorkout}
                className="bg-violet-600 py-3.5 rounded-xl items-center justify-center shadow-lg shadow-violet-600/10"
                accessibilityRole="button"
                accessibilityLabel="Start a quick empty workout log"
              >
                <Text className="text-zinc-50 text-sm font-extrabold uppercase tracking-wide">
                  ⚡ Start Empty Workout
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                onPress={() => router.push('/(app)/workout/plans/new')}
                className="bg-zinc-900 border border-zinc-800 py-3.5 rounded-xl items-center justify-center"
                accessibilityRole="button"
                accessibilityLabel="Create a new split workout plan"
              >
                <Text className="text-zinc-300 text-sm font-bold uppercase tracking-wide">
                  🛠️ Create Custom Plan
                </Text>
              </TouchableOpacity>
            </View>
          </>
        )}
      </ScrollView>
    </SafeAreaView>
  );
};
