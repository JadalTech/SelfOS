import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useNutritionFoods, useNutritionLogs } from '../../hooks/useNutrition';
import { DashboardLayout } from '../layouts/DashboardLayout';
import { FeatureHeader } from '../layouts/FeatureHeader';
import { SectionLayout } from '../layouts/SectionLayout';
import {
  VirtualizedList,
  FilterBar,
  LoadingState,
} from '../../../../shared/components';
import type { MealType } from '../../types/nutrition.types';

export const FoodSearchScreen: React.FC = React.memo(function FoodSearchScreen() {
  const router = useRouter();
  const { mealType, date } = useLocalSearchParams<{ mealType: MealType; date: string }>();
  const dateStr = date || new Date().toISOString().split('T')[0];

  const [searchTerm, setSearchTerm] = useState('');
  const [selectedTab, setSelectedTab] = useState('all');
  const [loggingFoodId, setLoggingFoodId] = useState<string | null>(null);
  const [quantity, setQuantity] = useState('100');

  const { foodVMs, isLoading } = useNutritionFoods(searchTerm);
  const { addFoodToMeal, isAdding } = useNutritionLogs(dateStr);

  const filterOptions = [
    { value: 'all', label: 'All Foods' },
    { value: 'custom', label: 'My Foods' },
    { value: 'global', label: 'Global Catalog' },
  ];

  const filteredFoods = foodVMs.filter((food) => {
    if (selectedTab === 'custom') return food.isCustom;
    if (selectedTab === 'global') return !food.isCustom;
    return true;
  });

  const handleLogFood = async (foodId: string) => {
    const food = foodVMs.find((f) => f.id === foodId);
    if (!food || !mealType) return;

    // Convert VM back to domain model shape for mutation parameter
    const domainFoodShape = {
      id: food.id,
      name: food.name,
      brand: food.brand,
      category: food.category,
      servingSize: food.servingSize,
      servingUnit: food.servingUnit,
      nutritionFacts: {
        calories: food.calories,
        protein: food.protein,
        carbohydrates: food.carbohydrates,
        fats: food.fats,
        fiber: food.fiber,
        sugar: food.sugar,
        sodium: food.sodium,
        allergens: food.allergens,
        dietTags: food.dietTags,
      },
    };

    await addFoodToMeal({
      date: dateStr,
      mealType,
      food: domainFoodShape as any,
      quantity: parseFloat(quantity) || 100,
    });

    setLoggingFoodId(null);
    router.back();
  };

  return (
    <DashboardLayout>
      <FeatureHeader
        title="Find Food"
        subtitle={`Adding to ${mealType || 'Meal'}`}
        actionIcon="➕"
        actionLabel="Create Custom"
        onAction={() => router.push('/(app)/nutrition/add-food')}
      />

      <TextInput
        value={searchTerm}
        onChangeText={setSearchTerm}
        placeholder="Search oats, apple, chicken..."
        placeholderTextColor="#71717a"
        className="bg-zinc-900 border border-zinc-800 rounded-xl px-4 py-3 text-zinc-100 text-sm mb-1"
      />

      <FilterBar options={filterOptions} selectedValue={selectedTab} onSelect={setSelectedTab} />

      <SectionLayout title="Search Results">
        {isLoading ? (
          <LoadingState message="Searching catalogue..." inline={true} />
        ) : (
          <VirtualizedList
            data={filteredFoods}
            keyExtractor={(item) => item.id}
            emptyTitle="No Foods Found"
            emptyDescription="Try adjusting search terms or add a custom recipe."
            renderItem={({ item }) => (
              <View className="bg-zinc-900 border border-zinc-800 p-4 rounded-2xl mb-2.5 shadow-sm gap-2">
                <View className="flex-row items-center justify-between">
                  <View className="flex-1 pr-2">
                    <Text className="text-zinc-50 text-sm font-bold tracking-tight">{item.name}</Text>
                    <Text className="text-zinc-400 text-xs mt-0.5">
                      {item.brand || 'Standard'} • {item.caloriesLabel} ({item.servingSize}
                      {item.servingUnit})
                    </Text>
                  </View>

                  {loggingFoodId === item.id ? (
                    <TouchableOpacity
                      disabled={isAdding}
                      onPress={() => handleLogFood(item.id)}
                      className="bg-pink-500 px-3 py-1.5 rounded-lg"
                    >
                      <Text className="text-zinc-950 text-xs font-bold uppercase">Log</Text>
                    </TouchableOpacity>
                  ) : (
                    <TouchableOpacity
                      onPress={() => setLoggingFoodId(item.id)}
                      className="bg-zinc-800 border border-zinc-700 px-3 py-1.5 rounded-lg"
                    >
                      <Text className="text-zinc-300 text-xs font-bold uppercase">Select</Text>
                    </TouchableOpacity>
                  )}
                </View>

                {loggingFoodId === item.id ? (
                  <View className="flex-row items-center gap-2 mt-2 pt-2 border-t border-zinc-850">
                    <Text className="text-zinc-400 text-xs font-semibold">Quantity ({item.servingUnit}):</Text>
                    <TextInput
                      value={quantity}
                      onChangeText={setQuantity}
                      keyboardType="numeric"
                      className="bg-zinc-950 border border-zinc-800 rounded-lg px-2.5 py-1 text-zinc-100 text-xs w-20 text-center"
                    />
                    <TouchableOpacity
                      onPress={() => setLoggingFoodId(null)}
                      className="ml-auto px-2 py-1"
                    >
                      <Text className="text-zinc-500 text-xs">Cancel</Text>
                    </TouchableOpacity>
                  </View>
                ) : null}
              </View>
            )}
          />
        )}
      </SectionLayout>
    </DashboardLayout>
  );
});
export default FoodSearchScreen;
