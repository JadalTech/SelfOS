import React, { useState, useCallback, useMemo } from 'react';
import { View, ScrollView, RefreshControl, Text, TouchableOpacity, Modal } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { useHairRoutines } from '../hooks/useHairRoutines';
import { useHairProducts } from '../hooks/useHairProducts';
import { useRoutines } from '@/features/routine';
import { mapToHairRoutineVMs } from '../mappers/routines.mapper';
import { mapToHairProductVMs } from '../mappers/products.mapper';
import { HairRoutineCard, HairRoutineForm, LoadingHaircare, EmptyHaircare, ErrorHaircare } from '../components';

export const HairRoutinesScreen: React.FC = function HairRoutinesScreen() {
  const router = useRouter();
  const {
    hairRoutines,
    isLoading,
    isRefetching,
    isError,
    error,
    refetch,
    createHairRoutine,
    deleteHairRoutine,
    isMutating,
  } = useHairRoutines();

  const { products } = useHairProducts();
  const coreRoutinesState = useRoutines({ type: 'haircare' });
  const coreRoutines = useMemo(() => coreRoutinesState.data ?? [], [coreRoutinesState.data]);

  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  const productVMs = mapToHairProductVMs(products);
  const routineVMs = mapToHairRoutineVMs(hairRoutines, coreRoutines, products);

  const handleDelete = useCallback(
    async (id: string, routineId: string) => {
      await deleteHairRoutine({ id, coreRoutineId: routineId });
    },
    [deleteHairRoutine]
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
        <View className="flex-row items-center justify-between">
          <View>
            <TouchableOpacity onPress={() => router.back()} accessibilityRole="button">
              <Text className="text-amber-400 text-xs font-semibold mb-1">← Back to Haircare</Text>
            </TouchableOpacity>
            <Text className="text-zinc-50 text-2xl font-extrabold">Hair Routines</Text>
          </View>

          <TouchableOpacity
            className="bg-emerald-500 active:bg-emerald-600 px-4 py-2.5 rounded-xl shadow-sm"
            onPress={() => setIsAddModalOpen(true)}
            accessibilityRole="button"
          >
            <Text className="text-zinc-950 font-extrabold text-xs">+ Create Routine</Text>
          </TouchableOpacity>
        </View>

        {routineVMs.length === 0 ? (
          <EmptyHaircare
            title="No Hair Routines Created"
            message="Create wash day, deep conditioning, or oiling schedules linked to your products."
            actionLabel="+ Create First Routine"
            onAction={() => setIsAddModalOpen(true)}
          />
        ) : (
          <View className="gap-3">
            {routineVMs.map((routine) => (
              <HairRoutineCard key={routine.id} routine={routine} onDelete={handleDelete} />
            ))}
          </View>
        )}
      </ScrollView>

      {/* Add Hair Routine Modal */}
      <Modal
        visible={isAddModalOpen}
        animationType="slide"
        transparent
        onRequestClose={() => setIsAddModalOpen(false)}
      >
        <View className="flex-1 bg-black/80 justify-end p-4">
          <View className="gap-2">
            <TouchableOpacity
              className="self-end p-2 bg-zinc-800 rounded-full"
              onPress={() => setIsAddModalOpen(false)}
            >
              <Text className="text-zinc-400 text-xs font-bold">✕ Close</Text>
            </TouchableOpacity>

            <HairRoutineForm
              availableProducts={productVMs}
              isSubmitting={isMutating}
              onSubmit={async (vals) => {
                await createHairRoutine({
                  title: vals.title,
                  haircareCategory: vals.haircareCategory,
                  productIds: vals.productIds,
                  frequency: vals.frequency,
                  daysOfWeek: vals.daysOfWeek,
                  reminderTime: vals.reminderTime,
                  instructions: vals.instructions,
                });
                setIsAddModalOpen(false);
              }}
            />
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
};
