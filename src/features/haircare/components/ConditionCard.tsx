import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import type { HairConditionVM } from '../types';

interface ConditionCardProps {
  readonly condition: HairConditionVM;
  readonly onEdit?: (condition: HairConditionVM) => void;
  readonly onDelete?: (condition: HairConditionVM) => void;
}

export const ConditionCard: React.FC<ConditionCardProps> = React.memo(
  function ConditionCard({ condition, onEdit, onDelete }) {
    return (
      <View className="bg-zinc-900/90 border border-zinc-800/80 rounded-2xl p-4 gap-3 shadow-md">
        {/* Top Header */}
        <View className="flex-row items-center justify-between">
          <View className="flex-row items-center gap-2">
            <View className={`px-2.5 py-1 rounded-lg border ${condition.healthBadgeColor}`}>
              <Text className="text-xs font-black">Score {condition.overallHealth}/10</Text>
            </View>

            <View>
              <Text className="text-zinc-100 text-sm font-extrabold">{condition.formattedDate}</Text>
              <Text className="text-zinc-500 text-[10px]">{condition.scalpTypeLabel} • {condition.hairTypeLabel}</Text>
            </View>
          </View>

          <View className="flex-row items-center gap-2">
            {onEdit ? (
              <TouchableOpacity
                className="bg-zinc-950 border border-zinc-800 px-2.5 py-1.5 rounded-lg"
                onPress={() => onEdit(condition)}
                accessibilityRole="button"
              >
                <Text className="text-amber-400 text-xs font-bold">Edit</Text>
              </TouchableOpacity>
            ) : null}

            {onDelete ? (
              <TouchableOpacity
                className="bg-rose-950/60 border border-rose-500/30 px-2.5 py-1.5 rounded-lg"
                onPress={() => onDelete(condition)}
                accessibilityRole="button"
              >
                <Text className="text-rose-400 text-xs font-bold">Delete</Text>
              </TouchableOpacity>
            ) : null}
          </View>
        </View>

        {/* Rating Metrics Grid */}
        <View className="bg-zinc-950/60 border border-zinc-800/60 p-3 rounded-xl flex-row flex-wrap gap-x-4 gap-y-2">
          <View className="w-[45%]">
            <Text className="text-zinc-500 text-[10px]">Shedding Level</Text>
            <Text className="text-zinc-200 text-xs font-bold">{condition.sheddingLevel}/5</Text>
          </View>

          <View className="w-[45%]">
            <Text className="text-zinc-500 text-[10px]">Dandruff Level</Text>
            <Text className="text-zinc-200 text-xs font-bold">{condition.dandruffLevel}/5</Text>
          </View>

          <View className="w-[45%]">
            <Text className="text-zinc-500 text-[10px]">Scalp Itchiness</Text>
            <Text className="text-zinc-200 text-xs font-bold">{condition.itchinessLevel}/5</Text>
          </View>

          <View className="w-[45%]">
            <Text className="text-zinc-500 text-[10px]">Hair Dryness</Text>
            <Text className="text-zinc-200 text-xs font-bold">{condition.drynessLevel}/5</Text>
          </View>

          <View className="w-[45%]">
            <Text className="text-zinc-500 text-[10px]">Hair Frizz</Text>
            <Text className="text-zinc-200 text-xs font-bold">{condition.frizzLevel}/5</Text>
          </View>

          <View className="w-[45%]">
            <Text className="text-zinc-500 text-[10px]">Hair Shine</Text>
            <Text className="text-zinc-200 text-xs font-bold">{condition.shineLevel}/5</Text>
          </View>
        </View>

        {/* Optional Lifestyle Factors & Notes */}
        {condition.sleepHours || condition.waterIntakeLiters || condition.notes ? (
          <View className="gap-1 border-t border-zinc-800/60 pt-2">
            {condition.sleepHours || condition.waterIntakeLiters ? (
              <Text className="text-zinc-400 text-[11px]">
                {condition.sleepHours ? `Sleep: ${condition.sleepHours} hrs  ` : ''}
                {condition.waterIntakeLiters ? `Water: ${condition.waterIntakeLiters} L` : ''}
              </Text>
            ) : null}

            {condition.notes ? (
              <Text className="text-zinc-400 text-xs italic font-medium" numberOfLines={2}>
                &quot;{condition.notes}&quot;
              </Text>
            ) : null}
          </View>
        ) : null}
      </View>
    );
  }
);
