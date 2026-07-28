import React from 'react';
import { View, Text, TouchableOpacity, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';
import { useHydrationHistoryViewModel } from '../viewmodels/useHydrationHistoryViewModel';
import { FeatureLayout } from '../layouts/FeatureLayout';
import { LoadingState, EmptyState } from '../components';

export const HydrationHistoryScreen: React.FC = React.memo(function HydrationHistoryScreen() {
  const router = useRouter();
  const {
    history,
    isLoading,
    selectedDrinkType,
    setSelectedDrinkType,
    filterPeriod,
    setFilterPeriod,
    deleteEntry,
  } = useHydrationHistoryViewModel();

  if (isLoading) return <LoadingState />;

  return (
    <FeatureLayout title="Intake History" showBackButton={true}>
      <ScrollView className="flex-1 bg-black px-4" contentContainerStyle={{ paddingBottom: 40 }}>
        {/* Filters */}
        <View className="flex-row gap-2 my-4">
          {(['all', '7days', '30days'] as const).map((period) => (
            <TouchableOpacity
              key={period}
              onPress={() => setFilterPeriod(period)}
              className={`px-3.5 py-2 rounded-full border ${
                filterPeriod === period ? 'bg-blue-600 border-blue-500' : 'bg-zinc-950 border-zinc-900'
              }`}
            >
              <Text className="text-zinc-100 font-bold text-xs capitalize">{period}</Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* History List */}
        {history.length === 0 ? (
          <EmptyState title="No History Found" description="Try choosing a different period filter or log your first drink." />
        ) : (
          <View className="gap-3">
            {history.map((item) => (
              <TouchableOpacity
                key={item.id}
                onPress={() => router.push(`/hydration/entry/${item.id}`)}
                className="bg-zinc-950 border border-zinc-900 rounded-3xl p-4 flex-row items-center justify-between"
              >
                <View className="flex-row items-center gap-3">
                  <View className="w-10 h-10 rounded-full bg-zinc-900 border border-zinc-800 items-center justify-center">
                    <Text className="text-lg">{item.drinkTypeIcon}</Text>
                  </View>
                  <View className="gap-0.5">
                    <Text className="text-zinc-100 font-bold text-sm">{item.amountLabel}</Text>
                    <Text className="text-zinc-500 text-[10px] capitalize">
                      {item.drinkTypeLabel} • {item.temperatureLabel}
                    </Text>
                  </View>
                </View>
                <View className="flex-row items-center gap-4">
                  <View className="items-end">
                    <Text className="text-zinc-400 text-xs font-semibold">{item.time}</Text>
                    <Text className="text-zinc-500 text-[9px] mt-0.5">{item.date}</Text>
                  </View>
                  <TouchableOpacity
                    onPress={() => deleteEntry(item.id)}
                    className="p-1"
                  >
                    <Text className="text-red-500 font-bold text-base">×</Text>
                  </TouchableOpacity>
                </View>
              </TouchableOpacity>
            ))}
          </View>
        )}
      </ScrollView>
    </FeatureLayout>
  );
});
export default HydrationHistoryScreen;
