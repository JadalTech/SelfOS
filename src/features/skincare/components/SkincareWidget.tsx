import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { useSkincareDashboard } from '../hooks/useSkincareDashboard';
import { SkeletonLoader } from '../../../shared/components/loaders/SkeletonLoader';

export const SkincareWidget: React.FC = React.memo(function SkincareWidget() {
  const router = useRouter();
  const { dashboardVM, isLoading } = useSkincareDashboard();

  if (isLoading || !dashboardVM) {
    return <SkeletonLoader height={140} borderRadius={16} />;
  }

  return (
    <View className="bg-zinc-900 border border-zinc-800 p-4 rounded-2xl gap-3 shadow-md">
      <View className="flex-row items-center justify-between">
        <View className="flex-row items-center gap-2">
          <View className="w-8 h-8 rounded-xl bg-pink-500/10 border border-pink-500/30 items-center justify-center">
            <Text className="text-base">✨</Text>
          </View>
          <View>
            <Text className="text-zinc-50 text-sm font-bold">Skincare Regimen</Text>
            <Text className="text-zinc-500 text-[10px]">
              {dashboardVM.activeRoutinesCount} Routines • {dashboardVM.totalProductsCount} Products
            </Text>
          </View>
        </View>

        <TouchableOpacity
          onPress={() => router.push('/(app)/skincare')}
          className="bg-zinc-950 px-2.5 py-1 rounded-xl border border-zinc-800"
        >
          <Text className="text-pink-400 text-xs font-semibold">Open Engine →</Text>
        </TouchableOpacity>
      </View>

      {/* AM / PM Status Pills */}
      <View className="flex-row gap-2 bg-zinc-950 p-2.5 rounded-xl border border-zinc-800/60">
        <View className="flex-1 flex-row items-center justify-between">
          <Text className="text-zinc-400 text-xs font-medium">☀️ Morning</Text>
          <Text
            className={`text-xs font-bold ${
              dashboardVM.todayLogStatus.morningCompleted ? 'text-emerald-400' : 'text-zinc-500'
            }`}
          >
            {dashboardVM.todayLogStatus.morningCompleted ? '✓ Completed' : 'Pending'}
          </Text>
        </View>

        <View className="w-[1px] bg-zinc-800" />

        <View className="flex-1 flex-row items-center justify-between">
          <Text className="text-zinc-400 text-xs font-medium">🌙 Evening</Text>
          <Text
            className={`text-xs font-bold ${
              dashboardVM.todayLogStatus.eveningCompleted ? 'text-emerald-400' : 'text-zinc-500'
            }`}
          >
            {dashboardVM.todayLogStatus.eveningCompleted ? '✓ Completed' : 'Pending'}
          </Text>
        </View>
      </View>

      {/* Health Score & Alerts */}
      <View className="flex-row items-center justify-between">
        <Text className="text-zinc-400 text-xs">
          Weekly Rate: <Text className="text-pink-400 font-bold">{dashboardVM.weeklyCompletionRate}%</Text>
        </Text>

        {dashboardVM.latestAssessment ? (
          <Text className="text-zinc-400 text-xs">
            Health Score:{' '}
            <Text className="text-emerald-400 font-bold">
              {dashboardVM.latestAssessment.overallHealthScore}/10
            </Text>
          </Text>
        ) : null}
      </View>
    </View>
  );
});
