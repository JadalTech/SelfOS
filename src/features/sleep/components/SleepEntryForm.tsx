import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet } from 'react-native';
import { useForm, Controller } from 'react-hook-form';
import type { SleepEntryVM } from '../types/viewmodel.types';
import type { SleepSource } from '../types/sleep.types';

export interface SleepEntryFormValues {
  date: string;
  bedtimeHour: number;
  bedtimeMinute: number;
  bedtimeAmPm: 'AM' | 'PM';
  wakeHour: number;
  wakeMinute: number;
  wakeAmPm: 'AM' | 'PM';
  qualityRating: number;
  notes?: string;
  sleepSource: SleepSource;
  sleepEfficiency?: number;
  sleepLatency?: number;
  awakeDuration?: number;
  tags?: string[];
}

export interface SleepEntryFormProps {
  readonly initialValues?: SleepEntryVM | null;
  readonly onSubmit: (data: SleepEntryFormValues) => void;
  readonly isSubmitting?: boolean;
}

export const SleepEntryForm: React.FC<SleepEntryFormProps> = ({
  initialValues = null,
  onSubmit,
  isSubmitting = false,
}) => {
  const [showAdvanced, setShowAdvanced] = useState(false);

  // Helper to parse existing dates into form fields
  const getInitialFormValues = (): SleepEntryFormValues => {
    if (initialValues) {
      const parseTime = (dateStr: Date | string | undefined) => {
        if (!dateStr) return { hour: 11, minute: 0, ampm: 'PM' as const };
        const d = new Date(dateStr);
        let hour = d.getHours();
        const minute = d.getMinutes();
        const ampm: 'AM' | 'PM' = hour >= 12 ? 'PM' : 'AM';
        hour = hour % 12;
        hour = hour ? hour : 12;
        return { hour, minute, ampm };
      };

      const bedParsed = parseTime(initialValues.bedtimeFormatted ? new Date(initialValues.date + 'T' + initialValues.bedtimeFormatted) : undefined);
      const wakeParsed = parseTime(initialValues.wakeTimeFormatted ? new Date(initialValues.date + 'T' + initialValues.wakeTimeFormatted) : undefined);

      return {
        date: initialValues.date,
        bedtimeHour: bedParsed.hour,
        bedtimeMinute: bedParsed.minute,
        bedtimeAmPm: bedParsed.ampm,
        wakeHour: wakeParsed.hour,
        wakeMinute: wakeParsed.minute,
        wakeAmPm: wakeParsed.ampm,
        qualityRating: initialValues.qualityRating,
        notes: initialValues.notes,
        sleepSource: initialValues.sleepSource,
        sleepEfficiency: initialValues.sleepEfficiency,
        sleepLatency: initialValues.sleepLatency,
        awakeDuration: initialValues.awakeDuration,
        tags: initialValues.tags || [],
      };
    }

    const todayStr = new Date().toISOString().split('T')[0];
    return {
      date: todayStr,
      bedtimeHour: 11,
      bedtimeMinute: 0,
      bedtimeAmPm: 'PM',
      wakeHour: 7,
      wakeMinute: 0,
      wakeAmPm: 'AM',
      qualityRating: 7,
      notes: '',
      sleepSource: 'manual',
      sleepEfficiency: 90,
      sleepLatency: 15,
      awakeDuration: 20,
      tags: [],
    };
  };

  const {
    control,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<SleepEntryFormValues>({
    defaultValues: getInitialFormValues(),
  });

  const selectedDate = watch('date');
  const ratingValue = watch('qualityRating');

  // Simple quick date toggles
  const setQuickDate = (daysAgo: number) => {
    const d = new Date();
    d.setDate(d.getDate() - daysAgo);
    setValue('date', d.toISOString().split('T')[0]);
  };

  return (
    <View style={styles.container}>
      {/* Date Selection */}
      <View style={styles.formGroup}>
        <Text style={styles.label}>Waking Date</Text>
        <Controller
          control={control}
          name="date"
          render={({ field: { onChange, value } }) => (
            <View style={styles.dateContainer}>
              <TextInput
                style={styles.textInput}
                value={value}
                onChangeText={onChange}
                placeholder="YYYY-MM-DD"
                placeholderTextColor="#71717a"
              />
              <View style={styles.quickDateRow}>
                <TouchableOpacity
                  style={[styles.quickDateBtn, selectedDate === new Date().toISOString().split('T')[0] && styles.activeQuickBtn]}
                  onPress={() => setQuickDate(0)}
                >
                  <Text style={styles.quickDateText}>Today</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[styles.quickDateBtn, selectedDate === new Date(Date.now() - 86400000).toISOString().split('T')[0] && styles.activeQuickBtn]}
                  onPress={() => setQuickDate(1)}
                >
                  <Text style={styles.quickDateText}>Yesterday</Text>
                </TouchableOpacity>
              </View>
            </View>
          )}
        />
        {errors.date && <Text style={styles.errorText}>{errors.date.message}</Text>}
      </View>

      {/* Bedtime Adjuster */}
      <View style={styles.formGroup}>
        <Text style={styles.label}>Bedtime</Text>
        <View style={styles.timePickerContainer}>
          <Controller
            control={control}
            name="bedtimeHour"
            render={({ field: { onChange, value } }) => (
              <View style={styles.pickerCell}>
                <TouchableOpacity style={styles.adjustBtn} onPress={() => onChange(value > 1 ? value - 1 : 12)}>
                  <Text style={styles.adjustText}>-</Text>
                </TouchableOpacity>
                <Text style={styles.pickerVal}>{value.toString().padStart(2, '0')}</Text>
                <TouchableOpacity style={styles.adjustBtn} onPress={() => onChange(value < 12 ? value + 1 : 1)}>
                  <Text style={styles.adjustText}>+</Text>
                </TouchableOpacity>
                <Text style={styles.pickerLabel}>hr</Text>
              </View>
            )}
          />

          <Controller
            control={control}
            name="bedtimeMinute"
            render={({ field: { onChange, value } }) => (
              <View style={styles.pickerCell}>
                <TouchableOpacity style={styles.adjustBtn} onPress={() => onChange(value >= 15 ? value - 15 : 45)}>
                  <Text style={styles.adjustText}>-</Text>
                </TouchableOpacity>
                <Text style={styles.pickerVal}>{value.toString().padStart(2, '0')}</Text>
                <TouchableOpacity style={styles.adjustBtn} onPress={() => onChange(value <= 45 ? value + 15 : 0)}>
                  <Text style={styles.adjustText}>+</Text>
                </TouchableOpacity>
                <Text style={styles.pickerLabel}>min</Text>
              </View>
            )}
          />

          <Controller
            control={control}
            name="bedtimeAmPm"
            render={({ field: { onChange, value } }) => (
              <View style={styles.toggleCell}>
                <TouchableOpacity
                  style={[styles.toggleBtn, value === 'AM' && styles.activeToggle]}
                  onPress={() => onChange('AM')}
                >
                  <Text style={styles.toggleBtnText}>AM</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[styles.toggleBtn, value === 'PM' && styles.activeToggle]}
                  onPress={() => onChange('PM')}
                >
                  <Text style={styles.toggleBtnText}>PM</Text>
                </TouchableOpacity>
              </View>
            )}
          />
        </View>
      </View>

      {/* Wake-up Adjuster */}
      <View style={styles.formGroup}>
        <Text style={styles.label}>Wake-up Time</Text>
        <View style={styles.timePickerContainer}>
          <Controller
            control={control}
            name="wakeHour"
            render={({ field: { onChange, value } }) => (
              <View style={styles.pickerCell}>
                <TouchableOpacity style={styles.adjustBtn} onPress={() => onChange(value > 1 ? value - 1 : 12)}>
                  <Text style={styles.adjustText}>-</Text>
                </TouchableOpacity>
                <Text style={styles.pickerVal}>{value.toString().padStart(2, '0')}</Text>
                <TouchableOpacity style={styles.adjustBtn} onPress={() => onChange(value < 12 ? value + 1 : 1)}>
                  <Text style={styles.adjustText}>+</Text>
                </TouchableOpacity>
                <Text style={styles.pickerLabel}>hr</Text>
              </View>
            )}
          />

          <Controller
            control={control}
            name="wakeMinute"
            render={({ field: { onChange, value } }) => (
              <View style={styles.pickerCell}>
                <TouchableOpacity style={styles.adjustBtn} onPress={() => onChange(value >= 15 ? value - 15 : 45)}>
                  <Text style={styles.adjustText}>-</Text>
                </TouchableOpacity>
                <Text style={styles.pickerVal}>{value.toString().padStart(2, '0')}</Text>
                <TouchableOpacity style={styles.adjustBtn} onPress={() => onChange(value <= 45 ? value + 15 : 0)}>
                  <Text style={styles.adjustText}>+</Text>
                </TouchableOpacity>
                <Text style={styles.pickerLabel}>min</Text>
              </View>
            )}
          />

          <Controller
            control={control}
            name="wakeAmPm"
            render={({ field: { onChange, value } }) => (
              <View style={styles.toggleCell}>
                <TouchableOpacity
                  style={[styles.toggleBtn, value === 'AM' && styles.activeToggle]}
                  onPress={() => onChange('AM')}
                >
                  <Text style={styles.toggleBtnText}>AM</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[styles.toggleBtn, value === 'PM' && styles.activeToggle]}
                  onPress={() => onChange('PM')}
                >
                  <Text style={styles.toggleBtnText}>PM</Text>
                </TouchableOpacity>
              </View>
            )}
          />
        </View>
      </View>

      {/* Quality Rating Selector */}
      <View style={styles.formGroup}>
        <View style={styles.qualityLabelRow}>
          <Text style={styles.label}>Perceived Sleep Quality</Text>
          <Text style={styles.ratingBadge}>{ratingValue}/10</Text>
        </View>
        <Controller
          control={control}
          name="qualityRating"
          render={({ field: { onChange, value } }) => (
            <View style={styles.sliderContainer}>
              <View style={styles.ratingButtonGrid}>
                {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((num) => (
                  <TouchableOpacity
                    key={num}
                    style={[styles.ratingBtn, value === num && styles.activeRatingBtn]}
                    onPress={() => onChange(num)}
                    accessible={true}
                    accessibilityRole="button"
                    accessibilityLabel={`Rate quality ${num} out of 10`}
                  >
                    <Text style={[styles.ratingBtnText, value === num && styles.activeRatingBtnText]}>{num}</Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>
          )}
        />
      </View>

      {/* Toggle Advanced metrics */}
      <TouchableOpacity
        style={styles.advancedToggle}
        onPress={() => setShowAdvanced(!showAdvanced)}
      >
        <Text style={styles.advancedToggleText}>
          {showAdvanced ? 'Hide Advanced Metrics ▲' : 'Show Advanced Metrics (Wearable/Efficiency) ▼'}
        </Text>
      </TouchableOpacity>

      {showAdvanced && (
        <View style={styles.advancedContainer}>
          {/* Sleep Source */}
          <View style={styles.formGroup}>
            <Text style={styles.label}>Data Source</Text>
            <Controller
              control={control}
              name="sleepSource"
              render={({ field: { onChange, value } }) => (
                <View style={styles.sourceToggleRow}>
                  {(['manual', 'wearable', 'imported'] as const).map((src) => (
                    <TouchableOpacity
                      key={src}
                      style={[styles.sourceBtn, value === src && styles.activeSourceBtn]}
                      onPress={() => onChange(src)}
                    >
                      <Text style={[styles.sourceBtnText, value === src && styles.activeSourceBtnText]}>
                        {src.charAt(0).toUpperCase() + src.slice(1)}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
              )}
            />
          </View>

          {/* Efficiency (%) */}
          <View style={styles.formGroup}>
            <Text style={styles.label}>Sleep Efficiency (%)</Text>
            <Controller
              control={control}
              name="sleepEfficiency"
              render={({ field: { onChange, value } }) => (
                <TextInput
                  style={styles.textInput}
                  keyboardType="numeric"
                  value={value ? value.toString() : ''}
                  onChangeText={(val) => onChange(val ? parseInt(val, 10) : undefined)}
                  placeholder="e.g. 92"
                  placeholderTextColor="#71717a"
                />
              )}
            />
          </View>

          {/* Latency (min) */}
          <View style={styles.formGroup}>
            <Text style={styles.label}>Sleep Latency (minutes to fall asleep)</Text>
            <Controller
              control={control}
              name="sleepLatency"
              render={({ field: { onChange, value } }) => (
                <TextInput
                  style={styles.textInput}
                  keyboardType="numeric"
                  value={value ? value.toString() : ''}
                  onChangeText={(val) => onChange(val ? parseInt(val, 10) : undefined)}
                  placeholder="e.g. 15"
                  placeholderTextColor="#71717a"
                />
              )}
            />
          </View>

          {/* Awake Duration (min) */}
          <View style={styles.formGroup}>
            <Text style={styles.label}>Awake Duration during night (minutes)</Text>
            <Controller
              control={control}
              name="awakeDuration"
              render={({ field: { onChange, value } }) => (
                <TextInput
                  style={styles.textInput}
                  keyboardType="numeric"
                  value={value ? value.toString() : ''}
                  onChangeText={(val) => onChange(val ? parseInt(val, 10) : undefined)}
                  placeholder="e.g. 25"
                  placeholderTextColor="#71717a"
                />
              )}
            />
          </View>
        </View>
      )}

      {/* Notes */}
      <View style={styles.formGroup}>
        <Text style={styles.label}>Sleep Journal / Notes</Text>
        <Controller
          control={control}
          name="notes"
          render={({ field: { onChange, onBlur, value } }) => (
            <TextInput
              style={[styles.textInput, styles.textArea]}
              multiline
              numberOfLines={3}
              value={value}
              onBlur={onBlur}
              onChangeText={onChange}
              placeholder="e.g. Had caffeine late. Woke up once during the night, but felt rested."
              placeholderTextColor="#71717a"
            />
          )}
        />
      </View>

      {/* Trigger Submit container from layout parent */}
      <TouchableOpacity
        style={styles.submitTrigger}
        onPress={handleSubmit(onSubmit)}
        disabled={isSubmitting}
      >
        <Text style={styles.submitTriggerText}>
          {isSubmitting ? 'Logging...' : 'Submit Entry'}
        </Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    gap: 20,
  },
  formGroup: {
    gap: 8,
  },
  label: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#a1a1aa',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  textInput: {
    backgroundColor: '#18181b',
    borderWidth: 1,
    borderColor: '#27272a',
    borderRadius: 12,
    color: '#fafafa',
    paddingHorizontal: 16,
    height: 48,
    fontSize: 14,
    fontWeight: '500',
  },
  textArea: {
    height: 90,
    paddingTop: 12,
    textAlignVertical: 'top',
  },
  dateContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  quickDateRow: {
    flexDirection: 'row',
    gap: 8,
  },
  quickDateBtn: {
    backgroundColor: '#18181b',
    borderWidth: 1,
    borderColor: '#27272a',
    borderRadius: 10,
    paddingHorizontal: 12,
    height: 48,
    justifyContent: 'center',
  },
  activeQuickBtn: {
    borderColor: '#6366f1',
    backgroundColor: '#312e81',
  },
  quickDateText: {
    color: '#fafafa',
    fontSize: 12,
    fontWeight: '600',
  },
  timePickerContainer: {
    flexDirection: 'row',
    gap: 12,
    alignItems: 'center',
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
    height: 52,
    justifyContent: 'space-between',
  },
  adjustBtn: {
    width: 28,
    height: 28,
    borderRadius: 6,
    backgroundColor: '#27272a',
    alignItems: 'center',
    justifyContent: 'center',
  },
  adjustText: {
    color: '#fafafa',
    fontSize: 16,
    fontWeight: 'bold',
  },
  pickerVal: {
    color: '#fafafa',
    fontSize: 16,
    fontWeight: 'bold',
  },
  pickerLabel: {
    color: '#71717a',
    fontSize: 11,
    fontWeight: 'bold',
  },
  toggleCell: {
    flexDirection: 'row',
    backgroundColor: '#18181b',
    borderRadius: 12,
    padding: 3,
    height: 52,
    borderWidth: 1,
    borderColor: '#27272a',
    alignItems: 'center',
  },
  toggleBtn: {
    paddingHorizontal: 12,
    height: '100%',
    borderRadius: 9,
    justifyContent: 'center',
    alignItems: 'center',
  },
  activeToggle: {
    backgroundColor: '#6366f1',
  },
  toggleBtnText: {
    color: '#fafafa',
    fontSize: 12,
    fontWeight: '700',
  },
  qualityLabelRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  ratingBadge: {
    fontSize: 13,
    color: '#6366f1',
    fontWeight: 'bold',
  },
  sliderContainer: {
    backgroundColor: '#18181b',
    borderWidth: 1,
    borderColor: '#27272a',
    borderRadius: 14,
    padding: 12,
  },
  ratingButtonGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    justifyContent: 'space-between',
  },
  ratingBtn: {
    width: '18%', // 5 items per row with gap
    aspectRatio: 1,
    borderRadius: 10,
    backgroundColor: '#27272a',
    alignItems: 'center',
    justifyContent: 'center',
  },
  activeRatingBtn: {
    backgroundColor: '#6366f1',
  },
  ratingBtnText: {
    color: '#a1a1aa',
    fontSize: 14,
    fontWeight: 'bold',
  },
  activeRatingBtnText: {
    color: '#ffffff',
  },
  advancedToggle: {
    paddingVertical: 10,
    alignItems: 'center',
  },
  advancedToggleText: {
    color: '#818cf8',
    fontSize: 12,
    fontWeight: '600',
  },
  advancedContainer: {
    gap: 16,
    backgroundColor: '#18181b/40',
    borderWidth: 1,
    borderColor: '#27272a',
    borderRadius: 16,
    padding: 16,
  },
  sourceToggleRow: {
    flexDirection: 'row',
    backgroundColor: '#27272a',
    padding: 3,
    borderRadius: 10,
    gap: 4,
  },
  sourceBtn: {
    flex: 1,
    paddingVertical: 8,
    borderRadius: 8,
    alignItems: 'center',
  },
  activeSourceBtn: {
    backgroundColor: '#6366f1',
  },
  sourceBtnText: {
    color: '#a1a1aa',
    fontSize: 12,
    fontWeight: '600',
  },
  activeSourceBtnText: {
    color: '#ffffff',
  },
  errorText: {
    color: '#ef4444',
    fontSize: 11,
    fontWeight: '600',
  },
  submitTrigger: {
    display: 'none', // triggered programmatically from FormLayout footer
  },
  submitTriggerText: {
    color: '#ffffff',
  },
});
