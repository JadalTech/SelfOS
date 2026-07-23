import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import type { HaircareDashboardVM } from '../types';

interface HaircareWidgetProps {
  readonly data: HaircareDashboardVM;
  readonly onOpenModule: () => void;
}

export const HaircareWidget: React.FC<HaircareWidgetProps> = React.memo(
  function HaircareWidget({ data, onOpenModule }) {
    const upcoming = data.upcomingWashDay;

    return (
      <View className="bg-amber-950/20 border border-amber-800/40 rounded-2xl p-4 gap-3">
        <View className="flex-row items-center justify-between">
          <View className="flex-row items-center gap-2">
            <Text className="text-xl">💇‍♂️</Text>
            <View>
              <Text className="text-amber-400 text-xs font-extrabold uppercase tracking-wider">
                Haircare Regimen
              </Text>
              <Text className="text-zinc-400 text-[10px]">
                {data.activeProductsCount} active products
              </Text>
            </View>
          </View>

          <TouchableOpacity onPress={onOpenModule} accessibilityRole="button">
            <Text className="text-amber-400 text-xs font-semibold">Open →</Text>
          </TouchableOpacity>
        </View>

        {upcoming ? (
          <View className="bg-zinc-950/70 border border-zinc-800/60 p-3 rounded-xl flex-row items-center justify-between">
            <View className="flex-1 pr-2">
              <Text className="text-zinc-500 text-[10px] font-bold uppercase">Up Next Wash</Text>
              <Text className="text-zinc-100 text-xs font-bold" numberOfLines={1}>
                {upcoming.title}
              </Text>
            </View>
            <View className="bg-amber-500/10 border border-amber-500/30 px-2.5 py-1 rounded-full">
              <Text className="text-amber-400 text-[10px] font-bold">
                {upcoming.scheduleSummary}
              </Text>
            </View>
          </View>
        ) : (
          <Text className="text-zinc-500 text-xs text-center py-1">
            No hair routines setup yet.
          </Text>
        )}
      </View>
    );
  }
);
