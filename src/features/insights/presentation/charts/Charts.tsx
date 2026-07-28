/**
 * SVG Visual Analytics Charts
 * SelfOS v1.5.0 — Batch 12B
 */

import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Svg, { Rect, Line, Circle, Text as SvgText } from 'react-native-svg';
import type { ChartDataPoint } from '../mappers/ChartDataMapper';

// =========================================================================
// 1. Weekly Progress Line Chart
// =========================================================================

export const WeeklyProgressChart: React.FC<{ readonly data: ChartDataPoint[] }> = ({ data }) => {
  if (data.length === 0) return null;

  const height = 120;
  const width = 300;
  const padding = 20;

  const maxVal = 10;
  const xStep = (width - padding * 2) / (data.length - 1);

  return (
    <View style={styles.chartContainer}>
      <Svg height={height} width={width}>
        {/* Draw baseline grid lines */}
        <Line x1={padding} y1={height / 2} x2={width - padding} y2={height / 2} stroke="#2A2A40" strokeWidth="1" />
        
        {/* Draw lines and markers */}
        {data.map((point, index) => {
          const x = padding + index * xStep;
          const y = height - padding - (point.value / maxVal) * (height - padding * 2);

          const nextPoint = data[index + 1];
          let nextLine = null;
          if (nextPoint) {
            const nextX = padding + (index + 1) * xStep;
            const nextY = height - padding - (nextPoint.value / maxVal) * (height - padding * 2);
            nextLine = (
              <Line x1={x} y1={y} x2={nextX} y2={nextY} stroke="#FF4081" strokeWidth="2" />
            );
          }

          return (
            <React.Fragment key={point.label}>
              {nextLine}
              <Circle cx={x} cy={y} r="4" fill="#FF4081" />
              <SvgText x={x - 8} y={height - 2} fill="#8E8E9F" fontSize="9">
                {point.label}
              </SvgText>
            </React.Fragment>
          );
        })}
      </Svg>
    </View>
  );
};

// =========================================================================
// 2. Module Comparison Bar Chart
// =========================================================================

export const ModuleComparisonChart: React.FC<{ readonly data: ChartDataPoint[] }> = ({ data }) => {
  const height = 140;
  const width = 300;
  const barWidth = 35;
  const spacing = 20;

  return (
    <View style={styles.chartContainer}>
      <Svg height={height} width={width}>
        {data.map((point, index) => {
          const x = spacing + index * (barWidth + spacing);
          const barHeight = (point.value / 10) * 80;
          const y = height - 30 - barHeight;

          return (
            <React.Fragment key={point.label}>
              <Rect
                x={x}
                y={y}
                width={barWidth}
                height={barHeight}
                fill="#3F51B5"
                rx="4"
              />
              <SvgText x={x} y={y - 8} fill="#FFFFFF" fontSize="10" fontWeight="bold">
                {point.value}
              </SvgText>
              <SvgText x={x} y={height - 10} fill="#8E8E9F" fontSize="9">
                {point.label.substring(0, 5)}
              </SvgText>
            </React.Fragment>
          );
        })}
      </Svg>
    </View>
  );
};

const styles = StyleSheet.create({
  chartContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: 12,
  },
});
