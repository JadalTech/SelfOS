import React from 'react';
import { View, Text, TouchableOpacity, ScrollView, RefreshControl, SafeAreaView } from 'react-native';
import { useRouter } from 'expo-router';
import { useSkincareAnalytics } from '../analytics/hooks/useSkincareAnalytics';
import { StatTile } from '../../../shared/components/cards/StatTile';
import { ErrorStateCard } from '../../../shared/components/feedback/ErrorStateCard';
import { SkeletonLoader } from '../../../shared/components/loaders/SkeletonLoader';

export function SkincareAnalyticsDashboardScreen() {
  const router = useRouter();
  const { analyticsVM, isLoading, isError, error, refetch } = useSkincareAnalytics();

  let trendColor = '#3b82f6';
  let trendLabel = 'Stable';
  if (analyticsVM?.skinHealthScoreTrend === 'improving') {
    trendColor = '#10b981';
    trendLabel = 'Improving ↗';
  } else if (analyticsVM?.skinHealthScoreTrend === 'declining') {
    trendColor = '#f43f5e';
    trendLabel = 'Declining ↘';
  }

  return (
    <SafeAreaView className="flex-1 bg-zinc-950">
      <View className="flex-1 p-4 gap-4">
        {/* Header */}
        <View className="flex-row items-center justify-between border-b border-zinc-800 pb-3">
          <View className="flex-row items-center gap-3">
            <TouchableOpacity onPress={() => router.back()} className="p-1">
              <Text className="text-zinc-400 text-lg font-bold">← Back</Text>
            </TouchableOpacity>
            <Text className="text-zinc-50 text-xl font-extrabold">Skincare Analytics</Text>
          </View>
        </View>

        {isLoading ? (
          <View className="gap-3">
            <SkeletonLoader height={100} />
            <SkeletonLoader height={160} />
          </View>
        ) : isError ? (
          <ErrorStateCard message={error?.message} onRetry={refetch} />
        ) : analyticsVM ? (
          <ScrollView
            contentContainerStyle={{ gap: 16, paddingBottom: 32 }}
            showsVerticalScrollIndicator={false}
            refreshControl={
              <RefreshControl refreshing={isLoading} onRefresh={refetch} tintColor="#ec4899" />
            }
          >
            {/* Stat Tiles */}
            <View className="flex-row gap-3">
              <StatTile
                label="Weekly Completion"
                value={`${analyticsVM.weeklyCompletionRate}%`}
                icon="📊"
                badgeColor="#ec4899"
              />
              <StatTile
                label="Consistency Score"
                value={`${analyticsVM.currentConsistencyScore}%`}
                icon="🎯"
                badgeColor="#10b981"
              />
            </View>

            {/* Health Trend Badge Card */}
            <View className="bg-zinc-900 border border-zinc-800 p-4 rounded-2xl gap-2 shadow-sm">
              <Text className="text-zinc-400 text-xs font-medium">Skin Health Overall Trend</Text>
              <View className="flex-row items-baseline justify-between">
                <Text className="text-zinc-50 text-2xl font-black">
                  Avg {analyticsVM.averageSkinHealthScore} / 10
                </Text>
                <View
                  className="px-3 py-1 rounded-xl border"
                  style={{
                    backgroundColor: `${trendColor}20`,
                    borderColor: `${trendColor}40`,
                  }}
                >
                  <Text className="text-xs font-extrabold" style={{ color: trendColor }}>
                    {trendLabel}
                  </Text>
                </View>
              </View>
            </View>

            {/* Concern Progress Breakdown */}
            {analyticsVM.concernProgress.length > 0 ? (
              <View className="bg-zinc-900 border border-zinc-800 p-4 rounded-2xl gap-3 shadow-sm">
                <Text className="text-zinc-50 text-sm font-bold">Concern Progress Breakdown</Text>
                <View className="gap-2">
                  {analyticsVM.concernProgress.map((item) => (
                    <View
                      key={item.concern}
                      className="bg-zinc-950 p-3 rounded-xl border border-zinc-800/60 flex-row items-center justify-between"
                    >
                      <View>
                        <Text className="text-zinc-200 text-xs font-bold">{item.label}</Text>
                        <Text className="text-zinc-500 text-[10px]">
                          Initial Severity: {item.initialSeverity} → Current: {item.currentSeverity}
                        </Text>
                      </View>

                      <Text
                        className={`text-xs font-extrabold ${
                          item.change > 0
                            ? 'text-emerald-400'
                            : item.change < 0
                            ? 'text-rose-400'
                            : 'text-zinc-400'
                        }`}
                      >
                        {item.change > 0 ? `+${item.change} Impr.` : item.change < 0 ? `${item.change}` : 'Stable'}
                      </Text>
                    </View>
                  ))}
                </View>
              </View>
            ) : null}

            {/* Top Used Products Ranking */}
            {analyticsVM.topUsedProducts.length > 0 ? (
              <View className="bg-zinc-900 border border-zinc-800 p-4 rounded-2xl gap-2 shadow-sm">
                <Text className="text-zinc-50 text-sm font-bold">Top Applied Products</Text>
                <View className="gap-2 mt-1">
                  {analyticsVM.topUsedProducts.map((p, idx) => (
                    <View
                      key={p.productId}
                      className="flex-row items-center justify-between bg-zinc-950 p-2.5 rounded-xl border border-zinc-800/60"
                    >
                      <View className="flex-row items-center gap-2">
                        <View className="w-5 h-5 rounded-full bg-pink-500/20 items-center justify-center">
                          <Text className="text-pink-400 text-[10px] font-bold">#{idx + 1}</Text>
                        </View>
                        <Text className="text-zinc-200 text-xs font-semibold">{p.productName}</Text>
                      </View>
                      <Text className="text-zinc-400 text-xs font-bold">{p.usageCount} uses</Text>
                    </View>
                  ))}
                </View>
              </View>
            ) : null}

            {/* Insights List */}
            {analyticsVM.insights.length > 0 ? (
              <View className="gap-2">
                <Text className="text-zinc-50 text-sm font-bold">Rule-Based Insights</Text>
                {analyticsVM.insights.map((ins) => (
                  <View
                    key={ins.id}
                    className="bg-zinc-900 border border-zinc-800 p-3.5 rounded-2xl gap-1 shadow-sm"
                  >
                    <View className="flex-row items-center justify-between">
                      <Text className="text-pink-400 text-xs font-bold">{ins.title}</Text>
                      <Text className="text-zinc-500 text-[10px]">{ins.category}</Text>
                    </View>
                    <Text className="text-zinc-300 text-xs leading-relaxed">{ins.description}</Text>
                  </View>
                ))}
              </View>
            ) : null}
          </ScrollView>
        ) : null}
      </View>
    </SafeAreaView>
  );
}
