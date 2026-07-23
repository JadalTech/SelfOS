import React from 'react';
import { View, Text } from 'react-native';
import type { GreetingVM } from '../types';

interface DashboardHeaderProps {
  readonly greeting: GreetingVM;
}

export const DashboardHeader: React.FC<DashboardHeaderProps> = React.memo(
  function DashboardHeader({ greeting }) {
    const avatarInitial = greeting.name.trim().charAt(0).toUpperCase() || 'U';

    return (
      <View className="flex-row items-center justify-between pb-3">
        <View className="gap-0.5">
          <Text className="text-zinc-500 text-xs font-semibold uppercase tracking-wider">
            {greeting.formattedDate}
          </Text>
          <Text className="text-zinc-400 text-sm font-medium">
            {greeting.greetingText}
          </Text>
          <Text className="text-zinc-50 text-2xl font-extrabold tracking-tight">
            {greeting.name}
          </Text>
        </View>

        {/* User Avatar Circle */}
        <View className="w-12 h-12 rounded-full bg-emerald-500/10 border border-emerald-500/30 items-center justify-center shadow-md">
          <Text className="text-emerald-400 font-extrabold text-lg">{avatarInitial}</Text>
        </View>
      </View>
    );
  }
);
