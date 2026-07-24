import React from 'react';
import { View, Text } from 'react-native';

export interface ChartDataPoint {
  readonly label: string; // e.g. "Mon"
  readonly value: number;
}

export interface LineTrendChartProps {
  readonly title?: string;
  readonly data: ChartDataPoint[];
  readonly color?: string;
  readonly unit?: string;
  readonly height?: number;
}

export const LineTrendChart: React.FC<LineTrendChartProps> = React.memo(function LineTrendChart({
  title,
  data,
  color = '#ec4899',
  unit = '',
  height = 140,
}) {
  if (data.length === 0) {
    return (
      <View style={{ height }} className="items-center justify-center bg-zinc-900 border border-zinc-800 rounded-2xl">
        <Text className="text-zinc-500 text-xs font-semibold">No chart data available</Text>
      </View>
    );
  }

  const values = data.map((d) => d.value);
  const maxVal = Math.max(...values, 1);
  const minVal = Math.min(...values, 0);
  const valRange = maxVal - minVal;

  return (
    <View
      className="bg-zinc-900 border border-zinc-800 p-4 rounded-2xl shadow-sm gap-2"
      accessible={true}
      accessibilityRole="image"
      accessibilityLabel={`Chart showing ${title || 'Trend'}`}
    >
      {title ? (
        <Text className="text-zinc-400 text-xs font-semibold uppercase tracking-wider mb-1">
          {title}
        </Text>
      ) : null}

      <View style={{ height }} className="flex-row items-end justify-between pt-4 pb-1 px-1">
        {data.map((point, idx) => {
          // Calculate height percentage relative to range
          const pct = valRange > 0 ? (point.value - minVal) / valRange : 0.5;
          const barHeight = Math.max(12, Math.round(pct * (height - 36)));

          return (
            <View key={idx} className="items-center flex-1 gap-1.5">
              {/* Tooltip value */}
              <Text className="text-zinc-300 text-[10px] font-bold">
                {point.value}{unit}
              </Text>
              
              {/* Visual bar column */}
              <View
                style={{
                  height: barHeight,
                  backgroundColor: color,
                  width: 14,
                  borderRadius: 4,
                  opacity: 0.85,
                }}
              />
              
              {/* X Axis Label */}
              <Text className="text-zinc-500 text-[10px] font-bold mt-0.5">
                {point.label}
              </Text>
            </View>
          );
        })}
      </View>
    </View>
  );
});
