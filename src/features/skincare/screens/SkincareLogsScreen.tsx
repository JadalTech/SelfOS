import React from 'react';
import { View, Text, FlatList, RefreshControl, SafeAreaView } from 'react-native';
import { useSkincareLogs } from '../hooks/useSkincareLogs';
import { SkincareLogCard } from '../components/SkincareLogCard';
import { EmptyStateCard } from '../../../shared/components/feedback/EmptyStateCard';
import { ErrorStateCard } from '../../../shared/components/feedback/ErrorStateCard';
import { SkeletonLoader } from '../../../shared/components/loaders/SkeletonLoader';

export function SkincareLogsScreen() {
  const { logVMs, isLoading, isError, error, refetch } = useSkincareLogs();

  return (
    <SafeAreaView className="flex-1 bg-zinc-950">
      <View className="flex-1 p-4 gap-4">
        {/* Top Header */}
        <View>
          <Text className="text-zinc-500 text-[10px] font-bold uppercase tracking-wider">
            Audit Trail & History
          </Text>
          <Text className="text-zinc-50 text-2xl font-black tracking-tight">
            Execution Logs
          </Text>
        </View>

        {/* Logs List */}
        {isLoading ? (
          <View className="gap-3 mt-2">
            <SkeletonLoader height={90} />
            <SkeletonLoader height={90} />
            <SkeletonLoader height={90} />
          </View>
        ) : isError ? (
          <ErrorStateCard message={error?.message} onRetry={refetch} />
        ) : logVMs.length === 0 ? (
          <EmptyStateCard
            icon="📝"
            title="No Execution Logs Yet"
            description="Complete morning or evening routines to build your skincare compliance history."
          />
        ) : (
          <FlatList
            data={logVMs}
            keyExtractor={(item) => item.id}
            contentContainerStyle={{ gap: 10, paddingBottom: 24 }}
            showsVerticalScrollIndicator={false}
            refreshControl={
              <RefreshControl refreshing={isLoading} onRefresh={refetch} tintColor="#ec4899" />
            }
            renderItem={({ item }) => <SkincareLogCard log={item} />}
          />
        )}
      </View>
    </SafeAreaView>
  );
}
