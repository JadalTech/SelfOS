import React from 'react';
import { View, Text } from 'react-native';
import { PersonalRecordVM } from '../../types/viewmodel.types';

export interface PersonalRecordCardProps {
  readonly pr: PersonalRecordVM;
}

export const PersonalRecordCard: React.FC<PersonalRecordCardProps> = React.memo(function PersonalRecordCard({
  pr,
}) {
  const getBadgeColors = () => {
    switch (pr.type) {
      case 'one-rep-max':
        return 'bg-amber-500/10 border-amber-500/30 text-amber-400';
      case 'max-weight':
        return 'bg-orange-500/10 border-orange-500/30 text-orange-400';
      case 'highest-volume':
        return 'bg-violet-500/10 border-violet-500/30 text-violet-400';
      case 'max-reps':
        return 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400';
      default:
        return 'bg-zinc-500/10 border-zinc-800 text-zinc-400';
    }
  };

  return (
    <View
      className="bg-zinc-900 border border-zinc-800 p-4 rounded-2xl gap-3 shadow-sm flex-1"
      accessible={true}
      accessibilityRole="text"
      accessibilityLabel={`Personal Record for ${pr.exerciseName}: ${pr.valueLabel} on ${pr.typeLabel}.`}
    >
      <View className="flex-row items-center justify-between">
        <View className="w-9 h-9 rounded-xl bg-amber-500/10 border border-amber-500/30 items-center justify-center">
          <Text className="text-base">🏆</Text>
        </View>

        <View className={`px-2 py-0.5 rounded-md border ${getBadgeColors()}`}>
          <Text className="text-[9px] font-extrabold uppercase tracking-wide">
            {pr.typeLabel}
          </Text>
        </View>
      </View>

      <View className="gap-0.5">
        <Text className="text-zinc-400 text-[10px] font-bold uppercase tracking-wider">
          {pr.exerciseName}
        </Text>
        <Text className="text-zinc-50 text-2xl font-black tracking-tight mt-0.5">
          {pr.valueLabel}
        </Text>
      </View>

      <View className="border-t border-zinc-800/40 pt-2 flex-row justify-between items-center">
        <Text className="text-zinc-500 text-[9px] font-bold uppercase tracking-wider">Date Achieved</Text>
        <Text className="text-zinc-400 text-[10px] font-semibold">{pr.dateFormatted}</Text>
      </View>
    </View>
  );
});
