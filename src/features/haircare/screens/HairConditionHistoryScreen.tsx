import React, { useState, useMemo, useCallback } from 'react';
import { View, ScrollView, RefreshControl, Text, TouchableOpacity, TextInput } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { useHairConditions } from '../hooks/useHairConditions';
import { useDeleteHairCondition } from '../hooks/useDeleteHairCondition';
import { mapToHairConditionVMs, filterConditionVMs } from '../mappers/condition.mapper';
import type { HairConditionVM, ScalpType } from '../types';
import {
  ConditionCard,
  EmptyConditionState,
  LoadingHaircare,
  ErrorHaircare,
} from '../components';

const SCALP_FILTER_OPTIONS: { label: string; value: ScalpType | 'all' }[] = [
  { label: 'All Scalps', value: 'all' },
  { label: 'Dry', value: 'dry' },
  { label: 'Normal', value: 'normal' },
  { label: 'Oily', value: 'oily' },
  { label: 'Combo', value: 'combination' },
  { label: 'Sensitive', value: 'sensitive' },
];

export const HairConditionHistoryScreen: React.FC = function HairConditionHistoryScreen() {
  const router = useRouter();
  const { conditions, isLoading, isRefetching, isError, error, refetch } = useHairConditions();
  const { deleteCondition } = useDeleteHairCondition();

  // Search & Filter State
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedScalp, setSelectedScalp] = useState<ScalpType | 'all'>('all');
  const [dateSort, setDateSort] = useState<'newest' | 'oldest'>('newest');

  const conditionVMs = useMemo(() => mapToHairConditionVMs(conditions), [conditions]);

  const filteredVMs = useMemo(() => {
    return filterConditionVMs(conditionVMs, {
      searchKeyword: searchQuery,
      scalpType: selectedScalp,
      dateSort,
    });
  }, [conditionVMs, searchQuery, selectedScalp, dateSort]);

  const handleCreateNew = useCallback(() => {
    router.push('/(app)/haircare/condition/new');
  }, [router]);

  const handleEdit = useCallback(
    (condition: HairConditionVM) => {
      router.push(`/(app)/haircare/condition/${condition.id}/edit` as any);
    },
    [router]
  );

  const handleDelete = useCallback(
    async (condition: HairConditionVM) => {
      await deleteCondition(condition.id);
    },
    [deleteCondition]
  );

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
            <Text className="text-zinc-50 text-2xl font-extrabold">Health Assessments</Text>
          </View>

          <TouchableOpacity
            className="bg-amber-500 active:bg-amber-600 px-4 py-2.5 rounded-xl shadow-sm"
            onPress={handleCreateNew}
            accessibilityRole="button"
          >
            <Text className="text-zinc-950 font-extrabold text-xs">+ New Log</Text>
          </TouchableOpacity>
        </View>

        {/* Search Input Bar */}
        <View className="gap-1">
          <TextInput
            className="bg-zinc-900 border border-zinc-800 text-zinc-100 p-3 rounded-xl text-xs font-medium focus:border-amber-500"
            placeholder="🔍 Search notes, scalp type, or dates..."
            placeholderTextColor="#71717a"
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
        </View>

        {/* Filter Badges & Sort Toggle */}
        <View className="flex-row items-center justify-between">
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ gap: 6 }}>
            {SCALP_FILTER_OPTIONS.map((opt) => {
              const isSelected = selectedScalp === opt.value;
              return (
                <TouchableOpacity
                  key={opt.value}
                  className={`px-3 py-1.5 rounded-xl border ${
                    isSelected
                      ? 'bg-amber-500/20 border-amber-500'
                      : 'bg-zinc-900 border-zinc-800'
                  }`}
                  onPress={() => setSelectedScalp(opt.value)}
                >
                  <Text
                    className={`text-xs font-bold ${
                      isSelected ? 'text-amber-400' : 'text-zinc-400'
                    }`}
                  >
                    {opt.label}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </ScrollView>

          <TouchableOpacity
            className="bg-zinc-900 border border-zinc-800 px-2.5 py-1.5 rounded-xl ml-2"
            onPress={() => setDateSort((prev) => (prev === 'newest' ? 'oldest' : 'newest'))}
          >
            <Text className="text-amber-400 text-xs font-bold">
              {dateSort === 'newest' ? '↓ Newest' : '↑ Oldest'}
            </Text>
          </TouchableOpacity>
        </View>

        {/* Audit Record Stream */}
        {filteredVMs.length === 0 ? (
          <EmptyConditionState onNewAssessmentPress={handleCreateNew} />
        ) : (
          <View className="gap-3">
            {filteredVMs.map((condition) => (
              <ConditionCard
                key={condition.id}
                condition={condition}
                onEdit={handleEdit}
                onDelete={handleDelete}
              />
            ))}
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
};
