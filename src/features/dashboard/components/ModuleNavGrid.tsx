import React from 'react';
import { View, Text, TouchableOpacity, Alert } from 'react-native';
import type { ModuleNavVM } from '../types';

interface ModuleNavGridProps {
  readonly modules: ModuleNavVM[];
  readonly onModulePress: (route: string) => void;
}

export const ModuleNavGrid: React.FC<ModuleNavGridProps> = React.memo(
  function ModuleNavGrid({ modules, onModulePress }) {
    const handlePress = (mod: ModuleNavVM) => {
      if (mod.enabled) {
        onModulePress(mod.route);
      } else {
        Alert.alert(
          `${mod.title}`,
          `${mod.description}\n\nThis module is under active development and will launch in a future update!`,
          [{ text: 'Got it', style: 'default' }]
        );
      }
    };

    return (
      <View className="bg-zinc-900/90 border border-zinc-800/80 rounded-2xl p-4 gap-3 shadow-md">
        <View className="flex-row items-center justify-between">
          <Text className="text-zinc-400 text-xs font-semibold uppercase tracking-wider">
            SelfOS Health Modules
          </Text>
          <Text className="text-zinc-500 text-[10px]">Portal</Text>
        </View>

        <View className="flex-row flex-wrap gap-2.5">
          {modules.map((mod) => (
            <TouchableOpacity
              key={mod.id}
              className={`w-[48%] p-3.5 rounded-xl border ${
                mod.enabled
                  ? 'bg-zinc-950/80 border-emerald-500/40 active:border-emerald-500'
                  : 'bg-zinc-950/40 border-zinc-800/60 opacity-70'
              }`}
              onPress={() => handlePress(mod)}
              accessibilityRole="button"
              accessibilityLabel={`${mod.title}, ${mod.enabled ? 'Enabled' : 'Coming soon'}`}
            >
              <View className="flex-row items-center justify-between mb-1.5">
                <Text className="text-2xl">{mod.icon}</Text>

                {mod.badge ? (
                  <View className="bg-emerald-500/10 border border-emerald-500/30 px-2 py-0.5 rounded-full">
                    <Text className="text-emerald-400 text-[9px] font-extrabold">{mod.badge}</Text>
                  </View>
                ) : mod.comingSoon ? (
                  <View className="bg-zinc-800 px-2 py-0.5 rounded-full">
                    <Text className="text-zinc-400 text-[9px] font-semibold">Soon</Text>
                  </View>
                ) : null}
              </View>

              <Text className="text-zinc-100 text-sm font-bold" numberOfLines={1}>
                {mod.title}
              </Text>
              <Text className="text-zinc-500 text-[10px] mt-0.5" numberOfLines={1}>
                {mod.description}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>
    );
  }
);
