import React, { useMemo } from 'react';
import { useRouter } from 'expo-router';
import { useSleepSchedule } from '../hooks/useSleepSchedule';
import { FormLayout } from '../components/layouts/FormLayout';
import { SleepScheduleForm, SleepScheduleFormValues } from '../components/SleepScheduleForm';
import { mapToSleepScheduleVM } from '../mappers/sleep.mapper';

export const SleepScheduleScreen: React.FC = () => {
  const router = useRouter();
  const { activeSchedule, saveSchedule, isSaving, isLoading } = useSleepSchedule();

  const initialValues = useMemo(() => {
    return activeSchedule ? mapToSleepScheduleVM(activeSchedule) : null;
  }, [activeSchedule]);

  const handleSubmit = async (values: SleepScheduleFormValues) => {
    const construct24HourTime = (hour: number, minute: number, ampm: 'AM' | 'PM') => {
      let hour24 = hour % 12;
      if (ampm === 'PM') hour24 += 12;
      return `${hour24.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`;
    };

    const payload = {
      id: activeSchedule?.id || undefined,
      weekdayBedtime: construct24HourTime(values.weekdayBedHour, values.weekdayBedMin, values.weekdayBedAmPm),
      weekdayWakeTime: construct24HourTime(values.weekdayWakeHour, values.weekdayWakeMin, values.weekdayWakeAmPm),
      weekendBedtime: construct24HourTime(values.weekendBedHour, values.weekendBedMin, values.weekendBedAmPm),
      weekendWakeTime: construct24HourTime(values.weekendWakeHour, values.weekendWakeMin, values.weekendWakeAmPm),
      targetDurationMinutes: values.targetDurationMinutes,
      isActive: true,
      effectiveFrom: activeSchedule?.effectiveFrom || new Date().toISOString().split('T')[0],
    };

    try {
      await saveSchedule(payload as any);
      router.back();
    } catch {
      // Handled by query mutation error state
    }
  };

  return (
    <FormLayout
      title="Sleep Schedule"
      isSubmitting={isSaving || isLoading}
      onSubmit={() => {}} // Submission triggered internally
    >
      <SleepScheduleForm
        initialValues={initialValues}
        onSubmit={handleSubmit}
        isSubmitting={isSaving}
      />
    </FormLayout>
  );
};
