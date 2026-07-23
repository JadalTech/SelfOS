import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';

interface EmptyRoutineStateProps {
  readonly title?: string;
  readonly message?: string;
  readonly actionLabel?: string;
  readonly onAction?: () => void;
}

export const EmptyRoutineState: React.FC<EmptyRoutineStateProps> = React.memo(
  function EmptyRoutineState({
    title = 'No Routines Found',
    message = 'Get started by creating your first daily or weekly routine foundation.',
    actionLabel = 'Create New Routine',
    onAction,
  }) {
    return (
      <View className="flex-1 items-center justify-center p-6 my-8 gap-4">
        {/* Glow decoration */}
        <View className="w-20 h-20 bg-emerald-500/10 rounded-full items-center justify-center border border-emerald-500/20">
          <Text className="text-3xl">🌱</Text>
        </View>

        <View className="items-center gap-1 max-w-xs">
          <Text className="text-zinc-100 text-lg font-bold text-center tracking-tight">
            {title}
          </Text>
          <Text className="text-zinc-400 text-sm text-center font-normal leading-relaxed">
            {message}
          </Text>
        </View>

        {onAction ? (
          <TouchableOpacity
            className="mt-2 bg-emerald-500 active:bg-emerald-600 px-5 py-3 rounded-xl flex-row items-center justify-center shadow-lg shadow-emerald-500/20"
            onPress={onAction}
            accessibilityRole="button"
            accessibilityLabel={actionLabel}
          >
            <Text className="text-zinc-950 font-bold text-sm">{actionLabel}</Text>
          </TouchableOpacity>
        ) : null}
      </View>
    );
  }
);
