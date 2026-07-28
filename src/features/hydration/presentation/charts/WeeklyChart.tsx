import React from 'react';
import { View, Text } from 'react-native';
import Svg, { Rect, Text as SvgText, Line } from 'react-native-svg';
import type { ChartDataPointVM } from '../../types/viewmodel.types';

export interface WeeklyChartProps {
  readonly data: ChartDataPointVM[];
}

export const WeeklyChart: React.FC<WeeklyChartProps> = React.memo(function WeeklyChart({ data }) {
  const defaultData: ChartDataPointVM[] = [
    { label: 'Mon', value: 2000, secondaryValue: 2500 },
    { label: 'Tue', value: 2600, secondaryValue: 2500 },
    { label: 'Wed', value: 1800, secondaryValue: 2500 },
    { label: 'Thu', value: 2500, secondaryValue: 2500 },
    { label: 'Fri', value: 2200, secondaryValue: 2500 },
    { label: 'Sat', value: 1500, secondaryValue: 2500 },
    { label: 'Sun', value: 2800, secondaryValue: 2500 },
  ];

  const points = data.length > 0 ? data : defaultData;

  const height = 160;
  const width = 300;
  const padding = 24;

  const maxVal = 3000;
  const chartHeight = height - padding * 2;
  const chartWidth = width - padding * 2;

  return (
    <View className="bg-zinc-950 border border-zinc-900 rounded-3xl p-5 gap-3">
      <Text className="text-zinc-100 font-bold text-sm">Weekly Trend</Text>
      <View className="items-center">
        <Svg width={width} height={height}>
          <Line x1={padding} y1={height - padding} x2={width - padding} y2={height - padding} stroke="#27272a" strokeWidth={1} />
          {points.map((pt, idx) => {
            const x = padding + (idx * chartWidth) / (points.length - 1);
            const barHeight = (pt.value / maxVal) * chartHeight;
            const y = height - padding - barHeight;

            const goalHeight = ((pt.secondaryValue || 2500) / maxVal) * chartHeight;
            const goalY = height - padding - goalHeight;

            return (
              <React.Fragment key={idx}>
                {/* Goal Guideline Dot */}
                <Line x1={x - 8} y1={goalY} x2={x + 8} y2={goalY} stroke="#ef4444" strokeWidth={1.5} strokeDasharray="2,2" />
                {/* Intake Bar */}
                <Rect
                  x={x - 6}
                  y={y}
                  width={12}
                  height={barHeight}
                  fill="#3b82f6"
                  rx={3}
                />
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
