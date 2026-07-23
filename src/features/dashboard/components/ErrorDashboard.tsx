import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';

interface ErrorDashboardProps {
  readonly errorMessage?: string;
  readonly onRetry: () => void;
}

export const ErrorDashboard: React.FC<ErrorDashboardProps> = React.memo(
  function ErrorDashboard({ errorMessage = 'Unable to load dashboard metrics.', onRetry }) {
    return (
      <View className="flex-1 items-center justify-center p-6 gap-4">
        <View className="w-16 h-16 rounded-2xl bg-rose-500/10 border border-rose-500/20 items-center justify-center">
          <Text className="text-3xl">⚠️</Text>
        </View>

        <View className="items-center gap-1">
          <Text className="text-zinc-100 text-lg font-bold text-center">
            Dashboard Sync Error
          </Text>
          <Text className="text-zinc-400 text-xs text-center leading-relaxed max-w-xs">
            {errorMessage}
          </Text>
        </View>

        <TouchableOpacity
          className="px-6 py-3 bg-zinc-900 border border-zinc-800 rounded-xl active:bg-zinc-800"
          onPress={onRetry}
          accessibilityRole="button"
          accessibilityLabel="Retry loading dashboard"
        >
          <Text className="text-zinc-200 font-bold text-xs">Retry Connection</Text>
        </TouchableOpacity>
      </View>
    );
  }
);
