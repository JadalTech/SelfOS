/**
 * Calendar Screen Components
 * SelfOS v3.1.0 — Batch 14B
 */

import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { FocusTimerWidget } from '../components/Components';
import { useFocusSessionViewModel } from '../viewmodels/ViewModels';

export const CalendarDashboardScreen: React.FC = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.header}>Calendar & Timeline</Text>
      <Text style={styles.empty}>Today's timeline generated dynamically.</Text>
    </View>
  );
};

export const FocusDashboardScreen: React.FC = () => {
  const { session, startFocus } = useFocusSessionViewModel();

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Focus Sessions & Pomodoro</Text>
      <FocusTimerWidget session={session} onStart={startFocus} />
    </View>
  );
};

export const AvailabilityDashboardScreen: React.FC = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.header}>Availability & Working Hours</Text>
      <Text style={styles.empty}>Current Profile: Work (09:00 - 17:00)</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0F0F1A',
    padding: 16,
  },
  header: {
    color: '#FFFFFF',
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  empty: {
    color: '#8E8E9F',
    fontSize: 14,
    marginTop: 24,
    textAlign: 'center',
  },
});
