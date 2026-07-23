import React from 'react';
import { View, Text, TextInput, TouchableOpacity } from 'react-native';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { hairProductSchema, HairProductFormValues } from '../validation/haircare.validation';
import { InlineLoader } from '@/shared/components';
import type { ProductCategory } from '../types';

interface ProductFormProps {
  readonly initialValues?: Partial<HairProductFormValues>;
  readonly onSubmit: (values: HairProductFormValues) => Promise<void>;
  readonly isSubmitting?: boolean;
  readonly submitLabel?: string;
}

const CATEGORY_OPTIONS: { label: string; value: ProductCategory }[] = [
  { label: 'Shampoo', value: 'shampoo' },
  { label: 'Conditioner', value: 'conditioner' },
  { label: 'Hair Oil', value: 'oil' },
  { label: 'Serum', value: 'serum' },
  { label: 'Deep Mask', value: 'mask' },
  { label: 'Treatment', value: 'treatment' },
  { label: 'Custom', value: 'custom' },
];

export const ProductForm: React.FC<ProductFormProps> = React.memo(
  function ProductForm({
    initialValues,
    onSubmit,
    isSubmitting = false,
    submitLabel = 'Save Product',
  }) {
    const {
      control,
      handleSubmit,
      formState: { errors },
    } = useForm<HairProductFormValues>({
      resolver: zodResolver(hairProductSchema),
      defaultValues: {
        name: initialValues?.name || '',
        brand: initialValues?.brand || '',
        category: initialValues?.category || 'shampoo',
        isFavorite: initialValues?.isFavorite ?? false,
        isActive: initialValues?.isActive ?? true,
        notes: initialValues?.notes || '',
      },
    });

    return (
      <View className="bg-zinc-900 border border-zinc-800 rounded-2xl p-4 gap-4">
        {/* Product Name */}
        <View className="gap-1">
          <Text className="text-zinc-400 text-xs font-semibold">Product Name</Text>
          <Controller
            control={control}
            name="name"
            render={({ field: { onChange, onBlur, value } }) => (
              <TextInput
                className="bg-zinc-950 border border-zinc-800 text-zinc-100 p-3 rounded-xl text-sm font-medium focus:border-emerald-500"
                placeholder="e.g. Ketoconazole 2% Shampoo"
                placeholderTextColor="#71717a"
                onBlur={onBlur}
                onChangeText={onChange}
                value={value}
              />
            )}
          />
          {errors.name ? (
            <Text className="text-rose-500 text-xs font-medium">{errors.name.message}</Text>
          ) : null}
        </View>

        {/* Brand */}
        <View className="gap-1">
          <Text className="text-zinc-400 text-xs font-semibold">Brand / Manufacturer</Text>
          <Controller
            control={control}
            name="brand"
            render={({ field: { onChange, onBlur, value } }) => (
              <TextInput
                className="bg-zinc-950 border border-zinc-800 text-zinc-100 p-3 rounded-xl text-sm font-medium focus:border-emerald-500"
                placeholder="e.g. Nizoral / Ordinary"
                placeholderTextColor="#71717a"
                onBlur={onBlur}
                onChangeText={onChange}
                value={value}
              />
            )}
          />
          {errors.brand ? (
            <Text className="text-rose-500 text-xs font-medium">{errors.brand.message}</Text>
          ) : null}
        </View>

        {/* Category Pill Selector */}
        <View className="gap-1.5">
          <Text className="text-zinc-400 text-xs font-semibold">Category</Text>
          <Controller
            control={control}
            name="category"
            render={({ field: { onChange, value } }) => (
              <View className="flex-row flex-wrap gap-2">
                {CATEGORY_OPTIONS.map((opt) => {
                  const isSelected = value === opt.value;
                  return (
                    <TouchableOpacity
                      key={opt.value}
                      className={`px-3 py-2 rounded-xl border ${
                        isSelected
                          ? 'bg-amber-500/20 border-amber-500'
                          : 'bg-zinc-950 border-zinc-800'
                      }`}
                      onPress={() => onChange(opt.value)}
                      accessibilityRole="button"
                    >
                      <Text
                        className={`text-xs font-bold ${
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

        {/* Favorite Toggle */}
        <Controller
          control={control}
          name="isFavorite"
          render={({ field: { onChange, value } }) => (
            <TouchableOpacity
              className="flex-row items-center justify-between bg-zinc-950 border border-zinc-800 p-3 rounded-xl"
              onPress={() => onChange(!value)}
            >
              <Text className="text-zinc-200 text-xs font-semibold">Mark as Favorite ⭐</Text>
              <Text className="text-amber-400 text-base">{value ? '✓' : '○'}</Text>
            </TouchableOpacity>
          )}
        />

        {/* Notes */}
        <View className="gap-1">
          <Text className="text-zinc-400 text-xs font-semibold">Usage Notes (Optional)</Text>
          <Controller
            control={control}
            name="notes"
            render={({ field: { onChange, onBlur, value } }) => (
              <TextInput
                className="bg-zinc-950 border border-zinc-800 text-zinc-100 p-3 rounded-xl text-sm font-medium focus:border-emerald-500 min-h-[70px]"
                placeholder="e.g. Leave on scalp for 5 minutes before rinsing."
                placeholderTextColor="#71717a"
                multiline
                onBlur={onBlur}
                onChangeText={onChange}
                value={value || ''}
              />
            )}
          />
        </View>

        {/* Submit CTA */}
        <TouchableOpacity
          className="bg-emerald-500 active:bg-emerald-600 py-3.5 rounded-xl items-center justify-center shadow-lg shadow-emerald-500/20"
          onPress={handleSubmit((vals) => void onSubmit(vals))}
          disabled={isSubmitting}
          accessibilityRole="button"
        >
          {isSubmitting ? (
            <InlineLoader label="Saving product..." color="#09090b" />
          ) : (
            <Text className="text-zinc-950 font-extrabold text-sm">{submitLabel}</Text>
          )}
        </TouchableOpacity>
      </View>
    );
  }
);
