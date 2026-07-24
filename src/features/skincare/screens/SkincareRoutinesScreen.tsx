import React, { useState } from 'react';
import { View, Text, TouchableOpacity, FlatList, SafeAreaView } from 'react-native';
import { useSkincareRoutines } from '../hooks/useSkincareRoutines';
import { useSkincareProducts } from '../hooks/useSkincareProducts';
import { useSkincareLogs } from '../hooks/useSkincareLogs';
import { SkincareRoutineCard } from '../components/SkincareRoutineCard';
import { SkincareRoutineForm } from '../components/SkincareRoutineForm';
import { SkincareLogForm } from '../components/SkincareLogForm';
import { EmptyStateCard } from '../../../shared/components/feedback/EmptyStateCard';
import { ErrorStateCard } from '../../../shared/components/feedback/ErrorStateCard';
import { SkeletonLoader } from '../../../shared/components/loaders/SkeletonLoader';
import type { RoutineTime, SkincareRoutineVM } from '../types';
import type { SkincareRoutineFormValues, SkincareLogFormValues } from '../validation/skincare.validation';

export function SkincareRoutinesScreen() {
  const { routineVMs, isLoading, isError, error, refetch, createRoutine, deleteRoutine, isCreating } =
    useSkincareRoutines();
  const { productVMs } = useSkincareProducts();
  const { logExecution, isLogging } = useSkincareLogs();

  const [selectedTimeFilter, setSelectedTimeFilter] = useState<RoutineTime | 'all'>('all');
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [activeLoggingRoutine, setActiveLoggingRoutine] = useState<SkincareRoutineVM | null>(null);

  const filteredRoutines = routineVMs.filter((r) => {
    if (selectedTimeFilter === 'all') return true;
    return r.timeOfDay === selectedTimeFilter;
  });

  const handleCreateRoutineSubmit = async (values: SkincareRoutineFormValues) => {
    await createRoutine(values);
  };

  const handleLogSubmit = async (values: SkincareLogFormValues) => {
    await logExecution(values);
  };

  return (
    <SafeAreaView className="flex-1 bg-zinc-950">
      <View className="flex-1 p-4 gap-4">
        {/* Top Header */}
        <View className="flex-row items-center justify-between">
          <View>
            <Text className="text-zinc-500 text-[10px] font-bold uppercase tracking-wider">
              Regimens & Sequences
            </Text>
            <Text className="text-zinc-50 text-2xl font-black tracking-tight">
              Skincare Routines
            </Text>
          </View>
          <TouchableOpacity
            activeOpacity={0.8}
            onPress={() => setIsFormOpen(true)}
            className="bg-pink-600 px-3.5 py-2 rounded-xl border border-pink-500/40 shadow-sm"
          >
            <Text className="text-white text-xs font-bold">+ Build Routine</Text>
          </TouchableOpacity>
        </View>

        {/* Time Filters */}
        <View className="flex-row gap-2">
          {[
            { value: 'all', label: 'All Routines' },
            { value: 'morning', label: '☀️ Morning' },
            { value: 'evening', label: '🌙 Evening' },
            { value: 'weekly-special', label: '📅 Weekly' },
          ].map((tab) => {
            const isSelected = selectedTimeFilter === tab.value;
            return (
              <TouchableOpacity
                key={tab.value}
                onPress={() => setSelectedTimeFilter(tab.value as RoutineTime | 'all')}
                className={`px-3 py-1.5 rounded-xl border ${
                  isSelected ? 'bg-pink-500/20 border-pink-500/50' : 'bg-zinc-900 border-zinc-800'
                }`}
              >
                <Text
                  className={`text-xs font-semibold ${
                    isSelected ? 'text-pink-400' : 'text-zinc-400'
                  }`}
                >
                  {tab.label}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>

        {/* Routines List */}
        {isLoading ? (
          <View className="gap-3 mt-2">
            <SkeletonLoader height={140} />
            <SkeletonLoader height={140} />
          </View>
        ) : isError ? (
          <ErrorStateCard message={error?.message} onRetry={refetch} />
        ) : filteredRoutines.length === 0 ? (
          <EmptyStateCard
            icon="✨"
            title="No Skincare Routines Built"
            description="Create ordered morning, evening, or weekly special routines using active products from your vanity."
            actionLabel="+ Build Skincare Routine"
            onAction={() => setIsFormOpen(true)}
          />
        ) : (
          <FlatList
            data={filteredRoutines}
            keyExtractor={(item) => item.id}
            contentContainerStyle={{ gap: 14, paddingBottom: 24 }}
            showsVerticalScrollIndicator={false}
            renderItem={({ item }) => (
              <SkincareRoutineCard
                routine={item}
                onLogExecution={() => setActiveLoggingRoutine(item)}
                onDelete={() =>
                  deleteRoutine({ skincareRoutineId: item.id, coreRoutineId: item.routineId })
                }
              />
            )}
          />
        )}

        {/* Builder Form Modal */}
        <SkincareRoutineForm
          visible={isFormOpen}
          availableProducts={productVMs}
          isSubmitting={isCreating}
          onClose={() => setIsFormOpen(false)}
          onSubmit={handleCreateRoutineSubmit}
        />

        {/* Execution Logging Form Modal */}
        {activeLoggingRoutine ? (
          <SkincareLogForm
            visible={!!activeLoggingRoutine}
            routine={activeLoggingRoutine}
            isSubmitting={isLogging}
            onClose={() => setActiveLoggingRoutine(null)}
            onSubmit={handleLogSubmit}
          />
        ) : null}
      </View>
    </SafeAreaView>
  );
}
