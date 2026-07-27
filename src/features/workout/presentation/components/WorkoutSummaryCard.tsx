import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { WorkoutSessionVM } from '../../types/viewmodel.types';

export interface WorkoutSummaryCardProps {
  readonly session: WorkoutSessionVM;
  readonly onPress: () => void;
}

export const WorkoutSummaryCard: React.FC<WorkoutSummaryCardProps> = React.memo(function WorkoutSummaryCard({
  session,
  onPress,
}) {
  const isCompleted = session.status === 'completed';

  const getStatusBadge = () => {
    if (isCompleted) {
      return (
        <View className="bg-emerald-500/10 border border-emerald-500/30 px-2 py-0.5 rounded-md">
          <Text className="text-emerald-400 text-[10px] font-extrabold uppercase tracking-wide">
            Completed
          </Text>
        </View>
      );
    }
    if (session.status === 'abandoned') {
      return (
        <View className="bg-red-500/10 border border-red-500/30 px-2 py-0.5 rounded-md">
          <Text className="text-red-400 text-[10px] font-extrabold uppercase tracking-wide">
            Abandoned
          </Text>
        </View>
      );
    }
    return (
      <View className="bg-zinc-500/10 border border-zinc-800 px-2 py-0.5 rounded-md">
        <Text className="text-zinc-400 text-[10px] font-extrabold uppercase tracking-wide">
          {session.status}
        </Text>
      </View>
    );
  };

  return (
    <TouchableOpacity
      activeOpacity={0.7}
      onPress={onPress}
      className="bg-zinc-900 border border-zinc-800 p-4 rounded-2xl gap-3 shadow-sm"
      accessible={true}
      accessibilityRole="button"
      accessibilityLabel={`Workout log: ${session.name || 'Workout'}. Done on ${session.startedAt}. Volume: ${session.totalVolumeLabel}.`}
    >
      {/* Top Header */}
      <View className="flex-row items-center justify-between">
        <View className="gap-0.5">
          <Text className="text-zinc-50 text-base font-bold tracking-tight">
            {session.name || 'Strength Session'}
          </Text>
          <Text className="text-zinc-500 text-[10px] font-semibold uppercase tracking-wider">
            {session.startedAt}
          </Text>
        </View>
        {getStatusBadge()}
      </View>

      {/* Grid of Key Stats */}
      <View className="flex-row justify-between pt-2 border-t border-zinc-800/40 gap-2">
        <View className="items-center flex-1 py-1.5 bg-zinc-950/40 border border-zinc-800/40 rounded-xl">
          <Text className="text-zinc-500 text-[9px] font-extrabold uppercase tracking-wider">Volume</Text>
          <Text className="text-zinc-200 text-xs font-bold mt-0.5">{session.totalVolumeLabel}</Text>
        </View>

        <View className="items-center flex-1 py-1.5 bg-zinc-950/40 border border-zinc-800/40 rounded-xl">
          <Text className="text-zinc-500 text-[9px] font-extrabold uppercase tracking-wider">Reps</Text>
          <Text className="text-zinc-200 text-xs font-bold mt-0.5">{session.totalRepsLabel}</Text>
        </View>

        <View className="items-center flex-1 py-1.5 bg-zinc-950/40 border border-zinc-800/40 rounded-xl">
          <Text className="text-zinc-500 text-[9px] font-extrabold uppercase tracking-wider">Time</Text>
          <Text className="text-zinc-200 text-xs font-bold mt-0.5">{session.durationFormatted}</Text>
        </View>

        {session.caloriesBurned ? (
          <View className="items-center flex-1 py-1.5 bg-zinc-950/40 border border-zinc-800/40 rounded-xl">
            <Text className="text-zinc-500 text-[9px] font-extrabold uppercase tracking-wider">Burn</Text>
            <Text className="text-zinc-200 text-xs font-bold mt-0.5">{session.caloriesBurned} kcal</Text>
          </View>
        ) : null}
      </View>

      {/* RPE & Intensity details */}
      <View className="flex-row items-center justify-between pt-1">
        <View className="flex-row gap-3">
          {session.averageRPE ? (
            <Text className="text-zinc-500 text-[10px] font-medium">
              Average RPE: <Text className="text-zinc-300 font-bold">{session.averageRPE}</Text>
            </Text>
          ) : null}
          {session.estimatedIntensity ? (
            <Text className="text-zinc-500 text-[10px] font-medium">
              Intensity:{' '}
              <Text className="text-violet-400 font-bold capitalize">
                {session.estimatedIntensity}
              </Text>
            </Text>
          ) : null}
        </View>

        <Text className="text-zinc-500 text-xs font-bold">→</Text>
      </View>
    </TouchableOpacity>
  );
});
