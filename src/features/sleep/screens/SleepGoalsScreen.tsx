import React, { useMemo } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useSleepGoals } from '../hooks/useSleepGoals';
import { DetailLayout } from '../components/layouts/DetailLayout';
import { SleepGoalForm, SleepGoalFormValues } from '../components/SleepGoalForm';
import { mapToSleepGoalVM } from '../mappers/sleep.mapper';

export const SleepGoalsScreen: React.FC = () => {
  const { goals, saveGoal, toggleGoalActive, isSaving, isToggling, isLoading, refetch } = useSleepGoals();

  const goalVMs = useMemo(() => {
    return goals.map((g) => mapToSleepGoalVM(g));
  }, [goals]);

  const handleSubmit = async (values: SleepGoalFormValues) => {
    let targetValue = values.targetValue;
    let targetTime: string | undefined;

    if (values.category === 'bedtime' || values.category === 'wake_time') {
      let hr24 = values.targetHour % 12;
      if (values.targetAmPm === 'PM') hr24 += 12;
      targetTime = `${hr24.toString().padStart(2, '0')}:${values.targetMinute.toString().padStart(2, '0')}`;
      targetValue = 60; // 60 minutes max deviation as a default goal constraint
    }

    const payload = {
      category: values.category,
      targetValue,
      targetTime,
      isActive: true,
    };

    try {
      await saveGoal(payload as any);
    } catch {
      // Handled by query mutation error
    }
  };

  const handleToggleActive = async (goalId: string, currentActive: boolean) => {
    try {
      await toggleGoalActive({ goalId, isActive: !currentActive });
    } catch {
      // Handled by query mutation error
    }
  };

  return (
    <DetailLayout
      title="Sleep Goals"
      isLoading={isLoading || isToggling}
      onRetry={refetch}
    >
      {/* Create New Goal Section */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Create Sleep Goal</Text>
        <View style={styles.formCard}>
          <SleepGoalForm
            onSubmit={handleSubmit}
            isSubmitting={isSaving}
          />
        </View>
      </View>

      {/* Existing Goals List */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Your Sleep Goals</Text>
        {goalVMs.length === 0 ? (
          <View style={styles.emptyCard}>
            <Text style={styles.emptyText}>No goals defined yet. Select a category above to create one.</Text>
          </View>
        ) : (
          <View style={styles.goalsList}>
            {goalVMs.map((goal) => {
              return (
                <View key={goal.id} style={styles.goalItem}>
                  <View style={styles.goalInfo}>
                    <Text style={styles.goalCategory}>{goal.categoryLabel}</Text>
                    <Text style={styles.goalTarget}>{goal.targetValueLabel}</Text>
                  </View>

                  <TouchableOpacity
                    style={[
                      styles.toggleBtn,
                      goal.isActive ? styles.activeToggle : styles.inactiveToggle,
                    ]}
                    onPress={() => handleToggleActive(goal.id, goal.isActive)}
                    accessible={true}
                    accessibilityRole="button"
                    accessibilityLabel={`${goal.isActive ? 'Deactivate' : 'Activate'} ${goal.categoryLabel} goal`}
                    accessibilityHint={`Toggles this sleep goal ${goal.isActive ? 'off' : 'on'}`}
                    hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
                  >
                    <Text style={[
                      styles.toggleBtnText,
                      goal.isActive ? styles.activeToggleText : styles.inactiveToggleText,
                    ]}>
                      {goal.isActive ? 'Active' : 'Inactive'}
                    </Text>
                  </TouchableOpacity>
                </View>
              );
            })}
          </View>
        )}
      </View>
    </DetailLayout>
  );
};

const styles = StyleSheet.create({
  section: {
    gap: 12,
  },
  sectionTitle: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#a1a1aa',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  formCard: {
    backgroundColor: '#18181b',
    borderWidth: 1,
    borderColor: '#27272a',
    borderRadius: 16,
    padding: 16,
  },
  emptyCard: {
    backgroundColor: '#18181b',
    borderWidth: 1,
    borderColor: '#27272a',
    borderRadius: 16,
    padding: 24,
    alignItems: 'center',
  },
  emptyText: {
    color: '#71717a',
    fontSize: 12,
    textAlign: 'center',
    lineHeight: 18,
  },
  goalsList: {
    gap: 12,
  },
  goalItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#18181b',
    borderWidth: 1,
    borderColor: '#27272a',
    padding: 16,
    borderRadius: 16,
  },
  goalInfo: {
    flex: 1,
    gap: 4,
  },
  goalCategory: {
    color: '#fafafa',
    fontSize: 14,
    fontWeight: 'bold',
  },
  goalTarget: {
    color: '#818cf8',
    fontSize: 12,
    fontWeight: '600',
  },
  toggleBtn: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 10,
    borderWidth: 1,
  },
  activeToggle: {
    backgroundColor: '#312e81',
    borderColor: '#4338ca',
  },
  inactiveToggle: {
    backgroundColor: '#27272a',
    borderColor: '#3f3f46',
  },
  toggleBtnText: {
    fontSize: 12,
    fontWeight: '700',
  },
  activeToggleText: {
    color: '#c7d2fe',
  },
  inactiveToggleText: {
    color: '#71717a',
  },
});
