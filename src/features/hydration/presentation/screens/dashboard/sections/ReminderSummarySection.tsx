import React from 'react';
import { View, Text } from 'react-native';

export interface ReminderSummarySectionProps {
  readonly reminderEnabled: boolean;
  readonly intervalMinutes: number;
  readonly wakeTime: string;
  readonly sleepTime: string;
  readonly nextReminderTime?: string;
}

export const ReminderSummarySection: React.FC<ReminderSummarySectionProps> = React.memo(function ReminderSummarySection({
  reminderEnabled,
  intervalMinutes,
  wakeTime,
  sleepTime,
  nextReminderTime = 'None Scheduled',
}) {
  return (
    <View className="bg-zinc-950 border border-zinc-900 rounded-3xl p-5 gap-3 my-2">
      <Text className="text-zinc-100 font-bold text-sm">Reminders Overview</Text>
      <View className="flex-row justify-between items-center bg-zinc-900/50 border border-zinc-800/40 p-4 rounded-2xl">
        <View className="gap-0.5">
          <Text className="text-zinc-500 text-[9px] uppercase font-bold tracking-widest">Next Scheduled Reminder</Text>
          <Text className="text-blue-400 font-extrabold text-base mt-0.5">{nextReminderTime}</Text>
        </View>
        <View className="items-end gap-0.5">
          <Text className="text-zinc-500 text-[9px] uppercase font-bold tracking-widest">Interval</Text>
          <Text className="text-zinc-200 font-bold text-sm mt-0.5">{intervalMinutes} mins</Text>
        </View>
      </View>
      <Text className="text-zinc-500 text-[10px] leading-relaxed">
        Active window: {wakeTime} to {sleepTime}. Reminders are paused during sleep hours. Smart auto-adjustments are enabled.
      </Text>
    </View>
  );
});
