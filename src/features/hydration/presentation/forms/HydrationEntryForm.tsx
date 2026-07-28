import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, ScrollView } from 'react-native';
import { DRINK_METADATA, DRINK_TEMPERATURE_OPTIONS } from '../../constants/hydration.constants';
import { DrinkTypeChip } from '../components/Components';
import type { DrinkType, DrinkTemperature, HydrationSource } from '../../types/hydration.types';

export interface HydrationEntryFormProps {
  readonly initialValues?: {
    readonly amountML: number;
    readonly drinkType: DrinkType;
    readonly temperature: DrinkTemperature;
    readonly notes?: string;
    readonly date: string;
    readonly time: string;
  };
  readonly onSave: (data: {
    readonly amountML: number;
    readonly drinkType: DrinkType;
    readonly temperature: DrinkTemperature;
    readonly source: HydrationSource;
    readonly notes?: string;
    readonly date: string;
    readonly time: string;
  }) => void;
  readonly isSaving?: boolean;
}

export const HydrationEntryForm: React.FC<HydrationEntryFormProps> = React.memo(function HydrationEntryForm({
  initialValues,
  onSave,
  isSaving = false,
}) {
  const [amountML, setAmountML] = useState(initialValues?.amountML.toString() ?? '250');
  const [drinkType, setDrinkType] = useState<DrinkType>(initialValues?.drinkType ?? 'water');
  const [temperature, setTemperature] = useState<DrinkTemperature>(initialValues?.temperature ?? 'normal');
  const [notes, setNotes] = useState(initialValues?.notes ?? '');

  const now = new Date();
  const dateStr = initialValues?.date ?? now.toISOString().split('T')[0];
  const timeStr = initialValues?.time ?? now.toTimeString().split(' ')[0].substring(0, 5);

  const handleSubmit = () => {
    const parsedAmount = parseInt(amountML, 10);
    if (isNaN(parsedAmount) || parsedAmount <= 0) return;

    onSave({
      amountML: parsedAmount,
      drinkType,
      temperature,
      source: initialValues ? 'manual' : 'manual',
      notes: notes.trim() || undefined,
      date: dateStr,
      time: timeStr,
    });
  };

  return (
    <ScrollView className="flex-1 bg-black p-4 gap-5" contentContainerStyle={{ paddingBottom: 40 }}>
      {/* Amount Input */}
      <View className="gap-2">
        <Text className="text-zinc-400 text-xs font-bold uppercase tracking-wider">Amount (mL)</Text>
        <TextInput
          value={amountML}
          onChangeText={setAmountML}
          keyboardType="numeric"
          className="bg-zinc-950 border border-zinc-900 rounded-2xl p-4 text-zinc-100 font-bold text-lg"
          placeholder="e.g. 250"
          placeholderTextColor="#3f3f46"
          accessibilityLabel="Drink amount in milliliters"
        />
      </View>

      {/* Drink Type Grid */}
      <View className="gap-2 mt-2">
        <Text className="text-zinc-400 text-xs font-bold uppercase tracking-wider">Drink Type</Text>
        <View className="flex-row flex-wrap gap-2">
          {DRINK_METADATA.map((d) => (
            <DrinkTypeChip
              key={d.drinkType}
              type={d.drinkType}
              label={d.label}
              icon={d.icon}
              isSelected={drinkType === d.drinkType}
              onPress={() => setDrinkType(d.drinkType)}
            />
          ))}
        </View>
      </View>

      {/* Temperature Segmented Control */}
      <View className="gap-2 mt-2">
        <Text className="text-zinc-400 text-xs font-bold uppercase tracking-wider">Temperature</Text>
        <View className="flex-row bg-zinc-950 border border-zinc-900 p-1.5 rounded-2xl">
          {DRINK_TEMPERATURE_OPTIONS.map((opt) => (
            <TouchableOpacity
              key={opt.value}
              activeOpacity={0.8}
              onPress={() => setTemperature(opt.value)}
              className={`flex-1 py-2.5 rounded-xl items-center ${
                temperature === opt.value ? 'bg-zinc-900 border border-zinc-800' : ''
              }`}
              accessibilityRole="radio"
              accessibilityState={{ checked: temperature === opt.value }}
              accessibilityLabel={`Temperature option ${opt.label}`}
            >
              <Text className={`text-xs font-bold ${temperature === opt.value ? 'text-zinc-100' : 'text-zinc-500'}`}>
                {opt.label}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      {/* Notes TextInput */}
      <View className="gap-2 mt-2">
        <Text className="text-zinc-400 text-xs font-bold uppercase tracking-wider">Notes</Text>
        <TextInput
          value={notes}
          onChangeText={setNotes}
          className="bg-zinc-950 border border-zinc-900 rounded-2xl p-4 text-zinc-100 text-sm h-20"
          placeholder="Add notes about this drink..."
          placeholderTextColor="#3f3f46"
          multiline={true}
          accessibilityLabel="Notes input"
        />
      </View>

      {/* Action Button */}
      <TouchableOpacity
        activeOpacity={0.8}
        onPress={handleSubmit}
        disabled={isSaving}
        className="bg-blue-600 active:bg-blue-700 disabled:bg-blue-800/50 py-4 rounded-2xl items-center mt-6"
        accessibilityRole="button"
        accessibilityLabel="Save hydration entry"
      >
        <Text className="text-zinc-100 font-extrabold text-sm">
          {isSaving ? 'Saving Entry...' : 'Save Entry'}
        </Text>
      </TouchableOpacity>
    </ScrollView>
  );
});
