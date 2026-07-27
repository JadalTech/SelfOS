import React, { useMemo } from 'react';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { useSleepEntries } from '../hooks/useSleepEntries';
import { FormLayout } from '../components/layouts/FormLayout';
import { SleepEntryForm, SleepEntryFormValues } from '../components/SleepEntryForm';
import { mapToSleepEntryVM } from '../mappers/sleep.mapper';
import * as SleepEngine from '../engine/sleepEngine';

export const SleepLogScreen: React.FC = () => {
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id?: string }>();
  const { entries, saveEntry, isSaving } = useSleepEntries();

  // Find existing entry if editing
  const existingEntry = useMemo(() => {
    if (!id) return null;
    const entry = entries.find((e) => e.id === id);
    return entry ? mapToSleepEntryVM(entry) : null;
  }, [entries, id]);

  const handleSubmit = async (values: SleepEntryFormValues) => {
    // 1. Resolve actual Bedtime & Wake-up times as Dates
    const { bedtime, wakeTime } = getBedtimeAndWakeTimeFromSelections(
      values.date,
      values.bedtimeHour,
      values.bedtimeMinute,
      values.bedtimeAmPm,
      values.wakeHour,
      values.wakeMinute,
      values.wakeAmPm
    );

    // 2. Calculate sleep duration
    const durationMinutes = SleepEngine.calculateSleepDuration(bedtime, wakeTime);

    // 3. Construct input payload
    const payload = {
      id: id || undefined,
      date: values.date,
      bedtime,
      wakeTime,
      durationMinutes,
      quality: {
        rating: values.qualityRating,
        efficiencyPercentage: values.sleepEfficiency ?? null,
        deepSleepMinutes: null, // requires wearable data
        remSleepMinutes: null,
        lightSleepMinutes: null,
        awakeMinutes: values.awakeDuration ?? null,
      },
      sleepSource: values.sleepSource,
      sleepEfficiency: values.sleepEfficiency ?? null,
      sleepLatency: values.sleepLatency ?? null,
      awakeDuration: values.awakeDuration ?? null,
      notes: values.notes || null,
      tags: values.tags || [],
    };

    try {
      await saveEntry(payload as any);
      router.back();
    } catch {
      // Handled by query mutation error state
    }
  };

  return (
    <FormLayout
      title={id ? 'Edit Sleep Entry' : 'Log Night Sleep'}
      isSubmitting={isSaving}
      onSubmit={() => {}} // Form submission triggered internally in the component
    >
      <SleepEntryForm
        initialValues={existingEntry}
        onSubmit={handleSubmit}
        isSubmitting={isSaving}
      />
    </FormLayout>
  );
};

/**
 * Calculates correct calendar dates for bedtime and wake-up times.
 * Bedtime shifts to the previous day if actual bedtime (24h) is after wake-up time.
 */
function getBedtimeAndWakeTimeFromSelections(
  entryDate: string,
  bedtimeHour: number,
  bedtimeMinute: number,
  bedtimeAmPm: 'AM' | 'PM',
  wakeHour: number,
  wakeMinute: number,
  wakeAmPm: 'AM' | 'PM'
): { bedtime: Date; wakeTime: Date } {
  const [year, month, day] = entryDate.split('-').map(Number);
  
  let wakeHour24 = wakeHour % 12;
  if (wakeAmPm === 'PM') wakeHour24 += 12;
  const wakeTime = new Date(year, month - 1, day, wakeHour24, wakeMinute, 0, 0);

  let bedtimeHour24 = bedtimeHour % 12;
  if (bedtimeAmPm === 'PM') bedtimeHour24 += 12;

  let bedtimeDate = new Date(year, month - 1, day);
  // Shift bedtime to previous day if it starts after the wake-up time
  if (bedtimeHour24 > wakeHour24 || (bedtimeHour24 === wakeHour24 && bedtimeMinute > wakeMinute)) {
    bedtimeDate.setDate(bedtimeDate.getDate() - 1);
  }

  const bedtime = new Date(
    bedtimeDate.getFullYear(),
    bedtimeDate.getMonth(),
    bedtimeDate.getDate(),
    bedtimeHour24,
    bedtimeMinute,
    0,
    0
  );

  return { bedtime, wakeTime };
}
