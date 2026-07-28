import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { useHydrationEntryViewModel } from '../viewmodels/useHydrationEntryViewModel';
import { FeatureLayout } from '../layouts/FeatureLayout';
import { LoadingState } from '../components';
import { EntryRow } from '../components/Components';

export const HydrationEntryDetailScreen: React.FC = React.memo(function HydrationEntryDetailScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();
  const { entry, deleteEntry, isLoading } = useHydrationEntryViewModel(id);

  if (isLoading || !entry) return <LoadingState />;

  const handleDelete = async () => {
    await deleteEntry();
    router.replace('/hydration');
  };

  return (
    <FeatureLayout title="Drink Details" showBackButton={true}>
      <View className="flex-1 bg-black p-4 gap-5">
        <View className="bg-zinc-950 border border-zinc-900 rounded-3xl p-5 items-center gap-3">
          <View className="w-16 h-16 rounded-full bg-zinc-900 border border-zinc-800 items-center justify-center">
            <Text className="text-3xl">{entry.drinkTypeIcon}</Text>
          </View>
          <Text className="text-zinc-100 font-extrabold text-2xl mt-2">{entry.amountLabel}</Text>
          <Text className="text-zinc-500 text-xs capitalize">{entry.drinkTypeLabel} Beverage</Text>
        </View>

        <View className="bg-zinc-950 border border-zinc-900 rounded-3xl p-5 gap-1">
          <EntryRow label="Date" value={entry.date} />
          <EntryRow label="Time" value={entry.time} />
          <EntryRow label="Temperature" value={entry.temperatureLabel} />
          <EntryRow label="Source" value={entry.sourceLabel} />
          {entry.notes ? <EntryRow label="Notes" value={entry.notes} /> : null}
        </View>

        <View className="flex-row gap-3.5 mt-auto mb-6">
          <TouchableOpacity
            activeOpacity={0.8}
            onPress={() => router.push({ pathname: '/hydration/entry/edit', params: { id: entry.id } })}
            className="flex-1 bg-zinc-900 border border-zinc-800 py-4 rounded-2xl items-center"
          >
            <Text className="text-zinc-300 font-bold text-sm">Edit Entry</Text>
          </TouchableOpacity>
          <TouchableOpacity
            activeOpacity={0.8}
            onPress={handleDelete}
            className="flex-1 bg-red-950/20 border border-red-900/40 py-4 rounded-2xl items-center"
          >
            <Text className="text-red-400 font-bold text-sm">Delete Entry</Text>
          </TouchableOpacity>
        </View>
      </View>
    </FeatureLayout>
  );
});
export default HydrationEntryDetailScreen;
