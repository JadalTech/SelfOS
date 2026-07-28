import React from 'react';
import { View, Text } from 'react-native';
import Svg, { Rect, Line, Text as SvgText, Circle } from 'react-native-svg';
import type { ChartDataPointVM } from '../../types/viewmodel.types';

// =========================================================================
// 1. Monthly Chart
// =========================================================================

export const MonthlyChart: React.FC = React.memo(function MonthlyChart() {
  const points = [
    { label: 'W1', value: 2400 },
    { label: 'W2', value: 2600 },
    { label: 'W3', value: 2300 },
    { label: 'W4', value: 2700 },
  ];

  return (
    <View className="bg-zinc-950 border border-zinc-900 rounded-3xl p-5 gap-3">
      <Text className="text-zinc-100 font-bold text-sm">Monthly Trend (Weeks)</Text>
      <View className="items-center">
        <Svg width={300} height={120}>
          <Line x1={20} y1={90} x2={280} y2={90} stroke="#27272a" />
          {points.map((pt, idx) => {
            const x = 40 + idx * 70;
            const barHeight = (pt.value / 3000) * 80;
            const y = 90 - barHeight;
            return (
              <React.Fragment key={idx}>
                <Rect x={x - 12} y={y} width={24} height={barHeight} fill="#2563eb" rx={6} />
                <SvgText x={x} y={110} fill="#71717a" fontSize={9} textAnchor="middle">{pt.label}</SvgText>
                <SvgText x={x} y={y - 4} fill="#a1a1aa" fontSize={8} textAnchor="middle">{pt.value}</SvgText>
              </React.Fragment>
            );
          })}
        </Svg>
      </View>
    </View>
  );
});

// =========================================================================
// 2. Consistency Chart
// =========================================================================

export const ConsistencyChart: React.FC = React.memo(function ConsistencyChart() {
  return (
    <View className="bg-zinc-950 border border-zinc-900 rounded-3xl p-5 gap-3">
      <Text className="text-zinc-100 font-bold text-sm">Consistency (Last 10 Days)</Text>
      <View className="items-center">
        <Svg width={300} height={100}>
          <Line x1={20} y1={70} x2={280} y2={70} stroke="#27272a" />
          {Array.from({ length: 10 }).map((_, idx) => {
            const x = 35 + idx * 25;
            // Fake data: 0 to 100% completion
            const heightVal = idx === 4 || idx === 8 ? 20 : 50;
            const fill = heightVal === 50 ? '#10b981' : '#f59e0b';
            return (
              <React.Fragment key={idx}>
                <Rect x={x - 6} y={70 - heightVal} width={12} height={heightVal} fill={fill} rx={3} />
                <SvgText x={x} y={86} fill="#52525b" fontSize={7} textAnchor="middle">D{idx + 1}</SvgText>
              </React.Fragment>
            );
          })}
        </Svg>
      </View>
    </View>
  );
});

// =========================================================================
// 3. Hydration Score Trend Chart
// =========================================================================

export const HydrationScoreTrendChart: React.FC = React.memo(function HydrationScoreTrendChart() {
  const scores = [6.5, 7.8, 8.2, 7.0, 9.0, 8.5, 9.2];

  return (
    <View className="bg-zinc-950 border border-zinc-900 rounded-3xl p-5 gap-3">
      <Text className="text-zinc-100 font-bold text-sm">Hydration Score Trend</Text>
      <View className="items-center">
        <Svg width={300} height={100}>
          {scores.map((score, idx) => {
            const x = 30 + idx * 40;
            const y = 80 - (score / 10) * 60;
            return (
              <React.Fragment key={idx}>
                <Circle cx={x} cy={y} r={4} fill="#3b82f6" />
                {idx > 0 ? (
                  <Line
                    x1={30 + (idx - 1) * 40}
                    y1={80 - (scores[idx - 1] / 10) * 60}
                    x2={x}
                    y2={y}
                    stroke="#3b82f6"
                    strokeWidth={1.5}
                  />
                ) : null}
                <SvgText x={x} y={y - 8} fill="#a1a1aa" fontSize={8} textAnchor="middle">{score.toFixed(1)}</SvgText>
              </React.Fragment>
            );
          })}
        </Svg>
      </View>
    </View>
  );
});

// =========================================================================
// 4. Goal Achievement Chart
// =========================================================================

export const GoalAchievementChart: React.FC = React.memo(function GoalAchievementChart() {
  return (
    <View className="bg-zinc-950 border border-zinc-900 rounded-3xl p-5 gap-3">
      <Text className="text-zinc-100 font-bold text-sm">Goal Achievement Rate</Text>
      <View className="flex-row items-center justify-between p-4 bg-zinc-900/40 rounded-2xl border border-zinc-900/60">
        <View className="gap-0.5">
          <Text className="text-zinc-500 text-[10px] uppercase font-bold tracking-widest">Days Met Target</Text>
          <Text className="text-zinc-100 font-extrabold text-lg mt-0.5">24 / 30 Days</Text>
        </View>
        <View className="bg-emerald-950/20 px-3 py-1.5 rounded-full border border-emerald-900/50">
          <Text className="text-emerald-400 font-extrabold text-sm">80% Achieved</Text>
        </View>
      </View>
    </View>
  );
});

// =========================================================================
// 5. Peak Drinking Hours Chart
// =========================================================================

export const PeakDrinkingHoursChart: React.FC = React.memo(function PeakDrinkingHoursChart() {
  const hours = [
    { hour: '08:00', amount: 500 },
    { hour: '12:00', amount: 1000 },
    { hour: '16:00', amount: 750 },
    { hour: '20:00', amount: 500 },
  ];

  return (
    <View className="bg-zinc-950 border border-zinc-900 rounded-3xl p-5 gap-3">
      <Text className="text-zinc-100 font-bold text-sm">Peak Drinking Hours</Text>
      <View className="items-center">
        <Svg width={300} height={120}>
          <Line x1={20} y1={90} x2={280} y2={90} stroke="#27272a" />
          {hours.map((h, idx) => {
            const x = 40 + idx * 70;
            const barHeight = (h.amount / 1200) * 80;
            const y = 90 - barHeight;
            return (
              <React.Fragment key={idx}>
                <Rect x={x - 12} y={y} width={24} height={barHeight} fill="#06b6d4" rx={6} />
                <SvgText x={x} y={110} fill="#71717a" fontSize={9} textAnchor="middle">{h.hour}</SvgText>
                <SvgText x={x} y={y - 4} fill="#a1a1aa" fontSize={8} textAnchor="middle">{h.amount}mL</SvgText>
              </React.Fragment>
            );
          })}
        </Svg>
      </View>
    </View>
  );
});

// =========================================================================
// 6. Drink Quality Breakdown Chart
// =========================================================================

export const DrinkQualityBreakdownChart: React.FC = React.memo(function DrinkQualityBreakdownChart() {
  return (
    <View className="bg-zinc-950 border border-zinc-900 rounded-3xl p-5 gap-3">
      <Text className="text-zinc-100 font-bold text-sm">Hydration Quality Index</Text>
      <View className="flex-row items-center justify-between p-4 bg-zinc-900/40 rounded-2xl border border-zinc-900/60">
        <View className="gap-0.5">
          <Text className="text-zinc-500 text-[10px] uppercase font-bold tracking-widest">Effective Hydration Ratio</Text>
          <Text className="text-zinc-100 font-extrabold text-base mt-0.5">94% Quality Factor</Text>
        </View>
        <View className="bg-blue-950/20 px-3 py-1.5 rounded-full border border-blue-900/50">
          <Text className="text-blue-400 font-extrabold text-xs">High Purity</Text>
        </View>
      </View>
      <Text className="text-zinc-500 text-[10px] leading-relaxed">
        Calculated based on beverage type composition. Water and electrolyte beverages boost purity; caffeine content decreases effective retention.
      </Text>
    </View>
  );
});
