import React from 'react';
import { View, Text, TextInput, TouchableOpacity, ScrollView, Modal } from 'react-native';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { skincareProductSchema, SkincareProductFormValues } from '../validation/skincare.validation';
import { PRODUCT_CATEGORY_OPTIONS, PRODUCT_TYPE_OPTIONS } from '../constants/skincare.constants';

export interface ProductFormProps {
  readonly visible: boolean;
  readonly initialValues?: Partial<SkincareProductFormValues>;
  readonly isSubmitting?: boolean;
  readonly onClose: () => void;
  readonly onSubmit: (values: SkincareProductFormValues) => Promise<void>;
}

export const ProductForm: React.FC<ProductFormProps> = function ProductForm({
  visible,
  initialValues,
  isSubmitting = false,
  onClose,
  onSubmit,
}) {
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<SkincareProductFormValues>({
    resolver: zodResolver(skincareProductSchema),
    defaultValues: {
      name: initialValues?.name || '',
      brand: initialValues?.brand || '',
      category: initialValues?.category || 'moisturizer',
      type: initialValues?.type || 'cream',
      keyIngredients: initialValues?.keyIngredients || [],
      openedDate: initialValues?.openedDate || '',
      shelfLifeMonths: initialValues?.shelfLifeMonths || 12,
      isFavorite: initialValues?.isFavorite ?? false,
      notes: initialValues?.notes || '',
    },
  });

  const onFormSubmit = async (data: SkincareProductFormValues) => {
    await onSubmit(data);
    onClose();
  };

  return (
    <Modal visible={visible} animationType="slide" transparent onRequestClose={onClose}>
      <View className="flex-1 bg-black/80 justify-end">
        <View className="bg-zinc-900 border-t border-zinc-800 rounded-t-3xl p-5 max-h-[85%] gap-4">
          <View className="flex-row items-center justify-between border-b border-zinc-800 pb-3">
            <Text className="text-zinc-50 text-lg font-bold">
              {initialValues ? 'Edit Skincare Product' : 'Add Skincare Product'}
            </Text>
            <TouchableOpacity onPress={onClose} className="p-1">
              <Text className="text-zinc-400 text-lg font-bold">✕</Text>
            </TouchableOpacity>
          </View>

          <ScrollView contentContainerStyle={{ gap: 16 }} showsVerticalScrollIndicator={false}>
            {/* Brand */}
            <View className="gap-1">
              <Text className="text-zinc-400 text-xs font-semibold">Brand Name *</Text>
              <Controller
                control={control}
                name="brand"
                render={({ field: { onChange, onBlur, value } }) => (
                  <TextInput
                    className="bg-zinc-950 border border-zinc-800 p-3 rounded-xl text-zinc-50 text-sm"
                    placeholder="e.g. CeraVe, La Roche-Posay, Paula's Choice"
                    placeholderTextColor="#71717a"
                    onBlur={onBlur}
                    onChangeText={onChange}
                    value={value}
                  />
                )}
              />
              {errors.brand ? (
                <Text className="text-rose-400 text-xs">{errors.brand.message}</Text>
              ) : null}
            </View>

            {/* Name */}
            <View className="gap-1">
              <Text className="text-zinc-400 text-xs font-semibold">Product Name *</Text>
              <Controller
                control={control}
                name="name"
                render={({ field: { onChange, onBlur, value } }) => (
                  <TextInput
                    className="bg-zinc-950 border border-zinc-800 p-3 rounded-xl text-zinc-50 text-sm"
                    placeholder="e.g. Hydrating Facial Cleanser"
                    placeholderTextColor="#71717a"
                    onBlur={onBlur}
                    onChangeText={onChange}
                    value={value}
                  />
                )}
              />
              {errors.name ? (
                <Text className="text-rose-400 text-xs">{errors.name.message}</Text>
              ) : null}
            </View>

            {/* Category Selector */}
            <View className="gap-1.5">
              <Text className="text-zinc-400 text-xs font-semibold">Product Category *</Text>
              <Controller
                control={control}
                name="category"
                render={({ field: { onChange, value } }) => (
                  <View className="flex-row flex-wrap gap-2">
                    {PRODUCT_CATEGORY_OPTIONS.map((opt) => {
                      const isSelected = value === opt.value;
                      return (
                        <TouchableOpacity
                          key={opt.value}
                          onPress={() => onChange(opt.value)}
                          className={`px-3 py-1.5 rounded-xl border ${
                            isSelected
                              ? 'bg-pink-500/20 border-pink-500/50'
                              : 'bg-zinc-950 border-zinc-800'
                          }`}
                        >
                          <Text
                            className={`text-xs font-semibold ${
                              isSelected ? 'text-pink-400' : 'text-zinc-400'
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

            {/* Formula Type */}
            <View className="gap-1.5">
              <Text className="text-zinc-400 text-xs font-semibold">Texture / Formula Type *</Text>
              <Controller
                control={control}
                name="type"
                render={({ field: { onChange, value } }) => (
                  <View className="flex-row flex-wrap gap-2">
                    {PRODUCT_TYPE_OPTIONS.map((opt) => {
                      const isSelected = value === opt.value;
                      return (
                        <TouchableOpacity
                          key={opt.value}
                          onPress={() => onChange(opt.value)}
                          className={`px-3 py-1.5 rounded-xl border ${
                            isSelected
                              ? 'bg-emerald-500/20 border-emerald-500/50'
                              : 'bg-zinc-950 border-zinc-800'
                          }`}
                        >
                          <Text
                            className={`text-xs font-semibold ${
                              isSelected ? 'text-emerald-400' : 'text-zinc-400'
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

            {/* Key Active Ingredients */}
            <View className="gap-1">
              <Text className="text-zinc-400 text-xs font-semibold">
                Active Ingredients (comma separated)
              </Text>
              <Controller
                control={control}
                name="keyIngredients"
                render={({ field: { onChange, value } }) => (
                  <TextInput
                    className="bg-zinc-950 border border-zinc-800 p-3 rounded-xl text-zinc-50 text-sm"
                    placeholder="e.g. Niacinamide, Salicylic Acid, Hyaluronic Acid"
                    placeholderTextColor="#71717a"
                    onChangeText={(val) =>
                      onChange(
                        val
                          .split(',')
                          .map((s) => s.trim())
                          .filter(Boolean)
                      )
                    }
                    value={Array.isArray(value) ? value.join(', ') : ''}
                  />
                )}
              />
            </View>

            {/* Shelf Life Months */}
            <View className="gap-1">
              <Text className="text-zinc-400 text-xs font-semibold">Shelf Life (Months)</Text>
              <Controller
                control={control}
                name="shelfLifeMonths"
                render={({ field: { onChange, value } }) => (
                  <TextInput
                    className="bg-zinc-950 border border-zinc-800 p-3 rounded-xl text-zinc-50 text-sm"
                    placeholder="12"
                    placeholderTextColor="#71717a"
                    keyboardType="number-pad"
                    onChangeText={(val) => onChange(parseInt(val, 10) || 12)}
                    value={value ? String(value) : '12'}
                  />
                )}
              />
            </View>

            {/* Submit Button */}
            <TouchableOpacity
              activeOpacity={0.8}
              onPress={handleSubmit(onFormSubmit as any)}
              disabled={isSubmitting}
              className="bg-pink-600 p-3.5 rounded-xl items-center justify-center mt-3 shadow-lg"
            >
              <Text className="text-white text-sm font-bold">
                {isSubmitting ? 'Saving...' : initialValues ? 'Update Product' : 'Add Product'}
              </Text>
            </TouchableOpacity>
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
};
