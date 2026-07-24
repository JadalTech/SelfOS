import React from 'react';
import { View, Text, TextInput, TouchableOpacity, ScrollView } from 'react-native';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { foodSchema } from '../../validation/nutrition.validation';
import { FOOD_CATEGORY_OPTIONS, SERVING_UNIT_OPTIONS, ALLERGEN_OPTIONS, DIET_TAG_OPTIONS } from '../../constants/nutrition.constants';

export interface FoodFormProps {
  readonly defaultValues?: any;
  readonly onSubmit: (data: any) => void;
  readonly onCancel: () => void;
  readonly isSubmitting?: boolean;
}

export const FoodForm: React.FC<FoodFormProps> = React.memo(function FoodForm({
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
    resolver: zodResolver(foodSchema),
    defaultValues: {
      name: '',
      brand: '',
      category: 'custom',
      servingSize: 100,
      servingUnit: 'g',
      nutritionFacts: {
        calories: 0,
        protein: 0,
        carbohydrates: 0,
        fats: 0,
        fiber: 0,
        sugar: 0,
        sodium: 0,
        allergens: [],
        dietTags: [],
      },
      barcode: '',
      source: 'user',
      verified: false,
      externalId: '',
      image: '',
      manufacturer: '',
      ...defaultValues,
    },
  });

  // Extract nested error messages
  const factsErrors = errors.nutritionFacts as any;

  return (
    <ScrollView className="flex-1" contentContainerStyle={{ paddingBottom: 24 }} showsVerticalScrollIndicator={false}>
      <View className="gap-5">
        
        {/* Base Info */}
        <View className="gap-3.5">
          <Text className="text-zinc-400 text-xs font-bold uppercase tracking-wider">Basic Information</Text>
          
          <View className="gap-1">
            <Text className="text-zinc-300 text-xs font-bold">Food Name *</Text>
            <Controller
              control={control}
              name="name"
              render={({ field: { onChange, value } }) => (
                <TextInput
                  value={value}
                  onChangeText={onChange}
                  placeholder="e.g. Greek Yogurt"
                  placeholderTextColor="#71717a"
                  className="bg-zinc-900 border border-zinc-800 rounded-xl px-4 py-3 text-zinc-100 text-sm"
                />
              )}
            />
            {errors.name?.message ? (
              <Text className="text-rose-400 text-xs font-medium">{String(errors.name.message)}</Text>
            ) : null}
          </View>

          <View className="gap-1">
            <Text className="text-zinc-300 text-xs font-bold">Brand (Optional)</Text>
            <Controller
              control={control}
              name="brand"
              render={({ field: { onChange, value } }) => (
                <TextInput
                  value={value}
                  onChangeText={onChange}
                  placeholder="e.g. Chobani"
                  placeholderTextColor="#71717a"
                  className="bg-zinc-900 border border-zinc-800 rounded-xl px-4 py-3 text-zinc-100 text-sm"
                />
              )}
            />
          </View>

          <View className="flex-row gap-3">
            <View className="flex-1 gap-1">
              <Text className="text-zinc-300 text-xs font-bold">Serving Size *</Text>
              <Controller
                control={control}
                name="servingSize"
                render={({ field: { onChange, value } }) => (
                  <TextInput
                    value={value?.toString()}
                    onChangeText={(txt) => onChange(parseFloat(txt) || 0)}
                    keyboardType="numeric"
                    placeholder="100"
                    placeholderTextColor="#71717a"
                    className="bg-zinc-900 border border-zinc-800 rounded-xl px-4 py-3 text-zinc-100 text-sm"
                  />
                )}
              />
              {errors.servingSize?.message ? (
                <Text className="text-rose-400 text-xs font-medium">{String(errors.servingSize.message)}</Text>
              ) : null}
            </View>

            <View className="flex-1 gap-1">
              <Text className="text-zinc-300 text-xs font-bold">Serving Unit *</Text>
              <Controller
                control={control}
                name="servingUnit"
                render={({ field: { onChange, value } }) => (
                  <View className="flex-row flex-wrap gap-1 mt-1">
                    {SERVING_UNIT_OPTIONS.map((unit) => {
                      const isSel = unit.value === value;
                      return (
                        <TouchableOpacity
                          key={unit.value}
                          onPress={() => onChange(unit.value)}
                          className="px-2.5 py-1.5 rounded-lg border"
                          style={{
                            backgroundColor: isSel ? '#ec489920' : '#18181b',
                            borderColor: isSel ? '#ec4899' : '#27272a',
                          }}
                        >
                          <Text className="text-[10px] font-bold" style={{ color: isSel ? '#ec4899' : '#a1a1aa' }}>
                            {unit.label.split(' ')[0]}
                          </Text>
                        </TouchableOpacity>
                      );
                    })}
                  </View>
                )}
              />
            </View>
          </View>

          <View className="gap-1">
            <Text className="text-zinc-300 text-xs font-bold">Category *</Text>
            <Controller
              control={control}
              name="category"
              render={({ field: { onChange, value } }) => (
                <View className="flex-row flex-wrap gap-1.5 mt-1">
                  {FOOD_CATEGORY_OPTIONS.map((cat) => {
                    const isSel = cat.value === value;
                    return (
                      <TouchableOpacity
                        key={cat.value}
                        onPress={() => onChange(cat.value)}
                        className="px-3 py-2 rounded-xl border"
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
        </View>

        {/* Nutritional Facts */}
        <View className="gap-3.5 border-t border-zinc-800/60 pt-4">
          <Text className="text-zinc-400 text-xs font-bold uppercase tracking-wider">Nutrition Facts (Per Serving Size)</Text>

          <View className="flex-row gap-3">
            <View className="flex-1 gap-1">
              <Text className="text-zinc-300 text-xs font-bold">Calories (kcal) *</Text>
              <Controller
                control={control}
                name="nutritionFacts.calories"
                render={({ field: { onChange, value } }) => (
                  <TextInput
                    value={value?.toString()}
                    onChangeText={(txt) => onChange(parseInt(txt, 10) || 0)}
                    keyboardType="numeric"
                    className="bg-zinc-900 border border-zinc-800 rounded-xl px-4 py-3 text-zinc-100 text-sm"
                  />
                )}
              />
              {factsErrors?.calories?.message ? (
                <Text className="text-rose-400 text-xs font-medium">{String(factsErrors.calories.message)}</Text>
              ) : null}
            </View>

            <View className="flex-row flex-1 gap-1">
              <View className="flex-1 gap-1">
                <Text className="text-zinc-300 text-xs font-bold">Protein (g) *</Text>
                <Controller
                  control={control}
                  name="nutritionFacts.protein"
                  render={({ field: { onChange, value } }) => (
                    <TextInput
                      value={value?.toString()}
                      onChangeText={(txt) => onChange(parseFloat(txt) || 0)}
                      keyboardType="numeric"
                      className="bg-zinc-900 border border-zinc-800 rounded-xl px-4 py-3 text-zinc-100 text-sm"
                    />
                  )}
                />
                {factsErrors?.protein?.message ? (
                  <Text className="text-rose-400 text-xs font-medium">{String(factsErrors.protein.message)}</Text>
                ) : null}
              </View>
            </View>
          </View>

          <View className="flex-row gap-3">
            <View className="flex-1 gap-1">
              <Text className="text-zinc-300 text-xs font-bold">Carbs (g) *</Text>
              <Controller
                control={control}
                name="nutritionFacts.carbohydrates"
                render={({ field: { onChange, value } }) => (
                  <TextInput
                    value={value?.toString()}
                    onChangeText={(txt) => onChange(parseFloat(txt) || 0)}
                    keyboardType="numeric"
                    className="bg-zinc-900 border border-zinc-800 rounded-xl px-4 py-3 text-zinc-100 text-sm"
                  />
                )}
              />
              {factsErrors?.carbohydrates?.message ? (
                <Text className="text-rose-400 text-xs font-medium">{String(factsErrors.carbohydrates.message)}</Text>
              ) : null}
            </View>

            <View className="flex-1 gap-1">
              <Text className="text-zinc-300 text-xs font-bold">Fats (g) *</Text>
              <Controller
                control={control}
                name="nutritionFacts.fats"
                render={({ field: { onChange, value } }) => (
                  <TextInput
                    value={value?.toString()}
                    onChangeText={(txt) => onChange(parseFloat(txt) || 0)}
                    keyboardType="numeric"
                    className="bg-zinc-900 border border-zinc-800 rounded-xl px-4 py-3 text-zinc-100 text-sm"
                  />
                )}
              />
              {factsErrors?.fats?.message ? (
                <Text className="text-rose-400 text-xs font-medium">{String(factsErrors.fats.message)}</Text>
              ) : null}
            </View>
          </View>

          <View className="flex-row gap-3">
            <View className="flex-1 gap-1">
              <Text className="text-zinc-300 text-xs font-semibold text-zinc-400">Fiber (g)</Text>
              <Controller
                control={control}
                name="nutritionFacts.fiber"
                render={({ field: { onChange, value } }) => (
                  <TextInput
                    value={value?.toString()}
                    onChangeText={(txt) => onChange(parseFloat(txt) || 0)}
                    keyboardType="numeric"
                    className="bg-zinc-900 border border-zinc-800 rounded-xl px-4 py-3 text-zinc-100 text-sm"
                  />
                )}
              />
            </View>

            <View className="flex-1 gap-1">
              <Text className="text-zinc-300 text-xs font-semibold text-zinc-400">Sugar (g)</Text>
              <Controller
                control={control}
                name="nutritionFacts.sugar"
                render={({ field: { onChange, value } }) => (
                  <TextInput
                    value={value?.toString()}
                    onChangeText={(txt) => onChange(parseFloat(txt) || 0)}
                    keyboardType="numeric"
                    className="bg-zinc-900 border border-zinc-800 rounded-xl px-4 py-3 text-zinc-100 text-sm"
                  />
                )}
              />
            </View>
          </View>
        </View>

        {/* Diet & Allergens */}
        <View className="gap-3 border-t border-zinc-800/60 pt-4">
          <Text className="text-zinc-400 text-xs font-bold uppercase tracking-wider">Dietary Details</Text>

          <View className="gap-1.5">
            <Text className="text-zinc-300 text-xs font-bold">Diet Tags</Text>
            <Controller
              control={control}
              name="nutritionFacts.dietTags"
              render={({ field: { onChange, value = [] } }) => (
                <View className="flex-row flex-wrap gap-1.5">
                  {DIET_TAG_OPTIONS.map((tag) => {
                    const isSel = value?.includes(tag.value);
                    return (
                      <TouchableOpacity
                        key={tag.value}
                        onPress={() => {
                          const updated = isSel
                            ? (value as any).filter((v: any) => v !== tag.value)
                            : [...(value as any), tag.value];
                          onChange(updated);
                        }}
                        className="px-3 py-1.5 rounded-xl border"
                        style={{
                          backgroundColor: isSel ? '#10b98115' : '#18181b',
                          borderColor: isSel ? '#10b981' : '#27272a',
                        }}
                      >
                        <Text className="text-[10px] font-bold" style={{ color: isSel ? '#10b981' : '#a1a1aa' }}>
                          {tag.label}
                        </Text>
                      </TouchableOpacity>
                    );
                  })}
                </View>
              )}
            />
          </View>

          <View className="gap-1.5 mt-2">
            <Text className="text-zinc-300 text-xs font-bold">Contains Allergens</Text>
            <Controller
              control={control}
              name="nutritionFacts.allergens"
              render={({ field: { onChange, value = [] } }) => (
                <View className="flex-row flex-wrap gap-1.5">
                  {ALLERGEN_OPTIONS.map((alg) => {
                    const isSel = value?.includes(alg.value);
                    return (
                      <TouchableOpacity
                        key={alg.value}
                        onPress={() => {
                          const updated = isSel
                            ? (value as any).filter((v: any) => v !== alg.value)
                            : [...(value as any), alg.value];
                          onChange(updated);
                        }}
                        className="px-3 py-1.5 rounded-xl border"
                        style={{
                          backgroundColor: isSel ? '#f43f5e15' : '#18181b',
                          borderColor: isSel ? '#f43f5e' : '#27272a',
                        }}
                      >
                        <Text className="text-[10px] font-bold" style={{ color: isSel ? '#f43f5e' : '#a1a1aa' }}>
                          {alg.label}
                        </Text>
                      </TouchableOpacity>
                    );
                  })}
                </View>
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
            <Text className="text-zinc-950 text-xs font-extrabold uppercase tracking-wider">Save Food</Text>
          </TouchableOpacity>
        </View>
      </View>
    </ScrollView>
  );
});
export default FoodForm;
