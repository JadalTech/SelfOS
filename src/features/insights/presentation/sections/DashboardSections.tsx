/**
 * Dashboard Composable Section Components
 * SelfOS v1.5.0 — Batch 12B
 */

import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { SectionHeader } from '../components/Components';
import {
  OverallHealthCard,
  PredictionSummaryCard,
  RecommendationSummaryCard,
} from '../cards/Cards';
import { ModuleComparisonChart, WeeklyProgressChart } from '../charts/Charts';
import { ChartDataMapper } from '../mappers/ChartDataMapper';
import type { PipelineOutput } from '../../pipeline/InsightPipeline';

// =========================================================================
// 1. Overall Health Score Section
// =========================================================================

export const HealthScoreSection: React.FC<{
  readonly data: PipelineOutput | null;
  readonly onDetailsPress?: () => void;
}> = ({ data, onDetailsPress }) => {
  if (!data) return null;
  return (
    <View style={styles.section}>
      <SectionHeader title="Health Index Overview" onActionPress={onDetailsPress} actionLabel="Details" />
      <OverallHealthCard
        scoreLabel={`${data.score.overallScore}/10`}
        gradeLabel={`Grade ${data.score.grade}`}
        confidenceLabel={`${Math.round(data.score.confidence * 100)}% Data Confidence`}
      />
      <ModuleComparisonChart data={ChartDataMapper.toModuleComparison(data)} />
    </View>
  );
};

// =========================================================================
// 2. Active Recommendations Section
// =========================================================================

export const RecommendationsSection: React.FC<{
  readonly data: PipelineOutput | null;
  readonly onDetailsPress?: () => void;
}> = ({ data, onDetailsPress }) => {
  if (!data || data.recommendations.length === 0) return null;
  return (
    <View style={styles.section}>
      <SectionHeader title="Action Recommendations" onActionPress={onDetailsPress} />
      {data.recommendations.slice(0, 2).map((rec) => (
        <RecommendationSummaryCard
          key={rec.id}
          description={rec.description}
          impact={rec.expectedImpact}
          priority={rec.priority}
        />
      ))}
    </View>
  );
};

// =========================================================================
// 3. Projections & Predictions Section
// =========================================================================

export const PredictionsSection: React.FC<{
  readonly data: PipelineOutput | null;
  readonly onDetailsPress?: () => void;
}> = ({ data, onDetailsPress }) => {
  if (!data || !data.prediction) return null;
  const pred = data.prediction;
  return (
    <View style={styles.section}>
      <SectionHeader title="Predictions & Momentum" onActionPress={onDetailsPress} />
      <PredictionSummaryCard
        projectedValueLabel={`Forecast: ${pred.projectedValue} Score`}
        trajectoryLabel={`Wellness Trajectory: ${pred.wellnessTrajectory.toUpperCase()}`}
        dateLabel={`Target calculation: ${pred.targetDate}`}
        variant="default"
      />
      <WeeklyProgressChart data={ChartDataMapper.toWeeklyProgress(data)} />
    </View>
  );
};

const styles = StyleSheet.create({
  section: {
    marginBottom: 24,
  },
});
