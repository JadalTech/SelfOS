import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';

interface EmptyHaircareProps {
  readonly title?: string;
  readonly message?: string;
  readonly actionLabel?: string;
  readonly onAction?: () => void;
}

export const EmptyHaircare: React.FC<EmptyHaircareProps> = React.memo(
  function EmptyHaircare({
    title = 'No Haircare Items Found',
    message = 'Start building your haircare regimen by adding your first hair product or routine.',
    actionLabel,
    onAction,
  }) {
    return (
      <View className="bg-zinc-900/90 border border-zinc-800/80 rounded-2xl p-6 items-center gap-3 my-2">
        <View className="w-14 h-14 rounded-2xl bg-amber-500/10 border border-amber-500/20 items-center justify-center">
          <Text className="text-2xl">💇‍♂️</Text>
        </View>

        <Text className="text-zinc-100 text-base font-bold text-center">{title}</Text>
        <Text className="text-zinc-400 text-xs text-center leading-relaxed max-w-xs">{message}</Text>

        {actionLabel && onAction ? (
          <TouchableOpacity
            className="bg-emerald-500 active:bg-emerald-600 px-5 py-3 rounded-xl mt-1"
            onPress={onAction}
            accessibilityRole="button"
          >
            <Text className="text-zinc-950 font-extrabold text-xs">{actionLabel}</Text>
          </TouchableOpacity>
        ) : null}
      </View>
    );
  }
);
