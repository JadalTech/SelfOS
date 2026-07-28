/**
 * Presentation Components for Calendar & Intelligent Scheduling
 * SelfOS v3.1.0 — Batch 14B
 */

import React from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import type { TimeBlock, ScheduleConflict, FocusSession } from '../../domain/calendar.types';

export const TimeBlockCard: React.FC<{ readonly block: TimeBlock }> = ({ block }) => {
  const startLabel = new Date(block.startTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  const endLabel = new Date(block.endTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

  return (
    <View style={styles.card}>
      <Text style={styles.timeText}>{startLabel} - {endLabel}</Text>
      <Text style={styles.titleText}>{block.title}</Text>
      <Text style={styles.typeText}>Type: {block.type}</Text>
    </View>
  );
};

export const ConflictAlertCard: React.FC<{ readonly conflict: ScheduleConflict }> = ({ conflict }) => {
  return (
    <View style={styles.alertCard}>
      <Text style={styles.alertHeader}>Schedule Conflict Alert</Text>
      <Text style={styles.alertText}>{conflict.reason}</Text>
    </View>
  );
};

export const FocusTimerWidget: React.FC<{
  readonly session?: FocusSession;
  readonly onStart?: () => void;
}> = ({ session, onStart }) => {
  return (
    <View style={styles.timerCard}>
      <Text style={styles.timerHeader}>Focus Pomodoro Session</Text>
      <Text style={styles.timerDigits}>
        {session ? `${session.completedMinutes} / ${session.durationMinutes} min` : '25:00'}
      </Text>
      <Pressable style={styles.btn} onPress={onStart}>
        <Text style={styles.btnText}>{session ? 'Session Active' : 'Start Focus Session'}</Text>
      </Pressable>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#1E1E2F',
    borderRadius: 12,
    padding: 12,
    marginVertical: 4,
    borderLeftWidth: 4,
    borderLeftColor: '#FF4081',
  },
  timeText: {
    color: '#FF4081',
    fontWeight: 'bold',
    fontSize: 12,
  },
  titleText: {
    color: '#FFFFFF',
    fontSize: 15,
    marginVertical: 2,
  },
  typeText: {
    color: '#8E8E9F',
    fontSize: 12,
  },
  alertCard: {
    backgroundColor: '#2D1B28',
    borderRadius: 10,
    padding: 12,
    marginVertical: 4,
    borderWidth: 1,
    borderColor: '#FF4081',
  },
  alertHeader: {
    color: '#FF4081',
    fontWeight: 'bold',
    fontSize: 13,
  },
  alertText: {
    color: '#FFFFFF',
    fontSize: 13,
    marginTop: 2,
  },
  timerCard: {
    backgroundColor: '#1E1E2F',
    borderRadius: 16,
    padding: 16,
    alignItems: 'center',
    marginVertical: 8,
    borderWidth: 1,
    borderColor: '#3F51B5',
  },
  timerHeader: {
    color: '#8E8E9F',
    fontSize: 13,
  },
  timerDigits: {
    color: '#FFFFFF',
    fontSize: 32,
    fontWeight: 'bold',
    marginVertical: 8,
  },
  btn: {
    backgroundColor: '#FF4081',
    borderRadius: 20,
    paddingVertical: 10,
    paddingHorizontal: 20,
  },
  btnText: {
    color: '#FFFFFF',
    fontWeight: 'bold',
    fontSize: 14,
  },
});
