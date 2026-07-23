import React from 'react';
import { View, ScrollView, RefreshControl, Text, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { useHairAnalytics } from '../hooks/useHairAnalytics';
import { InsightCard } from '../components/InsightCard';
import { CompletionBarChart } from '../components/CompletionBarChart';
import { ConditionTrendChart } from '../components/ConditionTrendChart';
import { ProductUsageChart } from '../components/ProductUsageChart';
import { LoadingHaircare, ErrorHaircare } from '../../components';

export const HairAnalyticsDashboardScreen: React.FC = function HairAnalyticsDashboardScreen() {
  const router = useRouter();
  const { viewModel, isLoading, isRefetching, isError, error, refetch } = useHairAnalytics();

  if (isLoading) {
    return (
      <SafeAreaView className="flex-1 bg-zinc-950">
        <LoadingHaircare />
      </SafeAreaView>
    );
  }

  if (isError) {
    return (
      <SafeAreaView className="flex-1 bg-zinc-950">
        <ErrorHaircare errorMessage={error?.message} onRetry={() => void refetch()} />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView className="flex-1 bg-zinc-950">
      <ScrollView
        className="flex-1"
        contentContainerStyle={{ padding: 16, gap: 16 }}
        refreshControl={
          <RefreshControl
            refreshing={isRefetching}
            onRefresh={() => void refetch()}
            tintColor="#f59e0b"
          />
        }
      >
        {/* Header */}
        <View className="flex-row items-center justify-between">
          <View>
            <TouchableOpacity onPress={() => router.back()} accessibilityRole="button">
              <Text className="text-amber-400 text-xs font-semibold mb-1">← Back to Haircare</Text>
            </TouchableOpacity>
            <Text className="text-zinc-50 text-2xl font-extrabold">Haircare Analytics</Text>
          </View>

          <View className="bg-zinc-900 border border-zinc-800 px-3 py-1.5 rounded-xl">
            <Text className="text-amber-400 text-xs font-bold">Live Data</Text>
          </View>
        </View>

        {/* Insight Cards Stream */}
        <View className="gap-2">
          <Text className="text-zinc-400 text-xs font-semibold uppercase tracking-wider">
            Milestones & Key Metrics
          </Text>
          <View className="flex-row flex-wrap gap-3">
            {viewModel.insights.map((card) => (
              <InsightCard key={card.id} card={card} />
            ))}
          </View>
        </View>

        {/* Weekly Completion Bar Chart */}
        <CompletionBarChart weekly={viewModel.weekly} />

        {/* Scalp Health Condition Trend */}
        <ConditionTrendChart trend={viewModel.conditionTrend} />

        {/* Product Usage Ranking */}
        <ProductUsageChart productUsage={viewModel.productUsage} />
      </ScrollView>
    </SafeAreaView>
  );
};
