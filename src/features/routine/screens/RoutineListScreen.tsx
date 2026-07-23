import React, { useState, useMemo, useCallback } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  FlatList,
  RefreshControl,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { useRoutines } from '../hooks/useRoutines';
import type { Routine, RoutineType, RoutineStatus } from '../types';
import {
  RoutineCard,
  LoadingRoutineCard,
  EmptyRoutineState,
} from '../components';

type SortOption = 'streak-desc' | 'name-asc' | 'created-desc';

const CATEGORY_FILTERS: { label: string; value: RoutineType | 'all' | 'archived' }[] = [
  { label: 'All Active', value: 'all' },
  { label: 'Haircare', value: 'haircare' },
  { label: 'Skincare', value: 'skincare' },
  { label: 'Water', value: 'water' },
  { label: 'Gym', value: 'gym' },
  { label: 'Nutrition', value: 'nutrition' },
  { label: 'Meds', value: 'medication' },
  { label: 'Archived', value: 'archived' },
];

export const RoutineListScreen: React.FC = function RoutineListScreen() {
  const router = useRouter();

  // Local state for search query, category filter, and sorting
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedFilter, setSelectedFilter] = useState<RoutineType | 'all' | 'archived'>('all');
  const [sortBy, setSortBy] = useState<SortOption>('streak-desc');

  // Query configuration based on active vs archived
  const statusFilter: RoutineStatus | undefined =
    selectedFilter === 'archived' ? 'archived' : undefined;
  const typeFilter: RoutineType | undefined =
    selectedFilter !== 'all' && selectedFilter !== 'archived'
      ? (selectedFilter as RoutineType)
      : undefined;

  const {
    data: routines = [],
    isLoading,
    isRefetching,
    refetch,
    isError,
    error,
  } = useRoutines({
    status: statusFilter,
    type: typeFilter,
  });

  // Local search & sort on cached query data
  const filteredAndSortedRoutines = useMemo(() => {
    let result = [...routines];

    // Filter by search query
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      result = result.filter(
        (r) =>
          r.title.toLowerCase().includes(q) ||
          (r.description && r.description.toLowerCase().includes(q))
      );
    }

    // Sort
    result.sort((a, b) => {
      if (sortBy === 'streak-desc') {
        return b.currentStreak - a.currentStreak;
      }
      if (sortBy === 'name-asc') {
        return a.title.localeCompare(b.title);
      }
      if (sortBy === 'created-desc') {
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      }
      return 0;
    });

    return result;
  }, [routines, searchQuery, sortBy]);

  const handleRoutinePress = useCallback(
    (routineId: string) => {
      router.push(`/(app)/routines/${routineId}`);
    },
    [router]
  );

  const handleCreatePress = useCallback(() => {
    router.push('/(app)/routines/new');
  }, [router]);

  const renderItem = useCallback(
    ({ item }: { item: Routine }) => (
      <RoutineCard routine={item} onPress={handleRoutinePress} />
    ),
    [handleRoutinePress]
  );

  const keyExtractor = useCallback((item: Routine) => item.id, []);

  return (
    <SafeAreaView className="flex-1 bg-zinc-950 px-4 pt-2">
      {/* Header Bar */}
      <View className="flex-row items-center justify-between pb-3">
        <View>
          <Text className="text-zinc-500 text-xs font-semibold uppercase tracking-wider">
            SelfOS Foundation
          </Text>
          <Text className="text-zinc-50 text-2xl font-extrabold tracking-tight">
            My Routines
          </Text>
        </View>

        <TouchableOpacity
          className="bg-emerald-500 active:bg-emerald-600 px-4 py-2.5 rounded-xl flex-row items-center gap-1 shadow-md shadow-emerald-500/20"
          onPress={handleCreatePress}
          accessibilityRole="button"
          accessibilityLabel="Create new routine"
        >
          <Text className="text-zinc-950 text-lg font-bold lead-none">+</Text>
          <Text className="text-zinc-950 font-bold text-sm">New</Text>
        </TouchableOpacity>
      </View>

      {/* Search Input */}
      <View className="mb-3">
        <TextInput
          className="bg-zinc-900 border border-zinc-800 rounded-xl px-4 py-2.5 text-zinc-100 text-sm"
          placeholder="Search routines by name or notes..."
          placeholderTextColor="#71717a"
          value={searchQuery}
          onChangeText={setSearchQuery}
          clearButtonMode="while-editing"
        />
      </View>

      {/* Category Filter Pills Bar */}
      <View className="mb-3">
        <FlatList
          horizontal
          showsHorizontalScrollIndicator={false}
          data={CATEGORY_FILTERS}
          keyExtractor={(item) => item.value}
          contentContainerStyle={{ gap: 8 }}
          renderItem={({ item }) => {
            const isSelected = selectedFilter === item.value;
            return (
              <TouchableOpacity
                className={`px-3 py-1.5 rounded-xl border ${
                  isSelected
                    ? 'bg-emerald-500/10 border-emerald-500'
                    : 'bg-zinc-900 border-zinc-800'
                }`}
                onPress={() => setSelectedFilter(item.value)}
              >
                <Text
                  className={`text-xs font-semibold ${
                    isSelected ? 'text-emerald-400' : 'text-zinc-400'
                  }`}
                >
                  {item.label}
                </Text>
              </TouchableOpacity>
            );
          }}
        />
      </View>

      {/* Sort Options Bar */}
      <View className="flex-row items-center justify-between pb-2 border-b border-zinc-900 mb-2">
        <Text className="text-zinc-500 text-xs font-medium">
          Showing {filteredAndSortedRoutines.length} routine(s)
        </Text>

        <View className="flex-row items-center gap-2">
          <Text className="text-zinc-500 text-xs">Sort:</Text>
          <TouchableOpacity
            onPress={() =>
              setSortBy((prev) =>
                prev === 'streak-desc'
                  ? 'name-asc'
                  : prev === 'name-asc'
                  ? 'created-desc'
                  : 'streak-desc'
              )
            }
          >
            <Text className="text-zinc-300 text-xs font-semibold capitalize">
              {sortBy === 'streak-desc'
                ? 'Streak 🔥'
                : sortBy === 'name-asc'
                ? 'Name A-Z'
                : 'Newest'}
            </Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Main Routines List */}
      {isLoading ? (
        <View className="py-2">
          <LoadingRoutineCard />
          <LoadingRoutineCard />
          <LoadingRoutineCard />
        </View>
      ) : isError ? (
        <View className="flex-1 items-center justify-center p-6 gap-3">
          <Text className="text-rose-500 text-base font-bold">Failed to load routines</Text>
          <Text className="text-zinc-400 text-xs text-center">{error?.message}</Text>
          <TouchableOpacity
            className="px-4 py-2 rounded-xl bg-zinc-800"
            onPress={() => void refetch()}
          >
            <Text className="text-zinc-200 text-xs font-semibold">Retry</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <FlatList
          data={filteredAndSortedRoutines}
          keyExtractor={keyExtractor}
          renderItem={renderItem}
          contentContainerStyle={{ paddingBottom: 24 }}
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl
              refreshing={isRefetching}
              onRefresh={() => void refetch()}
              tintColor="#10b981"
            />
          }
          ListEmptyComponent={
            <EmptyRoutineState
              title={searchQuery ? 'No Matching Routines' : 'No Routines Found'}
              message={
                searchQuery
                  ? `No routines match "${searchQuery}". Try adjusting your search term.`
                  : 'Get started by creating your first routine foundation.'
              }
              onAction={searchQuery ? () => setSearchQuery('') : handleCreatePress}
              actionLabel={searchQuery ? 'Clear Search' : 'Create New Routine'}
            />
          }
        />
      )}
    </SafeAreaView>
  );
};
