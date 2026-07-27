import React from 'react';
import { View, Text, TextInput, TouchableOpacity, ScrollView } from 'react-native';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { exerciseSchema } from '../../validation/workout.validation';
import { MuscleGroup, ExerciseCategory, Equipment, Difficulty } from '../../types/workout.types';
import {
  MUSCLE_GROUP_OPTIONS,
  EXERCISE_CATEGORY_OPTIONS,
  EQUIPMENT_OPTIONS,
  DIFFICULTY_OPTIONS,
} from '../../constants/workout.constants';

export interface ExerciseFormProps {
  readonly defaultValues?: any;
  readonly onSubmit: (data: any) => void;
  readonly onCancel: () => void;
  readonly isSubmitting?: boolean;
}

export const ExerciseForm: React.FC<ExerciseFormProps> = React.memo(function ExerciseForm({
  defaultValues,
  onSubmit,
  onCancel,
  isSubmitting = false,
}) {
  const {
    control,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(exerciseSchema.omit({ userId: true, source: true })),
    defaultValues: {
      name: '',
      primaryMuscleGroup: 'chest',
      secondaryMuscleGroups: [],
      equipment: 'barbell',
      category: 'strength',
      difficulty: 'intermediate',
      defaultRestDuration: 90,
      defaultUnit: 'kg',
      instructions: [],
      ...defaultValues,
    },
  });

  const selectedPrimary = watch('primaryMuscleGroup');
  const selectedSecondary: MuscleGroup[] = watch('secondaryMuscleGroups') || [];
  const selectedCategory = watch('category');
  const selectedEquipment = watch('equipment');
  const selectedDifficulty = watch('difficulty');
  const selectedUnit = watch('defaultUnit');

  const toggleSecondaryMuscle = (muscle: MuscleGroup) => {
    if (selectedSecondary.includes(muscle)) {
      setValue(
        'secondaryMuscleGroups',
        selectedSecondary.filter((m) => m !== muscle)
      );
    } else {
      setValue('secondaryMuscleGroups', [...selectedSecondary, muscle]);
    }
  };

  return (
    <ScrollView
      className="flex-1"
      contentContainerStyle={{ padding: 16, paddingBottom: 40 }}
      showsVerticalScrollIndicator={false}
    >
      <View className="gap-5">
        {/* Exercise Name */}
        <View className="gap-1.5">
          <Text className="text-zinc-300 text-xs font-bold uppercase tracking-wider">Exercise Name *</Text>
          <Controller
            control={control}
            name="name"
            render={({ field: { onChange, value } }) => (
              <TextInput
                value={value}
                onChangeText={onChange}
                placeholder="e.g. Dumbbell Incline Press"
                placeholderTextColor="#71717a"
                className="bg-zinc-900 border border-zinc-800 rounded-xl px-4 py-3 text-zinc-100 text-sm"
              />
            )}
          />
          {errors.name?.message ? (
            <Text className="text-red-400 text-xs font-semibold">{String(errors.name.message)}</Text>
          ) : null}
        </View>

        {/* Primary Muscle Group */}
        <View className="gap-1.5">
          <Text className="text-zinc-300 text-xs font-bold uppercase tracking-wider">Primary Muscle Group *</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} className="flex-row gap-2">
            {MUSCLE_GROUP_OPTIONS.map((opt) => (
              <TouchableOpacity
                key={opt.value}
                onPress={() => setValue('primaryMuscleGroup', opt.value as MuscleGroup)}
                className={`px-3.5 py-2 rounded-xl border ${
                  selectedPrimary === opt.value
                    ? 'bg-violet-600 border-violet-500'
                    : 'bg-zinc-900 border-zinc-800'
                }`}
              >
                <Text
                  className={`text-xs font-bold ${
                    selectedPrimary === opt.value ? 'text-zinc-50' : 'text-zinc-400'
                  }`}
                >
                  {opt.label}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        {/* Secondary Muscle Groups */}
        <View className="gap-1.5">
          <Text className="text-zinc-300 text-xs font-bold uppercase tracking-wider">Secondary Muscles</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} className="flex-row gap-2">
            {MUSCLE_GROUP_OPTIONS.filter((o) => o.value !== selectedPrimary).map((opt) => {
              const isSelected = selectedSecondary.includes(opt.value as MuscleGroup);
              return (
                <TouchableOpacity
                  key={opt.value}
                  onPress={() => toggleSecondaryMuscle(opt.value as MuscleGroup)}
                  className={`px-3.5 py-2 rounded-xl border ${
                    isSelected ? 'bg-violet-500/20 border-violet-500/50' : 'bg-zinc-900 border-zinc-800'
                  }`}
                >
                  <Text className={`text-xs font-bold ${isSelected ? 'text-violet-400' : 'text-zinc-400'}`}>
                    {opt.label}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </ScrollView>
        </View>

        {/* Category */}
        <View className="gap-1.5">
          <Text className="text-zinc-300 text-xs font-bold uppercase tracking-wider">Category *</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} className="flex-row gap-2">
            {EXERCISE_CATEGORY_OPTIONS.map((opt) => (
              <TouchableOpacity
                key={opt.value}
                onPress={() => setValue('category', opt.value as ExerciseCategory)}
                className={`px-3.5 py-2 rounded-xl border ${
                  selectedCategory === opt.value
                    ? 'bg-violet-600 border-violet-500'
                    : 'bg-zinc-900 border-zinc-800'
                }`}
              >
                <Text
                  className={`text-xs font-bold ${
                    selectedCategory === opt.value ? 'text-zinc-50' : 'text-zinc-400'
                  }`}
                >
                  {opt.label}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        {/* Equipment */}
        <View className="gap-1.5">
          <Text className="text-zinc-300 text-xs font-bold uppercase tracking-wider">Equipment *</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} className="flex-row gap-2">
            {EQUIPMENT_OPTIONS.map((opt) => (
              <TouchableOpacity
                key={opt.value}
                onPress={() => setValue('equipment', opt.value as Equipment)}
                className={`px-3.5 py-2 rounded-xl border ${
                  selectedEquipment === opt.value
                    ? 'bg-violet-600 border-violet-500'
                    : 'bg-zinc-900 border-zinc-800'
                }`}
              >
                <Text
                  className={`text-xs font-bold ${
                    selectedEquipment === opt.value ? 'text-zinc-50' : 'text-zinc-400'
                  }`}
                >
                  {opt.label}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        {/* Difficulty */}
        <View className="gap-1.5">
          <Text className="text-zinc-300 text-xs font-bold uppercase tracking-wider">Difficulty *</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} className="flex-row gap-2">
            {DIFFICULTY_OPTIONS.map((opt) => (
              <TouchableOpacity
                key={opt.value}
                onPress={() => setValue('difficulty', opt.value as Difficulty)}
                className={`px-3.5 py-2 rounded-xl border ${
                  selectedDifficulty === opt.value
                    ? 'bg-violet-600 border-violet-500'
                    : 'bg-zinc-900 border-zinc-800'
                }`}
              >
                <Text
                  className={`text-xs font-bold ${
                    selectedDifficulty === opt.value ? 'text-zinc-50' : 'text-zinc-400'
                  }`}
                >
                  {opt.label}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        <View className="flex-row gap-3">
          {/* Rest Duration */}
          <View className="flex-1 gap-1.5">
            <Text className="text-zinc-300 text-xs font-bold uppercase tracking-wider">Rest Duration (s)</Text>
            <Controller
              control={control}
              name="defaultRestDuration"
              render={({ field: { onChange, value } }) => (
                <TextInput
                  value={value ? String(value) : ''}
                  onChangeText={(txt) => onChange(parseInt(txt, 10) || undefined)}
                  keyboardType="numeric"
                  placeholder="90"
                  placeholderTextColor="#71717a"
                  className="bg-zinc-900 border border-zinc-800 rounded-xl px-4 py-3 text-zinc-100 text-sm"
                />
              )}
            />
          </View>

          {/* Default Unit */}
          <View className="flex-1 gap-1.5">
            <Text className="text-zinc-300 text-xs font-bold uppercase tracking-wider">Default Unit</Text>
            <View className="flex-row bg-zinc-900 border border-zinc-800 rounded-xl p-1 justify-around">
              <TouchableOpacity
                onPress={() => setValue('defaultUnit', 'kg')}
                className={`flex-1 py-2 rounded-lg items-center ${
                  selectedUnit === 'kg' ? 'bg-zinc-950 border border-zinc-800' : ''
                }`}
              >
                <Text className={`text-xs font-bold ${selectedUnit === 'kg' ? 'text-violet-400' : 'text-zinc-400'}`}>
                  KG
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => setValue('defaultUnit', 'lbs')}
                className={`flex-1 py-2 rounded-lg items-center ${
                  selectedUnit === 'lbs' ? 'bg-zinc-950 border border-zinc-800' : ''
                }`}
              >
                <Text className={`text-xs font-bold ${selectedUnit === 'lbs' ? 'text-violet-400' : 'text-zinc-400'}`}>
                  LBS
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>

        {/* Buttons */}
        <View className="flex-row gap-3 mt-4 border-t border-zinc-800/60 pt-5">
          <TouchableOpacity
            onPress={onCancel}
            className="flex-1 bg-zinc-900 border border-zinc-800 py-3 rounded-xl items-center justify-center"
            accessibilityRole="button"
            accessibilityLabel="Cancel exercise creation"
          >
            <Text className="text-zinc-400 text-xs font-bold uppercase tracking-wider">Cancel</Text>
          </TouchableOpacity>

          <TouchableOpacity
            disabled={isSubmitting}
            onPress={handleSubmit(onSubmit)}
            className="flex-1 bg-violet-600 py-3 rounded-xl items-center justify-center shadow-sm shadow-violet-600/10"
            style={{ opacity: isSubmitting ? 0.6 : 1 }}
            accessibilityRole="button"
            accessibilityLabel="Submit and save exercise"
          >
            <Text className="text-zinc-50 text-xs font-extrabold uppercase tracking-wider">Save Exercise</Text>
          </TouchableOpacity>
        </View>
      </View>
    </ScrollView>
  );
});
