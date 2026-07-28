import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import type { HydrationEntryVM } from '../../../types/viewmodel.types';

export interface TimelineSectionProps {
  readonly entries: HydrationEntryVM[];
  readonly onDeleteEntry: (id: string) => void;
}

export const TimelineSection: React.FC<TimelineSectionProps> = React.memo(function TimelineSection({
  entries,
  onDeleteEntry,
}) {
  if (entries.length === 0) {
    return (
      <View className="bg-zinc-950 border border-zinc-900 rounded-3xl p-5 gap-2 my-2 items-center justify-center py-8">
        <Text className="text-zinc-500 text-xs">No drinks logged yet today.</Text>
      </View>
    );
  }

  return (
    <View className="bg-zinc-950 border border-zinc-900 rounded-3xl p-5 gap-3 my-2">
      <Text className="text-zinc-100 font-bold text-sm">Today's Timeline</Text>
      <View className="gap-3 mt-1">
        {entries.map((item, idx) => (
          <View key={item.id} className="flex-row items-center justify-between border-b border-zinc-900 pb-3 last:border-b-0 last:pb-0">
            <View className="flex-row items-center gap-3">
              <View className="w-9 h-9 rounded-full bg-zinc-900 border border-zinc-800 items-center justify-center">
                <Text className="text-base">{item.drinkTypeIcon}</Text>
              </View>
              <View className="gap-0.5">
                <Text className="text-zinc-100 font-bold text-sm">{item.amountLabel}</Text>
                <Text className="text-zinc-500 text-[10px] capitalize">
                  {item.drinkTypeLabel} • {item.temperatureLabel} • {item.sourceLabel}
                </Text>
              </View>
            </View>
            <View className="flex-row items-center gap-3">
              <Text className="text-zinc-400 text-xs font-semibold">{item.time}</Text>
              <TouchableOpacity
                onPress={() => onDeleteEntry(item.id)}
                hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
                accessibilityRole="button"
                accessibilityLabel="Delete hydration entry"
              >
                <Text className="text-red-500 text-xs font-bold">×</Text>
              </TouchableOpacity>
            </View>
          </View>
        ))}
      </View>
    </View>
  );
});
