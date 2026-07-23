import React from 'react';
import { View, Text } from 'react-native';
import type { HairLogVM } from '../types';

interface HairLogCardProps {
  readonly log: HairLogVM;
}

export const HairLogCard: React.FC<HairLogCardProps> = React.memo(function HairLogCard({ log }) {
  return (
    <View className="bg-zinc-950/60 border border-zinc-800/60 p-3.5 rounded-2xl gap-2">
      <View className="flex-row items-center justify-between">
        <Text className="text-zinc-100 text-sm font-bold">{log.routineTitle}</Text>
        <Text className="text-zinc-500 text-[10px]">
          {log.date} at {log.time}
        </Text>
      </View>

      {log.appliedProducts.length > 0 ? (
        <Text className="text-zinc-400 text-xs">
          Applied: <Text className="text-zinc-200 font-medium">{log.appliedProducts.join(', ')}</Text>
        </Text>
      ) : null}

      {log.notes ? (
        <Text className="text-zinc-400 text-xs italic">&quot;{log.notes}&quot;</Text>
      ) : null}
    </View>
  );
});
