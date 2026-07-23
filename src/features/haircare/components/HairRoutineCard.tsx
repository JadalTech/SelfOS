import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import type { HairRoutineVM } from '../types';
import { RoutineStatusBadge } from '@/features/routine';

interface HairRoutineCardProps {
  readonly routine: HairRoutineVM;
  readonly onLogPress?: (routineId: string) => void;
  readonly onDelete?: (id: string, routineId: string) => void;
}

export const HairRoutineCard: React.FC<HairRoutineCardProps> = React.memo(
  function HairRoutineCard({ routine, onLogPress, onDelete }) {
    return (
      <View className="bg-zinc-900/90 border border-zinc-800/80 p-4 rounded-2xl gap-3 shadow-md">
        <View className="flex-row items-center justify-between">
          <View className="flex-1 pr-2">
            <View className="flex-row items-center gap-2 mb-0.5">
              <Text className="text-zinc-500 text-[10px] font-bold uppercase tracking-wider">
                {routine.categoryLabel}
              </Text>
              <Text className="text-emerald-400 text-[10px]">🔥 {routine.currentStreak} day streak</Text>
            </View>
            <Text className="text-zinc-100 text-base font-extrabold" numberOfLines={1}>
              {routine.title}
            </Text>
          </View>

          <RoutineStatusBadge status={routine.status} size="sm" />
        </View>

        {/* Linked Hair Products */}
        {routine.products.length > 0 ? (
          <View className="gap-1 bg-zinc-950/60 p-2.5 rounded-xl border border-zinc-800/60">
            <Text className="text-zinc-500 text-[10px] font-bold uppercase">Products Used:</Text>
            <View className="flex-row flex-wrap gap-1.5 pt-0.5">
              {routine.products.map((p) => (
                <View key={p.id} className="bg-zinc-900 border border-zinc-800 px-2 py-0.5 rounded-md">
                  <Text className="text-zinc-300 text-xs font-medium">
                    {p.brand} {p.name}
                  </Text>
                </View>
              ))}
            </View>
          </View>
        ) : null}

        {/* Actions */}
        <View className="flex-row items-center justify-between pt-1 border-t border-zinc-800/60">
          <TouchableOpacity
            className="bg-emerald-500/10 border border-emerald-500/30 px-3 py-1.5 rounded-lg"
            onPress={() => onLogPress?.(routine.id)}
            accessibilityRole="button"
          >
            <Text className="text-emerald-400 font-bold text-xs">✓ Log Wash Day</Text>
          </TouchableOpacity>

          {onDelete ? (
            <TouchableOpacity
              onPress={() => onDelete(routine.id, routine.routineId)}
              accessibilityRole="button"
            >
              <Text className="text-rose-500 text-xs font-semibold">Delete</Text>
            </TouchableOpacity>
          ) : null}
        </View>
      </View>
    );
  }
);
