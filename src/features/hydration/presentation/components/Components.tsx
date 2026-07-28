import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import type { DrinkType } from '../../types/hydration.types';

// =========================================================================
// 1. Quick Add Button
// =========================================================================

export interface QuickAddButtonProps {
  readonly amount: number;
  readonly onPress: () => void;
}

export const QuickAddButton: React.FC<QuickAddButtonProps> = React.memo(function QuickAddButton({
  amount,
  onPress,
}) {
  return (
    <TouchableOpacity
      activeOpacity={0.8}
      onPress={onPress}
      className="bg-zinc-900 border border-zinc-800 p-3 rounded-2xl items-center"
      accessibilityRole="button"
      accessibilityLabel={`Add ${amount} mL`}
    >
      <Text className="text-zinc-100 font-bold text-sm">+{amount}</Text>
      <Text className="text-zinc-500 text-[10px]">mL</Text>
    </TouchableOpacity>
  );
});

// =========================================================================
// 2. Drink Type Chip
// =========================================================================

export interface DrinkTypeChipProps {
  readonly type: DrinkType;
  readonly label: string;
  readonly icon: string;
  readonly isSelected: boolean;
  readonly onPress: () => void;
}

export const DrinkTypeChip: React.FC<DrinkTypeChipProps> = React.memo(function DrinkTypeChip({
  type,
  label,
  icon,
  isSelected,
  onPress,
}) {
  return (
    <TouchableOpacity
      activeOpacity={0.8}
      onPress={onPress}
      className={`flex-row items-center px-4 py-2.5 rounded-full border gap-1.5 ${
        isSelected
          ? 'bg-blue-600 border-blue-500'
          : 'bg-zinc-900 border-zinc-800'
      }`}
      accessibilityRole="checkbox"
      accessibilityState={{ checked: isSelected }}
      accessibilityLabel={`Drink type ${label}`}
    >
      <Text className="text-sm">{icon}</Text>
      <Text className={`text-xs font-bold ${isSelected ? 'text-zinc-100' : 'text-zinc-400'}`}>
        {label}
      </Text>
    </TouchableOpacity>
  );
});

// =========================================================================
// 3. Entry Row
// =========================================================================

export interface EntryRowProps {
  readonly label: string;
  readonly value: string;
  readonly icon?: React.ReactNode;
}

export const EntryRow: React.FC<EntryRowProps> = React.memo(function EntryRow({
  label,
  value,
  icon,
}) {
  return (
    <View className="flex-row items-center justify-between border-b border-zinc-900 py-3.5">
      <View className="flex-row items-center gap-2.5">
        {icon}
        <Text className="text-zinc-400 text-xs font-medium">{label}</Text>
      </View>
      <Text className="text-zinc-100 text-xs font-semibold">{value}</Text>
    </View>
  );
});

// =========================================================================
// 4. Hydration Status Card
// =========================================================================

export interface HydrationStatusCardProps {
  readonly status: string;
  readonly color: string;
  readonly description: string;
}

export const HydrationStatusCard: React.FC<HydrationStatusCardProps> = React.memo(function HydrationStatusCard({
  status,
  color,
  description,
}) {
  return (
    <View className="bg-zinc-950 border border-zinc-900 rounded-3xl p-5 gap-2 border-l-4" style={{ borderLeftColor: color }}>
      <Text className="text-zinc-500 text-[10px] uppercase font-bold tracking-widest">Intake Quality Status</Text>
      <Text className="text-zinc-100 font-extrabold text-lg" style={{ color }}>{status}</Text>
      <Text className="text-zinc-400 text-xs mt-1 leading-relaxed">{description}</Text>
    </View>
  );
});

// =========================================================================
// 5. Hydration Score Card
// =========================================================================

export interface HydrationScoreCardProps {
  readonly overall: number;
  readonly timing: number;
  readonly consistency: number;
  readonly goalAchievement: number;
  readonly drinkDistribution: number;
  readonly hydrationQuality: number;
}

export const HydrationScoreCard: React.FC<HydrationScoreCardProps> = React.memo(function HydrationScoreCard({
  overall,
  timing,
  consistency,
  goalAchievement,
  drinkDistribution,
  hydrationQuality,
}) {
  const scores = [
    { label: 'Overall Index', val: overall },
    { label: 'Intake Timing', val: timing },
    { label: 'Consistency', val: consistency },
    { label: 'Goal Met', val: goalAchievement },
    { label: 'Variety Ratio', val: drinkDistribution },
    { label: 'Liquid Purity', val: hydrationQuality },
  ];

  return (
    <View className="bg-zinc-950 border border-zinc-900 rounded-3xl p-5 gap-3.5">
      <Text className="text-zinc-100 font-bold text-sm">Advanced Hydration Score</Text>
      <View className="flex-row flex-wrap gap-2.5 justify-between">
        {scores.map((s, idx) => (
          <View key={idx} className="flex-1 min-w-[120px] bg-zinc-900/40 border border-zinc-900/60 p-3.5 rounded-2xl">
            <Text className="text-zinc-500 text-[9px] uppercase font-bold tracking-widest leading-none">{s.label}</Text>
            <Text className="text-zinc-100 font-extrabold text-base mt-2">{s.val.toFixed(1)}/10</Text>
          </View>
        ))}
      </View>
    </View>
  );
});
