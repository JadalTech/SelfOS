import React from 'react';
import { View, Text, TouchableOpacity, ScrollView, RefreshControl, SafeAreaView, Image } from 'react-native';
import { useRouter } from 'expo-router';
import { useSkincareDashboard } from '../hooks/useSkincareDashboard';
import { SkincareHeader } from '../components/SkincareHeader';
import { StatTile } from '../../../shared/components/cards/StatTile';
import { ErrorStateCard } from '../../../shared/components/feedback/ErrorStateCard';
import { SkeletonLoader } from '../../../shared/components/loaders/SkeletonLoader';

export function SkincareDashboardScreen() {
  const router = useRouter();
  const { dashboardVM, isLoading, isError, error, refetch } = useSkincareDashboard();

  return (
    <SafeAreaView className="flex-1 bg-zinc-950">
      <ScrollView
        contentContainerStyle={{ padding: 16, gap: 16, paddingBottom: 32 }}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={isLoading} onRefresh={refetch} tintColor="#ec4899" />
        }
      >
        {/* Skincare Module Header */}
        <SkincareHeader
          activeProductsCount={dashboardVM?.totalProductsCount ?? 0}
          activeRoutinesCount={dashboardVM?.activeRoutinesCount ?? 0}
          latestHealthScore={dashboardVM?.latestAssessment?.overallHealthScore}
          onOpenProducts={() => router.push('/(app)/skincare/products')}
          onOpenRoutines={() => router.push('/(app)/skincare/routines')}
          onOpenTimeline={() => router.push('/(app)/skincare/timeline')}
          onOpenAnalytics={() => router.push('/(app)/skincare/analytics')}
          onOpenAssessments={() => router.push('/(app)/skincare/assessment')}
        />

        {isLoading ? (
          <View className="gap-3">
            <SkeletonLoader height={100} />
            <SkeletonLoader height={100} />
          </View>
        ) : isError ? (
          <ErrorStateCard message={error?.message} onRetry={refetch} />
        ) : dashboardVM ? (
          <>
            {/* Today's AM/PM Status Card */}
            <View className="bg-zinc-900 border border-zinc-800 p-4 rounded-2xl gap-3 shadow-sm">
              <Text className="text-zinc-50 text-base font-bold">Today&apos;s Regimen Progress</Text>

              <View className="flex-row gap-3">
                <TouchableOpacity
                  activeOpacity={0.8}
                  onPress={() => router.push('/(app)/skincare/routines')}
                  className={`flex-1 p-3.5 rounded-xl border flex-row items-center justify-between ${
                    dashboardVM.todayLogStatus.morningCompleted
                      ? 'bg-emerald-500/10 border-emerald-500/40'
                      : 'bg-zinc-950 border-zinc-800'
                  }`}
                >
                  <View>
                    <Text className="text-zinc-200 text-xs font-bold">☀️ Morning Routine</Text>
                    <Text
                      className={`text-[10px] font-semibold mt-0.5 ${
                        dashboardVM.todayLogStatus.morningCompleted
                          ? 'text-emerald-400'
                          : 'text-zinc-500'
                      }`}
                    >
                      {dashboardVM.todayLogStatus.morningCompleted ? 'Logged' : 'Not Logged'}
                    </Text>
                  </View>
                  <Text className="text-base">
                    {dashboardVM.todayLogStatus.morningCompleted ? '✅' : '⏳'}
                  </Text>
                </TouchableOpacity>

                <TouchableOpacity
                  activeOpacity={0.8}
                  onPress={() => router.push('/(app)/skincare/routines')}
                  className={`flex-1 p-3.5 rounded-xl border flex-row items-center justify-between ${
                    dashboardVM.todayLogStatus.eveningCompleted
                      ? 'bg-emerald-500/10 border-emerald-500/40'
                      : 'bg-zinc-950 border-zinc-800'
                  }`}
                >
                  <View>
                    <Text className="text-zinc-200 text-xs font-bold">🌙 Evening Routine</Text>
                    <Text
                      className={`text-[10px] font-semibold mt-0.5 ${
                        dashboardVM.todayLogStatus.eveningCompleted
                          ? 'text-emerald-400'
                          : 'text-zinc-500'
                      }`}
                    >
                      {dashboardVM.todayLogStatus.eveningCompleted ? 'Logged' : 'Not Logged'}
                    </Text>
                  </View>
                  <Text className="text-base">
                    {dashboardVM.todayLogStatus.eveningCompleted ? '✅' : '⏳'}
                  </Text>
                </TouchableOpacity>
              </View>
            </View>

            {/* Stat Tiles Row */}
            <View className="flex-row gap-3">
              <StatTile
                label="Weekly Score"
                value={`${dashboardVM.weeklyCompletionRate}%`}
                icon="📊"
                badgeColor="#ec4899"
                onPress={() => router.push('/(app)/skincare/analytics')}
              />
              <StatTile
                label="Expiring Soon"
                value={dashboardVM.expiringProductsCount}
                icon="⚠️"
                badgeColor="#f59e0b"
                onPress={() => router.push('/(app)/skincare/products')}
              />
            </View>

            {/* Latest Assessment Summary */}
            {dashboardVM.latestAssessment ? (
              <View className="bg-zinc-900 border border-zinc-800 p-4 rounded-2xl gap-2 shadow-sm">
                <View className="flex-row items-center justify-between">
                  <Text className="text-zinc-50 text-sm font-bold">Latest Skin Health Check</Text>
                  <TouchableOpacity onPress={() => router.push('/(app)/skincare/assessment')}>
                    <Text className="text-pink-400 text-xs font-semibold">History →</Text>
                  </TouchableOpacity>
                </View>

                <View className="flex-row items-center justify-between bg-zinc-950 p-3 rounded-xl border border-zinc-800/60">
                  <View>
                    <Text className="text-zinc-400 text-xs font-medium">
                      Date: {dashboardVM.latestAssessment.recordDateFormatted}
                    </Text>
                    <Text className="text-zinc-500 text-[11px]">
                      Type: {dashboardVM.latestAssessment.skinTypeLabel}
                    </Text>
                  </View>
                  <View className="bg-pink-500/20 px-3 py-1 rounded-xl border border-pink-500/40">
                    <Text className="text-pink-400 font-extrabold text-sm">
                      {dashboardVM.latestAssessment.overallHealthScore}/10
                    </Text>
                  </View>
                </View>
              </View>
            ) : null}

            {/* Recent Progress Photo Preview */}
            {dashboardVM.recentPhotoUrl ? (
              <View className="bg-zinc-900 border border-zinc-800 p-4 rounded-2xl gap-3 shadow-sm">
                <View className="flex-row items-center justify-between">
                  <Text className="text-zinc-50 text-sm font-bold">Recent Progress Photo</Text>
                  <TouchableOpacity onPress={() => router.push('/(app)/skincare/timeline')}>
                    <Text className="text-cyan-400 text-xs font-semibold">View Gallery →</Text>
                  </TouchableOpacity>
                </View>

                <View className="h-36 bg-zinc-950 rounded-xl overflow-hidden border border-zinc-800">
                  <Image source={{ uri: dashboardVM.recentPhotoUrl }} className="w-full h-full" resizeMode="cover" />
                </View>
              </View>
            ) : null}
          </>
        ) : null}
      </ScrollView>
    </SafeAreaView>
  );
}
