import React, { useState, useMemo } from 'react';
import { View, Text, ScrollView, TextInput, TouchableOpacity, SafeAreaView, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { useWorkoutHistory } from '../../hooks/useWorkout';
import { WorkoutSummaryCard } from '../components';
import { SkeletonLoader, ErrorStateCard } from '../../../../shared/components';

export const WorkoutHistoryScreen: React.FC = function WorkoutHistoryScreen() {
  const router = useRouter();
  const [searchTerm, setSearchTerm] = useState('');
  const { historyVM, isLoading, isError, refetch } = useWorkoutHistory(50);

  const filteredHistory = useMemo(() => {
    return historyVM.filter((s) => {
      const matchesSearch =
        s.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (s.notes || '').toLowerCase().includes(searchTerm.toLowerCase());
      return matchesSearch;
    });
  }, [historyVM, searchTerm]);

  return (
    <SafeAreaView className="flex-1 bg-zinc-950">
      <View className="flex-1 px-4 pt-4 gap-4">
        {/* Header */}
        <View className="flex-row items-center gap-2">
          <TouchableOpacity onPress={() => router.back()} className="p-1">
            <Text className="text-zinc-400 text-lg font-bold">←</Text>
          </TouchableOpacity>
          <View>
            <Text className="text-zinc-500 text-[10px] font-bold uppercase tracking-wider">
              Workout Timeline
            </Text>
            <Text className="text-zinc-50 text-xl font-extrabold tracking-tight">
              Session History
            </Text>
          </View>
        </View>

        {/* Search */}
        <TextInput
          value={searchTerm}
          onChangeText={setSearchTerm}
          placeholder="Search workout logs by name or notes..."
          placeholderTextColor="#71717a"
          className="bg-zinc-900 border border-zinc-800 rounded-xl px-4 py-3 text-zinc-100 text-sm"
        />

        {/* History timeline logs list */}
        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ gap: 12, paddingBottom: 32 }}>
          {isLoading ? (
            <View className="gap-3">
              <SkeletonLoader height={120} />
              <SkeletonLoader height={120} />
              <SkeletonLoader height={120} />
            </View>
          ) : isError ? (
            <ErrorStateCard message="Failed to load workout history logs" onRetry={refetch} />
          ) : (
            <>
              {filteredHistory.map((session) => (
                <WorkoutSummaryCard
                  key={session.id}
                  session={session}
                  onPress={() => {
                    // Alert detail or expand inline
                    Alert.alert(
                      session.name,
                      `Date: ${session.startedAt}\nDuration: ${session.durationFormatted}\nVolume: ${session.totalVolumeLabel}\nReps: ${session.totalRepsLabel}\nCalories: ${session.caloriesBurned} kcal\nIntensity: ${session.estimatedIntensity || 'N/A'}\n\nNotes: ${session.notes || 'No notes.'}`
                    );
                  }}
                />
              ))}

              {filteredHistory.length === 0 ? (
                <View className="py-16 items-center justify-center bg-zinc-900/30 border border-dashed border-zinc-800 rounded-2xl">
                  <Text className="text-zinc-500 text-sm font-semibold">No logs in history</Text>
                  <Text className="text-zinc-600 text-xs mt-1">Start tracking to see completed logs here</Text>
                </View>
              ) : null}
            </>
          )}
        </ScrollView>
      </View>
    </SafeAreaView>
  );
};
