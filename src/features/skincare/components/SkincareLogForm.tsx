import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, ScrollView, Modal } from 'react-native';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { skincareLogSchema, SkincareLogFormValues } from '../validation/skincare.validation';
import { RatingBar } from '../../../shared/components/inputs/RatingBar';
import type { SkincareRoutineVM, Weather } from '../types';

export interface SkincareLogFormProps {
  readonly visible: boolean;
  readonly routine: SkincareRoutineVM;
  readonly isSubmitting?: boolean;
  readonly onClose: () => void;
  readonly onSubmit: (values: SkincareLogFormValues) => Promise<void>;
}

export const SkincareLogForm: React.FC<SkincareLogFormProps> = function SkincareLogForm({
  visible,
  routine,
  isSubmitting = false,
  onClose,
  onSubmit,
}) {
  const [completedStepIds, setCompletedStepIds] = useState<string[]>(
    routine.steps.map((s) => s.id)
  );

  const { control, handleSubmit, setValue } = useForm<SkincareLogFormValues>({
    resolver: zodResolver(skincareLogSchema),
    defaultValues: {
      skincareRoutineId: routine.id,
      coreRoutineId: routine.routineId,
      dateStr: new Date().toISOString().split('T')[0],
      timeStr: new Date().toTimeString().split(' ')[0].substring(0, 5),
      completedStepIds: routine.steps.map((s) => s.id),
      skippedStepIds: [],
      appliedProductIds: routine.steps.map((s) => s.productId),
      skinFeeling: 4,
      weather: 'sunny',
      notes: '',
    },
  });

  const toggleStep = (stepId: string, productId: string) => {
    let updatedCompleted;
    if (completedStepIds.includes(stepId)) {
      updatedCompleted = completedStepIds.filter((id) => id !== stepId);
    } else {
      updatedCompleted = [...completedStepIds, stepId];
    }
    setCompletedStepIds(updatedCompleted);
    setValue('completedStepIds', updatedCompleted);

    const skipped = routine.steps.filter((s) => !updatedCompleted.includes(s.id)).map((s) => s.id);
    setValue('skippedStepIds', skipped);

    const appliedProds = routine.steps
      .filter((s) => updatedCompleted.includes(s.id))
      .map((s) => s.productId);
    setValue('appliedProductIds', appliedProds);
  };

  const onFormSubmit = async (data: SkincareLogFormValues) => {
    await onSubmit(data);
    onClose();
  };

  return (
    <Modal visible={visible} animationType="slide" transparent onRequestClose={onClose}>
      <View className="flex-1 bg-black/80 justify-end">
        <View className="bg-zinc-900 border-t border-zinc-800 rounded-t-3xl p-5 max-h-[85%] gap-4">
          <View className="flex-row items-center justify-between border-b border-zinc-800 pb-3">
            <View>
              <Text className="text-zinc-500 text-[10px] font-bold uppercase">Log Execution</Text>
              <Text className="text-zinc-50 text-lg font-bold">
                {routine.timeOfDayLabel} Routine
              </Text>
            </View>
            <TouchableOpacity onPress={onClose} className="p-1">
              <Text className="text-zinc-400 text-lg font-bold">✕</Text>
            </TouchableOpacity>
          </View>

          <ScrollView contentContainerStyle={{ gap: 16 }} showsVerticalScrollIndicator={false}>
            {/* Checklist of Steps */}
            <View className="gap-1.5">
              <Text className="text-zinc-400 text-xs font-semibold">Check Completed Steps</Text>
              <View className="gap-2">
                {routine.steps.map((step) => {
                  const isChecked = completedStepIds.includes(step.id);
                  return (
                    <TouchableOpacity
                      key={step.id}
                      onPress={() => toggleStep(step.id, step.productId)}
                      className={`p-3 rounded-xl border flex-row items-center justify-between ${
                        isChecked
                          ? 'bg-emerald-500/10 border-emerald-500/40'
                          : 'bg-zinc-950 border-zinc-800'
                      }`}
                    >
                      <View className="flex-row items-center gap-2 flex-1">
                        <Text className="text-sm">{isChecked ? '✅' : '⚪'}</Text>
                        <View className="flex-1">
                          <Text
                            className={`text-xs font-semibold ${
                              isChecked ? 'text-zinc-100' : 'text-zinc-400 line-through'
                            }`}
                          >
                            Step {step.stepOrder}: {step.productName}
                          </Text>
                          <Text className="text-zinc-500 text-[10px]">{step.productCategoryLabel}</Text>
                        </View>
                      </View>
                    </TouchableOpacity>
                  );
                })}
              </View>
            </View>

            {/* Skin Feeling Rating (1-5) */}
            <Controller
              control={control}
              name="skinFeeling"
              render={({ field: { onChange, value } }) => (
                <RatingBar
                  label="Skin Feeling After Routine"
                  value={typeof value === 'number' ? value : 4}
                  max={5}
                  activeColor="#10b981"
                  onChange={onChange}
                />
              )}
            />

            {/* Weather Selector */}
            <View className="gap-1.5">
              <Text className="text-zinc-400 text-xs font-semibold">Weather Condition</Text>
              <Controller
                control={control}
                name="weather"
                render={({ field: { onChange, value } }) => (
                  <View className="flex-row flex-wrap gap-2">
                    {(['sunny', 'cloudy', 'rainy', 'humid', 'cold'] as Weather[]).map((w) => {
                      const isSelected = value === w;
                      return (
                        <TouchableOpacity
                          key={w}
                          onPress={() => onChange(w)}
                          className={`px-3 py-1 rounded-xl border ${
                            isSelected
                              ? 'bg-pink-500/20 border-pink-500/50'
                              : 'bg-zinc-950 border-zinc-800'
                          }`}
                        >
                          <Text
                            className={`text-xs font-semibold capitalize ${
                              isSelected ? 'text-pink-400' : 'text-zinc-400'
                            }`}
                          >
                            {w}
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
              <Text className="text-zinc-400 text-xs font-semibold">Execution Notes</Text>
              <Controller
                control={control}
                name="notes"
                render={({ field: { onChange, onBlur, value } }) => (
                  <TextInput
                    className="bg-zinc-950 border border-zinc-800 p-3 rounded-xl text-zinc-50 text-xs"
                    placeholder="e.g. Skin felt extra hydrated, no stinging"
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
              className="bg-emerald-600 p-3.5 rounded-xl items-center justify-center mt-3 shadow-lg"
            >
              <Text className="text-white text-sm font-bold">
                {isSubmitting ? 'Saving Execution Log...' : 'Confirm & Save Routine Execution'}
              </Text>
            </TouchableOpacity>
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
};
