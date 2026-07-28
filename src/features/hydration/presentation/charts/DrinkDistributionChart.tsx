import React from 'react';
import { View, Text } from 'react-native';
import Svg, { Rect, Text as SvgText } from 'react-native-svg';
import type { ChartDataPointVM } from '../../types/viewmodel.types';

export interface DrinkDistributionChartProps {
  readonly data: ChartDataPointVM[];
}

export const DrinkDistributionChart: React.FC<DrinkDistributionChartProps> = React.memo(function DrinkDistributionChart({
  data,
}) {
  const defaultData = [
    { label: 'Water', value: 1500 },
    { label: 'Electrolyte', value: 500 },
    { label: 'Coffee', value: 250 },
    { label: 'Tea', value: 250 },
  ];

  const points = data.length > 0 ? data : defaultData;

  const height = 150;
  const width = 300;
  const rowHeight = 24;

  const maxVal = Math.max(...points.map((p) => p.value), 1);

  return (
    <View className="bg-zinc-950 border border-zinc-900 rounded-3xl p-5 gap-3">
      <Text className="text-zinc-100 font-bold text-sm">Drink Type Breakdown</Text>
      <View className="items-center">
        <Svg width={width} height={height}>
          {points.map((pt, idx) => {
            const y = idx * (rowHeight + 8) + 10;
            const barWidth = (pt.value / maxVal) * 160;

            return (
              <React.Fragment key={idx}>
                {/* Type Label */}
                <SvgText x={10} y={y + 14} fill="#e4e4e7" fontSize={9} fontWeight="bold">
                  {pt.label}
                </SvgText>
                {/* Horizontal Bar */}
                <Rect x={90} y={y} width={barWidth} height={18} fill="#3b82f6" rx={4} />
                {/* Value Label */}
                <SvgText x={95 + barWidth} y={y + 13} fill="#71717a" fontSize={9}>
                  {pt.value} mL
                </SvgText>
              </React.Fragment>
            );
          })}
        </Svg>
      </View>
    </View>
  );
});
