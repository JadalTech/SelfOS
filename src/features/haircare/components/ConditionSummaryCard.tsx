import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import type { HairConditionVM } from '../types';

interface ConditionSummaryCardProps {
  readonly latestCondition: HairConditionVM | null;
  readonly onOpenHistory: () => void;
  readonly onNewAssessment: () => void;
}

export const ConditionSummaryCard: React.FC<ConditionSummaryCardProps> = React.memo(
  function ConditionSummaryCard({ latestCondition, onOpenHistory, onNewAssessment }) {
    return (
      <View className="bg-zinc-900 border border-zinc-800 p-4 rounded-2xl gap-3 shadow-md">
        <View className="flex-row items-center justify-between">
          <Text className="text-zinc-400 text-xs font-semibold uppercase tracking-wider">
            Hair & Scalp Health Assessment
          </Text>
          <TouchableOpacity onPress={onOpenHistory} accessibilityRole="button">
            <Text className="text-amber-400 text-xs font-semibold">History →</Text>
          </TouchableOpacity>
        </View>

        {latestCondition ? (
          <View className="flex-row items-center justify-between bg-zinc-950/80 border border-zinc-800 p-3 rounded-xl">
            <View className="gap-0.5">
              <View className="flex-row items-center gap-2">
                <Text className="text-zinc-100 text-base font-extrabold">
                  {latestCondition.scalpTypeLabel}
                </Text>
                <View className={`px-2 py-0.5 rounded-md border ${latestCondition.healthBadgeColor}`}>
                  <Text className="text-[10px] font-bold">{latestCondition.healthBadgeLabel}</Text>
                </View>
              </View>
              <Text className="text-zinc-400 text-xs">
                Last recorded: {latestCondition.formattedDate}
              </Text>
            </View>

            <TouchableOpacity
              className="bg-amber-500 active:bg-amber-600 px-3.5 py-2 rounded-xl"
              onPress={onNewAssessment}
              accessibilityRole="button"
            >
              <Text className="text-zinc-950 font-extrabold text-xs">+ Log New</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <View className="bg-zinc-950/60 border border-dashed border-zinc-800 p-4 rounded-xl items-center gap-2">
            <Text className="text-zinc-400 text-xs text-center">
              No hair & scalp health assessment recorded yet.
            </Text>
            <TouchableOpacity
              className="bg-amber-500 active:bg-amber-600 px-4 py-2 rounded-xl"
              onPress={onNewAssessment}
              accessibilityRole="button"
            >
              <Text className="text-zinc-950 font-extrabold text-xs">+ Perform First Self-Assessment</Text>
            </TouchableOpacity>
          </View>
        )}
      </View>
    );
  }
);
