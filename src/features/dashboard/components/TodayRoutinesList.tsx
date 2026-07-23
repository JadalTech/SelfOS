import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import type { RoutineItemVM } from '../types';
import { RoutineStatusBadge } from '@/features/routine';

interface TodayRoutinesListProps {
  readonly items: RoutineItemVM[];
  readonly onItemPress: (routineId: string) => void;
  readonly onViewAllPress: () => void;
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

export const TodayRoutinesList: React.FC<TodayRoutinesListProps> = React.memo(
  function TodayRoutinesList({ items, onItemPress, onViewAllPress }) {
    return (
      <View className="bg-zinc-900/90 border border-zinc-800/80 rounded-2xl p-4 gap-3 shadow-md">
        <View className="flex-row items-center justify-between">
          <Text className="text-zinc-400 text-xs font-semibold uppercase tracking-wider">
            Today&apos;s Routines ({items.length})
          </Text>

          <TouchableOpacity onPress={onViewAllPress} accessibilityRole="button">
            <Text className="text-emerald-400 text-xs font-semibold">View All →</Text>
          </TouchableOpacity>
        </View>

        {items.length === 0 ? (
          <Text className="text-zinc-500 text-xs py-3 text-center">
            No routines scheduled for today. Take a break! 🎉
          </Text>
        ) : (
          <View className="gap-2">
            {items.map((item) => {
              const icon = TYPE_ICONS[item.type] ?? '🎯';
              return (
                <TouchableOpacity
                  key={item.id}
                  className="flex-row items-center justify-between bg-zinc-950/60 border border-zinc-800/60 p-3 rounded-xl active:border-zinc-700"
                  onPress={() => onItemPress(item.id)}
                  accessibilityRole="button"
                  accessibilityLabel={`Open ${item.title}`}
                >
                  <View className="flex-row items-center gap-3 flex-1 pr-2">
                    <Text className="text-lg">{icon}</Text>
                    <View className="flex-1">
                      <Text className="text-zinc-100 text-sm font-bold" numberOfLines={1}>
                        {item.title}
                      </Text>
                      <Text className="text-zinc-500 text-[10px]">
                        🔥 {item.currentStreak} day streak
                      </Text>
                    </View>
                  </View>

                  <RoutineStatusBadge status={item.status} size="sm" />
                </TouchableOpacity>
              );
            })}
          </View>
        )}
      </View>
    );
  }
);
