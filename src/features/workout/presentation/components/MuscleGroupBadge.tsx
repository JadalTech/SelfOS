import React from 'react';
import { View, Text } from 'react-native';
import { MuscleGroup } from '../../types/workout.types';
import { MUSCLE_GROUP_OPTIONS } from '../../constants/workout.constants';

export interface MuscleGroupBadgeProps {
  readonly muscleGroup: MuscleGroup;
  readonly size?: 'sm' | 'md';
}

const COLOR_MAP: Record<MuscleGroup, { bg: string; text: string; dot: string }> = {
  chest: { bg: 'bg-red-500/10', text: 'text-red-400', dot: 'bg-red-400' },
  back: { bg: 'bg-orange-500/10', text: 'text-orange-400', dot: 'bg-orange-400' },
  shoulders: { bg: 'bg-amber-500/10', text: 'text-amber-400', dot: 'bg-amber-400' },
  biceps: { bg: 'bg-yellow-500/10', text: 'text-yellow-400', dot: 'bg-yellow-400' },
  triceps: { bg: 'bg-lime-500/10', text: 'text-lime-400', dot: 'bg-lime-400' },
  forearms: { bg: 'bg-green-500/10', text: 'text-green-400', dot: 'bg-green-400' },
  quadriceps: { bg: 'bg-emerald-500/10', text: 'text-emerald-400', dot: 'bg-emerald-400' },
  hamstrings: { bg: 'bg-teal-500/10', text: 'text-teal-400', dot: 'bg-teal-400' },
  calves: { bg: 'bg-cyan-500/10', text: 'text-cyan-400', dot: 'bg-cyan-400' },
  glutes: { bg: 'bg-sky-500/10', text: 'text-sky-400', dot: 'bg-sky-400' },
  abs: { bg: 'bg-indigo-500/10', text: 'text-indigo-400', dot: 'bg-indigo-400' },
  cardio: { bg: 'bg-violet-500/10', text: 'text-violet-400', dot: 'bg-violet-400' },
  'full-body': { bg: 'bg-fuchsia-500/10', text: 'text-fuchsia-400', dot: 'bg-fuchsia-400' },
  other: { bg: 'bg-zinc-500/10', text: 'text-zinc-400', dot: 'bg-zinc-400' },
};

export const MuscleGroupBadge: React.FC<MuscleGroupBadgeProps> = React.memo(function MuscleGroupBadge({
  muscleGroup,
  size = 'sm',
}) {
  const colors = COLOR_MAP[muscleGroup] || COLOR_MAP.other;
  const option = MUSCLE_GROUP_OPTIONS.find((opt) => opt.value === muscleGroup);
  const label = option ? option.label : muscleGroup;

  const isSmall = size === 'sm';

  return (
    <View
      className={`flex-row items-center rounded-full border border-zinc-800/80 ${colors.bg} ${
        isSmall ? 'px-2 py-0.5 gap-1' : 'px-3 py-1 gap-1.5'
      }`}
      accessible={true}
      accessibilityRole="text"
      accessibilityLabel={`Target muscle group: ${label}`}
    >
      <View className={`rounded-full ${colors.dot} ${isSmall ? 'w-1.5 h-1.5' : 'w-2 h-2'}`} />
      <Text
        className={`font-semibold capitalize tracking-tight ${colors.text} ${
          isSmall ? 'text-[10px]' : 'text-xs'
        }`}
      >
        {label}
      </Text>
    </View>
  );
});
