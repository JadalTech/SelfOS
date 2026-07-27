import React, { useState, useMemo } from 'react';
import { View, Text, ScrollView, TouchableOpacity, SafeAreaView } from 'react-native';
import { useRouter } from 'expo-router';
import { usePersonalRecords } from '../../hooks/useWorkout';
import { PersonalRecordCard } from '../components';
import { SkeletonLoader, ErrorStateCard } from '../../../../shared/components';

export const PersonalRecordsScreen: React.FC = function PersonalRecordsScreen() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<'all' | 'one-rep-max' | 'max-weight' | 'highest-volume' | 'max-reps'>('all');
  const { personalRecordsVM, isLoading, isError, refetch } = usePersonalRecords();

  const filteredPrs = useMemo(() => {
    if (activeTab === 'all') return personalRecordsVM;
    return personalRecordsVM.filter((pr) => pr.type === activeTab);
  }, [personalRecordsVM, activeTab]);

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
              Achievements
            </Text>
            <Text className="text-zinc-50 text-xl font-extrabold tracking-tight">
              Personal Records
            </Text>
          </View>
        </View>

        {/* Filter Tabs */}
        <View className="h-8">
          <ScrollView horizontal showsHorizontalScrollIndicator={false} className="flex-row gap-2">
            {[
              { value: 'all', label: '🏆 All Records' },
              { value: 'one-rep-max', label: '🎯 Est. 1RM' },
              { value: 'max-weight', label: '💪 Max Weight' },
              { value: 'highest-volume', label: '📊 Max Volume' },
              { value: 'max-reps', label: '🔥 Max Reps' },
            ].map((tab) => {
              const isSelected = activeTab === tab.value;
              return (
                <TouchableOpacity
                  key={tab.value}
                  onPress={() => setActiveTab(tab.value as any)}
                  className={`px-3 py-1 rounded-full border items-center justify-center ${
                    isSelected
                      ? 'bg-violet-600 border-violet-500'
                      : 'bg-zinc-900 border-zinc-800'
                  }`}
                >
                  <Text className={`text-[10px] font-bold ${isSelected ? 'text-zinc-50' : 'text-zinc-400'}`}>
                    {tab.label}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </ScrollView>
        </View>

        {/* Grid Display of Achievements */}
        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 32 }}>
          {isLoading ? (
            <View className="flex-row flex-wrap gap-3">
              <View className="flex-1 min-w-[150px]"><SkeletonLoader height={140} /></View>
              <View className="flex-1 min-w-[150px]"><SkeletonLoader height={140} /></View>
            </View>
          ) : isError ? (
            <ErrorStateCard message="Failed to load personal records achievements" onRetry={refetch} />
          ) : (
            <>
              <View className="flex-row flex-wrap gap-3">
                {filteredPrs.map((pr) => (
                  <View key={pr.id} className="min-w-[45%] flex-1">
                    <PersonalRecordCard pr={pr} />
                  </View>
                ))}
              </View>

              {filteredPrs.length === 0 ? (
                <View className="py-16 items-center justify-center bg-zinc-900/30 border border-dashed border-zinc-800 rounded-2xl w-full mt-2">
                  <Text className="text-zinc-500 text-sm font-semibold">No records in this category</Text>
                  <Text className="text-zinc-600 text-xs mt-1">Keep pushing! Your achievements will show here</Text>
                </View>
              ) : null}
            </>
          )}
        </ScrollView>
      </View>
    </SafeAreaView>
  );
};
