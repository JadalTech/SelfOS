import React from 'react';
import { View, Text, Switch, TextInput } from 'react-native';
import type { RoutineReminder } from '../types';

interface ReminderPickerProps {
  readonly reminder?: RoutineReminder;
  readonly timezone?: string;
  readonly onChange: (updated?: RoutineReminder) => void;
}

export const ReminderPicker: React.FC<ReminderPickerProps> = React.memo(
  function ReminderPicker({ reminder, timezone = 'UTC', onChange }) {
    const isEnabled = reminder?.enabled ?? false;

    const handleToggle = (enabled: boolean) => {
      if (enabled) {
        onChange({
          id: reminder?.id ?? 'rem-1',
          time: reminder?.time ?? '09:00',
          enabled: true,
        });
      } else {
        onChange(undefined);
      }
    };

    const handleTimeChange = (time: string) => {
      if (!reminder) return;
      onChange({
        ...reminder,
        time,
      });
    };

    return (
      <View className="bg-zinc-900 border border-zinc-800 rounded-2xl p-4 gap-3">
        <View className="flex-row items-center justify-between">
          <View className="gap-0.5">
            <Text className="text-zinc-100 font-bold text-sm">Daily Reminder</Text>
            <Text className="text-zinc-400 text-xs">
              Get notified at your scheduled local time ({timezone})
            </Text>
          </View>

          <Switch
            value={isEnabled}
            onValueChange={handleToggle}
            trackColor={{ false: '#27272a', true: '#10b981' }}
            thumbColor={isEnabled ? '#09090b' : '#71717a'}
            accessibilityLabel="Toggle daily reminder"
          />
        </View>

        {isEnabled && reminder ? (
          <View className="pt-2 border-t border-zinc-800/80 flex-row items-center justify-between">
            <Text className="text-zinc-400 text-xs font-semibold uppercase tracking-wider">
              Reminder Time (HH:mm)
            </Text>
            <TextInput
              className="bg-zinc-950 border border-zinc-800 rounded-xl px-3 py-1.5 text-zinc-100 font-bold text-sm text-center min-w-[70px]"
              value={reminder.time}
              onChangeText={handleTimeChange}
              placeholder="09:00"
              placeholderTextColor="#71717a"
              maxLength={5}
            />
          </View>
        ) : null}
      </View>
    );
  }
);
