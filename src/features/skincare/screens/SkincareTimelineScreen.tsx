import React, { useState } from 'react';
import { View, Text, TouchableOpacity, FlatList, SafeAreaView } from 'react-native';
import { useRouter } from 'expo-router';
import { useSkinPhotos } from '../hooks/useSkinPhotos';
import { PhotoUploadForm } from '../components/PhotoUploadForm';
import { ProgressPhotoCard } from '../../../shared/components/cards/ProgressPhotoCard';
import { EmptyStateCard } from '../../../shared/components/feedback/EmptyStateCard';
import { ErrorStateCard } from '../../../shared/components/feedback/ErrorStateCard';
import { SkeletonLoader } from '../../../shared/components/loaders/SkeletonLoader';
import { PHOTO_ANGLE_OPTIONS } from '../constants/skincare.constants';
import type { PhotoAngle, ProgressPhotoVM } from '../types';
import type { ProgressPhotoUploadFormValues } from '../validation/skincare.validation';

export function SkincareTimelineScreen() {
  const router = useRouter();
  const { monthlyTimelineGroups, isLoading, isError, error, refetch, uploadPhoto, deletePhoto, isUploading } =
    useSkinPhotos();

  const [selectedAngle, setSelectedAngle] = useState<PhotoAngle | 'all'>('all');
  const [isUploadOpen, setIsUploadOpen] = useState(false);

  const filteredGroups = monthlyTimelineGroups
    .map((group) => ({
      ...group,
      photos: group.photos.filter((p: ProgressPhotoVM) => {
        if (selectedAngle === 'all') return true;
        return p.angle === selectedAngle;
      }),
    }))
    .filter((g) => g.photos.length > 0);

  const handleUploadSubmit = async (values: ProgressPhotoUploadFormValues) => {
    await uploadPhoto(values);
  };

  return (
    <SafeAreaView className="flex-1 bg-zinc-950">
      <View className="flex-1 p-4 gap-4">
        {/* Top Header */}
        <View className="flex-row items-center justify-between">
          <View>
            <Text className="text-zinc-500 text-[10px] font-bold uppercase tracking-wider">
              Visual Progress Gallery
            </Text>
            <Text className="text-zinc-50 text-2xl font-black tracking-tight">
              Skin Timeline
            </Text>
          </View>

          <View className="flex-row items-center gap-2">
            <TouchableOpacity
              activeOpacity={0.8}
              onPress={() => router.push('/(app)/skincare/compare')}
              className="bg-zinc-900 border border-zinc-800 px-3 py-2 rounded-xl"
            >
              <Text className="text-cyan-400 text-xs font-bold">🔍 Compare</Text>
            </TouchableOpacity>

            <TouchableOpacity
              activeOpacity={0.8}
              onPress={() => setIsUploadOpen(true)}
              className="bg-cyan-600 px-3.5 py-2 rounded-xl border border-cyan-500/40 shadow-sm"
            >
              <Text className="text-white text-xs font-bold">+ Upload</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Angle Filter Chips */}
        <View className="flex-row gap-2">
          {[{ value: 'all', label: 'All Angles' }, ...PHOTO_ANGLE_OPTIONS].map((opt) => {
            const isSelected = selectedAngle === opt.value;
            return (
              <TouchableOpacity
                key={opt.value}
                onPress={() => setSelectedAngle(opt.value as PhotoAngle | 'all')}
                className={`px-3 py-1.5 rounded-xl border ${
                  isSelected ? 'bg-cyan-500/20 border-cyan-500/50' : 'bg-zinc-900 border-zinc-800'
                }`}
              >
                <Text
                  className={`text-xs font-semibold ${
                    isSelected ? 'text-cyan-400' : 'text-zinc-400'
                  }`}
                >
                  {opt.label}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>

        {/* Timeline Gallery */}
        {isLoading ? (
          <View className="gap-3 mt-2">
            <SkeletonLoader height={180} />
            <SkeletonLoader height={180} />
          </View>
        ) : isError ? (
          <ErrorStateCard message={error?.message} onRetry={refetch} />
        ) : filteredGroups.length === 0 ? (
          <EmptyStateCard
            icon="📸"
            title="No Progress Photos Yet"
            description="Document your skin journey over time with frontal, left profile, and right profile progress photos."
            actionLabel="+ Upload First Photo"
            onAction={() => setIsUploadOpen(true)}
          />
        ) : (
          <FlatList
            data={filteredGroups}
            keyExtractor={(item) => item.monthYear}
            contentContainerStyle={{ gap: 20, paddingBottom: 24 }}
            showsVerticalScrollIndicator={false}
            renderItem={({ item }) => (
              <View className="gap-3">
                <View className="flex-row items-center gap-2 border-b border-zinc-800/80 pb-2">
                  <Text className="text-cyan-400 text-xs font-bold uppercase tracking-wider">
                    {item.monthYear}
                  </Text>
                  <Text className="text-zinc-600 text-xs">• {item.photos.length} photos</Text>
                </View>

                <View className="flex-row flex-wrap gap-3">
                  {item.photos.map((photo: ProgressPhotoVM) => (
                    <View key={photo.id} className="w-[48%]">
                      <ProgressPhotoCard
                        photoUrl={photo.photoUrl}
                        dateFormatted={photo.dateFormatted}
                        angleLabel={photo.angleLabel}
                        timeOfDayLabel={photo.timeOfDayLabel}
                        onDelete={() => deletePhoto(photo.id)}
                      />
                    </View>
                  ))}
                </View>
              </View>
            )}
          />
        )}

        {/* Upload Form Modal */}
        <PhotoUploadForm
          visible={isUploadOpen}
          isSubmitting={isUploading}
          onClose={() => setIsUploadOpen(false)}
          onSubmit={handleUploadSubmit}
        />
      </View>
    </SafeAreaView>
  );
}
