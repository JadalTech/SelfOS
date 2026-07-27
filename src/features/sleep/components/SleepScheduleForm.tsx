import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useForm, Controller } from 'react-hook-form';
import type { SleepScheduleVM } from '../types/viewmodel.types';

export interface SleepScheduleFormValues {
  weekdayBedHour: number;
  weekdayBedMin: number;
  weekdayBedAmPm: 'AM' | 'PM';
  weekdayWakeHour: number;
  weekdayWakeMin: number;
  weekdayWakeAmPm: 'AM' | 'PM';
  
  weekendBedHour: number;
  weekendBedMin: number;
  weekendBedAmPm: 'AM' | 'PM';
  weekendWakeHour: number;
  weekendWakeMin: number;
  weekendWakeAmPm: 'AM' | 'PM';

  targetDurationMinutes: number;
}

export interface SleepScheduleFormProps {
  readonly initialValues?: SleepScheduleVM | null;
  readonly onSubmit: (data: SleepScheduleFormValues) => void;
  readonly isSubmitting?: boolean;
}

export const SleepScheduleForm: React.FC<SleepScheduleFormProps> = ({
  initialValues = null,
  onSubmit,
  isSubmitting = false,
}) => {
  const getInitialFormValues = (): SleepScheduleFormValues => {
    const parseTime = (timeStr: string, defaultHour: number, defaultAmPm: 'AM' | 'PM') => {
      if (!timeStr) return { hour: defaultHour, minute: 0, ampm: defaultAmPm };
      const parts = timeStr.split(':');
      let hour = parseInt(parts[0], 10);
      const minute = parseInt(parts[1], 10);
      const ampm: 'AM' | 'PM' = hour >= 12 ? 'PM' : 'AM';
      hour = hour % 12;
      hour = hour ? hour : 12;
      return { hour, minute, ampm };
    };

    if (initialValues) {
      const weekdayBed = parseTime(initialValues.weekdayBedtime, 10, 'PM');
      const weekdayWake = parseTime(initialValues.weekdayWakeTime, 6, 'AM');
      const weekendBed = parseTime(initialValues.weekendBedtime, 11, 'PM');
      const weekendWake = parseTime(initialValues.weekendWakeTime, 8, 'AM');

      return {
        weekdayBedHour: weekdayBed.hour,
        weekdayBedMin: weekdayBed.minute,
        weekdayBedAmPm: weekdayBed.ampm,
        weekdayWakeHour: weekdayWake.hour,
        weekdayWakeMin: weekdayWake.minute,
        weekdayWakeAmPm: weekdayWake.ampm,
        weekendBedHour: weekendBed.hour,
        weekendBedMin: weekendBed.minute,
        weekendBedAmPm: weekendBed.ampm,
        weekendWakeHour: weekendWake.hour,
        weekendWakeMin: weekendWake.minute,
        weekendWakeAmPm: weekendWake.ampm,
        targetDurationMinutes: initialValues.targetDurationMinutes,
      };
    }

    return {
      weekdayBedHour: 10,
      weekdayBedMin: 30,
      weekdayBedAmPm: 'PM',
      weekdayWakeHour: 6,
      weekdayWakeMin: 30,
      weekdayWakeAmPm: 'AM',
      weekendBedHour: 11,
      weekendBedMin: 30,
      weekendBedAmPm: 'PM',
      weekendWakeHour: 8,
      weekendWakeMin: 30,
      weekendWakeAmPm: 'AM',
      targetDurationMinutes: 480, // 8 hours
    };
  };

  const { control, handleSubmit, watch } = useForm<SleepScheduleFormValues>({
    defaultValues: getInitialFormValues(),
  });

  const durationMinutes = watch('targetDurationMinutes');

  return (
    <View style={styles.container}>
      {/* Target Duration slider */}
      <View style={styles.formGroup}>
        <View style={styles.headerRow}>
          <Text style={styles.label}>Target Sleep Duration</Text>
          <Text style={styles.durationVal}>{(durationMinutes / 60).toFixed(1)} hrs</Text>
        </View>
        <Controller
          control={control}
          name="targetDurationMinutes"
          render={({ field: { onChange, value } }) => (
            <View style={styles.adjusterRow}>
              {[360, 420, 450, 480, 510, 540].map((mins) => (
                <TouchableOpacity
                  key={mins}
                  style={[styles.durationBtn, value === mins && styles.activeDurationBtn]}
                  onPress={() => onChange(mins)}
                >
                  <Text style={[styles.durationBtnText, value === mins && styles.activeDurationBtnText]}>
                    {(mins / 60).toFixed(1)}h
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          )}
        />
      </View>

      <View style={styles.divider} />

      {/* Weekday Schedule Section */}
      <Text style={styles.sectionHeader}>Weekday Targets</Text>
      
      {/* Weekday Bedtime */}
      <View style={styles.formGroup}>
        <Text style={styles.subLabel}>Target Bedtime</Text>
        <View style={styles.timePickerRow}>
          <Controller
            control={control}
            name="weekdayBedHour"
            render={({ field: { onChange, value } }) => (
              <View style={styles.pickerCell}>
                <TouchableOpacity style={styles.adjustBtn} onPress={() => onChange(value > 1 ? value - 1 : 12)}>
                  <Text style={styles.adjustText}>-</Text>
                </TouchableOpacity>
                <Text style={styles.pickerVal}>{value.toString().padStart(2, '0')}</Text>
                <TouchableOpacity style={styles.adjustBtn} onPress={() => onChange(value < 12 ? value + 1 : 1)}>
                  <Text style={styles.adjustText}>+</Text>
                </TouchableOpacity>
              </View>
            )}
          />

          <Controller
            control={control}
            name="weekdayBedMin"
            render={({ field: { onChange, value } }) => (
              <View style={styles.pickerCell}>
                <TouchableOpacity style={styles.adjustBtn} onPress={() => onChange(value >= 15 ? value - 15 : 45)}>
                  <Text style={styles.adjustText}>-</Text>
                </TouchableOpacity>
                <Text style={styles.pickerVal}>{value.toString().padStart(2, '0')}</Text>
                <TouchableOpacity style={styles.adjustBtn} onPress={() => onChange(value <= 45 ? value + 15 : 0)}>
                  <Text style={styles.adjustText}>+</Text>
                </TouchableOpacity>
              </View>
            )}
          />

          <Controller
            control={control}
            name="weekdayBedAmPm"
            render={({ field: { onChange, value } }) => (
              <View style={styles.toggleCell}>
                <TouchableOpacity
                  style={[styles.toggleBtn, value === 'AM' && styles.activeToggle]}
                  onPress={() => onChange('AM')}
                >
                  <Text style={styles.toggleText}>AM</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[styles.toggleBtn, value === 'PM' && styles.activeToggle]}
                  onPress={() => onChange('PM')}
                >
                  <Text style={styles.toggleText}>PM</Text>
                </TouchableOpacity>
              </View>
            )}
          />
        </View>
      </View>

      {/* Weekday Wake Time */}
      <View style={styles.formGroup}>
        <Text style={styles.subLabel}>Target Wake-up Time</Text>
        <View style={styles.timePickerRow}>
          <Controller
            control={control}
            name="weekdayWakeHour"
            render={({ field: { onChange, value } }) => (
              <View style={styles.pickerCell}>
                <TouchableOpacity style={styles.adjustBtn} onPress={() => onChange(value > 1 ? value - 1 : 12)}>
                  <Text style={styles.adjustText}>-</Text>
                </TouchableOpacity>
                <Text style={styles.pickerVal}>{value.toString().padStart(2, '0')}</Text>
                <TouchableOpacity style={styles.adjustBtn} onPress={() => onChange(value < 12 ? value + 1 : 1)}>
                  <Text style={styles.adjustText}>+</Text>
                </TouchableOpacity>
              </View>
            )}
          />

          <Controller
            control={control}
            name="weekdayWakeMin"
            render={({ field: { onChange, value } }) => (
              <View style={styles.pickerCell}>
                <TouchableOpacity style={styles.adjustBtn} onPress={() => onChange(value >= 15 ? value - 15 : 45)}>
                  <Text style={styles.adjustText}>-</Text>
                </TouchableOpacity>
                <Text style={styles.pickerVal}>{value.toString().padStart(2, '0')}</Text>
                <TouchableOpacity style={styles.adjustBtn} onPress={() => onChange(value <= 45 ? value + 15 : 0)}>
                  <Text style={styles.adjustText}>+</Text>
                </TouchableOpacity>
              </View>
            )}
          />

          <Controller
            control={control}
            name="weekdayWakeAmPm"
            render={({ field: { onChange, value } }) => (
              <View style={styles.toggleCell}>
                <TouchableOpacity
                  style={[styles.toggleBtn, value === 'AM' && styles.activeToggle]}
                  onPress={() => onChange('AM')}
                >
                  <Text style={styles.toggleText}>AM</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[styles.toggleBtn, value === 'PM' && styles.activeToggle]}
                  onPress={() => onChange('PM')}
                >
                  <Text style={styles.toggleText}>PM</Text>
                </TouchableOpacity>
              </View>
            )}
          />
        </View>
      </View>

      <View style={styles.divider} />

      {/* Weekend Schedule Section */}
      <Text style={styles.sectionHeader}>Weekend Targets</Text>

      {/* Weekend Bedtime */}
      <View style={styles.formGroup}>
        <Text style={styles.subLabel}>Target Bedtime</Text>
        <View style={styles.timePickerRow}>
          <Controller
            control={control}
            name="weekendBedHour"
            render={({ field: { onChange, value } }) => (
              <View style={styles.pickerCell}>
                <TouchableOpacity style={styles.adjustBtn} onPress={() => onChange(value > 1 ? value - 1 : 12)}>
                  <Text style={styles.adjustText}>-</Text>
                </TouchableOpacity>
                <Text style={styles.pickerVal}>{value.toString().padStart(2, '0')}</Text>
                <TouchableOpacity style={styles.adjustBtn} onPress={() => onChange(value < 12 ? value + 1 : 1)}>
                  <Text style={styles.adjustText}>+</Text>
                </TouchableOpacity>
              </View>
            )}
          />

          <Controller
            control={control}
            name="weekendBedMin"
            render={({ field: { onChange, value } }) => (
              <View style={styles.pickerCell}>
                <TouchableOpacity style={styles.adjustBtn} onPress={() => onChange(value >= 15 ? value - 15 : 45)}>
                  <Text style={styles.adjustText}>-</Text>
                </TouchableOpacity>
                <Text style={styles.pickerVal}>{value.toString().padStart(2, '0')}</Text>
                <TouchableOpacity style={styles.adjustBtn} onPress={() => onChange(value <= 45 ? value + 15 : 0)}>
                  <Text style={styles.adjustText}>+</Text>
                </TouchableOpacity>
              </View>
            )}
          />

          <Controller
            control={control}
            name="weekendBedAmPm"
            render={({ field: { onChange, value } }) => (
              <View style={styles.toggleCell}>
                <TouchableOpacity
                  style={[styles.toggleBtn, value === 'AM' && styles.activeToggle]}
                  onPress={() => onChange('AM')}
                >
                  <Text style={styles.toggleText}>AM</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[styles.toggleBtn, value === 'PM' && styles.activeToggle]}
                  onPress={() => onChange('PM')}
                >
                  <Text style={styles.toggleText}>PM</Text>
                </TouchableOpacity>
              </View>
            )}
          />
        </View>
      </View>

      {/* Weekend Wake Time */}
      <View style={styles.formGroup}>
        <Text style={styles.subLabel}>Target Wake-up Time</Text>
        <View style={styles.timePickerRow}>
          <Controller
            control={control}
            name="weekendWakeHour"
            render={({ field: { onChange, value } }) => (
              <View style={styles.pickerCell}>
                <TouchableOpacity style={styles.adjustBtn} onPress={() => onChange(value > 1 ? value - 1 : 12)}>
                  <Text style={styles.adjustText}>-</Text>
                </TouchableOpacity>
                <Text style={styles.pickerVal}>{value.toString().padStart(2, '0')}</Text>
                <TouchableOpacity style={styles.adjustBtn} onPress={() => onChange(value < 12 ? value + 1 : 1)}>
                  <Text style={styles.adjustText}>+</Text>
                </TouchableOpacity>
              </View>
            )}
          />

          <Controller
            control={control}
            name="weekendWakeMin"
            render={({ field: { onChange, value } }) => (
              <View style={styles.pickerCell}>
                <TouchableOpacity style={styles.adjustBtn} onPress={() => onChange(value >= 15 ? value - 15 : 45)}>
                  <Text style={styles.adjustText}>-</Text>
                </TouchableOpacity>
                <Text style={styles.pickerVal}>{value.toString().padStart(2, '0')}</Text>
                <TouchableOpacity style={styles.adjustBtn} onPress={() => onChange(value <= 45 ? value + 15 : 0)}>
                  <Text style={styles.adjustText}>+</Text>
                </TouchableOpacity>
              </View>
            )}
          />

          <Controller
            control={control}
            name="weekendWakeAmPm"
            render={({ field: { onChange, value } }) => (
              <View style={styles.toggleCell}>
                <TouchableOpacity
                  style={[styles.toggleBtn, value === 'AM' && styles.activeToggle]}
                  onPress={() => onChange('AM')}
                >
                  <Text style={styles.toggleText}>AM</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[styles.toggleBtn, value === 'PM' && styles.activeToggle]}
                  onPress={() => onChange('PM')}
                >
                  <Text style={styles.toggleText}>PM</Text>
                </TouchableOpacity>
              </View>
            )}
          />
        </View>
      </View>

      <TouchableOpacity
        style={styles.submitTrigger}
        onPress={handleSubmit(onSubmit)}
        disabled={isSubmitting}
      >
        <Text>Save Schedule</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    gap: 16,
  },
  formGroup: {
    gap: 8,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  label: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#a1a1aa',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  subLabel: {
    fontSize: 12,
    fontWeight: '700',
    color: '#a1a1aa',
  },
  sectionHeader: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#6366f1',
    marginTop: 8,
  },
  durationVal: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#6366f1',
  },
  adjusterRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    backgroundColor: '#18181b',
    borderWidth: 1,
    borderColor: '#27272a',
    borderRadius: 12,
    padding: 4,
  },
  durationBtn: {
    flex: 1,
    paddingVertical: 8,
    borderRadius: 8,
    alignItems: 'center',
  },
  activeDurationBtn: {
    backgroundColor: '#6366f1',
  },
  durationBtnText: {
    color: '#a1a1aa',
    fontSize: 12,
    fontWeight: '700',
  },
  activeDurationBtnText: {
    color: '#ffffff',
  },
  timePickerRow: {
    flexDirection: 'row',
    gap: 10,
  },
  pickerCell: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#18181b',
    borderWidth: 1,
    borderColor: '#27272a',
    borderRadius: 12,
    paddingHorizontal: 8,
    height: 48,
    justifyContent: 'space-between',
  },
  adjustBtn: {
    width: 24,
    height: 24,
    borderRadius: 4,
    backgroundColor: '#27272a',
    alignItems: 'center',
    justifyContent: 'center',
  },
  adjustText: {
    color: '#fafafa',
    fontSize: 14,
    fontWeight: 'bold',
  },
  pickerVal: {
    color: '#fafafa',
    fontSize: 14,
    fontWeight: 'bold',
  },
  toggleCell: {
    flexDirection: 'row',
    backgroundColor: '#18181b',
    borderRadius: 12,
    padding: 3,
    height: 48,
    borderWidth: 1,
    borderColor: '#27272a',
    alignItems: 'center',
  },
  toggleBtn: {
    paddingHorizontal: 10,
    height: '100%',
    borderRadius: 9,
    justifyContent: 'center',
    alignItems: 'center',
  },
  activeToggle: {
    backgroundColor: '#6366f1',
  },
  toggleText: {
    color: '#fafafa',
    fontSize: 11,
    fontWeight: '700',
  },
  divider: {
    height: 1,
    backgroundColor: '#27272a',
    marginVertical: 8,
  },
  submitTrigger: {
    display: 'none',
  },
});
