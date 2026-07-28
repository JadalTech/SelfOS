import React from 'react';
import { View, Text } from 'react-native';
import Svg, { Rect, Text as SvgText, Line } from 'react-native-svg';
import type { ChartDataPointVM } from '../../types/viewmodel.types';

export interface DailyChartProps {
  readonly data: ChartDataPointVM[];
}

export const DailyChart: React.FC<DailyChartProps> = React.memo(function DailyChart({ data }) {
  if (data.length === 0) {
    return (
      <View className="h-40 justify-center items-center bg-zinc-900/40 rounded-2xl border border-zinc-900">
        <Text className="text-zinc-500 text-xs">No chart data available.</Text>
      </View>
    );
  }

  const height = 160;
  const width = 300;
  const padding = 24;

  const maxVal = Math.max(...data.map((d) => d.value), 250);
  const chartHeight = height - padding * 2;
  const chartWidth = width - padding * 2;

  return (
    <View className="bg-zinc-950 border border-zinc-900 rounded-3xl p-5 gap-3">
      <Text className="text-zinc-100 font-bold text-sm">Today's Consumption Timeline</Text>
      <View className="items-center">
        <Svg width={width} height={height}>
          {/* Axis */}
          <Line x1={padding} y1={height - padding} x2={width - padding} y2={height - padding} stroke="#27272a" strokeWidth={1} />
          {data.map((pt, idx) => {
            const x = padding + (idx * chartWidth) / Math.max(1, data.length - 1);
            const barHeight = (pt.value / maxVal) * chartHeight;
            const y = height - padding - barHeight;

            return (
              <React.Fragment key={idx}>
                {/* Bar */}
                <Rect
                  x={x - 8}
                  y={y}
                  width={16}
                  height={barHeight}
                  fill="#3b82f6"
                  rx={4}
                />
                {/* X axis Label */}
                <SvgText
                  x={x}
                  y={height - 6}
                  fill="#71717a"
                  fontSize={8}
                  textAnchor="middle"
                >
                  {pt.label}
                </SvgText>
              </React.Fragment>
            );
          })}
        </Svg>
      </View>
    </View>
  );
});
