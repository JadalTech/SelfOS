import React from 'react';
import { View, Text } from 'react-native';

export interface DashboardHeaderProps {
  readonly username?: string;
  readonly climate?: string;
}

export const DashboardHeader: React.FC<DashboardHeaderProps> = React.memo(function DashboardHeader({
  username = 'Aura User',
  climate = 'normal',
}) {
  return (
    <View className="py-4 px-2">
      <Text className="text-zinc-400 text-xs font-bold uppercase tracking-widest">Hydration Module</Text>
      <Text className="text-zinc-100 font-extrabold text-2xl tracking-tight mt-1">Hello, {username}</Text>
      <Text className="text-zinc-500 text-xs mt-1">
        Current Climate Setting: <Text className="text-blue-400 capitalize">{climate}</Text>
      </Text>
    </View>
  );
});
