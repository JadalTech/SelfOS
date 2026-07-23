import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';

interface HaircareHeaderProps {
  readonly activeProductsCount: number;
  readonly completedWashDaysCount: number;
  readonly photosCount?: number;
  readonly onOpenProducts: () => void;
  readonly onOpenRoutines: () => void;
  readonly onOpenTimeline?: () => void;
  readonly onOpenAnalytics?: () => void;
  readonly onOpenCoach?: () => void;
}

export const HaircareHeader: React.FC<HaircareHeaderProps> = React.memo(
  function HaircareHeader({
    activeProductsCount,
    completedWashDaysCount,
    photosCount = 0,
    onOpenProducts,
    onOpenRoutines,
    onOpenTimeline,
    onOpenAnalytics,
    onOpenCoach,
  }) {
    return (
      <View className="bg-zinc-900/90 border border-zinc-800/80 rounded-2xl p-4 gap-3 shadow-md">
        <View className="flex-row items-center justify-between">
          <View className="flex-row items-center gap-3">
            <View className="w-12 h-12 rounded-2xl bg-amber-500/10 border border-amber-500/30 items-center justify-center">
              <Text className="text-2xl">💇‍♂️</Text>
            </View>
            <View>
              <Text className="text-zinc-500 text-[10px] font-bold uppercase tracking-wider">
                Health Regimen
              </Text>
              <Text className="text-zinc-50 text-xl font-extrabold tracking-tight">
                Haircare Engine
              </Text>
            </View>
          </View>

          <View className="flex-row items-center gap-1.5">
            {onOpenCoach ? (
              <TouchableOpacity
                className="bg-amber-500/10 border border-amber-500/40 px-2.5 py-1.5 rounded-xl"
                onPress={onOpenCoach}
                accessibilityRole="button"
                accessibilityLabel="Open AI Hair Coach"
              >
                <Text className="text-amber-400 text-xs font-bold">🤖 Coach</Text>
              </TouchableOpacity>
            ) : null}

            {onOpenAnalytics ? (
              <TouchableOpacity
                className="bg-zinc-950 border border-zinc-800 px-2.5 py-1.5 rounded-xl"
                onPress={onOpenAnalytics}
                accessibilityRole="button"
                accessibilityLabel="Open Haircare Analytics"
              >
                <Text className="text-amber-400 text-xs font-bold">📊 Analytics</Text>
              </TouchableOpacity>
            ) : null}
          </View>
        </View>

        {/* Quick Stats Summary */}
        <View className="flex-row gap-2 pt-2 border-t border-zinc-800/60">
          <TouchableOpacity
            className="flex-1 bg-zinc-950/60 border border-zinc-800/60 p-2.5 rounded-xl items-center"
            onPress={onOpenProducts}
            accessibilityRole="button"
            accessibilityLabel="Open hair products"
          >
            <Text className="text-amber-400 text-base font-black">{activeProductsCount}</Text>
            <Text className="text-zinc-400 text-[10px] font-medium">Products</Text>
          </TouchableOpacity>

          <TouchableOpacity
            className="flex-1 bg-zinc-950/60 border border-zinc-800/60 p-2.5 rounded-xl items-center"
            onPress={onOpenRoutines}
            accessibilityRole="button"
            accessibilityLabel="Open hair routines"
          >
            <Text className="text-emerald-400 text-base font-black">{completedWashDaysCount}</Text>
            <Text className="text-zinc-400 text-[10px] font-medium">Logs</Text>
          </TouchableOpacity>

          {onOpenTimeline ? (
            <TouchableOpacity
              className="flex-1 bg-zinc-950/60 border border-zinc-800/60 p-2.5 rounded-xl items-center"
              onPress={onOpenTimeline}
              accessibilityRole="button"
              accessibilityLabel="Open progress timeline"
            >
              <Text className="text-amber-400 text-base font-black">📸 {photosCount}</Text>
              <Text className="text-zinc-400 text-[10px] font-medium">Timeline</Text>
            </TouchableOpacity>
          ) : null}
        </View>
      </View>
    );
  }
);
