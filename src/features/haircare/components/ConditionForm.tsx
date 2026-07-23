import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, ScrollView } from 'react-native';
import type {
  HairConditionFormValues,
} from '../validation/haircare.validation';
import type { HairType, HairPorosity, ScalpType, HairDensity } from '../types';
import { InlineLoader } from '@/shared/components';

interface ConditionFormProps {
  readonly initialValues?: Partial<HairConditionFormValues>;
  readonly isSubmitting?: boolean;
  readonly submitLabel?: string;
  readonly onSubmit: (values: HairConditionFormValues) => Promise<void>;
}

const HAIR_TYPE_OPTIONS: { label: string; value: HairType }[] = [
  { label: 'Straight (1)', value: 'straight' },
  { label: 'Wavy (2)', value: 'wavy' },
  { label: 'Curly (3)', value: 'curly' },
  { label: 'Coily (4)', value: 'coily' },
];

const POROSITY_OPTIONS: { label: string; value: HairPorosity }[] = [
  { label: 'Low', value: 'low' },
  { label: 'Medium', value: 'medium' },
  { label: 'High', value: 'high' },
  { label: 'Unknown', value: 'unknown' },
];

const SCALP_TYPE_OPTIONS: { label: string; value: ScalpType }[] = [
  { label: 'Dry', value: 'dry' },
  { label: 'Normal', value: 'normal' },
  { label: 'Oily', value: 'oily' },
  { label: 'Combo', value: 'combination' },
  { label: 'Sensitive', value: 'sensitive' },
];

const DENSITY_OPTIONS: { label: string; value: HairDensity }[] = [
  { label: 'Thin', value: 'thin' },
  { label: 'Medium', value: 'medium' },
  { label: 'Thick', value: 'thick' },
];

export const ConditionForm: React.FC<ConditionFormProps> = function ConditionForm({
  initialValues,
  isSubmitting = false,
  submitLabel = 'Save Assessment Record',
  onSubmit,
}) {
  const [recordDate, setRecordDate] = useState(
    initialValues?.recordDate || new Date().toISOString().split('T')[0]
  );
  const [hairType, setHairType] = useState<HairType>(initialValues?.hairType || 'wavy');
  const [porosity, setPorosity] = useState<HairPorosity>(initialValues?.porosity || 'medium');
  const [scalpType, setScalpType] = useState<ScalpType>(initialValues?.scalpType || 'normal');
  const [hairDensity, setHairDensity] = useState<HairDensity>(initialValues?.hairDensity || 'medium');

  // Rating levels (1-5)
  const [sheddingLevel, setSheddingLevel] = useState<number>(initialValues?.sheddingLevel || 2);
  const [dandruffLevel, setDandruffLevel] = useState<number>(initialValues?.dandruffLevel || 1);
  const [itchinessLevel, setItchinessLevel] = useState<number>(initialValues?.itchinessLevel || 1);
  const [oilinessLevel, setOilinessLevel] = useState<number>(initialValues?.oilinessLevel || 2);
  const [drynessLevel, setDrynessLevel] = useState<number>(initialValues?.drynessLevel || 2);
  const [breakageLevel, setBreakageLevel] = useState<number>(initialValues?.breakageLevel || 1);
  const [frizzLevel, setFrizzLevel] = useState<number>(initialValues?.frizzLevel || 2);
  const [shineLevel, setShineLevel] = useState<number>(initialValues?.shineLevel || 3);

  // Overall Health (1-10)
  const [overallHealth, setOverallHealth] = useState<number>(initialValues?.overallHealth || 8);

  // Optional Lifestyle Factors
  const [notes, setNotes] = useState(initialValues?.notes || '');

  const handleSubmit = async () => {
    await onSubmit({
      recordDate,
      hairType,
      porosity,
      scalpType,
      hairDensity,
      sheddingLevel,
      dandruffLevel,
      itchinessLevel,
      oilinessLevel,
      drynessLevel,
      breakageLevel,
      frizzLevel,
      shineLevel,
      overallHealth,
      notes: notes.trim() || undefined,
    });
  };

  const renderRatingSelector = (
    label: string,
    value: number,
    onChange: (val: number) => void,
    max = 5
  ) => {
    return (
      <View className="gap-1 my-1">
        <View className="flex-row items-center justify-between">
          <Text className="text-zinc-400 text-xs font-semibold">{label}</Text>
          <Text className="text-amber-400 text-xs font-bold">{value}/{max}</Text>
        </View>
        <View className="flex-row gap-1.5">
          {Array.from({ length: max }, (_, i) => i + 1).map((val) => (
            <TouchableOpacity
              key={val}
              className={`flex-1 py-2 rounded-xl items-center border ${
                value === val
                  ? 'bg-amber-500/20 border-amber-500'
                  : 'bg-zinc-950 border-zinc-800'
              }`}
              onPress={() => onChange(val)}
            >
              <Text
                className={`text-xs font-bold ${
                  value === val ? 'text-amber-400' : 'text-zinc-400'
                }`}
              >
                {val}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>
    );
  };

  return (
    <ScrollView className="gap-4 max-h-[550px]" showsVerticalScrollIndicator={false}>
      {/* Assessment Date */}
      <View className="gap-1">
        <Text className="text-zinc-400 text-xs font-semibold">Assessment Date (YYYY-MM-DD)</Text>
        <TextInput
          className="bg-zinc-950 border border-zinc-800 text-zinc-100 p-3 rounded-xl text-xs font-medium focus:border-amber-500"
          value={recordDate}
          onChangeText={setRecordDate}
        />
      </View>

      {/* Hair Type */}
      <View className="gap-1.5">
        <Text className="text-zinc-400 text-xs font-semibold">Hair Type</Text>
        <View className="flex-row flex-wrap gap-2">
          {HAIR_TYPE_OPTIONS.map((opt) => (
            <TouchableOpacity
              key={opt.value}
              className={`px-3 py-2 rounded-xl border ${
                hairType === opt.value
                  ? 'bg-amber-500/20 border-amber-500'
                  : 'bg-zinc-950 border-zinc-800'
              }`}
              onPress={() => setHairType(opt.value)}
            >
              <Text className={`text-xs font-bold ${hairType === opt.value ? 'text-amber-400' : 'text-zinc-400'}`}>
                {opt.label}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      {/* Porosity */}
      <View className="gap-1.5">
        <Text className="text-zinc-400 text-xs font-semibold">Hair Porosity</Text>
        <View className="flex-row flex-wrap gap-2">
          {POROSITY_OPTIONS.map((opt) => (
            <TouchableOpacity
              key={opt.value}
              className={`px-3 py-2 rounded-xl border ${
                porosity === opt.value
                  ? 'bg-amber-500/20 border-amber-500'
                  : 'bg-zinc-950 border-zinc-800'
              }`}
              onPress={() => setPorosity(opt.value)}
            >
              <Text className={`text-xs font-bold ${porosity === opt.value ? 'text-amber-400' : 'text-zinc-400'}`}>
                {opt.label}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      {/* Scalp Type */}
      <View className="gap-1.5">
        <Text className="text-zinc-400 text-xs font-semibold">Scalp Type</Text>
        <View className="flex-row flex-wrap gap-2">
          {SCALP_TYPE_OPTIONS.map((opt) => (
            <TouchableOpacity
              key={opt.value}
              className={`px-3 py-2 rounded-xl border ${
                scalpType === opt.value
                  ? 'bg-amber-500/20 border-amber-500'
                  : 'bg-zinc-950 border-zinc-800'
              }`}
              onPress={() => setScalpType(opt.value)}
            >
              <Text className={`text-xs font-bold ${scalpType === opt.value ? 'text-amber-400' : 'text-zinc-400'}`}>
                {opt.label}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      {/* Hair Density */}
      <View className="gap-1.5">
        <Text className="text-zinc-400 text-xs font-semibold">Hair Density</Text>
        <View className="flex-row flex-wrap gap-2">
          {DENSITY_OPTIONS.map((opt) => (
            <TouchableOpacity
              key={opt.value}
              className={`px-3 py-2 rounded-xl border ${
                hairDensity === opt.value
                  ? 'bg-amber-500/20 border-amber-500'
                  : 'bg-zinc-950 border-zinc-800'
              }`}
              onPress={() => setHairDensity(opt.value)}
            >
              <Text className={`text-xs font-bold ${hairDensity === opt.value ? 'text-amber-400' : 'text-zinc-400'}`}>
                {opt.label}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      {/* Ratings 1-5 */}
      <View className="gap-2 bg-zinc-950/60 border border-zinc-800/80 p-3 rounded-2xl">
        <Text className="text-zinc-400 text-xs font-semibold uppercase tracking-wider mb-1">
          Symptom Ratings (1 = Very Low / Minimal, 5 = Severe)
        </Text>

        {renderRatingSelector('Hair Shedding', sheddingLevel, setSheddingLevel)}
        {renderRatingSelector('Dandruff / Flakes', dandruffLevel, setDandruffLevel)}
        {renderRatingSelector('Scalp Itchiness', itchinessLevel, setItchinessLevel)}
        {renderRatingSelector('Scalp Oiliness', oilinessLevel, setOilinessLevel)}
        {renderRatingSelector('Hair Dryness', drynessLevel, setDrynessLevel)}
        {renderRatingSelector('Hair Breakage', breakageLevel, setBreakageLevel)}
        {renderRatingSelector('Frizz Level', frizzLevel, setFrizzLevel)}
        {renderRatingSelector('Hair Shine & Luster', shineLevel, setShineLevel)}
      </View>

      {/* Overall Health 1-10 */}
      <View className="gap-1">
        {renderRatingSelector('Overall Hair & Scalp Health Score', overallHealth, setOverallHealth, 10)}
      </View>

      {/* Notes */}
      <View className="gap-1">
        <Text className="text-zinc-400 text-xs font-semibold">Notes & Observations</Text>
        <TextInput
          className="bg-zinc-950 border border-zinc-800 text-zinc-100 p-3 rounded-xl text-xs font-medium focus:border-amber-500"
          placeholder="e.g. Scalp felt dry after switching shampoos"
          placeholderTextColor="#71717a"
          multiline
          numberOfLines={3}
          value={notes}
          onChangeText={setNotes}
        />
      </View>

      {/* Submit Button */}
      <TouchableOpacity
        className="bg-amber-500 active:bg-amber-600 py-3.5 rounded-xl items-center justify-center shadow-lg shadow-amber-500/20 my-2"
        onPress={() => void handleSubmit()}
        disabled={isSubmitting}
      >
        {isSubmitting ? (
          <InlineLoader label="Saving assessment..." color="#09090b" />
        ) : (
          <Text className="text-zinc-950 font-extrabold text-xs">{submitLabel}</Text>
        )}
      </TouchableOpacity>
    </ScrollView>
  );
};
