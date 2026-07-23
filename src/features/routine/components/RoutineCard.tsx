import React, { useMemo } from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import type { Routine, RoutineLog } from '../types';
import { getRoutineStatusForDate } from '../engine/completion';
import { RoutineStatusBadge } from './RoutineStatusBadge';

interface RoutineCardProps {
  readonly routine: Routine;
  readonly logs?: RoutineLog[];
  readonly onPress: (routineId: string) => void;
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

const DAY_NAMES = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

export const RoutineCard: React.FC<RoutineCardProps> = React.memo(function RoutineCard({
  routine,
  logs = [],
  onPress,
}) {
  const icon = TYPE_ICONS[routine.type] ?? '🎯';

  // Compute status for today relative to routine timezone
  const todayStatus = useMemo(() => {
    const todayStr = new Date().toISOString().split('T')[0];
    return getRoutineStatusForDate(routine, logs, todayStr);
  }, [routine, logs]);

  // Format human readable frequency summary string
  const frequencySummary = useMemo(() => {
    const { frequency, interval, daysOfWeek, daysOfMonth } = routine.schedule;

    if (frequency === 'daily') {
      return interval === 1 ? 'Every day' : `Every ${interval} days`;
    }

    if (frequency === 'weekly') {
      const daysStr = daysOfWeek?.map((d) => DAY_NAMES[d]).join(', ') ?? '';
      return interval === 1
        ? `Weekly (${daysStr})`
        : `Every ${interval} wks (${daysStr})`;
    }

    if (frequency === 'monthly') {
      const daysStr = daysOfMonth?.join(', ') ?? '';
      return interval === 1
        ? `Monthly (${daysStr})`
        : `Every ${interval} mos (${daysStr})`;
    }

    return `Custom (${interval} days)`;
  }, [routine.schedule]);

  const activeReminder = routine.reminders.find((r) => r.enabled);

  return (
    <TouchableOpacity
      className="bg-zinc-900/90 border border-zinc-800/80 active:border-zinc-700/80 rounded-2xl p-4 mb-3 gap-3 shadow-md"
      onPress={() => onPress(routine.id)}
      accessibilityRole="button"
      accessibilityLabel={`Routine ${routine.title}, ${frequencySummary}, Streak ${routine.currentStreak} days`}
    >
      <View className="flex-row items-center justify-between">
        <View className="flex-row items-center gap-3 flex-1 pr-2">
          {/* Icon Badge */}
          <View className="w-10 h-10 rounded-xl bg-zinc-800/90 border border-zinc-700/50 items-center justify-center">
            <Text className="text-xl">{icon}</Text>
          </View>

          <View className="flex-1">
            <Text className="text-zinc-100 text-base font-bold tracking-tight numberOfLines={1}">
              {routine.title}
            </Text>
            <Text className="text-zinc-400 text-xs font-medium">
              {frequencySummary}
            </Text>
          </View>
        </View>

        {/* Status Badge */}
        <RoutineStatusBadge status={todayStatus} size="sm" />
      </View>

      {/* Footer Info */}
      <View className="flex-row items-center justify-between pt-2 border-t border-zinc-800/60">
        <View className="flex-row items-center gap-1.5">
          <Text className="text-amber-500 text-xs font-bold">🔥 {routine.currentStreak}</Text>
          <Text className="text-zinc-400 text-xs font-medium">
            day streak (Best: {routine.longestStreak})
          </Text>
        </View>

        {activeReminder ? (
          <View className="flex-row items-center gap-1">
            <Text className="text-zinc-400 text-xs">⏰ {activeReminder.time}</Text>
          </View>
        ) : null}
      </View>
    </TouchableOpacity>
  );
});
