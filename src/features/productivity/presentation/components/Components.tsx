/**
 * Reusable Productivity Presentation Components
 * SelfOS v3.0.0 — Batch 14A
 */

import React from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import type { Goal, Task, Project, PlannedTimeSlot } from '../../domain/productivity.types';

export const GoalCard: React.FC<{ readonly goal: Goal }> = ({ goal }) => {
  return (
    <View style={styles.card}>
      <Text style={styles.cardTitle}>{goal.title}</Text>
      <Text style={styles.cardSub}>Category: {goal.category} | Status: {goal.status}</Text>
      <Text style={styles.progressText}>Progress: {goal.progressPercentage}%</Text>
    </View>
  );
};

export const TaskItem: React.FC<{
  readonly task: Task;
  readonly onToggle?: () => void;
}> = ({ task, onToggle }) => {
  return (
    <Pressable style={styles.taskRow} onPress={onToggle}>
      <View style={[styles.checkbox, task.status === 'completed' && styles.checkboxChecked]} />
      <View style={styles.taskInfo}>
        <Text style={[styles.taskTitle, task.status === 'completed' && styles.taskCompleted]}>
          {task.title}
        </Text>
        <Text style={styles.taskMeta}>
          Priority: {task.priority} | Est: {task.estimatedMinutes}m
        </Text>
      </View>
    </Pressable>
  );
};

export const ProjectProgressCard: React.FC<{ readonly project: Project }> = ({ project }) => {
  return (
    <View style={styles.card}>
      <Text style={styles.cardTitle}>{project.title}</Text>
      <Text style={styles.cardSub}>Target: {new Date(project.targetEndDate).toLocaleDateString()}</Text>
      <Text style={styles.progressText}>Progress: {project.progressPercentage}%</Text>
    </View>
  );
};

export const DailyPlanTimeline: React.FC<{ readonly slots: readonly PlannedTimeSlot[] }> = ({ slots }) => {
  return (
    <View style={styles.timelineContainer}>
      {slots.map((slot) => (
        <View key={slot.slotId} style={styles.slotRow}>
          <Text style={styles.timeLabel}>{slot.timeLabel}</Text>
          <View style={styles.slotBox}>
            <Text style={styles.slotTitle}>{slot.activityTitle}</Text>
            <Text style={styles.slotType}>Type: {slot.type}</Text>
          </View>
        </View>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#1E1E2F',
    borderRadius: 12,
    padding: 14,
    marginVertical: 6,
    borderWidth: 1,
    borderColor: '#2A2A40',
  },
  cardTitle: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  cardSub: {
    color: '#8E8E9F',
    fontSize: 13,
  },
  progressText: {
    color: '#FF4081',
    fontWeight: 'bold',
    marginTop: 6,
  },
  taskRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#1E1E2F',
    padding: 12,
    borderRadius: 10,
    marginVertical: 4,
    borderWidth: 1,
    borderColor: '#2A2A40',
  },
  checkbox: {
    width: 20,
    height: 20,
    borderRadius: 4,
    borderWidth: 2,
    borderColor: '#FF4081',
    marginRight: 12,
  },
  checkboxChecked: {
    backgroundColor: '#FF4081',
  },
  taskInfo: {
    flex: 1,
  },
  taskTitle: {
    color: '#FFFFFF',
    fontSize: 15,
  },
  taskCompleted: {
    textDecorationLine: 'line-through',
    color: '#8E8E9F',
  },
  taskMeta: {
    color: '#8E8E9F',
    fontSize: 12,
    marginTop: 2,
  },
  timelineContainer: {
    marginVertical: 8,
  },
  slotRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 6,
  },
  timeLabel: {
    color: '#FF4081',
    fontWeight: 'bold',
    width: 100,
    fontSize: 13,
  },
  slotBox: {
    flex: 1,
    backgroundColor: '#1E1E2F',
    borderRadius: 8,
    padding: 10,
    borderWidth: 1,
    borderColor: '#2A2A40',
  },
  slotTitle: {
    color: '#FFFFFF',
    fontSize: 14,
  },
  slotType: {
    color: '#8E8E9F',
    fontSize: 11,
    marginTop: 2,
  },
});
