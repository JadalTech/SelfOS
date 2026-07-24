import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, ScrollView } from 'react-native';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { skinAssessmentSchema, SkinAssessmentFormValues } from '../validation/skincare.validation';
import { SKIN_TYPE_OPTIONS, SKIN_CONCERN_OPTIONS } from '../constants/skincare.constants';
import { RatingBar } from '../../../shared/components/inputs/RatingBar';
import type { SkinType, SkinConcern, Severity } from '../types';

export interface AssessmentFormProps {
  readonly isSubmitting?: boolean;
  readonly onSubmit: (values: SkinAssessmentFormValues) => Promise<void>;
}

export const AssessmentForm: React.FC<AssessmentFormProps> = function AssessmentForm({
  isSubmitting = false,
  onSubmit,
}) {
  const [selectedConcerns, setSelectedConcerns] = useState<SkinConcern[]>(['acne']);
  const [severityMap, setSeverityMap] = useState<Record<string, Severity>>({ acne: 3 });

  const {
    control,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<SkinAssessmentFormValues>({
    resolver: zodResolver(skinAssessmentSchema),
    defaultValues: {
      recordDate: new Date().toISOString().split('T')[0],
      skinType: 'combination',
      concerns: ['acne'],
      overallHealthScore: 7,
      hydrationLevel: 3,
      sensitivityLevel: 2,
      oilinessLevel: 3,
      barrierHealthScore: 4,
      severityMap: { acne: 3 },
      notes: '',
    },
  });

  const toggleConcern = (concern: SkinConcern) => {
    let updated;
    if (selectedConcerns.includes(concern)) {
      updated = selectedConcerns.filter((c) => c !== concern);
    } else {
      updated = [...selectedConcerns, concern];
    }
    setSelectedConcerns(updated);
    setValue('concerns', updated);

    const updatedSev = { ...severityMap };
    if (!updatedSev[concern]) {
      updatedSev[concern] = 3;
    }
    setSeverityMap(updatedSev);
    setValue('severityMap', updatedSev);
  };

  const setConcernSeverity = (concern: SkinConcern, sev: number) => {
    const updatedSev = { ...severityMap, [concern]: sev as Severity };
    setSeverityMap(updatedSev);
    setValue('severityMap', updatedSev);
  };

  return (
    <ScrollView contentContainerStyle={{ gap: 20, paddingBottom: 32 }} showsVerticalScrollIndicator={false}>
      {/* Date */}
      <View className="gap-1">
        <Text className="text-zinc-400 text-xs font-semibold">Assessment Date (YYYY-MM-DD) *</Text>
        <Controller
          control={control}
          name="recordDate"
          render={({ field: { onChange, onBlur, value } }) => (
            <TextInput
              className="bg-zinc-900 border border-zinc-800 p-3 rounded-xl text-zinc-50 text-sm"
              onBlur={onBlur}
              onChangeText={onChange}
              value={value}
            />
          )}
        />
        {errors.recordDate ? (
          <Text className="text-rose-400 text-xs">{errors.recordDate.message}</Text>
        ) : null}
      </View>

      {/* Skin Type */}
      <View className="gap-1.5">
        <Text className="text-zinc-400 text-xs font-semibold">Current Skin Type *</Text>
        <Controller
          control={control}
          name="skinType"
          render={({ field: { onChange, value } }) => (
            <View className="flex-row flex-wrap gap-2">
              {SKIN_TYPE_OPTIONS.map((opt) => {
                const isSelected = value === opt.value;
                return (
                  <TouchableOpacity
                    key={opt.value}
                    onPress={() => onChange(opt.value as SkinType)}
                    className={`px-3 py-2 rounded-xl border ${
                      isSelected
                        ? 'bg-pink-500/20 border-pink-500/50'
                        : 'bg-zinc-900 border-zinc-800'
                    }`}
                  >
                    <Text
                      className={`text-xs font-semibold ${
                        isSelected ? 'text-pink-400' : 'text-zinc-300'
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

      {/* Active Concerns */}
      <View className="gap-1.5">
        <Text className="text-zinc-400 text-xs font-semibold">Active Skin Concerns *</Text>
        <View className="flex-row flex-wrap gap-2">
          {SKIN_CONCERN_OPTIONS.map((opt) => {
            const isSelected = selectedConcerns.includes(opt.value);
            return (
              <TouchableOpacity
                key={opt.value}
                onPress={() => toggleConcern(opt.value)}
                className={`px-3 py-1.5 rounded-xl border ${
                  isSelected
                    ? 'bg-amber-500/20 border-amber-500/50'
                    : 'bg-zinc-900 border-zinc-800'
                }`}
              >
                <Text
                  className={`text-xs font-medium ${
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

      {/* Severity Selectors for Active Concerns */}
      {selectedConcerns.length > 0 ? (
        <View className="gap-3 bg-zinc-900/60 p-4 rounded-2xl border border-zinc-800">
          <Text className="text-zinc-300 text-xs font-bold">Concern Severity Ratings (1-5)</Text>
          {selectedConcerns.map((concern) => {
            const label = SKIN_CONCERN_OPTIONS.find((o) => o.value === concern)?.label || concern;
            const currentSev = severityMap[concern] || 3;
            return (
              <RatingBar
                key={concern}
                label={label}
                value={currentSev}
                max={5}
                activeColor="#f59e0b"
                onChange={(v) => setConcernSeverity(concern, v)}
              />
            );
          })}
        </View>
      ) : null}

      {/* Overall Health Score (1-10) */}
      <Controller
        control={control}
        name="overallHealthScore"
        render={({ field: { onChange, value } }) => (
          <RatingBar
            label="Overall Skin Health Score (1-10)"
            value={value || 7}
            max={10}
            activeColor="#ec4899"
            onChange={onChange}
          />
        )}
      />

      {/* Hydration Level (1-5) */}
      <Controller
        control={control}
        name="hydrationLevel"
        render={({ field: { onChange, value } }) => (
          <RatingBar
            label="Hydration Level (1=Very Dry, 5=Plump & Well Hydrated)"
            value={value || 3}
            max={5}
            activeColor="#3b82f6"
            onChange={onChange}
          />
        )}
      />

      {/* Barrier Health (1-5) */}
      <Controller
        control={control}
        name="barrierHealthScore"
        render={({ field: { onChange, value } }) => (
          <RatingBar
            label="Skin Barrier Condition (1=Damaged/Stinging, 5=Resilient)"
            value={value || 4}
            max={5}
            activeColor="#10b981"
            onChange={onChange}
          />
        )}
      />

      {/* Notes */}
      <View className="gap-1">
        <Text className="text-zinc-400 text-xs font-semibold">Additional Notes</Text>
        <Controller
          control={control}
          name="notes"
          render={({ field: { onChange, onBlur, value } }) => (
            <TextInput
              className="bg-zinc-900 border border-zinc-800 p-3 rounded-xl text-zinc-50 text-xs"
              placeholder="e.g. Skin felt sensitive after introducing retinol"
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
        onPress={handleSubmit(onSubmit as any)}
        disabled={isSubmitting}
        className="bg-pink-600 p-4 rounded-2xl items-center justify-center shadow-lg"
      >
        <Text className="text-white text-base font-bold">
          {isSubmitting ? 'Saving Assessment...' : 'Submit Skin Assessment'}
        </Text>
      </TouchableOpacity>
    </ScrollView>
  );
};
