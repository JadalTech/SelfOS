import React from 'react';
import { View, Text, TouchableOpacity, Alert } from 'react-native';
import type { SkincareRoutineVM } from '../types';

export interface SkincareRoutineCardProps {
  readonly routine: SkincareRoutineVM;
  readonly onLogExecution?: () => void;
  readonly onDelete?: () => void;
}

export const SkincareRoutineCard: React.FC<SkincareRoutineCardProps> = React.memo(function SkincareRoutineCard({
  routine,
  onLogExecution,
  onDelete,
}) {
  const handleDeleteConfirm = () => {
    Alert.alert('Delete Routine', 'Are you sure you want to delete this skincare routine?', [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Delete', style: 'destructive', onPress: onDelete },
    ]);
  };

  return (
    <View className="bg-zinc-900 border border-zinc-800 p-4 rounded-2xl gap-3 shadow-sm">
      <View className="flex-row items-center justify-between">
        <View className="flex-row items-center gap-2">
          <Text className="text-xl">{routine.timeOfDayIcon}</Text>
          <View>
            <Text className="text-zinc-50 text-base font-bold">{routine.timeOfDayLabel} Routine</Text>
            <Text className="text-zinc-500 text-xs">{routine.stepsCount} Steps configured</Text>
          </View>
        </View>

        {onLogExecution ? (
          <TouchableOpacity
            activeOpacity={0.8}
            onPress={onLogExecution}
            className="bg-emerald-600 px-3.5 py-2 rounded-xl border border-emerald-500/40"
          >
            <Text className="text-white text-xs font-bold">✓ Log Routine</Text>
          </TouchableOpacity>
        ) : null}
      </View>

      {/* Ordered Step Preview */}
      <View className="gap-2 bg-zinc-950/80 p-3 rounded-xl border border-zinc-800/60">
        {routine.steps.map((step) => (
          <View key={step.id} className="flex-row items-center justify-between py-1 border-b border-zinc-800/40 last:border-0">
            <View className="flex-row items-center gap-2 flex-1 pr-2">
              <View className="w-5 h-5 rounded-full bg-pink-500/20 items-center justify-center border border-pink-500/40">
                <Text className="text-pink-400 text-[10px] font-bold">{step.stepOrder}</Text>
              </View>
              <View className="flex-1">
                <Text className="text-zinc-200 text-xs font-semibold">{step.productName}</Text>
                <Text className="text-zinc-500 text-[10px]">{step.productBrand} • {step.productCategoryLabel}</Text>
              </View>
            </View>
            {step.waitTimeFormatted ? (
              <View className="bg-zinc-900 px-2 py-0.5 rounded border border-zinc-800">
                <Text className="text-amber-400 text-[10px] font-medium">{step.waitTimeFormatted}</Text>
              </View>
            ) : null}
          </View>
        ))}
      </View>

      {/* Targeted Concerns */}
      {routine.targetedConcernsFormatted.length > 0 ? (
        <View className="flex-row flex-wrap gap-1.5 pt-1">
          {routine.targetedConcernsFormatted.map((concern, idx) => (
            <View key={idx} className="bg-zinc-800/60 px-2 py-0.5 rounded text-zinc-400">
              <Text className="text-zinc-400 text-[10px]">{concern}</Text>
            </View>
          ))}
        </View>
      ) : null}

      {/* Footer Actions */}
      {onDelete ? (
        <View className="flex-row justify-end pt-1 border-t border-zinc-800/40">
          <TouchableOpacity onPress={handleDeleteConfirm} className="py-1 px-2">
            <Text className="text-rose-400 text-xs font-semibold">Delete Routine</Text>
          </TouchableOpacity>
        </View>
      ) : null}
    </View>
  );
});
