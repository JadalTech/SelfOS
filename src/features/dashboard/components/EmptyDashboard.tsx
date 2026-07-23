import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';

interface EmptyDashboardProps {
  readonly onCreateRoutine: () => void;
}

export const EmptyDashboard: React.FC<EmptyDashboardProps> = React.memo(
  function EmptyDashboard({ onCreateRoutine }) {
    return (
      <View className="bg-zinc-900/90 border border-zinc-800/80 rounded-2xl p-6 items-center gap-4 my-4">
        <View className="w-16 h-16 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 items-center justify-center">
          <Text className="text-3xl">🚀</Text>
        </View>

        <View className="items-center gap-1">
          <Text className="text-zinc-100 text-lg font-bold text-center">
            Welcome to SelfOS!
          </Text>
          <Text className="text-zinc-400 text-xs text-center leading-relaxed max-w-xs">
            Build your personal habit engine by creating your first daily or weekly routine.
          </Text>
        </View>

        <TouchableOpacity
          className="bg-emerald-500 active:bg-emerald-600 px-6 py-3.5 rounded-xl flex-row items-center justify-center shadow-lg shadow-emerald-500/20"
          onPress={onCreateRoutine}
          accessibilityRole="button"
          accessibilityLabel="Create your first routine"
        >
          <Text className="text-zinc-950 font-extrabold text-sm">
            + Create First Routine
          </Text>
        </TouchableOpacity>
      </View>
    );
  }
);
