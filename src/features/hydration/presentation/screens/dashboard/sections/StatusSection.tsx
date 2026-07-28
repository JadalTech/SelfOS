import React from 'react';
import { View, Text } from 'react-native';

export interface StatusSectionProps {
  readonly statusLabel: string;
  readonly statusColor: string;
  readonly remainingLabel: string;
}

export const StatusSection: React.FC<StatusSectionProps> = React.memo(function StatusSection({
  statusLabel,
  statusColor,
  remainingLabel,
}) {
  return (
    <View className="bg-zinc-950 border border-zinc-900 rounded-3xl p-5 gap-3 my-2 flex-row items-center justify-between">
      <View className="gap-1">
        <Text className="text-zinc-500 text-[10px] uppercase font-bold tracking-widest">Hydration Status</Text>
        <Text className="text-zinc-100 font-extrabold text-lg" style={{ color: statusColor }}>
          {statusLabel}
        </Text>
      </View>
      <View className="items-end gap-1">
        <Text className="text-zinc-500 text-[10px] uppercase font-bold tracking-widest">Remaining Today</Text>
        <Text className="text-zinc-100 font-extrabold text-lg">{remainingLabel}</Text>
      </View>
    </View>
  );
});
