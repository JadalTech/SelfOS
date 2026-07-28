import React from 'react';
import { View, Text } from 'react-native';
import { ProgressRing } from './ProgressRing';

export interface CompletionRingProps {
  readonly consumedML: number;
  readonly goalML: number;
  readonly percentage: number;
  readonly score: number;
  readonly statusColor?: string;
}

export const CompletionRing: React.FC<CompletionRingProps> = React.memo(function CompletionRing({
  consumedML,
  goalML,
  percentage,
  score,
  statusColor = '#3b82f6',
}) {
  const progress = percentage / 100;

  return (
    <View className="items-center justify-center py-6 bg-zinc-950/40 rounded-3xl border border-zinc-900/50">
      <ProgressRing progress={progress} color={statusColor} size={200} strokeWidth={16}>
        <View className="items-center">
          <Text className="text-zinc-100 text-3xl font-extrabold tracking-tight">
            {percentage}%
          </Text>
          <Text className="text-zinc-400 text-[10px] uppercase font-bold tracking-widest mt-1">
            {consumedML} / {goalML} mL
          </Text>
          <View className="mt-2 bg-zinc-900 px-2 py-0.5 rounded-full border border-zinc-800">
            <Text className="text-[10px] text-zinc-300 font-semibold">
              Score: {score.toFixed(1)}/10
            </Text>
          </View>
        </View>
      </ProgressRing>
    </View>
  );
});
