import React from 'react';
import { View, Text } from 'react-native';

export interface DistributionSegment {
  readonly label: string;
  readonly percentage: number;
  readonly color: string;
}

export interface DistributionChartProps {
  readonly title?: string;
  readonly segments: DistributionSegment[];
}

export const DistributionChart: React.FC<DistributionChartProps> = React.memo(function DistributionChart({
  title,
  segments,
}) {
  const activeSegments = segments.filter((s) => s.percentage > 0);

  return (
    <View
      className="bg-zinc-900 border border-zinc-800 p-4 rounded-2xl shadow-sm gap-3"
      accessible={true}
      accessibilityRole="image"
      accessibilityLabel={`Distribution split: ${segments.map((s) => `${s.label} ${s.percentage}%`).join(', ')}`}
    >
      {title ? (
        <Text className="text-zinc-400 text-xs font-semibold uppercase tracking-wider">
          {title}
        </Text>
      ) : null}

      {/* Segmented multi-colored bar */}
      <View className="h-6 w-full rounded-xl overflow-hidden flex-row bg-zinc-850">
        {activeSegments.map((seg, idx) => (
          <View
            key={idx}
            style={{
              width: `${seg.percentage}%`,
              backgroundColor: seg.color,
            }}
            className="h-full items-center justify-center"
          >
            {seg.percentage >= 15 ? (
              <Text className="text-zinc-950 text-[10px] font-extrabold">
                {seg.percentage}%
              </Text>
            ) : null}
          </View>
        ))}
      </View>

      {/* Legend labels row */}
      <View className="flex-row flex-wrap gap-x-4 gap-y-1.5 mt-1">
        {segments.map((seg, idx) => (
          <View key={idx} className="flex-row items-center gap-1.5">
            <View
              style={{ backgroundColor: seg.color }}
              className="w-2.5 h-2.5 rounded-full"
            />
            <Text className="text-zinc-400 text-xs font-medium">
              {seg.label} <Text className="text-zinc-300 font-bold">({seg.percentage}%)</Text>
            </Text>
          </View>
        ))}
      </View>
    </View>
  );
});
