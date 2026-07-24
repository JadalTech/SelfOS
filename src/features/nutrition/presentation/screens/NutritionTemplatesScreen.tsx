import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { useNutritionTemplates } from '../../hooks/useNutrition';
import { DashboardLayout } from '../layouts/DashboardLayout';
import { FeatureHeader } from '../layouts/FeatureHeader';
import { SectionLayout } from '../layouts/SectionLayout';
import {
  VirtualizedList,
  LoadingState,
} from '../../../../shared/components';

export const NutritionTemplatesScreen: React.FC = React.memo(function NutritionTemplatesScreen() {
  const { templateVMs, isLoading, deleteTemplate } = useNutritionTemplates();

  return (
    <DashboardLayout>
      <FeatureHeader title="Meal Templates" subtitle="Instantly log pre-configured meal lists" />

      <SectionLayout title="Saved Templates">
        {isLoading ? (
          <LoadingState message="Loading templates..." inline={true} />
        ) : (
          <VirtualizedList
            data={templateVMs}
            keyExtractor={(item) => item.id}
            emptyTitle="No Templates"
            emptyDescription="Create templates from logged meals to speed up your daily tracking."
            renderItem={({ item }) => (
              <View className="bg-zinc-900 border border-zinc-800 p-4 rounded-2xl flex-row items-center justify-between mb-2.5 shadow-sm">
                <View className="flex-1 pr-3">
                  <Text className="text-zinc-50 text-sm font-bold tracking-tight">{item.title}</Text>
                  <Text className="text-zinc-400 text-xs mt-0.5">
                    {item.mealTypeLabel} • {item.foodsCount} foods ({item.totalCaloriesLabel})
                  </Text>
                </View>

                <View className="flex-row items-center gap-2">
                  <TouchableOpacity
                    onPress={() => deleteTemplate(item.id)}
                    className="w-8 h-8 rounded-full bg-zinc-800 border border-zinc-700 items-center justify-center"
                    accessible={true}
                    accessibilityRole="button"
                    accessibilityLabel={`Delete template ${item.title}`}
                    hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
                  >
                    <Text className="text-zinc-400 text-xs font-bold">✕</Text>
                  </TouchableOpacity>
                </View>
              </View>
            )}
          />
        )}
      </SectionLayout>
    </DashboardLayout>
  );
});
export default NutritionTemplatesScreen;
