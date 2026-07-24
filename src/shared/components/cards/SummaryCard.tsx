import React from 'react';
import { View, Text } from 'react-native';

export interface SummaryMetricItem {
  readonly label: string;
  readonly value: string | number;
  readonly progress?: number; // 0 to 1
  readonly color?: string;
}

export interface SummaryCardProps {
  readonly title?: string;
  readonly metrics: SummaryMetricItem[];
  readonly footerText?: string;
}

export const SummaryCard: React.FC<SummaryCardProps> = React.memo(function SummaryCard({
  title,
  metrics,
  footerText,
}) {
  return (
    <View
      className="bg-zinc-900 border border-zinc-800 p-4 rounded-2xl shadow-sm gap-3"
      accessible={true}
      accessibilityRole="summary"
      accessibilityLabel={`${title || 'Summary Card'}`}
    >
      {title ? (
        <Text className="text-zinc-400 text-xs font-semibold uppercase tracking-wider mb-0.5">
          {title}
        </Text>
      ) : null}

      <View className="flex-row gap-3">
        {metrics.map((item, idx) => {
          const color = item.color || '#ec4899';
          const percentage = item.progress !== undefined ? Math.min(100, Math.round(item.progress * 100)) : null;

          return (
            <View key={idx} className="flex-1 gap-1">
              <Text className="text-zinc-500 text-[10px] font-bold uppercase tracking-wider">{item.label}</Text>
              <Text className="text-zinc-100 text-sm font-bold">{item.value}</Text>
              {percentage !== null ? (
                <View className="h-1 bg-zinc-800 rounded-full overflow-hidden mt-1 w-full">
                  <View
                    style={{ width: `${percentage}%`, backgroundColor: color }}
                    className="h-full rounded-full"
                  />
                </View>
              ) : null}
            </View>
          );
        })}
      </View>

      {footerText ? (
        <Text className="text-zinc-500 text-[10px] font-medium border-t border-zinc-800/60 pt-2 mt-1">
          {footerText}
        </Text>
      ) : null}
    </View>
  );
});
