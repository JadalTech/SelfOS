import React from 'react';
import { View, Text, TextInput, TouchableOpacity } from 'react-native';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { hairRoutineSchema, HairRoutineFormValues } from '../validation/haircare.validation';
import { InlineLoader } from '@/shared/components';
import type { HairProductVM, HairRoutineCategory } from '../types';

interface HairRoutineFormProps {
  readonly availableProducts: HairProductVM[];
  readonly onSubmit: (values: HairRoutineFormValues) => Promise<void>;
  readonly isSubmitting?: boolean;
}

const CATEGORY_OPTIONS: { label: string; value: HairRoutineCategory }[] = [
  { label: 'Wash Day', value: 'wash-day' },
  { label: 'Hair Oiling', value: 'oiling' },
  { label: 'Scalp Massage', value: 'scalp-massage' },
  { label: 'Deep Condition', value: 'deep-conditioning' },
  { label: 'Custom', value: 'custom' },
];

export const HairRoutineForm: React.FC<HairRoutineFormProps> = React.memo(
  function HairRoutineForm({ availableProducts, onSubmit, isSubmitting = false }) {
    const {
      control,
      handleSubmit,
      formState: { errors },
    } = useForm<HairRoutineFormValues>({
      resolver: zodResolver(hairRoutineSchema),
      defaultValues: {
        title: '',
        haircareCategory: 'wash-day',
        productIds: [],
        frequency: 'weekly',
        instructions: '',
      },
    });

    return (
      <View className="bg-zinc-900 border border-zinc-800 rounded-2xl p-4 gap-4">
        {/* Title */}
        <View className="gap-1">
          <Text className="text-zinc-400 text-xs font-semibold">Routine Name</Text>
          <Controller
            control={control}
            name="title"
            render={({ field: { onChange, onBlur, value } }) => (
              <TextInput
                className="bg-zinc-950 border border-zinc-800 text-zinc-100 p-3 rounded-xl text-sm font-medium focus:border-emerald-500"
                placeholder="e.g. Sunday Ketoconazole Wash Day"
                placeholderTextColor="#71717a"
                onBlur={onBlur}
                onChangeText={onChange}
                value={value}
              />
            )}
          />
          {errors.title ? (
            <Text className="text-rose-500 text-xs font-medium">{errors.title.message}</Text>
          ) : null}
        </View>

        {/* Haircare Category */}
        <View className="gap-1.5">
          <Text className="text-zinc-400 text-xs font-semibold">Haircare Category</Text>
          <Controller
            control={control}
            name="haircareCategory"
            render={({ field: { onChange, value } }) => (
              <View className="flex-row flex-wrap gap-2">
                {CATEGORY_OPTIONS.map((cat) => {
                  const isSelected = value === cat.value;
                  return (
                    <TouchableOpacity
                      key={cat.value}
                      className={`px-3 py-2 rounded-xl border ${
                        isSelected
                          ? 'bg-emerald-500/20 border-emerald-500'
                          : 'bg-zinc-950 border-zinc-800'
                      }`}
                      onPress={() => onChange(cat.value)}
                    >
                      <Text
                        className={`text-xs font-bold ${
                          isSelected ? 'text-emerald-400' : 'text-zinc-400'
                        }`}
                      >
                        {cat.label}
                      </Text>
                    </TouchableOpacity>
                  );
                })}
              </View>
            )}
          />
        </View>

        {/* Product Picker */}
        <View className="gap-1.5">
          <Text className="text-zinc-400 text-xs font-semibold">Link Hair Products</Text>
          {availableProducts.length === 0 ? (
            <Text className="text-amber-400 text-xs font-medium bg-amber-500/10 p-2.5 rounded-xl border border-amber-500/20">
              No products found. Create a product first to link it to your wash day.
            </Text>
          ) : (
            <Controller
              control={control}
              name="productIds"
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
                        <View>
                          <Text className="text-zinc-100 text-xs font-bold">
                            {p.brand} {p.name}
                          </Text>
                          <Text className="text-zinc-500 text-[10px]">{p.categoryLabel}</Text>
                        </View>
                        <Text className="text-emerald-400 font-bold">{isSelected ? '✓' : '+'}</Text>
                      </TouchableOpacity>
                    );
                  })}
                </View>
              )}
            />
          )}
          {errors.productIds ? (
            <Text className="text-rose-500 text-xs font-medium">{errors.productIds.message}</Text>
          ) : null}
        </View>

        {/* Frequency */}
        <View className="gap-1.5">
          <Text className="text-zinc-400 text-xs font-semibold">Repeat Frequency</Text>
          <Controller
            control={control}
            name="frequency"
            render={({ field: { onChange, value } }) => (
              <View className="flex-row gap-2">
                {['daily', 'weekly', 'monthly'].map((freq) => (
                  <TouchableOpacity
                    key={freq}
                    className={`flex-1 py-2.5 rounded-xl border items-center capitalize ${
                      value === freq
                        ? 'bg-emerald-500/20 border-emerald-500'
                        : 'bg-zinc-950 border-zinc-800'
                    }`}
                    onPress={() => onChange(freq)}
                  >
                    <Text
                      className={`text-xs font-bold capitalize ${
                        value === freq ? 'text-emerald-400' : 'text-zinc-400'
                      }`}
                    >
                      {freq}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
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
            <InlineLoader label="Saving routine..." color="#09090b" />
          ) : (
            <Text className="text-zinc-950 font-extrabold text-sm">Save Hair Routine</Text>
          )}
        </TouchableOpacity>
      </View>
    );
  }
);
