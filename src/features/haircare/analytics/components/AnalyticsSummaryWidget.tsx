import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import type { HairAnalyticsVM } from '../types/analytics.types';

interface AnalyticsSummaryWidgetProps {
  readonly analytics: HairAnalyticsVM;
  readonly onOpenAnalytics: () => void;
}

export const AnalyticsSummaryWidget: React.FC<AnalyticsSummaryWidgetProps> = React.memo(
  function AnalyticsSummaryWidget({ analytics, onOpenAnalytics }) {
    return (
      <View className="bg-zinc-900 border border-zinc-800 p-4 rounded-2xl gap-3 shadow-md">
        <View className="flex-row items-center justify-between">
          <View className="flex-row items-center gap-2">
            <Text className="text-xl">📊</Text>
            <Text className="text-zinc-400 text-xs font-semibold uppercase tracking-wider">
              Haircare Insights & Analytics
            </Text>
          </View>

          <TouchableOpacity onPress={onOpenAnalytics} accessibilityRole="button">
            <Text className="text-amber-400 text-xs font-semibold">View Dashboard →</Text>
          </TouchableOpacity>
        </View>

        {/* 3 Metric Tiles */}
        <View className="flex-row gap-2 pt-1">
          <View className="flex-1 bg-zinc-950/80 border border-zinc-800/80 p-3 rounded-xl items-center">
            <Text className="text-amber-400 text-lg font-black">{analytics.weekly.completionRate}%</Text>
            <Text className="text-zinc-400 text-[10px] font-medium text-center">Weekly Rate</Text>
          </View>

          <View className="flex-1 bg-zinc-950/80 border border-zinc-800/80 p-3 rounded-xl items-center">
            <Text className="text-amber-400 text-lg font-black">Every {analytics.monthly.avgWashIntervalDays || 3}d</Text>
            <Text className="text-zinc-400 text-[10px] font-medium text-center">Wash Interval</Text>
          </View>

          <View className="flex-1 bg-zinc-950/80 border border-zinc-800/80 p-3 rounded-xl items-center">
            <Text className="text-emerald-400 text-lg font-black">{analytics.conditionTrend.avgOverallHealth}/10</Text>
            <Text className="text-zinc-400 text-[10px] font-medium text-center">Scalp Health</Text>
          </View>
        </View>
      </View>
    );
  }
);
