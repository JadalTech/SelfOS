import React from 'react';
import { View, Text, TextInput, TouchableOpacity, ScrollView } from 'react-native';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { nutritionGoalSchema } from '../../validation/nutrition.validation';

export interface GoalFormProps {
  readonly defaultValues?: any;
  readonly onSubmit: (data: any) => void;
  readonly onCancel: () => void;
  readonly isSubmitting?: boolean;
}

export const GoalForm: React.FC<GoalFormProps> = React.memo(function GoalForm({
  defaultValues,
  onSubmit,
  onCancel,
  isSubmitting = false,
}) {
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(nutritionGoalSchema),
    defaultValues: {
      calorieTarget: 2000,
      proteinTarget: 150,
      carbTarget: 200,
      fatTarget: 65,
      fiberTarget: 30,
      isActive: true,
      ...defaultValues,
    },
  });

  return (
    <ScrollView className="flex-1" contentContainerStyle={{ paddingBottom: 24 }} showsVerticalScrollIndicator={false}>
      <View className="gap-5">
        
        <View className="gap-1">
          <Text className="text-zinc-300 text-xs font-bold">Daily Calorie Target (kcal) *</Text>
          <Controller
            control={control}
            name="calorieTarget"
            render={({ field: { onChange, value } }) => (
              <TextInput
                value={value?.toString()}
                onChangeText={(txt) => onChange(parseInt(txt, 10) || 0)}
                keyboardType="numeric"
                placeholder="2000"
                placeholderTextColor="#71717a"
                className="bg-zinc-900 border border-zinc-800 rounded-xl px-4 py-3 text-zinc-100 text-sm"
              />
            )}
          />
          {errors.calorieTarget?.message ? (
            <Text className="text-rose-400 text-xs font-medium">{String(errors.calorieTarget.message)}</Text>
          ) : null}
        </View>

        <View className="flex-row gap-3">
          <View className="flex-1 gap-1">
            <Text className="text-zinc-300 text-xs font-bold">Protein Target (g) *</Text>
            <Controller
              control={control}
              name="proteinTarget"
              render={({ field: { onChange, value } }) => (
                <TextInput
                  value={value?.toString()}
                  onChangeText={(txt) => onChange(parseInt(txt, 10) || 0)}
                  keyboardType="numeric"
                  placeholder="150"
                  placeholderTextColor="#71717a"
                  className="bg-zinc-900 border border-zinc-800 rounded-xl px-4 py-3 text-zinc-100 text-sm"
                />
              )}
            />
            {errors.proteinTarget?.message ? (
              <Text className="text-rose-400 text-xs font-medium">{String(errors.proteinTarget.message)}</Text>
            ) : null}
          </View>

          <View className="flex-1 gap-1">
            <Text className="text-zinc-300 text-xs font-bold">Carbohydrates Target (g) *</Text>
            <Controller
              control={control}
              name="carbTarget"
              render={({ field: { onChange, value } }) => (
                <TextInput
                  value={value?.toString()}
                  onChangeText={(txt) => onChange(parseInt(txt, 10) || 0)}
                  keyboardType="numeric"
                  placeholder="200"
                  placeholderTextColor="#71717a"
                  className="bg-zinc-900 border border-zinc-800 rounded-xl px-4 py-3 text-zinc-100 text-sm"
                />
              )}
            />
            {errors.carbTarget?.message ? (
              <Text className="text-rose-400 text-xs font-medium">{String(errors.carbTarget.message)}</Text>
            ) : null}
          </View>
        </View>

        <View className="flex-row gap-3">
          <View className="flex-1 gap-1">
            <Text className="text-zinc-300 text-xs font-bold">Fats Target (g) *</Text>
            <Controller
              control={control}
              name="fatTarget"
              render={({ field: { onChange, value } }) => (
                <TextInput
                  value={value?.toString()}
                  onChangeText={(txt) => onChange(parseInt(txt, 10) || 0)}
                  keyboardType="numeric"
                  placeholder="65"
                  placeholderTextColor="#71717a"
                  className="bg-zinc-900 border border-zinc-800 rounded-xl px-4 py-3 text-zinc-100 text-sm"
                />
              )}
            />
            {errors.fatTarget?.message ? (
              <Text className="text-rose-400 text-xs font-medium">{String(errors.fatTarget.message)}</Text>
            ) : null}
          </View>

          <View className="flex-1 gap-1">
            <Text className="text-zinc-300 text-xs font-semibold text-zinc-400">Fiber Target (g)</Text>
            <Controller
              control={control}
              name="fiberTarget"
              render={({ field: { onChange, value } }) => (
                <TextInput
                  value={value?.toString()}
                  onChangeText={(txt) => onChange(parseInt(txt, 10) || 0)}
                  keyboardType="numeric"
                  placeholder="30"
                  placeholderTextColor="#71717a"
                  className="bg-zinc-900 border border-zinc-800 rounded-xl px-4 py-3 text-zinc-100 text-sm"
                />
              )}
            />
          </View>
        </View>

        {/* Buttons */}
        <View className="flex-row gap-3 mt-4 border-t border-zinc-800/60 pt-5">
          <TouchableOpacity
            onPress={onCancel}
            className="flex-1 bg-zinc-900 border border-zinc-800 py-3 rounded-xl items-center justify-center"
          >
            <Text className="text-zinc-400 text-xs font-bold uppercase tracking-wider">Cancel</Text>
          </TouchableOpacity>

          <TouchableOpacity
            disabled={isSubmitting}
            onPress={handleSubmit(onSubmit)}
            className="flex-1 bg-pink-500 py-3 rounded-xl items-center justify-center"
            style={{ opacity: isSubmitting ? 0.6 : 1 }}
          >
            <Text className="text-zinc-950 text-xs font-extrabold uppercase tracking-wider">Save Targets</Text>
          </TouchableOpacity>
        </View>
      </View>
    </ScrollView>
  );
});
