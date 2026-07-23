import React, { useMemo, useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { useRoutine } from '../hooks/useRoutine';
import {
  useCompleteRoutine,
  useSkipRoutine,
  useUndoCompletion,
} from '../hooks/useRoutineMutations';
import { getRoutineStatusForDate, calculateCompletionRate } from '../engine/completion';
import { RoutineStatusBadge } from '../components/RoutineStatusBadge';
import { FullScreenLoader, InlineLoader } from '@/shared/components';

const TYPE_ICONS: Record<string, string> = {
  haircare: '💇‍♂️',
  skincare: '🧴',
  water: '💧',
  nutrition: '🥗',
  gym: '🏋️‍♂️',
  sleep: '😴',
  medication: '💊',
  custom: '🎯',
};

export const RoutineDetailsScreen: React.FC = function RoutineDetailsScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();
  const routineId = id ?? '';

  const { routine, logs, isLoading, isError, error } = useRoutine(routineId);
  const completeMutation = useCompleteRoutine();
  const skipMutation = useSkipRoutine();
  const undoMutation = useUndoCompletion();

  const [activeActionId, setActiveActionId] = useState<string | null>(null);

  const todayStr = useMemo(() => new Date().toISOString().split('T')[0], []);

  // Compute status for today
  const todayStatus = useMemo(() => {
    if (!routine) return 'pending';
    return getRoutineStatusForDate(routine, logs, todayStr);
  }, [routine, logs, todayStr]);

  // Compute completion rate over the last 30 days
  const completionStats = useMemo(() => {
    if (!routine) return { completed: 0, scheduled: 0, rate: 0 };
    const end = new Date();
    const start = new Date();
    start.setDate(start.getDate() - 30);

    const startStr = start.toISOString().split('T')[0];
    const endStr = end.toISOString().split('T')[0];

    return calculateCompletionRate(routine, logs, startStr, endStr);
  }, [routine, logs]);

  if (isLoading) {
    return <FullScreenLoader message="Loading routine details..." />;
  }

  if (isError || !routine) {
    return (
      <SafeAreaView className="flex-1 bg-zinc-950 items-center justify-center p-6 gap-4">
        <Text className="text-rose-500 font-bold text-lg">Routine Not Found</Text>
        <Text className="text-zinc-400 text-xs text-center">
          {error?.message ?? 'The requested routine does not exist.'}
        </Text>
        <TouchableOpacity
          className="px-5 py-2.5 bg-zinc-900 border border-zinc-800 rounded-xl"
          onPress={() => router.back()}
        >
          <Text className="text-zinc-200 font-semibold text-xs">Go Back</Text>
        </TouchableOpacity>
      </SafeAreaView>
    );
  }

  const icon = TYPE_ICONS[routine.type] ?? '🎯';

  const handleComplete = async () => {
    setActiveActionId('complete');
    try {
      await completeMutation.mutateAsync({
        routineId,
        dateStr: todayStr,
      });
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Failed to complete routine';
      Alert.alert('Completion Error', msg);
    } finally {
      setActiveActionId(null);
    }
  };

  const handleSkip = async () => {
    setActiveActionId('skip');
    try {
      await skipMutation.mutateAsync({
        routineId,
        dateStr: todayStr,
      });
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Failed to skip routine';
      Alert.alert('Skip Error', msg);
    } finally {
      setActiveActionId(null);
    }
  };

  const handleUndo = async (logId: string) => {
    setActiveActionId(logId);
    try {
      await undoMutation.mutateAsync({
        routineId,
        logId,
      });
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Failed to undo log';
      Alert.alert('Undo Error', msg);
    } finally {
      setActiveActionId(null);
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-zinc-950">
      {/* Header Bar */}
      <View className="flex-row items-center justify-between px-4 py-3 border-b border-zinc-900">
        <TouchableOpacity
          className="px-3 py-1.5 rounded-xl bg-zinc-900 border border-zinc-800"
          onPress={() => router.back()}
          accessibilityRole="button"
          accessibilityLabel="Go back to list"
        >
          <Text className="text-zinc-300 font-semibold text-xs">← Back</Text>
        </TouchableOpacity>

        <Text className="text-zinc-100 font-extrabold text-base numberOfLines={1}">
          Routine Overview
        </Text>

        <TouchableOpacity
          className="px-3 py-1.5 rounded-xl bg-zinc-900 border border-zinc-800"
          onPress={() => router.push(`/(app)/routines/${routineId}/edit`)}
          accessibilityRole="button"
          accessibilityLabel="Edit routine"
        >
          <Text className="text-emerald-400 font-semibold text-xs">Edit</Text>
        </TouchableOpacity>
      </View>

      <ScrollView
        className="flex-1"
        contentContainerStyle={{ padding: 16, gap: 16 }}
        showsVerticalScrollIndicator={false}
      >
        {/* Title Header Card */}
        <View className="bg-zinc-900/90 border border-zinc-800/80 rounded-2xl p-5 gap-3">
          <View className="flex-row items-center justify-between">
            <View className="flex-row items-center gap-3">
              <View className="w-12 h-12 rounded-2xl bg-zinc-800 items-center justify-center border border-zinc-700/60">
                <Text className="text-2xl">{icon}</Text>
              </View>
              <View className="flex-1 pr-2">
                <Text className="text-zinc-100 text-xl font-extrabold tracking-tight">
                  {routine.title}
                </Text>
                <Text className="text-zinc-400 text-xs font-medium capitalize">
                  {routine.type} • {routine.schedule.frequency}
                </Text>
              </View>
            </View>

            <RoutineStatusBadge status={todayStatus} size="md" />
          </View>

          {routine.description ? (
            <Text className="text-zinc-300 text-sm font-normal leading-relaxed pt-1">
              {routine.description}
            </Text>
          ) : null}
        </View>

        {/* Action Buttons for Today */}
        <View className="bg-zinc-900/90 border border-zinc-800/80 rounded-2xl p-4 gap-3">
          <Text className="text-zinc-400 text-xs font-semibold uppercase tracking-wider">
            Today&apos;s Log ({todayStr})
          </Text>

          <View className="flex-row gap-3">
            <TouchableOpacity
              className={`flex-1 py-3.5 rounded-xl items-center justify-center border ${
                todayStatus === 'completed'
                  ? 'bg-emerald-950/60 border-emerald-800/80'
                  : 'bg-emerald-500 active:bg-emerald-600 border-emerald-400'
              }`}
              onPress={handleComplete}
              disabled={activeActionId !== null}
              accessibilityRole="button"
              accessibilityLabel="Mark routine as completed today"
            >
              {activeActionId === 'complete' ? (
                <InlineLoader label="Saving..." color="#09090b" />
              ) : (
                <Text
                  className={`font-extrabold text-sm ${
                    todayStatus === 'completed' ? 'text-emerald-400' : 'text-zinc-950'
                  }`}
                >
                  {todayStatus === 'completed' ? '✓ Completed Today' : 'Mark Completed'}
                </Text>
              )}
            </TouchableOpacity>

            <TouchableOpacity
              className={`px-5 py-3.5 rounded-xl items-center justify-center border ${
                todayStatus === 'skipped'
                  ? 'bg-amber-950/60 border-amber-800/80'
                  : 'bg-zinc-800 active:bg-zinc-700 border-zinc-700'
              }`}
              onPress={handleSkip}
              disabled={activeActionId !== null}
              accessibilityRole="button"
              accessibilityLabel="Skip routine today"
            >
              {activeActionId === 'skip' ? (
                <InlineLoader label="..." color="#f59e0b" />
              ) : (
                <Text
                  className={`font-semibold text-sm ${
                    todayStatus === 'skipped' ? 'text-amber-400' : 'text-zinc-300'
                  }`}
                >
                  Skip
                </Text>
              )}
            </TouchableOpacity>
          </View>
        </View>

        {/* Stats Grid */}
        <View className="flex-row gap-3">
          {/* Current Streak */}
          <View className="flex-1 bg-zinc-900/90 border border-zinc-800/80 rounded-2xl p-4 gap-1">
            <Text className="text-zinc-400 text-xs font-semibold uppercase tracking-wider">
              Current Streak
            </Text>
            <View className="flex-row items-baseline gap-1">
              <Text className="text-amber-500 text-2xl font-black">🔥 {routine.currentStreak}</Text>
              <Text className="text-zinc-400 text-xs font-medium">days</Text>
            </View>
            <Text className="text-zinc-500 text-[10px] mt-1">
              Longest: {routine.longestStreak} days
            </Text>
          </View>

          {/* 30-Day Completion Rate */}
          <View className="flex-1 bg-zinc-900/90 border border-zinc-800/80 rounded-2xl p-4 gap-1">
            <Text className="text-zinc-400 text-xs font-semibold uppercase tracking-wider">
              30-Day Rate
            </Text>
            <View className="flex-row items-baseline gap-1">
              <Text className="text-emerald-400 text-2xl font-black">
                {Math.round(completionStats.rate)}%
              </Text>
            </View>
            <Text className="text-zinc-500 text-[10px] mt-1">
              {completionStats.completed} of {completionStats.scheduled} scheduled days
            </Text>
          </View>
        </View>

        {/* Recent Completion Logs History */}
        <View className="bg-zinc-900/90 border border-zinc-800/80 rounded-2xl p-4 gap-3">
          <View className="flex-row items-center justify-between border-b border-zinc-800/80 pb-2">
            <Text className="text-zinc-400 text-xs font-semibold uppercase tracking-wider">
              Completion History
            </Text>
            <Text className="text-zinc-500 text-xs font-medium">
              {logs.length} record(s)
            </Text>
          </View>

          {logs.length === 0 ? (
            <Text className="text-zinc-500 text-xs py-4 text-center">
              No completion history logged yet.
            </Text>
          ) : (
            <View className="gap-2.5">
              {logs.map((log) => (
                <View
                  key={log.id}
                  className="flex-row items-center justify-between bg-zinc-950/60 border border-zinc-800/60 p-3 rounded-xl"
                >
                  <View className="gap-0.5">
                    <Text className="text-zinc-200 text-sm font-semibold">{log.date}</Text>
                    <Text className="text-zinc-500 text-xs">Logged at {log.time}</Text>
                  </View>

                  <View className="flex-row items-center gap-3">
                    <RoutineStatusBadge status={log.status} size="sm" />

                    <TouchableOpacity
                      className="px-2.5 py-1 rounded-lg bg-zinc-800 active:bg-zinc-700"
                      onPress={() => void handleUndo(log.id)}
                      disabled={activeActionId !== null}
                      accessibilityRole="button"
                      accessibilityLabel={`Undo completion log for ${log.date}`}
                    >
                      {activeActionId === log.id ? (
                        <InlineLoader label="" color="#ef4444" />
                      ) : (
                        <Text className="text-rose-400 text-xs font-medium">Undo</Text>
                      )}
                    </TouchableOpacity>
                  </View>
                </View>
              ))}
            </View>
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};
