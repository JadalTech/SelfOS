import React from 'react';
import { View, Text } from 'react-native';
import type { InsightCardVM } from '../types/analytics.types';

interface InsightCardProps {
  readonly card: InsightCardVM;
}

export const InsightCard: React.FC<InsightCardProps> = React.memo(
  function InsightCard({ card }) {
    return (
      <View className="bg-zinc-900/90 border border-zinc-800/80 rounded-2xl p-4 gap-2 shadow-md flex-1 min-w-[150px]">
        <View className="flex-row items-center justify-between">
          <Text className="text-2xl">{card.icon}</Text>
          <Text className="text-zinc-500 text-[10px] font-bold uppercase tracking-wider">{card.type}</Text>
        </View>

        <View className="gap-0.5 mt-1">
          <Text className="text-amber-400 text-lg font-black tracking-tight">{card.value}</Text>
          <Text className="text-zinc-100 text-xs font-bold">{card.title}</Text>
          <Text className="text-zinc-400 text-[10px] leading-tight" numberOfLines={2}>
            {card.subtitle}
          </Text>
        </View>
      </View>
    );
  }
);
