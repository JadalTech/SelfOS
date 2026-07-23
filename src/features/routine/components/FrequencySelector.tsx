import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import type { RoutineFrequency } from '../types';

interface FrequencySelectorProps {
  readonly selectedFrequency: RoutineFrequency;
  readonly onChange: (frequency: RoutineFrequency) => void;
}

const FREQUENCY_OPTIONS: { label: string; value: RoutineFrequency }[] = [
  { label: 'Daily', value: 'daily' },
  { label: 'Weekly', value: 'weekly' },
  { label: 'Monthly', value: 'monthly' },
  { label: 'Custom', value: 'custom' },
];

export const FrequencySelector: React.FC<FrequencySelectorProps> = React.memo(
  function FrequencySelector({ selectedFrequency, onChange }) {
    return (
      <View className="gap-2">
        <Text className="text-zinc-400 text-xs font-semibold uppercase tracking-wider">
          Frequency
        </Text>
        <View className="flex-row items-center gap-2 bg-zinc-900 border border-zinc-800 p-1.5 rounded-xl">
          {FREQUENCY_OPTIONS.map((opt) => {
            const isSelected = selectedFrequency === opt.value;
            return (
              <TouchableOpacity
                key={opt.value}
                className={`flex-1 py-2.5 rounded-lg items-center justify-center ${
                  isSelected ? 'bg-emerald-500 shadow-md shadow-emerald-500/20' : 'bg-transparent'
                }`}
                onPress={() => onChange(opt.value)}
                accessibilityRole="button"
                accessibilityLabel={`Select frequency ${opt.label}`}
                accessibilityState={{ selected: isSelected }}
              >
                <Text
                  className={`text-xs font-bold ${
                    isSelected ? 'text-zinc-950' : 'text-zinc-400'
                  }`}
                >
                  {opt.label}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>
      </View>
    );
  }
);
