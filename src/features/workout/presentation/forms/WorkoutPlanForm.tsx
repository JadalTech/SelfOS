import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, ScrollView, Modal, FlatList } from 'react-native';
import { useForm, Controller, useFieldArray } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { workoutPlanSchema } from '../../validation/workout.validation';
import { Exercise, WorkoutExercise, ExerciseSet } from '../../types/workout.types';
import { STANDARD_EXERCISES } from '../../constants/workout.constants';

export interface WorkoutPlanFormProps {
  readonly defaultValues?: any;
  readonly userExercises?: Exercise[]; // Custom exercises created by the user
  readonly onSubmit: (data: any) => void;
  readonly onCancel: () => void;
  readonly isSubmitting?: boolean;
}

const DAYS_OF_WEEK = [
  { value: 'monday', label: 'Mon' },
  { value: 'tuesday', label: 'Tue' },
  { value: 'wednesday', label: 'Wed' },
  { value: 'thursday', label: 'Thu' },
  { value: 'friday', label: 'Fri' },
  { value: 'saturday', label: 'Sat' },
  { value: 'sunday', label: 'Sun' },
];

export const WorkoutPlanForm: React.FC<WorkoutPlanFormProps> = React.memo(function WorkoutPlanForm({
  defaultValues,
  userExercises = [],
  onSubmit,
  onCancel,
  isSubmitting = false,
}) {
  const allExercises: Exercise[] = [...STANDARD_EXERCISES, ...userExercises];
  const [isExerciseSelectorVisible, setIsExerciseSelectorVisible] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  const {
    control,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(workoutPlanSchema),
    defaultValues: {
      name: '',
      description: '',
      exercises: [],
      schedule: [],
      ...defaultValues,
    },
  });

  const { fields: exerciseFields, append: appendExercise, remove: removeExercise } = useFieldArray({
    control,
    name: 'exercises',
  });

  const selectedSchedule: string[] = watch('schedule') || [];
  const planExercises: WorkoutExercise[] = watch('exercises') || [];

  const toggleDay = (day: string) => {
    if (selectedSchedule.includes(day)) {
      setValue(
        'schedule',
        selectedSchedule.filter((d) => d !== day)
      );
    } else {
      setValue('schedule', [...selectedSchedule, day]);
    }
  };

  const handleSelectExercise = (exercise: Exercise) => {
    // Append exercise to plan split with 1 default working set
    const defaultSet: ExerciseSet = {
      id: Math.random().toString(36).substring(2, 9),
      type: 'working',
      weight: 0,
      reps: 10,
      completed: false,
    };

    appendExercise({
      id: Math.random().toString(36).substring(2, 9),
      exerciseId: exercise.id,
      exerciseName: exercise.name,
      exerciseCategory: exercise.category,
      primaryMuscleGroup: exercise.primaryMuscleGroup,
      sets: [defaultSet],
    });
    setIsExerciseSelectorVisible(false);
    setSearchTerm('');
  };

  const addSetToExercise = (exIndex: number) => {
    const currentExercises = [...planExercises];
    const targetEx = currentExercises[exIndex];
    if (targetEx) {
      const lastSet = targetEx.sets[targetEx.sets.length - 1];
      const newSet: ExerciseSet = {
        id: Math.random().toString(36).substring(2, 9),
        type: 'working',
        weight: lastSet ? lastSet.weight : 0,
        reps: lastSet ? lastSet.reps : 10,
        completed: false,
      };
      targetEx.sets.push(newSet);
      setValue('exercises', currentExercises);
    }
  };

  const removeSetFromExercise = (exIndex: number, setIndex: number) => {
    const currentExercises = [...planExercises];
    const targetEx = currentExercises[exIndex];
    if (targetEx && targetEx.sets.length > 1) {
      targetEx.sets.splice(setIndex, 1);
      setValue('exercises', currentExercises);
    }
  };

  const updateSetValues = (exIndex: number, setIndex: number, fields: Partial<ExerciseSet>) => {
    const currentExercises = [...planExercises];
    const targetEx = currentExercises[exIndex];
    if (targetEx) {
      targetEx.sets[setIndex] = { ...targetEx.sets[setIndex], ...fields };
      setValue('exercises', currentExercises);
    }
  };

  const filteredCatalog = allExercises.filter((ex) =>
    ex.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <ScrollView
      className="flex-1"
      contentContainerStyle={{ padding: 16, paddingBottom: 40 }}
      showsVerticalScrollIndicator={false}
    >
      <View className="gap-5">
        {/* Plan Name */}
        <View className="gap-1.5">
          <Text className="text-zinc-300 text-xs font-bold uppercase tracking-wider">Plan Name *</Text>
          <Controller
            control={control}
            name="name"
            render={({ field: { onChange, value } }) => (
              <TextInput
                value={value}
                onChangeText={onChange}
                placeholder="e.g. Upper Body Focus"
                placeholderTextColor="#71717a"
                className="bg-zinc-900 border border-zinc-800 rounded-xl px-4 py-3 text-zinc-100 text-sm"
              />
            )}
          />
          {errors.name?.message ? (
            <Text className="text-red-400 text-xs font-semibold">{String(errors.name.message)}</Text>
          ) : null}
        </View>

        {/* Plan Description */}
        <View className="gap-1.5">
          <Text className="text-zinc-300 text-xs font-bold uppercase tracking-wider">Description</Text>
          <Controller
            control={control}
            name="description"
            render={({ field: { onChange, value } }) => (
              <TextInput
                value={value}
                onChangeText={onChange}
                placeholder="e.g. Hypertrophy split targetting chest and back"
                placeholderTextColor="#71717a"
                multiline
                numberOfLines={3}
                className="bg-zinc-900 border border-zinc-800 rounded-xl px-4 py-3 text-zinc-100 text-sm min-h-[80px] text-left"
              />
            )}
          />
        </View>

        {/* Schedule Selection */}
        <View className="gap-1.5">
          <Text className="text-zinc-300 text-xs font-bold uppercase tracking-wider">Target Schedule</Text>
          <View className="flex-row flex-wrap gap-2">
            {DAYS_OF_WEEK.map((day) => {
              const isSelected = selectedSchedule.includes(day.value);
              return (
                <TouchableOpacity
                  key={day.value}
                  onPress={() => toggleDay(day.value)}
                  className={`px-3 py-2 rounded-xl border flex-1 min-w-[70px] items-center justify-center ${
                    isSelected
                      ? 'bg-violet-600 border-violet-500'
                      : 'bg-zinc-900 border-zinc-800'
                  }`}
                >
                  <Text className={`text-xs font-bold ${isSelected ? 'text-zinc-50' : 'text-zinc-400'}`}>
                    {day.label}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>
        </View>

        {/* Exercises List Header */}
        <View className="gap-2 pt-2 border-t border-zinc-800/40">
          <View className="flex-row items-center justify-between">
            <Text className="text-zinc-200 text-sm font-bold uppercase tracking-wide">Exercises Split</Text>
            <TouchableOpacity
              onPress={() => setIsExerciseSelectorVisible(true)}
              className="bg-violet-500/10 border border-violet-500/30 px-3 py-1.5 rounded-xl"
            >
              <Text className="text-violet-400 text-xs font-bold">+ Add Exercise</Text>
            </TouchableOpacity>
          </View>
          {errors.exercises?.message ? (
            <Text className="text-red-400 text-xs font-semibold">{String(errors.exercises.message)}</Text>
          ) : null}
        </View>

        {/* Dynamic Exercise Field Arrays */}
        <View className="gap-4">
          {exerciseFields.map((field, exIndex) => {
            const currentEx = planExercises[exIndex];
            if (!currentEx) return null;

            return (
              <View key={field.id} className="bg-zinc-900/60 border border-zinc-800 p-4 rounded-2xl gap-3">
                {/* Exercise Header */}
                <View className="flex-row items-center justify-between">
                  <View className="flex-1">
                    <Text className="text-zinc-50 font-bold text-sm" numberOfLines={1}>
                      {currentEx.exerciseName}
                    </Text>
                    <Text className="text-zinc-500 text-[10px] capitalize font-medium">
                      {currentEx.primaryMuscleGroup}
                    </Text>
                  </View>

                  <TouchableOpacity
                    onPress={() => removeExercise(exIndex)}
                    className="px-2.5 py-1 bg-red-500/10 border border-red-500/20 rounded-lg"
                  >
                    <Text className="text-red-400 text-[10px] font-bold">Remove</Text>
                  </TouchableOpacity>
                </View>

                {/* Sets Header */}
                <View className="flex-row justify-between items-center px-1">
                  <Text className="text-zinc-400 text-[10px] font-extrabold uppercase tracking-wider">
                    Target Sets
                  </Text>
                  <TouchableOpacity
                    onPress={() => addSetToExercise(exIndex)}
                    className="bg-zinc-950 border border-zinc-800 px-2 py-1 rounded-lg"
                  >
                    <Text className="text-zinc-400 text-[9px] font-bold">+ Set</Text>
                  </TouchableOpacity>
                </View>

                {/* Sets List */}
                <View>
                  {currentEx.sets.map((set, setIndex) => (
                    <View key={setIndex} className="flex-row items-center gap-2 mb-2 bg-zinc-950/60 border border-zinc-850 p-2 rounded-xl">
                      <Text className="text-zinc-400 text-xs font-bold w-12 text-center">
                        Set {setIndex + 1}
                      </Text>

                      {/* Weight input */}
                      <View className="flex-row items-center bg-zinc-900 border border-zinc-800 px-2 py-1.5 rounded-lg flex-1">
                        <TextInput
                          keyboardType="numeric"
                          value={set.weight > 0 ? String(set.weight) : ''}
                          placeholder="Weight"
                          placeholderTextColor="#52525b"
                          onChangeText={(v) =>
                            updateSetValues(exIndex, setIndex, { weight: parseFloat(v) || 0 })
                          }
                          className="text-zinc-50 font-bold text-xs text-center flex-1 p-0"
                        />
                        <Text className="text-zinc-500 text-[9px] font-bold ml-1">KG</Text>
                      </View>

                      {/* Reps input */}
                      <View className="flex-row items-center bg-zinc-900 border border-zinc-800 px-2 py-1.5 rounded-lg flex-1">
                        <TextInput
                          keyboardType="number-pad"
                          value={set.reps > 0 ? String(set.reps) : ''}
                          placeholder="Reps"
                          placeholderTextColor="#52525b"
                          onChangeText={(v) =>
                            updateSetValues(exIndex, setIndex, { reps: parseInt(v, 10) || 0 })
                          }
                          className="text-zinc-50 font-bold text-xs text-center flex-1 p-0"
                        />
                        <Text className="text-zinc-500 text-[9px] font-bold ml-1">Reps</Text>
                      </View>

                      {/* Delete Set */}
                      <TouchableOpacity
                        disabled={currentEx.sets.length <= 1}
                        onPress={() => removeSetFromExercise(exIndex, setIndex)}
                        className={`w-8 h-8 rounded-lg items-center justify-center border bg-zinc-900 border-zinc-800 ${
                          currentEx.sets.length <= 1 ? 'opacity-30' : ''
                        }`}
                      >
                        <Text className="text-red-400 text-xs font-bold">×</Text>
                      </TouchableOpacity>
                    </View>
                  ))}
                </View>
              </View>
            );
          })}

          {exerciseFields.length === 0 ? (
            <View className="py-8 bg-zinc-900/30 border border-dashed border-zinc-800 items-center justify-center rounded-2xl">
              <Text className="text-zinc-500 text-xs font-semibold">No exercises added to this split plan</Text>
              <Text className="text-zinc-600 text-[10px] mt-1">Tap &apos;+ Add Exercise&apos; to build your routine</Text>
            </View>
          ) : null}
        </View>

        {/* Submit Actions */}
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
            className="flex-1 bg-violet-600 py-3 rounded-xl items-center justify-center shadow-sm shadow-violet-600/10"
            style={{ opacity: isSubmitting ? 0.6 : 1 }}
          >
            <Text className="text-zinc-50 text-xs font-extrabold uppercase tracking-wider">Save Plan</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Exercise Selection Modal */}
      <Modal
        visible={isExerciseSelectorVisible}
        animationType="slide"
        transparent
        onRequestClose={() => setIsExerciseSelectorVisible(false)}
      >
        <View className="flex-1 bg-zinc-950/95 justify-end pt-10">
          <View className="bg-zinc-900 border-t border-zinc-800 rounded-t-3xl p-4 flex-1">
            <View className="flex-row justify-between items-center mb-4">
              <Text className="text-zinc-50 text-base font-bold">Select Exercise</Text>
              <TouchableOpacity
                onPress={() => setIsExerciseSelectorVisible(false)}
                className="w-8 h-8 rounded-full bg-zinc-950 border border-zinc-800 items-center justify-center"
              >
                <Text className="text-zinc-400 text-sm font-bold">×</Text>
              </TouchableOpacity>
            </View>

            {/* Search Bar */}
            <TextInput
              value={searchTerm}
              onChangeText={setSearchTerm}
              placeholder="Search exercise catalog..."
              placeholderTextColor="#71717a"
              className="bg-zinc-950 border border-zinc-800 rounded-xl px-4 py-3 text-zinc-100 text-sm mb-4"
            />

            {/* Catalog List */}
            <FlatList
              data={filteredCatalog}
              keyExtractor={(item) => item.id}
              showsVerticalScrollIndicator={false}
              renderItem={({ item }) => (
                <TouchableOpacity
                  onPress={() => handleSelectExercise(item)}
                  className="py-3.5 border-b border-zinc-800/60 flex-row justify-between items-center"
                >
                  <View>
                    <Text className="text-zinc-100 font-semibold text-sm">{item.name}</Text>
                    <Text className="text-zinc-500 text-[10px] capitalize mt-0.5">
                      {item.primaryMuscleGroup} • {item.equipment}
                    </Text>
                  </View>
                  <Text className="text-zinc-400 text-sm">+</Text>
                </TouchableOpacity>
              )}
              ListEmptyComponent={() => (
                <View className="py-12 items-center justify-center">
                  <Text className="text-zinc-500 text-xs font-semibold">No exercises match search</Text>
                </View>
              )}
            />
          </View>
        </View>
      </Modal>
    </ScrollView>
  );
});
