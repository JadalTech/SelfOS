import React from 'react';
import { View, Text } from 'react-native';
import type { ActivityVM } from '../types';

interface RecentActivityCardProps {
  readonly activities: ActivityVM[];
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

export const RecentActivityCard: React.FC<RecentActivityCardProps> = React.memo(
  function RecentActivityCard({ activities }) {
    return (
      <View className="bg-zinc-900/90 border border-zinc-800/80 rounded-2xl p-4 gap-3 shadow-md">
        <Text className="text-zinc-400 text-xs font-semibold uppercase tracking-wider">
          Recent Activity Log
        </Text>

        {activities.length === 0 ? (
          <Text className="text-zinc-500 text-xs py-3 text-center">
            No activity logs recorded yet.
          </Text>
        ) : (
          <View className="gap-2">
            {activities.map((act) => {
              const icon = TYPE_ICONS[act.type] ?? '🎯';
              const statusColor =
                act.status === 'completed'
                  ? 'text-emerald-400 font-semibold'
                  : act.status === 'skipped'
                  ? 'text-amber-400 font-semibold'
                  : 'text-rose-400 font-semibold';

              return (
                <View
                  key={act.id}
                  className="flex-row items-center justify-between bg-zinc-950/60 border border-zinc-800/60 p-3 rounded-xl"
                >
                  <View className="flex-row items-center gap-3 flex-1 pr-2">
                    <Text className="text-base">{icon}</Text>
                    <View className="flex-1">
                      <Text className="text-zinc-200 text-xs font-bold" numberOfLines={1}>
                        {act.title}
                      </Text>
                      <Text className="text-zinc-500 text-[10px]">
                        {act.date} at {act.time}
                      </Text>
                    </View>
                  </View>

                  <Text className={`text-xs capitalize ${statusColor}`}>{act.status}</Text>
                </View>
              );
            })}
          </View>
        )}
      </View>
    );
  }
);
