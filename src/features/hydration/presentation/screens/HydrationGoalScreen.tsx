import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';
import { useHydrationGoalViewModel } from '../viewmodels/useHydrationGoalViewModel';
import { FeatureLayout } from '../layouts/FeatureLayout';
import { LoadingState } from '../components';
import type { ActivityLevel, ClimateType } from '../../types/hydration.types';

export const HydrationGoalScreen: React.FC = React.memo(function HydrationGoalScreen() {
  const router = useRouter();
  const { goal, saveGoal, isLoading, isSaving, calculateRecommended } = useHydrationGoalViewModel();

  const [dailyTarget, setDailyTarget] = useState(goal?.dailyTargetML.toString() ?? '2500');
  const [weight, setWeight] = useState(goal?.weightKg?.toString() ?? '70');
  const [activity, setActivity] = useState<ActivityLevel>((goal?.activityLevel as ActivityLevel) ?? 'moderate');
  const [climate, setClimate] = useState<ClimateType>((goal?.climate as ClimateType) ?? 'normal');
  const [wakeTime, setWakeTime] = useState(goal?.wakeTime ?? '07:00');
  const [sleepTime, setSleepTime] = useState(goal?.sleepTime ?? '23:00');

  const handleCalculate = () => {
    const w = parseFloat(weight);
    if (isNaN(w) || w <= 0) return;
    const rec = calculateRecommended(w, activity, climate);
    setDailyTarget(rec.toString());
  };

  const handleSave = async () => {
    const target = parseInt(dailyTarget, 10);
    const w = parseFloat(weight);
    if (isNaN(target) || target <= 0) return;

    await saveGoal({
      dailyTargetML: target,
      customTargetEnabled: true,
      weightKg: isNaN(w) ? undefined : w,
      activityLevel: activity,
      climate,
      wakeTime,
      sleepTime,
      reminderEnabled: goal?.reminderEnabled ?? true,
      reminderIntervalMinutes: goal?.reminderIntervalMinutes ?? 60,
      smartAdjustments: goal?.smartAdjustments ?? true,
    });
    router.back();
  };

  if (isLoading) return <LoadingState />;

  return (
    <FeatureLayout title="Goal Settings" showBackButton={true}>
      <ScrollView className="flex-1 bg-black p-4 gap-5" contentContainerStyle={{ paddingBottom: 40 }}>
        {/* Daily Target */}
        <View className="gap-2">
          <Text className="text-zinc-400 text-xs font-bold uppercase tracking-wider">Daily Target (mL)</Text>
          <TextInput
            value={dailyTarget}
            onChangeText={setDailyTarget}
            keyboardType="numeric"
            className="bg-zinc-950 border border-zinc-900 rounded-2xl p-4 text-zinc-100 font-bold text-lg"
          />
        </View>

        {/* Weight */}
        <View className="gap-2 mt-2">
          <Text className="text-zinc-400 text-xs font-bold uppercase tracking-wider">Weight (kg)</Text>
          <TextInput
            value={weight}
            onChangeText={setWeight}
            keyboardType="numeric"
            className="bg-zinc-950 border border-zinc-900 rounded-2xl p-4 text-zinc-100 font-bold text-lg"
          />
        </View>

        {/* Auto Recommendation Calculator Trigger */}
        <TouchableOpacity
          onPress={handleCalculate}
          className="bg-zinc-900 border border-zinc-800 py-3 rounded-xl items-center mt-2"
        >
          <Text className="text-blue-400 font-bold text-xs">Calculate Recommended Intake</Text>
        </TouchableOpacity>

        {/* Activity Level Selector */}
        <View className="gap-2 mt-4">
          <Text className="text-zinc-400 text-xs font-bold uppercase tracking-wider">Activity Level</Text>
          <View className="flex-row flex-wrap gap-2">
            {(['sedentary', 'moderate', 'high', 'very-high'] as const).map((level) => (
              <TouchableOpacity
                key={level}
                onPress={() => setActivity(level)}
                className={`px-4 py-2.5 rounded-full border ${
                  activity === level ? 'bg-blue-600 border-blue-500' : 'bg-zinc-950 border-zinc-900'
                }`}
              >
                <Text className="text-zinc-100 font-bold text-xs capitalize">{level}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Climate Selector */}
        <View className="gap-2 mt-4">
          <Text className="text-zinc-400 text-xs font-bold uppercase tracking-wider">Climate</Text>
          <View className="flex-row flex-wrap gap-2">
            {(['cold', 'normal', 'hot', 'very-hot'] as const).map((type) => (
              <TouchableOpacity
                key={type}
                onPress={() => setClimate(type)}
                className={`px-4 py-2.5 rounded-full border ${
                  climate === type ? 'bg-blue-600 border-blue-500' : 'bg-zinc-950 border-zinc-900'
                }`}
              >
                <Text className="text-zinc-100 font-bold text-xs capitalize">{type}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Save Button */}
        <TouchableOpacity
          activeOpacity={0.8}
          onPress={handleSave}
          disabled={isSaving}
          className="bg-blue-600 active:bg-blue-700 disabled:bg-blue-800/50 py-4 rounded-2xl items-center mt-8"
        >
          <Text className="text-zinc-100 font-extrabold text-sm">
            {isSaving ? 'Saving Goals...' : 'Save Settings'}
          </Text>
        </TouchableOpacity>
      </ScrollView>
    </FeatureLayout>
  );
});
export default HydrationGoalScreen;
