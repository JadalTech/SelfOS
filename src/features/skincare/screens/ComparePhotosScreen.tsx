import React, { useState, useMemo } from 'react';
import { View, Text, TouchableOpacity, ScrollView, SafeAreaView } from 'react-native';
import { useRouter } from 'expo-router';
import { useSkinPhotos } from '../hooks/useSkinPhotos';
import { PhotoComparisonView } from '../../../shared/components/media/PhotoComparisonView';
import { EmptyStateCard } from '../../../shared/components/feedback/EmptyStateCard';
import { ErrorStateCard } from '../../../shared/components/feedback/ErrorStateCard';
import { SkeletonLoader } from '../../../shared/components/loaders/SkeletonLoader';

export function ComparePhotosScreen() {
  const router = useRouter();
  const { photoVMs, isLoading, isError, error, refetch } = useSkinPhotos();

  const [baselinePhotoId, setBaselinePhotoId] = useState<string | null>(null);
  const [currentPhotoId, setCurrentPhotoId] = useState<string | null>(null);

  const baselinePhoto = useMemo(
    () => photoVMs.find((p) => p.id === baselinePhotoId) || photoVMs[photoVMs.length - 1],
    [photoVMs, baselinePhotoId]
  );

  const currentPhoto = useMemo(
    () => photoVMs.find((p) => p.id === currentPhotoId) || photoVMs[0],
    [photoVMs, currentPhotoId]
  );

  return (
    <SafeAreaView className="flex-1 bg-zinc-950">
      <View className="flex-1 p-4 gap-4">
        {/* Header */}
        <View className="flex-row items-center justify-between border-b border-zinc-800 pb-3">
          <View className="flex-row items-center gap-3">
            <TouchableOpacity onPress={() => router.back()} className="p-1">
              <Text className="text-zinc-400 text-lg font-bold">← Back</Text>
            </TouchableOpacity>
            <Text className="text-zinc-50 text-xl font-extrabold">Photo Comparison</Text>
          </View>
        </View>

        {isLoading ? (
          <SkeletonLoader height={240} />
        ) : isError ? (
          <ErrorStateCard message={error?.message} onRetry={refetch} />
        ) : photoVMs.length < 2 ? (
          <EmptyStateCard
            icon="🔍"
            title="Need At Least 2 Photos to Compare"
            description="Upload baseline and current progress photos to compare skin texture, acne clearance, and hyperpigmentation."
            actionLabel="Back to Timeline"
            onAction={() => router.back()}
          />
        ) : (
          <ScrollView contentContainerStyle={{ gap: 16, paddingBottom: 24 }} showsVerticalScrollIndicator={false}>
            {/* Comparison Display View */}
            <PhotoComparisonView
              baselinePhotoUrl={baselinePhoto?.photoUrl}
              baselineDateFormatted={baselinePhoto?.dateFormatted}
              currentPhotoUrl={currentPhoto?.photoUrl}
              currentDateFormatted={currentPhoto?.dateFormatted}
              angleLabel={currentPhoto?.angleLabel}
            />

            {/* Select Baseline Photo */}
            <View className="gap-2 bg-zinc-900 border border-zinc-800 p-4 rounded-2xl">
              <Text className="text-zinc-300 text-xs font-bold">Select Baseline (Before) Photo:</Text>
              <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ gap: 8 }}>
                {photoVMs.map((p) => {
                  const isSelected = baselinePhoto?.id === p.id;
                  return (
                    <TouchableOpacity
                      key={p.id}
                      onPress={() => setBaselinePhotoId(p.id)}
                      className={`px-3 py-2 rounded-xl border ${
                        isSelected ? 'bg-pink-500/20 border-pink-500/50' : 'bg-zinc-950 border-zinc-800'
                      }`}
                    >
                      <Text className={`text-xs font-semibold ${isSelected ? 'text-pink-400' : 'text-zinc-400'}`}>
                        {p.dateFormatted} ({p.angleLabel})
                      </Text>
                    </TouchableOpacity>
                  );
                })}
              </ScrollView>
            </View>

            {/* Select Current Photo */}
            <View className="gap-2 bg-zinc-900 border border-zinc-800 p-4 rounded-2xl">
              <Text className="text-zinc-300 text-xs font-bold">Select Current (After) Photo:</Text>
              <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ gap: 8 }}>
                {photoVMs.map((p) => {
                  const isSelected = currentPhoto?.id === p.id;
                  return (
                    <TouchableOpacity
                      key={p.id}
                      onPress={() => setCurrentPhotoId(p.id)}
                      className={`px-3 py-2 rounded-xl border ${
                        isSelected ? 'bg-cyan-500/20 border-cyan-500/50' : 'bg-zinc-950 border-zinc-800'
                      }`}
                    >
                      <Text className={`text-xs font-semibold ${isSelected ? 'text-cyan-400' : 'text-zinc-400'}`}>
                        {p.dateFormatted} ({p.angleLabel})
                      </Text>
                    </TouchableOpacity>
                  );
                })}
              </ScrollView>
            </View>
          </ScrollView>
        )}
      </View>
    </SafeAreaView>
  );
}
