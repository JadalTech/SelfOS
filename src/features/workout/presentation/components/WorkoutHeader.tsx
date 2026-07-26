import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';

export interface WorkoutHeaderProps {
  readonly plansCount: number;
  readonly templatesCount: number;
  readonly historyCount: number;
  readonly prsCount: number;
  readonly activeSessionId?: string | null;
}

export const WorkoutHeader: React.FC<WorkoutHeaderProps> = React.memo(function WorkoutHeader({
  plansCount,
  templatesCount,
  historyCount,
  prsCount,
  activeSessionId,
}) {
  const router = useRouter();

  return (
    <View className="bg-zinc-900/90 border border-zinc-800/80 rounded-2xl p-4 gap-3 shadow-md">
      <View className="flex-row items-center justify-between">
        <View className="flex-row items-center gap-3">
          <View className="w-12 h-12 rounded-2xl bg-violet-500/10 border border-violet-500/30 items-center justify-center">
            <Text className="text-2xl">🏋️‍♂️</Text>
          </View>
          <View>
            <Text className="text-zinc-500 text-[10px] font-bold uppercase tracking-wider">
              Fitness & Strength
            </Text>
            <Text className="text-zinc-50 text-xl font-extrabold tracking-tight">
              Workout Engine
            </Text>
          </View>
        </View>

        <View className="flex-row items-center gap-2">
          {activeSessionId ? (
            <TouchableOpacity
              className="bg-emerald-500/10 border border-emerald-500/40 px-3 py-1.5 rounded-xl flex-row items-center gap-1.5 animate-pulse"
              onPress={() => router.push('/(app)/workout/session')}
              accessibilityRole="button"
              accessibilityLabel="Resume active workout session"
            >
              <View className="w-2 h-2 rounded-full bg-emerald-400" />
              <Text className="text-emerald-400 text-xs font-bold">Active Track</Text>
            </TouchableOpacity>
          ) : (
            <TouchableOpacity
              className="bg-zinc-950 border border-zinc-800 px-3 py-1.5 rounded-xl"
              onPress={() => router.push('/(app)/workout/exercises')}
              accessibilityRole="button"
              accessibilityLabel="Open Exercise Library"
            >
              <Text className="text-zinc-300 text-xs font-bold">📖 Library</Text>
            </TouchableOpacity>
          )}
        </View>
      </View>

      <View className="flex-row gap-2 pt-1 border-t border-zinc-800/60">
        <TouchableOpacity
          className="flex-1 bg-zinc-950/70 border border-zinc-800 p-2.5 rounded-xl items-center"
          onPress={() => router.push('/(app)/workout/plans')}
          accessibilityRole="button"
          accessibilityLabel={`View ${plansCount} workout plans`}
        >
          <Text className="text-violet-400 font-bold text-sm">{plansCount}</Text>
          <Text className="text-zinc-400 text-[10px] font-medium">Split Plans</Text>
        </TouchableOpacity>

        <TouchableOpacity
          className="flex-1 bg-zinc-950/70 border border-zinc-800 p-2.5 rounded-xl items-center"
          onPress={() => router.push('/(app)/workout/history')}
          accessibilityRole="button"
          accessibilityLabel={`View ${historyCount} completed sessions in history`}
        >
          <Text className="text-emerald-400 font-bold text-sm">{historyCount}</Text>
          <Text className="text-zinc-400 text-[10px] font-medium">History Logs</Text>
        </TouchableOpacity>

        <TouchableOpacity
          className="flex-1 bg-zinc-950/70 border border-zinc-800 p-2.5 rounded-xl items-center"
          onPress={() => router.push('/(app)/workout/prs')}
          accessibilityRole="button"
          accessibilityLabel={`View ${prsCount} personal records`}
        >
          <Text className="text-amber-400 font-bold text-sm">{prsCount}</Text>
          <Text className="text-zinc-400 text-[10px] font-medium">PR Badges</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
});
