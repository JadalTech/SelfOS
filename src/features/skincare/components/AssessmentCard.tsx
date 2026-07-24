import React from 'react';
import { View, Text, TouchableOpacity, Alert } from 'react-native';
import type { SkinAssessmentVM } from '../types';

export interface AssessmentCardProps {
  readonly assessment: SkinAssessmentVM;
  readonly onDelete?: () => void;
}

export const AssessmentCard: React.FC<AssessmentCardProps> = React.memo(function AssessmentCard({
  assessment,
  onDelete,
}) {
  const handleDeleteConfirm = () => {
    Alert.alert('Delete Assessment', 'Are you sure you want to delete this skin assessment record?', [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Delete', style: 'destructive', onPress: onDelete },
    ]);
  };

  return (
    <View className="bg-zinc-900 border border-zinc-800 p-4 rounded-2xl gap-3 shadow-sm">
      <View className="flex-row items-center justify-between">
        <View>
          <Text className="text-zinc-500 text-[10px] font-bold uppercase tracking-wider">
            {assessment.recordDateFormatted}
          </Text>
          <Text className="text-zinc-50 text-base font-bold">
            Skin Type: {assessment.skinTypeLabel}
          </Text>
        </View>

        {/* Health Score Badge */}
        <View
          className="px-3 py-1.5 rounded-xl border items-center justify-center"
          style={{
            backgroundColor: `${assessment.healthScoreBadgeColor}15`,
            borderColor: `${assessment.healthScoreBadgeColor}40`,
          }}
        >
          <Text
            className="text-base font-extrabold"
            style={{ color: assessment.healthScoreBadgeColor }}
          >
            {assessment.overallHealthScore} / 10
          </Text>
          <Text className="text-zinc-500 text-[9px] font-bold uppercase">Health Score</Text>
        </View>
      </View>

      {/* Metrics Row */}
      <View className="flex-row gap-2 bg-zinc-950/70 p-2.5 rounded-xl border border-zinc-800/60">
        <View className="flex-1 items-center">
          <Text className="text-zinc-500 text-[10px]">Hydration</Text>
          <Text className="text-zinc-200 text-xs font-bold">{assessment.hydrationPercentage}%</Text>
        </View>
        <View className="flex-1 items-center border-x border-zinc-800">
          <Text className="text-zinc-500 text-[10px]">Sensitivity</Text>
          <Text className="text-zinc-200 text-xs font-bold">{assessment.sensitivityStatusLabel}</Text>
        </View>
        <View className="flex-1 items-center">
          <Text className="text-zinc-500 text-[10px]">Barrier</Text>
          <Text className="text-zinc-200 text-xs font-bold">{assessment.barrierHealthStatusLabel}</Text>
        </View>
      </View>

      {/* Top Concerns */}
      {assessment.topConcernsFormatted.length > 0 ? (
        <View className="gap-1">
          <Text className="text-zinc-500 text-[10px] font-semibold">Active Concerns:</Text>
          <View className="flex-row flex-wrap gap-1.5">
            {assessment.topConcernsFormatted.map((c) => (
              <View
                key={c.concern}
                className="bg-amber-500/10 border border-amber-500/30 px-2 py-0.5 rounded-md flex-row items-center gap-1"
              >
                <Text className="text-amber-400 text-xs font-semibold">{c.label}</Text>
                <Text className="text-amber-500 text-[10px]">({c.severityLabel})</Text>
              </View>
            ))}
          </View>
        </View>
      ) : null}

      {onDelete ? (
        <View className="flex-row justify-end pt-1 border-t border-zinc-800/40">
          <TouchableOpacity onPress={handleDeleteConfirm} className="py-1 px-2">
            <Text className="text-rose-400 text-xs font-semibold">Delete Assessment</Text>
          </TouchableOpacity>
        </View>
      ) : null}
    </View>
  );
});
