/**
 * Dashboard Presentational Cards
 * SelfOS v1.5.0 — Batch 12B
 */

import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { CardContainer, ComponentVariant } from '../components/Components';

// =========================================================================
// 1. Overall Health Index Card
// =========================================================================

export const OverallHealthCard: React.FC<{
  readonly scoreLabel: string;
  readonly gradeLabel: string;
  readonly confidenceLabel: string;
  readonly variant?: ComponentVariant;
}> = ({ scoreLabel, gradeLabel, confidenceLabel, variant = 'default' }) => {
  return (
    <CardContainer variant={variant}>
      <Text style={styles.cardSubtitle}>Unified Health Score</Text>
      <View style={styles.scoreRow}>
        <Text style={styles.scoreText}>{scoreLabel}</Text>
        <View style={styles.badge}>
          <Text style={styles.badgeText}>{gradeLabel}</Text>
        </View>
      </View>
      {variant !== 'compact' && <Text style={styles.metaText}>{confidenceLabel}</Text>}
    </CardContainer>
  );
};

// =========================================================================
// 2. Prediction Summary Card
// =========================================================================

export const PredictionSummaryCard: React.FC<{
  readonly projectedValueLabel: string;
  readonly trajectoryLabel: string;
  readonly dateLabel: string;
  readonly variant?: ComponentVariant;
}> = ({ projectedValueLabel, trajectoryLabel, dateLabel, variant = 'default' }) => {
  return (
    <CardContainer variant={variant}>
      <Text style={styles.cardSubtitle}>AI Projections</Text>
      <Text style={styles.titleText}>{projectedValueLabel}</Text>
      <Text style={styles.metaText}>{trajectoryLabel}</Text>
      {variant === 'expanded' && <Text style={styles.subMetaText}>{dateLabel}</Text>}
    </CardContainer>
  );
};

// =========================================================================
// 3. Recommendation Summary Card
// =========================================================================

export const RecommendationSummaryCard: React.FC<{
  readonly description: string;
  readonly impact: string;
  readonly priority: string;
}> = ({ description, impact, priority }) => {
  return (
    <CardContainer variant="default">
      <View style={styles.row}>
        <Text style={styles.bodyText}>{description}</Text>
        <View style={[styles.priorityBadge, { backgroundColor: priority === 'HIGH' ? '#FF4D4D' : '#FFA500' }]}>
          <Text style={styles.priorityText}>{priority}</Text>
        </View>
      </View>
      <Text style={styles.metaText}>{impact}</Text>
    </CardContainer>
  );
};

const styles = StyleSheet.create({
  cardSubtitle: {
    color: '#8E8E9F',
    fontSize: 14,
    marginBottom: 4,
  },
  scoreRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  scoreText: {
    color: '#FFFFFF',
    fontSize: 32,
    fontWeight: 'bold',
    marginRight: 12,
  },
  titleText: {
    color: '#FFFFFF',
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  bodyText: {
    color: '#FFFFFF',
    fontSize: 15,
    flex: 1,
    paddingRight: 8,
  },
  metaText: {
    color: '#FF4081',
    fontSize: 13,
    fontWeight: '600',
  },
  subMetaText: {
    color: '#8E8E9F',
    fontSize: 12,
    marginTop: 4,
  },
  badge: {
    backgroundColor: '#FF4081',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 4,
  },
  badgeText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: 'bold',
  },
  priorityBadge: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 4,
    height: 20,
  },
  priorityText: {
    color: '#FFFFFF',
    fontSize: 10,
    fontWeight: 'bold',
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 6,
  },
});
