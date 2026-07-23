import React from 'react';
import { View, Text } from 'react-native';
import type { CalculatedDayStatus } from '../engine/completion';

interface RoutineStatusBadgeProps {
  readonly status: CalculatedDayStatus;
  readonly size?: 'sm' | 'md';
}

export const RoutineStatusBadge: React.FC<RoutineStatusBadgeProps> = React.memo(
  function RoutineStatusBadge({ status, size = 'md' }) {
    let badgeBg = 'bg-zinc-800/80 border-zinc-700';
    let textStyle = 'text-zinc-400';
    let label = 'Pending';

    switch (status) {
      case 'completed':
        badgeBg = 'bg-emerald-950/80 border-emerald-800/60';
        textStyle = 'text-emerald-400 font-semibold';
        label = 'Completed';
        break;
      case 'skipped':
        badgeBg = 'bg-amber-950/80 border-amber-800/60';
        textStyle = 'text-amber-400 font-semibold';
        label = 'Skipped';
        break;
      case 'missed':
        badgeBg = 'bg-rose-950/80 border-rose-800/60';
        textStyle = 'text-rose-400 font-semibold';
        label = 'Missed';
        break;
      case 'not-scheduled':
        badgeBg = 'bg-zinc-900 border-zinc-800';
        textStyle = 'text-zinc-500 font-medium';
        label = 'Off-Schedule';
        break;
      case 'pending':
      default:
        badgeBg = 'bg-zinc-900 border-zinc-800';
        textStyle = 'text-zinc-400 font-medium';
        label = 'Pending';
        break;
    }

    const padding = size === 'sm' ? 'px-2 py-0.5' : 'px-3 py-1';
    const textSize = size === 'sm' ? 'text-xs' : 'text-xs';

    return (
      <View
        className={`rounded-full border ${badgeBg} ${padding} items-center justify-center`}
        accessibilityRole="text"
        accessibilityLabel={`Status: ${label}`}
      >
        <Text className={`${textSize} ${textStyle}`}>{label}</Text>
      </View>
    );
  }
);
