import React from 'react';
import { View, Text, ScrollView } from 'react-native';
import { useHydrationReminderViewModel } from '../viewmodels/useHydrationReminderViewModel';
import { FeatureLayout } from '../layouts/FeatureLayout';
import { LoadingState } from '../components';

export const HydrationRemindersScreen: React.FC = React.memo(function HydrationRemindersScreen() {
  const { schedule, reminderEnabled, intervalMinutes, startTime, endTime, isLoading } = useHydrationReminderViewModel();

  if (isLoading) return <LoadingState />;

  return (
    <FeatureLayout title="Reminders" showBackButton={true}>
      <ScrollView className="flex-1 bg-black p-4 gap-4" contentContainerStyle={{ paddingBottom: 40 }}>
        <View className="bg-zinc-950 border border-zinc-900 rounded-3xl p-5 gap-2 my-2">
          <Text className="text-zinc-500 text-[10px] uppercase font-bold tracking-widest">Active Reminders</Text>
          <Text className="text-zinc-100 font-extrabold text-lg">
            {reminderEnabled ? 'Enabled' : 'Disabled'}
          </Text>
          <Text className="text-zinc-400 text-xs mt-1 leading-relaxed">
            Every {intervalMinutes} minutes from {startTime} to {endTime}.
          </Text>
        </View>

        {/* Schedule list */}
        <View className="bg-zinc-950 border border-zinc-900 rounded-3xl p-5 gap-3">
          <Text className="text-zinc-100 font-bold text-sm">Scheduled Reminders</Text>
          <View className="gap-2.5 mt-1">
            {schedule.map((item, idx) => (
              <View key={idx} className="flex-row items-center justify-between border-b border-zinc-900 pb-2.5 last:border-b-0 last:pb-0">
                <Text className="text-zinc-200 font-bold text-sm">{item.time}</Text>
                <Text className="text-zinc-500 text-xs">{item.label}</Text>
              </View>
            ))}
          </View>
        </View>
      </ScrollView>
    </FeatureLayout>
  );
});
export default HydrationRemindersScreen;
