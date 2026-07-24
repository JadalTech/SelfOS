import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, ScrollView, Modal } from 'react-native';
import { useForm, Controller, useWatch } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { skincareRoutineSchema, SkincareRoutineFormValues } from '../validation/skincare.validation';
import { ROUTINE_TIME_OPTIONS, SKIN_CONCERN_OPTIONS } from '../constants/skincare.constants';
import type { SkincareProductVM, SkinConcern, RoutineTime } from '../types';

export interface SkincareRoutineFormProps {
  readonly visible: boolean;
  readonly availableProducts: SkincareProductVM[];
  readonly isSubmitting?: boolean;
  readonly onClose: () => void;
  readonly onSubmit: (values: SkincareRoutineFormValues) => Promise<void>;
}

export const SkincareRoutineForm: React.FC<SkincareRoutineFormProps> = function SkincareRoutineForm({
  visible,
  availableProducts,
  isSubmitting = false,
  onClose,
  onSubmit,
}) {
  const {
    control,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<SkincareRoutineFormValues>({
    resolver: zodResolver(skincareRoutineSchema),
    defaultValues: {
      title: 'Morning Skincare Routine',
      timeOfDay: 'morning',
      steps: [],
      targetedConcerns: [],
      frequency: 'daily',
    },
  });

  const currentTimeOfDay = useWatch({ control, name: 'timeOfDay' });

  const [selectedSteps, setSelectedSteps] = useState<
    { productId: string; stepOrder: number; timeOfDay: RoutineTime; isOptional: boolean; waitTimeMinutes?: number; instructions?: string }[]
  >([]);

  const toggleProductStep = (product: SkincareProductVM) => {
    const existingIndex = selectedSteps.findIndex((s) => s.productId === product.id);
    let updated;
    if (existingIndex >= 0) {
      updated = selectedSteps.filter((s) => s.productId !== product.id);
    } else {
      updated = [
        ...selectedSteps,
        {
          productId: product.id,
          stepOrder: selectedSteps.length + 1,
          timeOfDay: currentTimeOfDay || 'morning',
          isOptional: false,
          waitTimeMinutes: 0,
        },
      ];
    }
    // Re-index step orders
    updated = updated.map((s, idx) => ({ ...s, stepOrder: idx + 1 }));
    setSelectedSteps(updated);
    setValue('steps', updated);
  };

  const toggleConcern = (concern: SkinConcern, currentList: SkinConcern[] = []) => {
    let updated;
    if (currentList.includes(concern)) {
      updated = currentList.filter((c) => c !== concern);
    } else {
      updated = [...currentList, concern];
    }
    setValue('targetedConcerns', updated);
  };

  const onFormSubmit = async (data: SkincareRoutineFormValues) => {
    const formattedSteps = selectedSteps.map((s, idx) => ({
      ...s,
      stepOrder: idx + 1,
      timeOfDay: data.timeOfDay,
      isOptional: false,
    }));
    await onSubmit({ ...data, steps: formattedSteps });
    onClose();
  };

  return (
    <Modal visible={visible} animationType="slide" transparent onRequestClose={onClose}>
      <View className="flex-1 bg-black/80 justify-end">
        <View className="bg-zinc-900 border-t border-zinc-800 rounded-t-3xl p-5 max-h-[90%] gap-4">
          <View className="flex-row items-center justify-between border-b border-zinc-800 pb-3">
            <Text className="text-zinc-50 text-lg font-bold">Routine Builder</Text>
            <TouchableOpacity onPress={onClose} className="p-1">
              <Text className="text-zinc-400 text-lg font-bold">✕</Text>
            </TouchableOpacity>
          </View>

          <ScrollView contentContainerStyle={{ gap: 16 }} showsVerticalScrollIndicator={false}>
            {/* Title */}
            <View className="gap-1">
              <Text className="text-zinc-400 text-xs font-semibold">Routine Name *</Text>
              <Controller
                control={control}
                name="title"
                render={({ field: { onChange, onBlur, value } }) => (
                  <TextInput
                    className="bg-zinc-950 border border-zinc-800 p-3 rounded-xl text-zinc-50 text-sm"
                    placeholder="e.g. Daily Glow Morning Routine"
                    placeholderTextColor="#71717a"
                    onBlur={onBlur}
                    onChangeText={onChange}
                    value={value}
                  />
                )}
              />
              {errors.title ? (
                <Text className="text-rose-400 text-xs">{errors.title.message}</Text>
              ) : null}
            </View>

            {/* Time of Day */}
            <View className="gap-1.5">
              <Text className="text-zinc-400 text-xs font-semibold">Time of Day *</Text>
              <Controller
                control={control}
                name="timeOfDay"
                render={({ field: { onChange, value } }) => (
                  <View className="flex-row flex-wrap gap-2">
                    {ROUTINE_TIME_OPTIONS.map((opt) => {
                      const isSelected = value === opt.value;
                      return (
                        <TouchableOpacity
                          key={opt.value}
                          onPress={() => onChange(opt.value)}
                          className={`px-3 py-1.5 rounded-xl border ${
                            isSelected
                              ? 'bg-pink-500/20 border-pink-500/50'
                              : 'bg-zinc-950 border-zinc-800'
                          }`}
                        >
                          <Text
                            className={`text-xs font-semibold ${
                              isSelected ? 'text-pink-400' : 'text-zinc-400'
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

            {/* Step Selection from Products */}
            <View className="gap-1.5">
              <Text className="text-zinc-400 text-xs font-semibold">
                Select Routine Products & Steps ({selectedSteps.length} selected) *
              </Text>
              {availableProducts.length === 0 ? (
                <Text className="text-zinc-500 text-xs">
                  No active products available. Please add products to your vanity first.
                </Text>
              ) : (
                <View className="gap-2">
                  {availableProducts.map((prod) => {
                    const stepItem = selectedSteps.find((s) => s.productId === prod.id);
                    const isSelected = !!stepItem;

                    return (
                      <TouchableOpacity
                        key={prod.id}
                        onPress={() => toggleProductStep(prod)}
                        className={`p-3 rounded-xl border flex-row items-center justify-between ${
                          isSelected
                            ? 'bg-pink-500/10 border-pink-500/40'
                            : 'bg-zinc-950 border-zinc-800'
                        }`}
                      >
                        <View className="flex-1 pr-2">
                          <Text className="text-zinc-200 text-xs font-bold">{prod.name}</Text>
                          <Text className="text-zinc-500 text-[10px]">
                            {prod.brand} • {prod.categoryLabel}
                          </Text>
                        </View>
                        {isSelected ? (
                          <View className="w-6 h-6 rounded-full bg-pink-500 items-center justify-center">
                            <Text className="text-white text-xs font-bold">{stepItem.stepOrder}</Text>
                          </View>
                        ) : (
                          <View className="w-6 h-6 rounded-full border border-zinc-700 items-center justify-center">
                            <Text className="text-zinc-600 text-xs">+</Text>
                          </View>
                        )}
                      </TouchableOpacity>
                    );
                  })}
                </View>
              )}
            </View>

            {/* Targeted Skin Concerns */}
            <View className="gap-1.5">
              <Text className="text-zinc-400 text-xs font-semibold">Targeted Skin Concerns</Text>
              <Controller
                control={control}
                name="targetedConcerns"
                render={({ field: { value } }) => (
                  <View className="flex-row flex-wrap gap-2">
                    {SKIN_CONCERN_OPTIONS.map((opt) => {
                      const isSelected = (value || []).includes(opt.value);
                      return (
                        <TouchableOpacity
                          key={opt.value}
                          onPress={() => toggleConcern(opt.value, value)}
                          className={`px-2.5 py-1 rounded-lg border ${
                            isSelected
                              ? 'bg-amber-500/20 border-amber-500/50'
                              : 'bg-zinc-950 border-zinc-800'
                          }`}
                        >
                          <Text
                            className={`text-[11px] font-medium ${
                              isSelected ? 'text-amber-400' : 'text-zinc-400'
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

            {/* Submit */}
            <TouchableOpacity
              activeOpacity={0.8}
              onPress={handleSubmit(onFormSubmit as any)}
              disabled={isSubmitting || selectedSteps.length === 0}
              className="bg-pink-600 p-3.5 rounded-xl items-center justify-center mt-3 shadow-lg"
            >
              <Text className="text-white text-sm font-bold">
                {isSubmitting ? 'Creating Routine...' : 'Save Skincare Routine'}
              </Text>
            </TouchableOpacity>
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
};
