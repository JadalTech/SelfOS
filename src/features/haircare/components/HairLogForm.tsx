import React from 'react';
import { View, Text, TextInput, TouchableOpacity } from 'react-native';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { hairLogSchema, HairLogFormValues } from '../validation/haircare.validation';
import { InlineLoader } from '@/shared/components';
import type { HairRoutineVM, HairProductVM } from '../types';

interface HairLogFormProps {
  readonly routine: HairRoutineVM;
  readonly availableProducts: HairProductVM[];
  readonly onSubmit: (values: HairLogFormValues) => Promise<void>;
  readonly isSubmitting?: boolean;
}

export const HairLogForm: React.FC<HairLogFormProps> = React.memo(
  function HairLogForm({ routine, availableProducts, onSubmit, isSubmitting = false }) {
    const defaultProductIds = routine.products.map((p) => p.id);

    const {
      control,
      handleSubmit,
      formState: { errors },
    } = useForm<HairLogFormValues>({
      resolver: zodResolver(hairLogSchema),
      defaultValues: {
        hairRoutineId: routine.id,
        appliedProductIds: defaultProductIds.length > 0 ? defaultProductIds : availableProducts.map((p) => p.id),
        notes: '',
      },
    });

    return (
      <View className="bg-zinc-900 border border-zinc-800 rounded-2xl p-4 gap-4">
        <View>
          <Text className="text-zinc-500 text-[10px] font-bold uppercase tracking-wider">
            Logging Completion
          </Text>
          <Text className="text-zinc-50 text-lg font-extrabold">{routine.title}</Text>
        </View>

        {/* Applied Products */}
        <View className="gap-1.5">
          <Text className="text-zinc-400 text-xs font-semibold">Select Applied Products</Text>
          <Controller
            control={control}
            name="appliedProductIds"
            render={({ field: { onChange, value } }) => (
              <View className="gap-2">
                {availableProducts.map((p) => {
                  const isSelected = value.includes(p.id);
                  return (
                    <TouchableOpacity
                      key={p.id}
                      className={`flex-row items-center justify-between p-3 rounded-xl border ${
                        isSelected
                          ? 'bg-emerald-950/60 border-emerald-500/60'
                          : 'bg-zinc-950 border-zinc-800'
                      }`}
                      onPress={() => {
                        if (isSelected) {
                          onChange(value.filter((id) => id !== p.id));
                        } else {
                          onChange([...value, p.id]);
                        }
                      }}
                    >
                      <Text className="text-zinc-100 text-xs font-bold">
                        {p.brand} {p.name}
                      </Text>
                      <Text className="text-emerald-400 font-bold">{isSelected ? '✓' : '+'}</Text>
                    </TouchableOpacity>
                  );
                })}
              </View>
            )}
          />
          {errors.appliedProductIds ? (
            <Text className="text-rose-500 text-xs font-medium">{errors.appliedProductIds.message}</Text>
          ) : null}
        </View>

        {/* Notes */}
        <View className="gap-1">
          <Text className="text-zinc-400 text-xs font-semibold">Notes / Scalp Observations</Text>
          <Controller
            control={control}
            name="notes"
            render={({ field: { onChange, onBlur, value } }) => (
              <TextInput
                className="bg-zinc-950 border border-zinc-800 text-zinc-100 p-3 rounded-xl text-sm font-medium focus:border-emerald-500 min-h-[60px]"
                placeholder="e.g. Scalp felt refreshed after ketoconazole treatment."
                placeholderTextColor="#71717a"
                multiline
                onBlur={onBlur}
                onChangeText={onChange}
                value={value || ''}
              />
            )}
          />
        </View>

        {/* Submit */}
        <TouchableOpacity
          className="bg-emerald-500 active:bg-emerald-600 py-3.5 rounded-xl items-center justify-center shadow-lg shadow-emerald-500/20"
          onPress={handleSubmit((vals) => void onSubmit(vals))}
          disabled={isSubmitting}
          accessibilityRole="button"
        >
          {isSubmitting ? (
            <InlineLoader label="Saving wash log..." color="#09090b" />
          ) : (
            <Text className="text-zinc-950 font-extrabold text-sm">✓ Complete Wash Day</Text>
          )}
        </TouchableOpacity>
      </View>
    );
  }
);
