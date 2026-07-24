import React from 'react';
import { View, Text, TextInput, TouchableOpacity, ScrollView } from 'react-native';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { nutritionTemplateSchema, NutritionTemplateFormValues } from '../../validation/nutrition.validation';
import { MEAL_TYPE_OPTIONS } from '../../constants/nutrition.constants';

export interface TemplateFormProps {
  readonly defaultValues?: Partial<NutritionTemplateFormValues>;
  readonly onSubmit: (data: NutritionTemplateFormValues) => void;
  readonly onCancel: () => void;
  readonly isSubmitting?: boolean;
}

export const TemplateForm: React.FC<TemplateFormProps> = React.memo(function TemplateForm({
  defaultValues,
  onSubmit,
  onCancel,
  isSubmitting = false,
}) {
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<NutritionTemplateFormValues>({
    resolver: zodResolver(nutritionTemplateSchema),
    defaultValues: {
      title: '',
      mealType: 'breakfast',
      foods: [],
      ...defaultValues,
    },
  });

  return (
    <ScrollView className="flex-1" contentContainerStyle={{ paddingBottom: 24 }} showsVerticalScrollIndicator={false}>
      <View className="gap-5">
        
        <View className="gap-1">
          <Text className="text-zinc-300 text-xs font-bold">Template Title *</Text>
          <Controller
            control={control}
            name="title"
            render={({ field: { onChange, value } }) => (
              <TextInput
                value={value}
                onChangeText={onChange}
                placeholder="e.g. Oatmeal Breakfast Bowl"
                placeholderTextColor="#71717a"
                className="bg-zinc-900 border border-zinc-800 rounded-xl px-4 py-3 text-zinc-100 text-sm"
              />
            )}
          />
          {errors.title && <Text className="text-rose-400 text-xs font-medium">{errors.title.message}</Text>}
        </View>

        <View className="gap-1.5">
          <Text className="text-zinc-300 text-xs font-bold">Meal Type *</Text>
          <Controller
            control={control}
            name="mealType"
            render={({ field: { onChange, value } }) => (
              <View className="flex-row flex-wrap gap-1.5 mt-1">
                {MEAL_TYPE_OPTIONS.map((cat) => {
                  const isSel = cat.value === value;
                  return (
                    <TouchableOpacity
                      key={cat.value}
                      onPress={() => onChange(cat.value)}
                      className="px-3.5 py-2 rounded-xl border"
                      style={{
                        backgroundColor: isSel ? '#ec489915' : '#18181b',
                        borderColor: isSel ? '#ec4899' : '#27272a',
                      }}
                    >
                      <Text className="text-xs font-bold" style={{ color: isSel ? '#ec4899' : '#a1a1aa' }}>
                        {cat.icon} {cat.label}
                      </Text>
                    </TouchableOpacity>
                  );
                })}
              </View>
            )}
          />
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
            <Text className="text-zinc-950 text-xs font-extrabold uppercase tracking-wider">Save Template</Text>
          </TouchableOpacity>
        </View>
      </View>
    </ScrollView>
  );
});
