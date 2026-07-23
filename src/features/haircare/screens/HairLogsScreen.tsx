import React, { useMemo } from 'react';
import { View, ScrollView, RefreshControl, Text, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { useHairLogs } from '../hooks/useHairLogs';
import { useHairRoutines } from '../hooks/useHairRoutines';
import { useHairProducts } from '../hooks/useHairProducts';
import { useRoutines } from '@/features/routine';
import { mapToHairLogVMs } from '../mappers/logs.mapper';
import { HairLogCard, LoadingHaircare, EmptyHaircare, ErrorHaircare } from '../components';

export const HairLogsScreen: React.FC = function HairLogsScreen() {
  const router = useRouter();
  const { logs, isLoading, isRefetching, isError, error, refetch } = useHairLogs();
  const { hairRoutines } = useHairRoutines();
  const { products } = useHairProducts();
  const coreRoutinesState = useRoutines({ type: 'haircare' });
  const coreRoutines = useMemo(() => coreRoutinesState.data ?? [], [coreRoutinesState.data]);

  const logVMs = mapToHairLogVMs(logs, hairRoutines, coreRoutines, products);

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
        <View className="flex-row items-center justify-between">
          <View>
            <TouchableOpacity onPress={() => router.back()} accessibilityRole="button">
              <Text className="text-amber-400 text-xs font-semibold mb-1">← Back to Haircare</Text>
            </TouchableOpacity>
            <Text className="text-zinc-50 text-2xl font-extrabold">Wash Log History</Text>
          </View>
        </View>

        {logVMs.length === 0 ? (
          <EmptyHaircare
            title="No Wash Logs Found"
            message="Your completed wash days and treatment executions will be archived here."
          />
        ) : (
          <View className="gap-3">
            {logVMs.map((log) => (
              <HairLogCard key={log.id} log={log} />
            ))}
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
};
