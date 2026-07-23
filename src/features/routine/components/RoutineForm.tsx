import React from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import { useForm, Controller, useWatch } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  routineFormSchema,
  type RoutineFormValues,
} from '../validation/routine.validation';
import type { RoutineType, RoutineStatus } from '../types';
import { ScheduleSelector } from './ScheduleSelector';
import { ReminderPicker } from './ReminderPicker';
import { InlineLoader } from '@/shared/components';

interface RoutineFormProps {
  readonly initialValues?: Partial<RoutineFormValues>;
  readonly submitLabel?: string;
  readonly isSubmitting?: boolean;
  readonly onSubmit: (values: RoutineFormValues) => Promise<void> | void;
}

const ROUTINE_TYPES: { type: RoutineType; label: string; icon: string }[] = [
  { type: 'haircare', label: 'Haircare', icon: '💇‍♂️' },
  { type: 'skincare', label: 'Skincare', icon: '🧴' },
  { type: 'water', label: 'Water', icon: '💧' },
  { type: 'nutrition', label: 'Nutrition', icon: '🥗' },
  { type: 'gym', label: 'Gym', icon: '🏋️‍♂️' },
  { type: 'sleep', label: 'Sleep', icon: '😴' },
  { type: 'medication', label: 'Meds', icon: '💊' },
  { type: 'custom', label: 'Custom', icon: '🎯' },
];

const DEFAULT_FORM_VALUES: RoutineFormValues = {
  title: '',
  description: '',
  type: 'haircare',
  status: 'active',
  schedule: {
    frequency: 'daily',
    interval: 1,
    startDate: new Date().toISOString().split('T')[0],
    timezone: 'Asia/Kolkata',
  },
  reminders: [],
};

export const RoutineForm: React.FC<RoutineFormProps> = React.memo(
  function RoutineForm({
    initialValues,
    submitLabel = 'Save Routine',
    isSubmitting = false,
    onSubmit,
  }) {
    const defaultValues: RoutineFormValues = {
      ...DEFAULT_FORM_VALUES,
      ...initialValues,
      schedule: {
        ...DEFAULT_FORM_VALUES.schedule,
        ...initialValues?.schedule,
      },
    };

    const {
      control,
      handleSubmit,
      formState: { errors },
    } = useForm<RoutineFormValues>({
      resolver: zodResolver(routineFormSchema),
      defaultValues,
    });

    const watchedSchedule = useWatch({ control, name: 'schedule' });

    return (
      <ScrollView
        className="flex-1"
        contentContainerStyle={{ padding: 16, gap: 20 }}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        {/* Title Input */}
        <View className="gap-1.5">
          <Text className="text-zinc-400 text-xs font-semibold uppercase tracking-wider">
            Routine Name *
          </Text>
          <Controller
            control={control}
            name="title"
            render={({ field: { onChange, onBlur, value } }) => (
              <TextInput
                className={`bg-zinc-900 border ${
                  errors.title ? 'border-rose-500' : 'border-zinc-800'
                } rounded-xl px-4 py-3 text-zinc-100 text-base font-semibold`}
                placeholder="e.g. Ketoconazole Scalp Wash"
                placeholderTextColor="#71717a"
                onBlur={onBlur}
                onChangeText={onChange}
                value={value}
              />
            )}
          />
          {errors.title ? (
            <Text className="text-rose-500 text-xs font-medium mt-0.5">
              {errors.title.message}
            </Text>
          ) : null}
        </View>

        {/* Description Input */}
        <View className="gap-1.5">
          <Text className="text-zinc-400 text-xs font-semibold uppercase tracking-wider">
            Description (Optional)
          </Text>
          <Controller
            control={control}
            name="description"
            render={({ field: { onChange, onBlur, value } }) => (
              <TextInput
                className="bg-zinc-900 border border-zinc-800 rounded-xl px-4 py-3 text-zinc-100 text-sm font-normal min-h-[80px]"
                placeholder="Add notes, steps, or products..."
                placeholderTextColor="#71717a"
                multiline
                numberOfLines={3}
                onBlur={onBlur}
                onChangeText={onChange}
                value={value ?? ''}
              />
            )}
          />
        </View>

        {/* Routine Category Type Selector */}
        <View className="gap-2">
          <Text className="text-zinc-400 text-xs font-semibold uppercase tracking-wider">
            Category Type
          </Text>
          <Controller
            control={control}
            name="type"
            render={({ field: { onChange, value } }) => (
              <View className="flex-row flex-wrap gap-2">
                {ROUTINE_TYPES.map((item) => {
                  const isSelected = value === item.type;
                  return (
                    <TouchableOpacity
                      key={item.type}
                      className={`px-3 py-2 rounded-xl flex-row items-center gap-1.5 border ${
                        isSelected
                          ? 'bg-emerald-500/10 border-emerald-500'
                          : 'bg-zinc-900 border-zinc-800'
                      }`}
                      onPress={() => onChange(item.type)}
                      accessibilityRole="button"
                      accessibilityLabel={`Select category ${item.label}`}
                      accessibilityState={{ selected: isSelected }}
                    >
                      <Text className="text-base">{item.icon}</Text>
                      <Text
                        className={`text-xs font-semibold ${
                          isSelected ? 'text-emerald-400' : 'text-zinc-400'
                        }`}
                      >
                        {item.label}
                      </Text>
                    </TouchableOpacity>
                  );
                })}
              </View>
            )}
          />
        </View>

        {/* Schedule Selector */}
        <Controller
          control={control}
          name="schedule"
          render={({ field: { onChange, value } }) => (
            <ScheduleSelector
              value={value}
              onChange={onChange}
              errors={{
                daysOfWeek: errors.schedule?.daysOfWeek?.message,
              }}
            />
          )}
        />

        {/* Reminder Picker */}
        <Controller
          control={control}
          name="reminders"
          render={({ field: { onChange, value } }) => {
            const firstReminder = value && value.length > 0 ? value[0] : undefined;
            return (
              <ReminderPicker
                reminder={firstReminder}
                timezone={watchedSchedule?.timezone ?? 'Asia/Kolkata'}
                onChange={(updated) => {
                  onChange(updated ? [updated] : []);
                }}
              />
            );
          }}
        />

        {/* Status Selector */}
        <View className="gap-2">
          <Text className="text-zinc-400 text-xs font-semibold uppercase tracking-wider">
            Initial Status
          </Text>
          <Controller
            control={control}
            name="status"
            render={({ field: { onChange, value } }) => (
              <View className="flex-row gap-2">
                {(['active', 'paused', 'draft'] as RoutineStatus[]).map((st) => {
                  const isSelected = value === st;
                  return (
                    <TouchableOpacity
                      key={st}
                      className={`flex-1 py-2.5 rounded-xl border items-center justify-center capitalize ${
                        isSelected
                          ? 'bg-zinc-800 border-zinc-600'
                          : 'bg-zinc-900 border-zinc-800'
                      }`}
                      onPress={() => onChange(st)}
                    >
                      <Text
                        className={`text-xs font-semibold capitalize ${
                          isSelected ? 'text-zinc-100' : 'text-zinc-400'
                        }`}
                      >
                        {st}
                      </Text>
                    </TouchableOpacity>
                  );
                })}
              </View>
            )}
          />
        </View>

        {/* Submit Button */}
        <TouchableOpacity
          className="mt-4 bg-emerald-500 active:bg-emerald-600 py-4 rounded-xl items-center justify-center shadow-lg shadow-emerald-500/20"
          onPress={handleSubmit((data) => void onSubmit(data))}
          disabled={isSubmitting}
          accessibilityRole="button"
          accessibilityLabel={submitLabel}
        >
          {isSubmitting ? (
            <InlineLoader label="Saving..." color="#09090b" />
          ) : (
            <Text className="text-zinc-950 font-extrabold text-base">
              {submitLabel}
            </Text>
          )}
        </TouchableOpacity>
      </ScrollView>
    );
  }
);
