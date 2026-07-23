import React, { useCallback, useState } from 'react';
import { View, ScrollView, RefreshControl, Text, TouchableOpacity, Modal } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { useHaircareDashboard } from '../hooks/useHaircareDashboard';
import { useHairProducts } from '../hooks/useHairProducts';
import { useHairTimeline } from '../hooks/useHairTimeline';
import { useLatestHairCondition } from '../hooks/useLatestHairCondition';
import { useHairAnalytics, AnalyticsSummaryWidget } from '../analytics';
import { useHairRecommendations, AICoachCard } from '../ai';
import { mapToHairProductVMs } from '../mappers/products.mapper';
import type { HairRoutineVM, HairProductVM, HairLogVM } from '../types';
import {
  HaircareHeader,
  HairRoutineCard,
  ProductCard,
  HairLogCard,
  HairLogForm,
  PhotoCard,
  ConditionSummaryCard,
  LoadingHaircare,
  ErrorHaircare,
  EmptyHaircare,
} from '../components';

export const HaircareDashboardScreen: React.FC = function HaircareDashboardScreen() {
  const router = useRouter();
  const {
    viewModel,
    isLoading,
    isRefetching,
    isError,
    error,
    refetch,
    logExecution,
    isActionPending,
  } = useHaircareDashboard();

  const { products } = useHairProducts();
  const { latestPhoto, totalPhotosCount } = useHairTimeline();
  const { latestCondition } = useLatestHairCondition();
  const { viewModel: analyticsVM } = useHairAnalytics();
  const { topRecommendation } = useHairRecommendations();

  const [selectedRoutineForLog, setSelectedRoutineForLog] = useState<string | null>(null);

  const handleOpenProducts = useCallback(() => {
    router.push('/(app)/haircare/products');
  }, [router]);

  const handleOpenRoutines = useCallback(() => {
    router.push('/(app)/haircare/routines');
  }, [router]);

  const handleOpenTimeline = useCallback(() => {
    router.push('/(app)/haircare/timeline');
  }, [router]);

  const handleOpenConditionHistory = useCallback(() => {
    router.push('/(app)/haircare/condition');
  }, [router]);

  const handleNewAssessment = useCallback(() => {
    router.push('/(app)/haircare/condition/new');
  }, [router]);

  const handleOpenAnalytics = useCallback(() => {
    router.push('/(app)/haircare/analytics');
  }, [router]);

  const handleOpenCoach = useCallback(() => {
    router.push('/(app)/haircare/coach');
  }, [router]);

  const handleOpenLogs = useCallback(() => {
    router.push('/(app)/haircare/logs');
  }, [router]);

  const handleLogRoutinePress = useCallback((routineId: string) => {
    setSelectedRoutineForLog(routineId);
  }, []);

  const handleCloseLogModal = useCallback(() => {
    setSelectedRoutineForLog(null);
  }, []);

  if (isLoading) {
    return (
      <SafeAreaView className="flex-1 bg-zinc-950">
        <LoadingHaircare />
      </SafeAreaView>
    );
  }

  if (isError || !viewModel) {
    return (
      <SafeAreaView className="flex-1 bg-zinc-950">
        <ErrorHaircare errorMessage={error?.message} onRetry={() => void refetch()} />
      </SafeAreaView>
    );
  }

  const {
    upcomingWashDay,
    activeRoutines,
    favoriteProducts,
    recentLogs,
    activeProductsCount,
    completedWashDaysCount,
  } = viewModel;

  const targetRoutineForLog = activeRoutines.find((r: HairRoutineVM) => r.id === selectedRoutineForLog);

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
            tintColor="#f59e0b"
          />
        }
      >
        {/* Header */}
        <HaircareHeader
          activeProductsCount={activeProductsCount}
          completedWashDaysCount={completedWashDaysCount}
          photosCount={totalPhotosCount}
          onOpenProducts={handleOpenProducts}
          onOpenRoutines={handleOpenRoutines}
          onOpenTimeline={handleOpenTimeline}
          onOpenAnalytics={handleOpenAnalytics}
          onOpenCoach={handleOpenCoach}
        />

        {/* AI Hair Coach Widget */}
        <AICoachCard
          topRecommendation={topRecommendation}
          onOpenCoach={handleOpenCoach}
        />

        {/* Analytics Summary Widget */}
        <AnalyticsSummaryWidget
          analytics={analyticsVM}
          onOpenAnalytics={handleOpenAnalytics}
        />

        {/* Scalp & Hair Condition Assessment Summary */}
        <ConditionSummaryCard
          latestCondition={latestCondition}
          onOpenHistory={handleOpenConditionHistory}
          onNewAssessment={handleNewAssessment}
        />

        {/* Progress Photo Timeline Preview */}
        <View className="gap-2 bg-zinc-900 border border-zinc-800 p-4 rounded-2xl">
          <View className="flex-row items-center justify-between">
            <Text className="text-zinc-400 text-xs font-semibold uppercase tracking-wider">
              Hair Growth Timeline
            </Text>
            <TouchableOpacity onPress={handleOpenTimeline} accessibilityRole="button">
              <Text className="text-amber-400 text-xs font-semibold">View Gallery ({totalPhotosCount}) →</Text>
            </TouchableOpacity>
          </View>

          {latestPhoto ? (
            <View className="w-40 pt-1">
              <PhotoCard photo={latestPhoto} onPress={handleOpenTimeline} />
            </View>
          ) : (
            <TouchableOpacity
              className="bg-zinc-950 border border-dashed border-zinc-800 p-3 rounded-xl items-center"
              onPress={handleOpenTimeline}
            >
              <Text className="text-amber-400 text-xs font-bold">+ Upload First Progress Photo</Text>
            </TouchableOpacity>
          )}
        </View>

        {/* Upcoming Wash Day Spotlight */}
        {upcomingWashDay ? (
          <View className="gap-2">
            <Text className="text-zinc-400 text-xs font-semibold uppercase tracking-wider">
              Up Next Wash Day
            </Text>
            <HairRoutineCard routine={upcomingWashDay} onLogPress={handleLogRoutinePress} />
          </View>
        ) : null}

        {/* Active Hair Routines */}
        <View className="gap-3">
          <View className="flex-row items-center justify-between">
            <Text className="text-zinc-400 text-xs font-semibold uppercase tracking-wider">
              Hair Routines ({activeRoutines.length})
            </Text>
            <TouchableOpacity onPress={handleOpenRoutines} accessibilityRole="button">
              <Text className="text-amber-400 text-xs font-semibold">Manage Routines →</Text>
            </TouchableOpacity>
          </View>

          {activeRoutines.length === 0 ? (
            <EmptyHaircare
              title="No Hair Routines Yet"
              message="Create your first wash day or deep conditioning schedule to start tracking."
              actionLabel="+ Create Hair Routine"
              onAction={handleOpenRoutines}
            />
          ) : (
            <View className="gap-3">
              {activeRoutines.map((routine: HairRoutineVM) => (
                <HairRoutineCard
                  key={routine.id}
                  routine={routine}
                  onLogPress={handleLogRoutinePress}
                />
              ))}
            </View>
          )}
        </View>

        {/* Favorite Products Section */}
        {favoriteProducts.length > 0 ? (
          <View className="gap-3">
            <View className="flex-row items-center justify-between">
              <Text className="text-zinc-400 text-xs font-semibold uppercase tracking-wider">
                Favorite Products ({favoriteProducts.length})
              </Text>
              <TouchableOpacity onPress={handleOpenProducts} accessibilityRole="button">
                <Text className="text-amber-400 text-xs font-semibold">Products Catalog →</Text>
              </TouchableOpacity>
            </View>

            <View className="gap-2">
              {favoriteProducts.map((product: HairProductVM) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </View>
          </View>
        ) : null}

        {/* Recent Wash Logs Stream */}
        <View className="gap-3">
          <View className="flex-row items-center justify-between">
            <Text className="text-zinc-400 text-xs font-semibold uppercase tracking-wider">
              Recent Wash Logs ({recentLogs.length})
            </Text>
            <TouchableOpacity onPress={handleOpenLogs} accessibilityRole="button">
              <Text className="text-amber-400 text-xs font-semibold">View Log History →</Text>
            </TouchableOpacity>
          </View>

          {recentLogs.length === 0 ? (
            <Text className="text-zinc-500 text-xs py-3 text-center">
              No wash day logs recorded yet.
            </Text>
          ) : (
            <View className="gap-2">
              {recentLogs.map((log: HairLogVM) => (
                <HairLogCard key={log.id} log={log} />
              ))}
            </View>
          )}
        </View>
      </ScrollView>

      {/* Log Execution Modal */}
      <Modal
        visible={Boolean(selectedRoutineForLog)}
        animationType="slide"
        transparent
        onRequestClose={handleCloseLogModal}
      >
        <View className="flex-1 bg-black/80 justify-end p-4">
          {targetRoutineForLog ? (
            <View className="gap-2">
              <TouchableOpacity
                className="self-end p-2 bg-zinc-800 rounded-full"
                onPress={handleCloseLogModal}
              >
                <Text className="text-zinc-400 text-xs font-bold">✕ Close</Text>
              </TouchableOpacity>

              <HairLogForm
                routine={targetRoutineForLog}
                availableProducts={mapToHairProductVMs(products)}
                isSubmitting={isActionPending}
                onSubmit={async (vals) => {
                  await logExecution({
                    hairRoutineId: targetRoutineForLog.id,
                    coreRoutineId: targetRoutineForLog.routineId,
                    dateStr: new Date().toISOString().split('T')[0],
                    appliedProductIds: vals.appliedProductIds,
                    notes: vals.notes,
                  });
                  handleCloseLogModal();
                }}
              />
            </View>
          ) : null}
        </View>
      </Modal>
    </SafeAreaView>
  );
};
