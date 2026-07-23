import React, { useState, useCallback } from 'react';
import { View, ScrollView, RefreshControl, Text, TouchableOpacity, Modal, TextInput } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { useHairTimeline } from '../hooks/useHairTimeline';
import { useUploadHairPhoto } from '../hooks/useUploadHairPhoto';
import { useDeleteHairPhoto } from '../hooks/useDeleteHairPhoto';
import type { HairPhotoVM, PhotoAngle } from '../types';
import {
  TimelineCard,
  UploadPhotoButton,
  DeletePhotoDialog,
  LoadingHaircare,
  EmptyGallery,
  ErrorHaircare,
} from '../components';
import { InlineLoader } from '@/shared/components';

const ANGLE_OPTIONS: { label: string; value: PhotoAngle }[] = [
  { label: 'Crown View', value: 'crown' },
  { label: 'Front Angle', value: 'front' },
  { label: 'Back View', value: 'back' },
  { label: 'Left Side', value: 'left' },
  { label: 'Right Side', value: 'right' },
  { label: 'Hairline Detail', value: 'hairline' },
];

export const HairTimelineScreen: React.FC = function HairTimelineScreen() {
  const router = useRouter();
  const { monthGroups, totalPhotosCount, isLoading, isRefetching, isError, error, refetch } =
    useHairTimeline();

  const { uploadPhoto, isUploading } = useUploadHairPhoto();
  const { deletePhoto, isDeleting } = useDeleteHairPhoto();

  // Modals & States
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  const [photoToDelete, setPhotoToDelete] = useState<HairPhotoVM | null>(null);

  // Form states
  const [imageUriInput, setImageUriInput] = useState('');
  const [selectedAngle, setSelectedAngle] = useState<PhotoAngle>('crown');
  const [captureDateInput, setCaptureDateInput] = useState(new Date().toISOString().split('T')[0]);
  const [notesInput, setNotesInput] = useState('');

  const handleOpenUpload = useCallback(() => {
    setImageUriInput('');
    setCaptureDateInput(new Date().toISOString().split('T')[0]);
    setSelectedAngle('crown');
    setNotesInput('');
    setIsUploadModalOpen(true);
  }, []);

  const handleConfirmUpload = useCallback(async () => {
    if (!imageUriInput.trim()) return;
    await uploadPhoto({
      imageUri: imageUriInput.trim(),
      captureDate: captureDateInput.trim() || new Date().toISOString().split('T')[0],
      angle: selectedAngle,
      notes: notesInput.trim() || undefined,
    });
    setIsUploadModalOpen(false);
  }, [imageUriInput, captureDateInput, selectedAngle, notesInput, uploadPhoto]);

  const handleConfirmDelete = useCallback(async () => {
    if (!photoToDelete) return;
    await deletePhoto({
      photoId: photoToDelete.id,
      storagePath: photoToDelete.storagePath,
    });
    setPhotoToDelete(null);
  }, [photoToDelete, deletePhoto]);

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

  return (
    <SafeAreaView className="flex-1 bg-zinc-950">
      <ScrollView
        className="flex-1"
        contentContainerStyle={{ padding: 16, gap: 16 }}
        refreshControl={
          <RefreshControl
            refreshing={isRefetching}
            onRefresh={() => void refetch()}
            tintColor="#f59e0b"
          />
        }
      >
        {/* Header */}
        <View className="flex-row items-center justify-between">
          <View>
            <TouchableOpacity onPress={() => router.back()} accessibilityRole="button">
              <Text className="text-amber-400 text-xs font-semibold mb-1">← Back to Haircare</Text>
            </TouchableOpacity>
            <Text className="text-zinc-50 text-2xl font-extrabold">Hair Growth Timeline</Text>
          </View>

          {totalPhotosCount >= 2 ? (
            <TouchableOpacity
              className="bg-zinc-900 border border-zinc-800 px-3 py-2 rounded-xl"
              onPress={() => router.push('/(app)/haircare/compare')}
              accessibilityRole="button"
            >
              <Text className="text-amber-400 text-xs font-bold">Compare ⇄</Text>
            </TouchableOpacity>
          ) : null}
        </View>

        {/* Action Banner */}
        <View className="flex-row items-center justify-between bg-zinc-900/90 border border-zinc-800/80 p-3.5 rounded-2xl">
          <View>
            <Text className="text-zinc-400 text-xs font-semibold">Total Documented</Text>
            <Text className="text-zinc-100 text-lg font-black">{totalPhotosCount} photos</Text>
          </View>

          <UploadPhotoButton onPress={handleOpenUpload} isUploading={isUploading} />
        </View>

        {/* Timeline Monthly Groups */}
        {totalPhotosCount === 0 ? (
          <EmptyGallery onUploadPress={handleOpenUpload} />
        ) : (
          <View className="gap-4">
            {monthGroups.map((group) => (
              <TimelineCard
                key={group.monthYearLabel}
                group={group}
                onPhotoDelete={(photo) => setPhotoToDelete(photo)}
              />
            ))}
          </View>
        )}
      </ScrollView>

      {/* Upload Photo Modal */}
      <Modal
        visible={isUploadModalOpen}
        animationType="slide"
        transparent
        onRequestClose={() => setIsUploadModalOpen(false)}
      >
        <View className="flex-1 bg-black/80 justify-end p-4">
          <View className="bg-zinc-900 border border-zinc-800 rounded-2xl p-4 gap-4">
            <View className="flex-row items-center justify-between">
              <Text className="text-zinc-100 text-lg font-extrabold">Upload Progress Photo</Text>
              <TouchableOpacity onPress={() => setIsUploadModalOpen(false)}>
                <Text className="text-zinc-400 text-xs font-bold">✕ Close</Text>
              </TouchableOpacity>
            </View>

            {/* Photo URI / Storage Source */}
            <View className="gap-1">
              <Text className="text-zinc-400 text-xs font-semibold">Photo Image URL or Local Path</Text>
              <TextInput
                className="bg-zinc-950 border border-zinc-800 text-zinc-100 p-3 rounded-xl text-xs font-medium focus:border-amber-500"
                placeholder="https://images.unsplash.com/... or file:///..."
                placeholderTextColor="#71717a"
                value={imageUriInput}
                onChangeText={setImageUriInput}
              />
            </View>

            {/* Angle Selection */}
            <View className="gap-1.5">
              <Text className="text-zinc-400 text-xs font-semibold">Camera Angle</Text>
              <View className="flex-row flex-wrap gap-2">
                {ANGLE_OPTIONS.map((opt) => {
                  const isSelected = selectedAngle === opt.value;
                  return (
                    <TouchableOpacity
                      key={opt.value}
                      className={`px-3 py-2 rounded-xl border ${
                        isSelected
                          ? 'bg-amber-500/20 border-amber-500'
                          : 'bg-zinc-950 border-zinc-800'
                      }`}
                      onPress={() => setSelectedAngle(opt.value)}
                    >
                      <Text
                        className={`text-xs font-bold ${
                          isSelected ? 'text-amber-400' : 'text-zinc-400'
                        }`}
                      >
                        {opt.label}
                      </Text>
                    </TouchableOpacity>
                  );
                })}
              </View>
            </View>

            {/* Capture Date */}
            <View className="gap-1">
              <Text className="text-zinc-400 text-xs font-semibold">Capture Date (YYYY-MM-DD)</Text>
              <TextInput
                className="bg-zinc-950 border border-zinc-800 text-zinc-100 p-3 rounded-xl text-xs font-medium focus:border-amber-500"
                value={captureDateInput}
                onChangeText={setCaptureDateInput}
              />
            </View>

            {/* Notes */}
            <View className="gap-1">
              <Text className="text-zinc-400 text-xs font-semibold">Notes (Optional)</Text>
              <TextInput
                className="bg-zinc-950 border border-zinc-800 text-zinc-100 p-3 rounded-xl text-xs font-medium focus:border-amber-500"
                placeholder="e.g. Month 3 post-treatment growth"
                placeholderTextColor="#71717a"
                value={notesInput}
                onChangeText={setNotesInput}
              />
            </View>

            {/* Submit Upload */}
            <TouchableOpacity
              className="bg-amber-500 active:bg-amber-600 py-3.5 rounded-xl items-center justify-center shadow-lg shadow-amber-500/20"
              onPress={() => void handleConfirmUpload()}
              disabled={isUploading || !imageUriInput.trim()}
            >
              {isUploading ? (
                <InlineLoader label="Uploading photo..." color="#09090b" />
              ) : (
                <Text className="text-zinc-950 font-extrabold text-xs">Save Progress Photo</Text>
              )}
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* Delete Confirmation Dialog */}
      <DeletePhotoDialog
        visible={Boolean(photoToDelete)}
        photo={photoToDelete}
        isDeleting={isDeleting}
        onConfirm={handleConfirmDelete}
        onCancel={() => setPhotoToDelete(null)}
      />
    </SafeAreaView>
  );
};
