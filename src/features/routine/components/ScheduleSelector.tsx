import React from 'react';
import { View, Text, TextInput, TouchableOpacity } from 'react-native';
import type { RoutineFrequency } from '../types';
import { FrequencySelector } from './FrequencySelector';

interface ScheduleValues {
  frequency: RoutineFrequency;
  interval: number;
  daysOfWeek?: number[];
  daysOfMonth?: number[];
  startDate: string;
  endDate?: string | null;
  timezone: string;
}

interface ScheduleSelectorProps {
  readonly value: ScheduleValues;
  readonly onChange: (updated: ScheduleValues) => void;
  readonly errors?: Record<string, string | undefined>;
}

const WEEKDAYS = [
  { label: 'S', value: 0 },
  { label: 'M', value: 1 },
  { label: 'T', value: 2 },
  { label: 'W', value: 3 },
  { label: 'T', value: 4 },
  { label: 'F', value: 5 },
  { label: 'S', value: 6 },
];

export const ScheduleSelector: React.FC<ScheduleSelectorProps> = React.memo(
  function ScheduleSelector({ value, onChange, errors = {} }) {
    const handleFrequencyChange = (freq: RoutineFrequency) => {
      onChange({
        ...value,
        frequency: freq,
        interval: 1,
        daysOfWeek: freq === 'weekly' ? [1, 3] : undefined, // Default Mon & Wed
        daysOfMonth: freq === 'monthly' ? [1, 15] : undefined, // Default 1st & 15th
      });
    };

    const toggleWeekday = (day: number) => {
      const currentDays = value.daysOfWeek ?? [];
      const updated = currentDays.includes(day)
        ? currentDays.filter((d) => d !== day)
        : [...currentDays, day].sort();

      onChange({
        ...value,
        daysOfWeek: updated,
      });
    };

    const handleIntervalChange = (text: string) => {
      const parsed = parseInt(text, 10);
      onChange({
        ...value,
        interval: isNaN(parsed) || parsed < 1 ? 1 : parsed,
      });
    };

    return (
      <View className="gap-4">
        {/* Frequency selector pills */}
        <FrequencySelector
          selectedFrequency={value.frequency}
          onChange={handleFrequencyChange}
        />

        {/* Interval input */}
        <View className="gap-1.5">
          <Text className="text-zinc-400 text-xs font-semibold uppercase tracking-wider">
            Repeat Interval
          </Text>
          <View className="flex-row items-center bg-zinc-900 border border-zinc-800 rounded-xl px-4 py-2.5">
            <Text className="text-zinc-400 text-sm mr-2">Every</Text>
            <TextInput
              className="text-zinc-100 font-bold text-sm min-w-[40px]"
              keyboardType="number-pad"
              value={String(value.interval)}
              onChangeText={handleIntervalChange}
              maxLength={3}
            />
            <Text className="text-zinc-400 text-sm ml-2">
              {value.frequency === 'daily'
                ? 'day(s)'
                : value.frequency === 'weekly'
                ? 'week(s)'
                : value.frequency === 'monthly'
                ? 'month(s)'
                : 'days'}
            </Text>
          </View>
        </View>

        {/* Weekly Day Picker */}
        {value.frequency === 'weekly' ? (
          <View className="gap-1.5">
            <Text className="text-zinc-400 text-xs font-semibold uppercase tracking-wider">
              Repeat On
            </Text>
            <View className="flex-row justify-between gap-1">
              {WEEKDAYS.map((day) => {
                const isSelected = value.daysOfWeek?.includes(day.value);
                return (
                  <TouchableOpacity
                    key={day.value}
                    className={`w-10 h-10 rounded-xl items-center justify-center border ${
                      isSelected
                        ? 'bg-emerald-500 border-emerald-400 shadow-sm'
                        : 'bg-zinc-900 border-zinc-800'
                    }`}
                    onPress={() => toggleWeekday(day.value)}
                    accessibilityRole="button"
                    accessibilityLabel={`Select weekday ${day.label}`}
                    accessibilityState={{ selected: Boolean(isSelected) }}
                  >
                    <Text
                      className={`text-sm font-bold ${
                        isSelected ? 'text-zinc-950' : 'text-zinc-400'
                      }`}
                    >
                      {day.label}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </View>
            {errors.daysOfWeek ? (
              <Text className="text-rose-500 text-xs mt-1">{errors.daysOfWeek}</Text>
            ) : null}
          </View>
        ) : null}

        {/* Start Date & Timezone */}
        <View className="flex-row gap-3">
          <View className="flex-1 gap-1.5">
            <Text className="text-zinc-400 text-xs font-semibold uppercase tracking-wider">
              Start Date
            </Text>
            <TextInput
              className="bg-zinc-900 border border-zinc-800 rounded-xl px-4 py-3 text-zinc-100 text-sm font-medium"
              placeholder="YYYY-MM-DD"
              placeholderTextColor="#71717a"
              value={value.startDate}
              onChangeText={(startDate) => onChange({ ...value, startDate })}
            />
          </View>

          <View className="flex-1 gap-1.5">
            <Text className="text-zinc-400 text-xs font-semibold uppercase tracking-wider">
              Timezone
            </Text>
            <TextInput
              className="bg-zinc-900 border border-zinc-800 rounded-xl px-4 py-3 text-zinc-100 text-sm font-medium"
              placeholder="Asia/Kolkata"
              placeholderTextColor="#71717a"
              value={value.timezone}
              onChangeText={(timezone) => onChange({ ...value, timezone })}
            />
          </View>
        </View>
      </View>
    );
  }
);
