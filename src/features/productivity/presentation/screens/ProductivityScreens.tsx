/**
 * Productivity Screen Components
 * SelfOS v3.0.0 — Batch 14A
 */

import React from 'react';
import { View, Text, StyleSheet, FlatList } from 'react-native';
import { GoalCard, TaskItem } from '../components/Components';
import { useGoalsViewModel, useTasksViewModel } from '../viewmodels/ViewModels';

export const GoalsDashboardScreen: React.FC = () => {
  const { goals } = useGoalsViewModel();

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Goals Overview</Text>
      {goals.length === 0 ? (
        <Text style={styles.empty}>No active goals recorded.</Text>
      ) : (
        <FlatList data={goals} keyExtractor={(g) => g.id} renderItem={({ item }) => <GoalCard goal={item} />} />
      )}
    </View>
  );
};

export const TasksDashboardScreen: React.FC = () => {
  const { tasks } = useTasksViewModel();

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Tasks & Checklists</Text>
      {tasks.length === 0 ? (
        <Text style={styles.empty}>No pending tasks.</Text>
      ) : (
        <FlatList data={tasks} keyExtractor={(t) => t.id} renderItem={({ item }) => <TaskItem task={item} />} />
      )}
    </View>
  );
};

export const ProjectsDashboardScreen: React.FC = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.header}>Projects & Milestones</Text>
      <Text style={styles.empty}>No active projects.</Text>
    </View>
  );
};

export const DailyPlannerDashboardScreen: React.FC = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.header}>Daily Planner & Workload</Text>
      <Text style={styles.empty}>Daily plan generated dynamically.</Text>
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
