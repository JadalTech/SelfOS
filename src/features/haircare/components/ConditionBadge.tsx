import React from 'react';
import { View, Text } from 'react-native';

interface ConditionBadgeProps {
  readonly label: string;
  readonly value: string | number;
  readonly colorClass?: string;
}

export const ConditionBadge: React.FC<ConditionBadgeProps> = React.memo(
  function ConditionBadge({ label, value, colorClass = 'text-amber-400 bg-amber-500/10 border-amber-500/30' }) {
    return (
      <View className={`px-2.5 py-1 rounded-lg border flex-row items-center gap-1.5 ${colorClass}`}>
        <Text className="text-[10px] font-semibold opacity-75">{label}:</Text>
        <Text className="text-xs font-bold">{value}</Text>
      </View>
    );
  }
);
