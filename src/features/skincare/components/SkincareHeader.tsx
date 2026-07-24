import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';

export interface SkincareHeaderProps {
  readonly activeProductsCount: number;
  readonly activeRoutinesCount: number;
  readonly latestHealthScore?: number;
  readonly onOpenProducts: () => void;
  readonly onOpenRoutines: () => void;
  readonly onOpenTimeline?: () => void;
  readonly onOpenAnalytics?: () => void;
  readonly onOpenAssessments?: () => void;
}

export const SkincareHeader: React.FC<SkincareHeaderProps> = React.memo(function SkincareHeader({
  activeProductsCount,
  activeRoutinesCount,
  latestHealthScore,
  onOpenProducts,
  onOpenRoutines,
  onOpenTimeline,
  onOpenAnalytics,
  onOpenAssessments,
}) {
  return (
    <View className="bg-zinc-900/90 border border-zinc-800/80 rounded-2xl p-4 gap-3 shadow-md">
      <View className="flex-row items-center justify-between">
        <View className="flex-row items-center gap-3">
          <View className="w-12 h-12 rounded-2xl bg-pink-500/10 border border-pink-500/30 items-center justify-center">
            <Text className="text-2xl">✨</Text>
          </View>
          <View>
            <Text className="text-zinc-500 text-[10px] font-bold uppercase tracking-wider">
              Dermatology & Skin
            </Text>
            <Text className="text-zinc-50 text-xl font-extrabold tracking-tight">
              Skincare Engine
            </Text>
          </View>
        </View>

        <View className="flex-row items-center gap-1.5">
          {onOpenAnalytics ? (
            <TouchableOpacity
              className="bg-zinc-950 border border-zinc-800 px-2.5 py-1.5 rounded-xl"
              onPress={onOpenAnalytics}
              accessibilityRole="button"
              accessibilityLabel="Open Skincare Analytics"
            >
              <Text className="text-zinc-300 text-xs font-bold">📊 Analytics</Text>
            </TouchableOpacity>
          ) : null}
        </View>
      </View>

      <View className="flex-row gap-2 pt-1 border-t border-zinc-800/60">
        <TouchableOpacity
          className="flex-1 bg-zinc-950/70 border border-zinc-800 p-2.5 rounded-xl items-center"
          onPress={onOpenProducts}
        >
          <Text className="text-pink-400 font-bold text-sm">{activeProductsCount}</Text>
          <Text className="text-zinc-400 text-[10px] font-medium">Products</Text>
        </TouchableOpacity>

        <TouchableOpacity
          className="flex-1 bg-zinc-950/70 border border-zinc-800 p-2.5 rounded-xl items-center"
          onPress={onOpenRoutines}
        >
          <Text className="text-emerald-400 font-bold text-sm">{activeRoutinesCount}</Text>
          <Text className="text-zinc-400 text-[10px] font-medium">Routines</Text>
        </TouchableOpacity>

        <TouchableOpacity
          className="flex-1 bg-zinc-950/70 border border-zinc-800 p-2.5 rounded-xl items-center"
          onPress={onOpenAssessments}
          disabled={!onOpenAssessments}
        >
          <Text className="text-amber-400 font-bold text-sm">
            {typeof latestHealthScore === 'number' ? `${latestHealthScore}/10` : 'Self-Check'}
          </Text>
          <Text className="text-zinc-400 text-[10px] font-medium">Skin Health</Text>
        </TouchableOpacity>

        {onOpenTimeline ? (
          <TouchableOpacity
            className="flex-1 bg-zinc-950/70 border border-zinc-800 p-2.5 rounded-xl items-center"
            onPress={onOpenTimeline}
          >
            <Text className="text-cyan-400 font-bold text-sm">Photos</Text>
            <Text className="text-zinc-400 text-[10px] font-medium">Timeline</Text>
          </TouchableOpacity>
        ) : null}
      </View>
    </View>
  );
});
