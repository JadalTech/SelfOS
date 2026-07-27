import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useForm, Controller } from 'react-hook-form';
import type { SleepGoalVM } from '../types/viewmodel.types';

export interface SleepGoalFormValues {
  category: 'duration' | 'bedtime' | 'wake_time' | 'consistency' | 'recovery';
  targetValue: number;
  targetHour: number;
  targetMinute: number;
  targetAmPm: 'AM' | 'PM';
}

export interface SleepGoalFormProps {
  readonly initialValues?: SleepGoalVM | null;
  readonly onSubmit: (data: SleepGoalFormValues) => void;
  readonly isSubmitting?: boolean;
}

export const SleepGoalForm: React.FC<SleepGoalFormProps> = ({
  initialValues = null,
  onSubmit,
  isSubmitting = false,
}) => {
  const getInitialFormValues = (): SleepGoalFormValues => {
    if (initialValues) {
      const isTimeGoal = initialValues.category === 'bedtime' || initialValues.category === 'wake_time';
      let hour = 10;
      let minute = 0;
      let ampm: 'AM' | 'PM' = 'PM';

      if (isTimeGoal && initialValues.targetTime) {
        const parts = initialValues.targetTime.split(':');
        let parsedHour = parseInt(parts[0], 10);
        minute = parseInt(parts[1], 10);
        ampm = parsedHour >= 12 ? 'PM' : 'AM';
        parsedHour = parsedHour % 12;
        hour = parsedHour ? parsedHour : 12;
      }

      return {
        category: initialValues.category as any,
        targetValue: initialValues.targetValue,
        targetHour: hour,
        targetMinute: minute,
        targetAmPm: ampm,
      };
    }

    return {
      category: 'duration',
      targetValue: 480, // 8 hours in minutes
      targetHour: 11,
      targetMinute: 0,
      targetAmPm: 'PM',
    };
  };

  const { control, handleSubmit, watch, setValue } = useForm<SleepGoalFormValues>({
    defaultValues: getInitialFormValues(),
  });

  const selectedCategory = watch('category');

  // Adjust defaults when category changes
  const handleCategoryChange = (cat: any, onChange: any) => {
    onChange(cat);
    // Reset defaults based on category
    if (cat === 'duration') {
      setValue('targetValue', 480);
    } else if (cat === 'consistency') {
      setValue('targetValue', 85);
    } else if (cat === 'recovery') {
      setValue('targetValue', 80);
    } else if (cat === 'bedtime') {
      setValue('targetHour', 11);
      setValue('targetMinute', 0);
      setValue('targetAmPm', 'PM');
    } else if (cat === 'wake_time') {
      setValue('targetHour', 7);
      setValue('targetMinute', 0);
      setValue('targetAmPm', 'AM');
    }
  };

  return (
    <View style={styles.container}>
      {/* Category selector */}
      <View style={styles.formGroup}>
        <Text style={styles.label}>Goal Category</Text>
        <Controller
          control={control}
          name="category"
          render={({ field: { onChange, value } }) => (
            <View style={styles.catGrid}>
              {([
                { key: 'duration', label: 'Duration' },
                { key: 'consistency', label: 'Consistency' },
                { key: 'recovery', label: 'Recovery' },
                { key: 'bedtime', label: 'Bedtime' },
                { key: 'wake_time', label: 'Wake-Up' },
              ] as const).map((item) => (
                <TouchableOpacity
                  key={item.key}
                  style={[styles.catBtn, value === item.key && styles.activeCatBtn]}
                  onPress={() => handleCategoryChange(item.key, onChange)}
                >
                  <Text style={[styles.catBtnText, value === item.key && styles.activeCatBtnText]}>
                    {item.label}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          )}
        />
      </View>

      <View style={styles.divider} />

      {/* Target adjustments based on category */}
      {selectedCategory === 'duration' && (
        <View style={styles.formGroup}>
          <Text style={styles.label}>Target Sleep Duration</Text>
          <Controller
            control={control}
            name="targetValue"
            render={({ field: { onChange, value } }) => (
              <View style={styles.valSelectionGrid}>
                {[360, 420, 450, 480, 510, 540].map((mins) => (
                  <TouchableOpacity
                    key={mins}
                    style={[styles.valBtn, value === mins && styles.activeValBtn]}
                    onPress={() => onChange(mins)}
                  >
                    <Text style={[styles.valBtnText, value === mins && styles.activeValBtnText]}>
                      {(mins / 60).toFixed(1)} hrs
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            )}
          />
        </View>
      )}

      {selectedCategory === 'consistency' && (
        <View style={styles.formGroup}>
          <Text style={styles.label}>Target Schedule Consistency (%)</Text>
          <Controller
            control={control}
            name="targetValue"
            render={({ field: { onChange, value } }) => (
              <View style={styles.valSelectionGrid}>
                {[70, 75, 80, 85, 90, 95].map((pct) => (
                  <TouchableOpacity
                    key={pct}
                    style={[styles.valBtn, value === pct && styles.activeValBtn]}
                    onPress={() => onChange(pct)}
                  >
                    <Text style={[styles.valBtnText, value === pct && styles.activeValBtnText]}>
                      {pct}%
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            )}
          />
        </View>
      )}

      {selectedCategory === 'recovery' && (
        <View style={styles.formGroup}>
          <Text style={styles.label}>Target Daily Recovery Score</Text>
          <Controller
            control={control}
            name="targetValue"
            render={({ field: { onChange, value } }) => (
              <View style={styles.valSelectionGrid}>
                {[65, 70, 75, 80, 85, 90].map((score) => (
                  <TouchableOpacity
                    key={score}
                    style={[styles.valBtn, value === score && styles.activeValBtn]}
                    onPress={() => onChange(score)}
                  >
                    <Text style={[styles.valBtnText, value === score && styles.activeValBtnText]}>
                      {score}+
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            )}
          />
        </View>
      )}

      {(selectedCategory === 'bedtime' || selectedCategory === 'wake_time') && (
        <View style={styles.formGroup}>
          <Text style={styles.label}>Target Time</Text>
          <View style={styles.timePickerContainer}>
            <Controller
              control={control}
              name="targetHour"
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
              name="targetMinute"
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
              name="targetAmPm"
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
      )}

      <TouchableOpacity
        style={styles.submitTrigger}
        onPress={handleSubmit(onSubmit)}
        disabled={isSubmitting}
      >
        <Text>Save Goal</Text>
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
  label: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#a1a1aa',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  catGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  catBtn: {
    paddingVertical: 10,
    paddingHorizontal: 14,
    borderRadius: 10,
    backgroundColor: '#18181b',
    borderWidth: 1,
    borderColor: '#27272a',
  },
  activeCatBtn: {
    borderColor: '#6366f1',
    backgroundColor: '#312e81',
  },
  catBtnText: {
    color: '#a1a1aa',
    fontSize: 12,
    fontWeight: '600',
  },
  activeCatBtnText: {
    color: '#ffffff',
  },
  divider: {
    height: 1,
    backgroundColor: '#27272a',
    marginVertical: 8,
  },
  valSelectionGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  valBtn: {
    flex: 1,
    minWidth: '28%',
    paddingVertical: 12,
    borderRadius: 12,
    backgroundColor: '#18181b',
    borderWidth: 1,
    borderColor: '#27272a',
    alignItems: 'center',
  },
  activeValBtn: {
    borderColor: '#6366f1',
    backgroundColor: '#312e81',
  },
  valBtnText: {
    color: '#a1a1aa',
    fontSize: 13,
    fontWeight: 'bold',
  },
  activeValBtnText: {
    color: '#ffffff',
  },
  timePickerContainer: {
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
  submitTrigger: {
    display: 'none',
  },
});
