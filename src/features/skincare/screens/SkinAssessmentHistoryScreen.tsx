import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, FlatList, SafeAreaView } from 'react-native';
import { useRouter } from 'expo-router';
import { useSkinAssessments } from '../hooks/useSkinAssessments';
import { AssessmentCard } from '../components/AssessmentCard';
import { EmptyStateCard } from '../../../shared/components/feedback/EmptyStateCard';
import { ErrorStateCard } from '../../../shared/components/feedback/ErrorStateCard';
import { SkeletonLoader } from '../../../shared/components/loaders/SkeletonLoader';

export function SkinAssessmentHistoryScreen() {
  const router = useRouter();
  const { assessmentVMs, isLoading, isError, error, refetch, deleteAssessment } =
    useSkinAssessments();
  const [searchQuery, setSearchQuery] = useState('');

  const filtered = assessmentVMs.filter((a) => {
    if (!searchQuery.trim()) return true;
    const q = searchQuery.toLowerCase();
    return (
      a.skinTypeLabel.toLowerCase().includes(q) ||
      a.topConcernsFormatted.some((c) => c.label.toLowerCase().includes(q))
    );
  });

  return (
    <SafeAreaView className="flex-1 bg-zinc-950">
      <View className="flex-1 p-4 gap-4">
        {/* Header */}
        <View className="flex-row items-center justify-between">
          <View>
            <Text className="text-zinc-500 text-[10px] font-bold uppercase tracking-wider">
              Condition & Progress
            </Text>
            <Text className="text-zinc-50 text-2xl font-black tracking-tight">
              Skin Assessments
            </Text>
          </View>
          <TouchableOpacity
            activeOpacity={0.8}
            onPress={() => router.push('/(app)/skincare/assessment/new')}
            className="bg-pink-600 px-3.5 py-2 rounded-xl border border-pink-500/40 shadow-sm"
          >
            <Text className="text-white text-xs font-bold">+ New Check-In</Text>
          </TouchableOpacity>
        </View>

        {/* Search */}
        <TextInput
          className="bg-zinc-900 border border-zinc-800 px-3.5 py-2 rounded-xl text-zinc-50 text-xs"
          placeholder="Filter history by skin type or concern..."
          placeholderTextColor="#71717a"
          value={searchQuery}
          onChangeText={setSearchQuery}
        />

        {/* Assessment List */}
        {isLoading ? (
          <View className="gap-3 mt-2">
            <SkeletonLoader height={120} />
            <SkeletonLoader height={120} />
          </View>
        ) : isError ? (
          <ErrorStateCard message={error?.message} onRetry={refetch} />
        ) : filtered.length === 0 ? (
          <EmptyStateCard
            icon="🩺"
            title="No Skin Assessments Logged"
            description="Perform periodic skin self-assessments to track barrier health, hydration levels, and concern severity over time."
            actionLabel="+ Complete First Assessment"
            onAction={() => router.push('/(app)/skincare/assessment/new')}
          />
        ) : (
          <FlatList
            data={filtered}
            keyExtractor={(item) => item.id}
            contentContainerStyle={{ gap: 12, paddingBottom: 24 }}
            showsVerticalScrollIndicator={false}
            renderItem={({ item }) => (
              <AssessmentCard assessment={item} onDelete={() => deleteAssessment(item.id)} />
            )}
          />
        )}
      </View>
    </SafeAreaView>
  );
}
