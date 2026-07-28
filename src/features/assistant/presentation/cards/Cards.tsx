/**
 * Rich Response Cards for AI Assistant UI
 * SelfOS v2.0.0 — Batch 13B
 */

import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

// =========================================================================
// 1. Health Score Card
// =========================================================================

export const HealthScoreCard: React.FC<{
  readonly score: number;
  readonly grade: string;
}> = ({ score, grade }) => {
  return (
    <View style={styles.card}>
      <Text style={styles.cardHeader}>Unified Health Index</Text>
      <Text style={styles.scoreText}>{score}/10 ({grade})</Text>
    </View>
  );
};

// =========================================================================
// 2. Recommendation Card
// =========================================================================

export const RecommendationCard: React.FC<{
  readonly title: string;
  readonly description: string;
}> = ({ title, description }) => {
  return (
    <View style={styles.card}>
      <Text style={styles.cardHeader}>Recommendation: {title}</Text>
      <Text style={styles.cardBody}>{description}</Text>
    </View>
  );
};

// =========================================================================
// 3. Goal Plan Card
// =========================================================================

export const GoalPlanCard: React.FC<{
  readonly goalTitle: string;
  readonly targetDate: string;
}> = ({ goalTitle, targetDate }) => {
  return (
    <View style={styles.card}>
      <Text style={styles.cardHeader}>Goal Target: {goalTitle}</Text>
      <Text style={styles.cardBody}>Completion Date: {targetDate}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#1E1E2F',
    borderRadius: 12,
    padding: 12,
    marginVertical: 6,
    borderWidth: 1,
    borderColor: '#2A2A40',
  },
  cardHeader: {
    color: '#FF4081',
    fontWeight: 'bold',
    fontSize: 14,
    marginBottom: 4,
  },
  scoreText: {
    color: '#FFFFFF',
    fontSize: 22,
    fontWeight: 'bold',
  },
  cardBody: {
    color: '#FFFFFF',
    fontSize: 14,
  },
});
