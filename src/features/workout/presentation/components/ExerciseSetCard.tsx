import React, { useCallback } from 'react';
import { View, Text, TextInput, TouchableOpacity } from 'react-native';
import { ExerciseSet, SetType } from '../../types/workout.types';

export interface ExerciseSetCardProps {
  readonly set: ExerciseSet;
  readonly index: number;
  readonly isTracking?: boolean;
  readonly defaultUnit?: 'kg' | 'lbs';
  readonly onUpdateSet: (index: number, updated: Partial<ExerciseSet>) => void;
  readonly onDeleteSet: (index: number) => void;
}

export const ExerciseSetCard: React.FC<ExerciseSetCardProps> = React.memo(function ExerciseSetCard({
  set,
  index,
  isTracking = true,
  defaultUnit = 'kg',
  onUpdateSet,
  onDeleteSet,
}) {
  const handleWeightChange = useCallback(
    (val: string) => {
      const parsed = parseFloat(val);
      onUpdateSet(index, { weight: isNaN(parsed) ? 0 : parsed });
    },
    [index, onUpdateSet]
  );

  const handleRepsChange = useCallback(
    (val: string) => {
      const parsed = parseInt(val, 10);
      onUpdateSet(index, { reps: isNaN(parsed) ? 0 : parsed });
    },
    [index, onUpdateSet]
  );

  const handleRpeChange = useCallback(
    (val: string) => {
      const parsed = parseFloat(val);
      onUpdateSet(index, { rpe: isNaN(parsed) ? undefined : parsed });
    },
    [index, onUpdateSet]
  );

  const handleToggleComplete = useCallback(() => {
    onUpdateSet(index, { completed: !set.completed });
  }, [index, set.completed, onUpdateSet]);

  const handleToggleType = useCallback(() => {
    const types: SetType[] = ['working', 'warmup', 'drop', 'failure'];
    const currentIdx = types.indexOf(set.type);
    const nextType = types[(currentIdx + 1) % types.length];
    onUpdateSet(index, { type: nextType });
  }, [index, set.type, onUpdateSet]);

  const getSetTypeLabel = (t: SetType) => {
    switch (t) {
      case 'warmup':
        return '☀️ Warm';
      case 'drop':
        return '💧 Drop';
      case 'failure':
        return '🔥 Fail';
      default:
        return '💪 Work';
    }
  };

  const getSetTypeColor = (t: SetType) => {
    switch (t) {
      case 'warmup':
        return 'text-amber-400 bg-amber-500/10 border-amber-500/30';
      case 'drop':
        return 'text-cyan-400 bg-cyan-500/10 border-cyan-500/30';
      case 'failure':
        return 'text-red-400 bg-red-500/10 border-red-500/30';
      default:
        return 'text-violet-400 bg-violet-500/10 border-violet-500/30';
    }
  };

  return (
    <View
      className={`flex-row items-center justify-between p-2 rounded-xl border mb-2 ${
        set.completed
          ? 'bg-emerald-500/5 border-emerald-500/30'
          : 'bg-zinc-950 border-zinc-800/80'
      }`}
      accessible={true}
      accessibilityLabel={`Set ${index + 1}: ${set.type} set, ${set.weight} ${defaultUnit} by ${
        set.reps
      } reps, ${set.completed ? 'completed' : 'incomplete'}.`}
    >
      {/* 1. Set Label & Type Cycle */}
      <View className="flex-row items-center gap-2">
        <TouchableOpacity
          disabled={!isTracking}
          onPress={handleToggleType}
          className={`px-2 py-1 rounded-lg border items-center justify-center min-w-[50px] ${getSetTypeColor(
            set.type
          )}`}
          accessibilityRole="button"
          accessibilityLabel={`Set type ${set.type}. Click to change.`}
        >
          <Text className="text-[10px] font-extrabold uppercase tracking-wide">
            {getSetTypeLabel(set.type)}
          </Text>
        </TouchableOpacity>
      </View>

      {/* 2. Inputs Row */}
      <View className="flex-row items-center flex-1 justify-around px-2 gap-2">
        {/* Weight Input */}
        <View className="flex-row items-center bg-zinc-900 border border-zinc-800 px-2.5 py-1.5 rounded-lg flex-1">
          <TextInput
            editable={isTracking}
            keyboardType="numeric"
            value={set.weight > 0 ? String(set.weight) : ''}
            placeholder="0"
            placeholderTextColor="#71717a"
            onChangeText={handleWeightChange}
            className="text-zinc-50 font-bold text-sm text-center flex-1 p-0"
            accessibilityLabel="Weight value"
          />
          <Text className="text-zinc-500 text-[10px] font-extrabold ml-1 uppercase">{defaultUnit}</Text>
        </View>

        {/* Reps Input */}
        <View className="flex-row items-center bg-zinc-900 border border-zinc-800 px-2.5 py-1.5 rounded-lg flex-1">
          <TextInput
            editable={isTracking}
            keyboardType="number-pad"
            value={set.reps > 0 ? String(set.reps) : ''}
            placeholder="0"
            placeholderTextColor="#71717a"
            onChangeText={handleRepsChange}
            className="text-zinc-50 font-bold text-sm text-center flex-1 p-0"
            accessibilityLabel="Reps count"
          />
          <Text className="text-zinc-500 text-[10px] font-extrabold ml-1 uppercase">Reps</Text>
        </View>

        {/* RPE Selector */}
        <View className="flex-row items-center bg-zinc-900 border border-zinc-800 px-2.5 py-1.5 rounded-lg flex-1">
          <TextInput
            editable={isTracking}
            keyboardType="numeric"
            value={set.rpe ? String(set.rpe) : ''}
            placeholder="—"
            placeholderTextColor="#71717a"
            onChangeText={handleRpeChange}
            className="text-zinc-50 font-bold text-sm text-center flex-1 p-0"
            accessibilityLabel="Rate of perceived exertion"
          />
          <Text className="text-zinc-500 text-[10px] font-extrabold ml-1 uppercase">RPE</Text>
        </View>
      </View>

      {/* 3. Actions / Checkbox */}
      <View className="flex-row items-center gap-1.5">
        {isTracking ? (
          <>
            <TouchableOpacity
              activeOpacity={0.8}
              onPress={handleToggleComplete}
              className={`w-9 h-9 rounded-xl items-center justify-center border ${
                set.completed
                  ? 'bg-emerald-500 border-emerald-400'
                  : 'bg-zinc-900 border-zinc-800'
              }`}
              accessibilityRole="checkbox"
              accessibilityState={{ checked: set.completed }}
              accessibilityLabel="Mark set completed"
            >
              <Text className={`text-sm ${set.completed ? 'text-zinc-950 font-black' : 'text-zinc-600'}`}>
                {set.completed ? '✓' : '⎔'}
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => onDeleteSet(index)}
              className="w-9 h-9 rounded-xl items-center justify-center border border-zinc-800 bg-zinc-900"
              accessibilityRole="button"
              accessibilityLabel="Delete set"
            >
              <Text className="text-red-400 text-sm font-bold">×</Text>
            </TouchableOpacity>
          </>
        ) : (
          <View className="w-10 items-end justify-center pr-2">
            <Text className="text-zinc-400 text-xs font-bold">
              {set.completed ? '✅' : '❌'}
            </Text>
          </View>
        )}
      </View>
    </View>
  );
});
