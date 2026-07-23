import React, { useState, useMemo } from 'react';
import { View, ScrollView, Text, TouchableOpacity, Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { useHairTimeline } from '../hooks/useHairTimeline';
import type { HairPhotoVM } from '../types';
import { ComparisonCard, LoadingHaircare, EmptyGallery, ErrorHaircare } from '../components';

export const ComparePhotosScreen: React.FC = function ComparePhotosScreen() {
  const router = useRouter();
  const { photos, isLoading, isError, error, refetch } = useHairTimeline();

  // Auto-select initial Before (oldest) and After (newest) photos
  const sortedChronological = useMemo(() => {
    return [...photos].sort((a, b) => a.captureDate.localeCompare(b.captureDate));
  }, [photos]);

  const defaultBefore = sortedChronological[0] || null;
  const defaultAfter = sortedChronological[sortedChronological.length - 1] || null;

  const [selectedBefore, setSelectedBefore] = useState<HairPhotoVM | null>(defaultBefore);
  const [selectedAfter, setSelectedAfter] = useState<HairPhotoVM | null>(defaultAfter);

  if (isLoading) {
    return (
      <SafeAreaView className="flex-1 bg-zinc-950">
        <LoadingHaircare />
      </SafeAreaView>
    );
  }

  if (isError) {
    return (
      <SafeAreaView className="flex-1 bg-zinc-950">
        <ErrorHaircare errorMessage={error?.message} onRetry={() => void refetch()} />
      </SafeAreaView>
    );
  }

  if (photos.length < 2) {
    return (
      <SafeAreaView className="flex-1 bg-zinc-950 p-4 gap-4">
        <TouchableOpacity onPress={() => router.back()} accessibilityRole="button">
          <Text className="text-amber-400 text-xs font-semibold">← Back to Timeline</Text>
        </TouchableOpacity>

        <EmptyGallery onUploadPress={() => router.push('/(app)/haircare/timeline')} />
      </SafeAreaView>
    );
  }

  const beforePhoto = selectedBefore || defaultBefore;
  const afterPhoto = selectedAfter || defaultAfter;

  return (
    <SafeAreaView className="flex-1 bg-zinc-950">
      <ScrollView className="flex-1" contentContainerStyle={{ padding: 16, gap: 16 }}>
        {/* Header */}
        <View>
          <TouchableOpacity onPress={() => router.back()} accessibilityRole="button">
            <Text className="text-amber-400 text-xs font-semibold mb-1">← Back to Timeline</Text>
          </TouchableOpacity>
          <Text className="text-zinc-50 text-2xl font-extrabold">Progress Comparison</Text>
          <Text className="text-zinc-400 text-xs mt-0.5">
            Select any two progress photos to compare growth and hair density changes.
          </Text>
        </View>

        {/* Side by Side Comparison Display */}
        {beforePhoto && afterPhoto ? (
          <ComparisonCard beforePhoto={beforePhoto} afterPhoto={afterPhoto} />
        ) : null}

        {/* Photo Selection Triggers */}
        <View className="gap-3 bg-zinc-900 border border-zinc-800 p-4 rounded-2xl">
          <Text className="text-zinc-400 text-xs font-semibold uppercase tracking-wider">
            Select Photo Models
          </Text>

          {/* Before Picker */}
          <View className="gap-1.5">
            <Text className="text-amber-400 text-xs font-bold">1. Select BEFORE Photo:</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ gap: 8 }}>
              {photos.map((p) => {
                const isSelected = beforePhoto?.id === p.id;
                return (
                  <TouchableOpacity
                    key={`before_${p.id}`}
                    className={`w-16 h-16 rounded-xl overflow-hidden border-2 ${
                      isSelected ? 'border-amber-500 scale-105' : 'border-zinc-800 opacity-60'
                    }`}
                    onPress={() => setSelectedBefore(p)}
                  >
                    <Image source={{ uri: p.photoUrl }} className="w-full h-full" resizeMode="cover" />
                  </TouchableOpacity>
                );
              })}
            </ScrollView>
          </View>

          {/* After Picker */}
          <View className="gap-1.5 pt-2 border-t border-zinc-800/60">
            <Text className="text-emerald-400 text-xs font-bold">2. Select AFTER Photo:</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ gap: 8 }}>
              {photos.map((p) => {
                const isSelected = afterPhoto?.id === p.id;
                return (
                  <TouchableOpacity
                    key={`after_${p.id}`}
                    className={`w-16 h-16 rounded-xl overflow-hidden border-2 ${
                      isSelected ? 'border-emerald-500 scale-105' : 'border-zinc-800 opacity-60'
                    }`}
                    onPress={() => setSelectedAfter(p)}
                  >
                    <Image source={{ uri: p.photoUrl }} className="w-full h-full" resizeMode="cover" />
                  </TouchableOpacity>
                );
              })}
            </ScrollView>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};
