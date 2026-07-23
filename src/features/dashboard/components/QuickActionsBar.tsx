import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import type { RoutineItemVM } from '../types';
import { InlineLoader } from '@/shared/components';

interface QuickActionsBarProps {
  readonly topPendingRoutine?: RoutineItemVM;
  readonly onComplete: (routineId: string) => void;
  readonly onSkip: (routineId: string) => void;
  readonly isActionPending?: boolean;
}

const TYPE_ICONS: Record<string, string> = {
  haircare: '💇‍♂️',
  skincare: '🧴',
  water: '💧',
  nutrition: '🥗',
  gym: '🏋️‍♂️',
  sleep: '😴',
  medication: '💊',
  custom: '🎯',
};

export const QuickActionsBar: React.FC<QuickActionsBarProps> = React.memo(
  function QuickActionsBar({
    topPendingRoutine,
    onComplete,
    onSkip,
    isActionPending = false,
  }) {
    if (!topPendingRoutine) return null;

    const icon = TYPE_ICONS[topPendingRoutine.type] ?? '🎯';

    return (
      <View className="bg-emerald-950/40 border border-emerald-800/60 rounded-2xl p-4 gap-3">
        <View className="flex-row items-center justify-between">
          <View className="flex-row items-center gap-2.5 flex-1 pr-2">
            <View className="w-8 h-8 rounded-lg bg-emerald-900/60 items-center justify-center">
              <Text className="text-base">{icon}</Text>
            </View>
            <View className="flex-1">
              <Text className="text-zinc-400 text-[10px] font-bold uppercase tracking-wider">
                Up Next Today
              </Text>
              <Text className="text-zinc-100 text-sm font-bold" numberOfLines={1}>
                {topPendingRoutine.title}
              </Text>
            </View>
          </View>

          {topPendingRoutine.time ? (
            <Text className="text-emerald-400 text-xs font-semibold">
              ⏰ {topPendingRoutine.time}
            </Text>
          ) : null}
        </View>

        <View className="flex-row gap-2 pt-1 border-t border-emerald-900/40">
          <TouchableOpacity
            className="flex-1 bg-emerald-500 active:bg-emerald-600 py-2.5 rounded-xl items-center justify-center shadow-sm"
            onPress={() => onComplete(topPendingRoutine.id)}
            disabled={isActionPending}
            accessibilityRole="button"
            accessibilityLabel={`Complete ${topPendingRoutine.title}`}
          >
            {isActionPending ? (
              <InlineLoader label="..." color="#09090b" />
            ) : (
              <Text className="text-zinc-950 font-extrabold text-xs">✓ Complete Now</Text>
            )}
          </TouchableOpacity>

          <TouchableOpacity
            className="px-4 py-2.5 bg-zinc-900 active:bg-zinc-800 border border-zinc-800 rounded-xl items-center justify-center"
            onPress={() => onSkip(topPendingRoutine.id)}
            disabled={isActionPending}
            accessibilityRole="button"
            accessibilityLabel={`Skip ${topPendingRoutine.title}`}
          >
            <Text className="text-zinc-400 font-semibold text-xs">Skip</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }
);
