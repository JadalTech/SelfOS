import React from 'react';
import { View, Text, TextInput, TouchableOpacity, ScrollView, Modal } from 'react-native';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { progressPhotoUploadSchema, ProgressPhotoUploadFormValues } from '../validation/skincare.validation';
import { PHOTO_ANGLE_OPTIONS } from '../constants/skincare.constants';
import type { PhotoAngle } from '../types';

export interface PhotoUploadFormProps {
  readonly visible: boolean;
  readonly isSubmitting?: boolean;
  readonly onClose: () => void;
  readonly onSubmit: (values: ProgressPhotoUploadFormValues) => Promise<void>;
}

export const PhotoUploadForm: React.FC<PhotoUploadFormProps> = function PhotoUploadForm({
  visible,
  isSubmitting = false,
  onClose,
  onSubmit,
}) {
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<ProgressPhotoUploadFormValues>({
    resolver: zodResolver(progressPhotoUploadSchema),
    defaultValues: {
      photoUri: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=500',
      date: new Date().toISOString().split('T')[0],
      timeOfDay: 'morning',
      angle: 'front',
      lightingCondition: 'natural-daylight',
      notes: '',
    },
  });

  const onFormSubmit = async (data: ProgressPhotoUploadFormValues) => {
    await onSubmit(data);
    onClose();
  };

  return (
    <Modal visible={visible} animationType="slide" transparent onRequestClose={onClose}>
      <View className="flex-1 bg-black/80 justify-end">
        <View className="bg-zinc-900 border-t border-zinc-800 rounded-t-3xl p-5 max-h-[85%] gap-4">
          <View className="flex-row items-center justify-between border-b border-zinc-800 pb-3">
            <Text className="text-zinc-50 text-lg font-bold">Add Progress Photo</Text>
            <TouchableOpacity onPress={onClose} className="p-1">
              <Text className="text-zinc-400 text-lg font-bold">✕</Text>
            </TouchableOpacity>
          </View>

          <ScrollView contentContainerStyle={{ gap: 16 }} showsVerticalScrollIndicator={false}>
            {/* Image URI */}
            <View className="gap-1">
              <Text className="text-zinc-400 text-xs font-semibold">Photo File Path / URL *</Text>
              <Controller
                control={control}
                name="photoUri"
                render={({ field: { onChange, onBlur, value } }) => (
                  <TextInput
                    className="bg-zinc-950 border border-zinc-800 p-3 rounded-xl text-zinc-50 text-sm"
                    placeholder="file:///... or image URL"
                    placeholderTextColor="#71717a"
                    onBlur={onBlur}
                    onChangeText={onChange}
                    value={value}
                  />
                )}
              />
              {errors.photoUri ? (
                <Text className="text-rose-400 text-xs">{errors.photoUri.message}</Text>
              ) : null}
            </View>

            {/* Date */}
            <View className="gap-1">
              <Text className="text-zinc-400 text-xs font-semibold">Capture Date (YYYY-MM-DD) *</Text>
              <Controller
                control={control}
                name="date"
                render={({ field: { onChange, onBlur, value } }) => (
                  <TextInput
                    className="bg-zinc-950 border border-zinc-800 p-3 rounded-xl text-zinc-50 text-sm"
                    onBlur={onBlur}
                    onChangeText={onChange}
                    value={value}
                  />
                )}
              />
            </View>

            {/* Angle Selector */}
            <View className="gap-1.5">
              <Text className="text-zinc-400 text-xs font-semibold">Photo Angle *</Text>
              <Controller
                control={control}
                name="angle"
                render={({ field: { onChange, value } }) => (
                  <View className="flex-row flex-wrap gap-2">
                    {PHOTO_ANGLE_OPTIONS.map((opt) => {
                      const isSelected = value === opt.value;
                      return (
                        <TouchableOpacity
                          key={opt.value}
                          onPress={() => onChange(opt.value as PhotoAngle)}
                          className={`px-3 py-1.5 rounded-xl border ${
                            isSelected
                              ? 'bg-cyan-500/20 border-cyan-500/50'
                              : 'bg-zinc-950 border-zinc-800'
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
                )}
              />
            </View>

            {/* Notes */}
            <View className="gap-1">
              <Text className="text-zinc-400 text-xs font-semibold">Lighting / Notes</Text>
              <Controller
                control={control}
                name="notes"
                render={({ field: { onChange, onBlur, value } }) => (
                  <TextInput
                    className="bg-zinc-950 border border-zinc-800 p-3 rounded-xl text-zinc-50 text-xs"
                    placeholder="e.g. Natural daylight, 1 week after starting vitamin C"
                    placeholderTextColor="#71717a"
                    onBlur={onBlur}
                    onChangeText={onChange}
                    value={value}
                  />
                )}
              />
            </View>

            {/* Submit Button */}
            <TouchableOpacity
              activeOpacity={0.8}
              onPress={handleSubmit(onFormSubmit as any)}
              disabled={isSubmitting}
              className="bg-cyan-600 p-3.5 rounded-xl items-center justify-center mt-3 shadow-lg"
            >
              <Text className="text-white text-sm font-bold">
                {isSubmitting ? 'Uploading...' : 'Save Progress Photo'}
              </Text>
            </TouchableOpacity>
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
};
