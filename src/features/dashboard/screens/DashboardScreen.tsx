import React, { useCallback } from 'react';
import { View, ScrollView, RefreshControl } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { useDashboard } from '../hooks/useDashboard';
import {
  DashboardHeader,
  TodayProgressCard,
  QuickActionsBar,
  TodayRoutinesList,
  StreakOverviewCard,
  StatsGrid,
  WeeklyProgressCard,
  RecentActivityCard,
  ModuleNavGrid,
  LoadingDashboard,
  EmptyDashboard,
  ErrorDashboard,
} from '../components';

export const DashboardScreen: React.FC = function DashboardScreen() {
  const router = useRouter();
  const {
    viewModel,
    isLoading,
    isRefetching,
    isError,
    error,
    refetch,
    completeRoutine,
    skipRoutine,
    isActionPending,
  } = useDashboard();

  const handleRoutinePress = useCallback(
    (routineId: string) => {
      router.push(`/(app)/routines/${routineId}`);
    },
    [router]
  );

  const handleViewAllRoutines = useCallback(() => {
    router.push('/(app)/routines');
  }, [router]);

  const handleCreateRoutine = useCallback(() => {
    router.push('/(app)/routines/new');
  }, [router]);

  const handleModulePress = useCallback(
    (route: string) => {
      router.push(route as any);
    },
    [router]
  );

  if (isLoading) {
    return (
      <SafeAreaView className="flex-1 bg-zinc-950">
        <LoadingDashboard />
      </SafeAreaView>
    );
  }

  if (isError || !viewModel) {
    return (
      <SafeAreaView className="flex-1 bg-zinc-950">
        <ErrorDashboard errorMessage={error?.message} onRetry={() => void refetch()} />
      </SafeAreaView>
    );
  }

  const {
    greeting,
    progress,
    todayRoutines,
    topPendingRoutine,
    stats,
    weekly,
    recentActivities,
    modules,
  } = viewModel;

  return (
    <SafeAreaView className="flex-1 bg-zinc-950">
      <ScrollView
        className="flex-1"
        contentContainerStyle={{ padding: 16, gap: 16 }}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={isRefetching}
            onRefresh={() => void refetch()}
            tintColor="#10b981"
          />
        }
      >
        {/* 1. Header Zone */}
        <DashboardHeader greeting={greeting} />

        {/* 2. Today's Progress Card */}
        <TodayProgressCard progress={progress} />

        {/* 3. Quick Action Banner for Top Pending Routine */}
        {topPendingRoutine ? (
          <QuickActionsBar
            topPendingRoutine={topPendingRoutine}
            onComplete={(id) => void completeRoutine(id)}
            onSkip={(id) => void skipRoutine(id)}
            isActionPending={isActionPending}
          />
        ) : null}

        {/* 4. Today's Routines List */}
        <TodayRoutinesList
          items={todayRoutines}
          onItemPress={handleRoutinePress}
          onViewAllPress={handleViewAllRoutines}
        />

        {/* 5. Onboarding Empty State if 0 active routines */}
        {stats.activeRoutinesCount === 0 ? (
          <EmptyDashboard onCreateRoutine={handleCreateRoutine} />
        ) : null}

        {/* 6. Current Streak Spotlight */}
        {stats.topStreakCount > 0 ? <StreakOverviewCard stats={stats} /> : null}

        {/* 7. Stats Grid */}
        <StatsGrid stats={stats} />

        {/* 8. 7-Day Activity Matrix */}
        <WeeklyProgressCard weekly={weekly} />

        {/* 9. Recent Activity Stream */}
        <RecentActivityCard activities={recentActivities} />

        {/* 10. Health Modules Navigation Portal Grid */}
        <ModuleNavGrid modules={modules} onModulePress={handleModulePress} />

        {/* Bottom padding for tab / scroll view clearance */}
        <View className="h-6" />
      </ScrollView>
    </SafeAreaView>
  );
};
