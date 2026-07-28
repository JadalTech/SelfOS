/**
 * Dedicated Screen Components for Insights Engine
 * SelfOS v1.5.0 — Batch 12B
 */

import React from 'react';
import { View, Text, StyleSheet, FlatList, Pressable } from 'react-native';
import { useRouter } from 'expo-router';
import { FeatureLayout, ScrollableDashboard } from '../layouts/Layouts';
import { LoadingState, EmptyState, SectionHeader } from '../components/Components';
import { useInsightsDashboardContext } from '../contexts/InsightsDashboardContext';
import {
  HealthScoreSection,
  RecommendationsSection,
  PredictionsSection,
} from '../sections/DashboardSections';
import {
  useInsightsDashboardViewModel,
  useHealthScoreViewModel,
  useTrendViewModel,
  useCorrelationViewModel,
  useHabitViewModel,
  useRecommendationViewModel,
  usePredictionViewModel,
} from '../viewmodels/useInsightsDashboardViewModel';

// =========================================================================
// 1. Insights Dashboard Screen
// =========================================================================

export const InsightsDashboardScreen: React.FC = () => {
  const router = useRouter();
  const { data, loading, error } = useInsightsDashboardContext();

  if (loading) return <LoadingState />;
  if (!data) return <EmptyState type="NoData" />;

  return (
    <FeatureLayout>
      <ScrollableDashboard>
        <Text style={styles.screenTitle}>Unified Health Insights</Text>
        
        <HealthScoreSection
          data={data}
          onDetailsPress={() => router.push('/insights/health-score')}
        />

        <RecommendationsSection
          data={data}
          onDetailsPress={() => router.push('/insights/recommendations')}
        />

        <PredictionsSection
          data={data}
          onDetailsPress={() => router.push('/insights/predictions')}
        />

        {/* Quick Navigation Panel */}
        <View style={styles.quickNav}>
          <Pressable style={styles.navBtn} onPress={() => router.push('/insights/correlations')}>
            <Text style={styles.navBtnText}>Correlations</Text>
          </Pressable>
          <Pressable style={styles.navBtn} onPress={() => router.push('/insights/trends')}>
            <Text style={styles.navBtnText}>Trends</Text>
          </Pressable>
          <Pressable style={styles.navBtn} onPress={() => router.push('/insights/habits')}>
            <Text style={styles.navBtnText}>Habit Patterns</Text>
          </Pressable>
        </View>
      </ScrollableDashboard>
    </FeatureLayout>
  );
};

// =========================================================================
// 2. Health Score Screen
// =========================================================================

export const HealthScoreScreen: React.FC = () => {
  const { score, breakdown, loading } = useHealthScoreViewModel();
  if (loading) return <LoadingState />;
  if (!score || !breakdown) return <EmptyState type="NoData" />;

  return (
    <FeatureLayout>
      <ScrollableDashboard>
        <Text style={styles.screenTitle}>Score Breakdown</Text>
        <Text style={styles.scoreText}>{score.overallScoreLabel} ({score.gradeLabel})</Text>
        
        <View style={styles.list}>
          <Text style={styles.itemText}>Nutrition: {score.nutritionLabel} (Weight: {breakdown.nutrition.weight})</Text>
          <Text style={styles.itemText}>Workout: {score.workoutLabel} (Weight: {breakdown.workout.weight})</Text>
          <Text style={styles.itemText}>Sleep: {score.sleepLabel} (Weight: {breakdown.sleep.weight})</Text>
          <Text style={styles.itemText}>Hydration: {score.hydrationLabel} (Weight: {breakdown.hydration.weight})</Text>
        </View>
      </ScrollableDashboard>
    </FeatureLayout>
  );
};

// =========================================================================
// 3. Trends Screen
// =========================================================================

export const TrendsScreen: React.FC = () => {
  const { trends, loading } = useTrendViewModel();
  if (loading) return <LoadingState />;

  return (
    <FeatureLayout>
      <FlatList
        data={trends}
        keyExtractor={(item) => item.metricName}
        renderItem={({ item }) => (
          <View style={styles.card}>
            <Text style={styles.titleText}>{item.metricName}</Text>
            <Text style={styles.valueText}>Direction: {item.directionLabel} ({item.changeLabel})</Text>
            <Text style={styles.subText}>{item.baselineLabel}</Text>
          </View>
        )}
        ListHeaderComponent={<Text style={[styles.screenTitle, { margin: 16 }]}>Trend Analysis</Text>}
      />
    </FeatureLayout>
  );
};

// =========================================================================
// 4. Correlations Screen
// =========================================================================

export const CorrelationsScreen: React.FC = () => {
  const { correlations, loading } = useCorrelationViewModel();
  if (loading) return <LoadingState />;

  return (
    <FeatureLayout>
      <FlatList
        data={correlations}
        keyExtractor={(item) => item.title}
        renderItem={({ item }) => (
          <View style={styles.card}>
            <Text style={styles.titleText}>{item.title}</Text>
            <Text style={styles.valueText}>Strength: {item.strengthPercent} ({item.confidenceLabel})</Text>
            <Text style={styles.subText}>{item.explanation}</Text>
          </View>
        )}
        ListHeaderComponent={<Text style={[styles.screenTitle, { margin: 16 }]}>Cross-module Correlations</Text>}
      />
    </FeatureLayout>
  );
};

// =========================================================================
// 5. Habits Screen
// =========================================================================

export const HabitScreen: React.FC = () => {
  const { habits, loading } = useHabitViewModel();
  if (loading) return <LoadingState />;

  return (
    <FeatureLayout>
      <FlatList
        data={habits}
        keyExtractor={(item) => item.name}
        renderItem={({ item }) => (
          <View style={styles.card}>
            <Text style={styles.titleText}>{item.name}</Text>
            <Text style={styles.valueText}>Consistency: {item.consistencyLabel}</Text>
            <Text style={styles.subText}>{item.pattern}</Text>
          </View>
        )}
        ListHeaderComponent={<Text style={[styles.screenTitle, { margin: 16 }]}>Habit Patterns</Text>}
      />
    </FeatureLayout>
  );
};

// =========================================================================
// 6. Recommendations Screen
// =========================================================================

export const RecommendationsScreen: React.FC = () => {
  const { recommendations, loading } = useRecommendationViewModel();
  if (loading) return <LoadingState />;

  return (
    <FeatureLayout>
      <FlatList
        data={recommendations}
        keyExtractor={(item, index) => index.toString()}
        renderItem={({ item }) => (
          <View style={styles.card}>
            <Text style={styles.titleText}>{item.description}</Text>
            <Text style={styles.valueText}>{item.impact}</Text>
            <Text style={styles.subText}>{item.sourceLabel}</Text>
          </View>
        )}
        ListHeaderComponent={<Text style={[styles.screenTitle, { margin: 16 }]}>Recommendations</Text>}
      />
    </FeatureLayout>
  );
};

// =========================================================================
// 7. Predictions Screen
// =========================================================================

export const PredictionsScreen: React.FC = () => {
  const { prediction, loading } = usePredictionViewModel();
  if (loading) return <LoadingState />;
  if (!prediction) return <EmptyState type="NoPredictions" />;

  return (
    <FeatureLayout>
      <ScrollableDashboard>
        <Text style={styles.screenTitle}>Predictions & Projections</Text>
        <View style={styles.card}>
          <Text style={styles.titleText}>{prediction.type}</Text>
          <Text style={styles.valueText}>{prediction.projectedValueLabel}</Text>
          <Text style={styles.subText}>{prediction.trajectoryLabel}</Text>
          <Text style={styles.subText}>{prediction.dateLabel}</Text>
        </View>
      </ScrollableDashboard>
    </FeatureLayout>
  );
};

// =========================================================================
// 8. Reports Screen
// =========================================================================

export const ReportsScreen: React.FC = () => {
  return (
    <FeatureLayout>
      <ScrollableDashboard>
        <Text style={styles.screenTitle}>Unified Reports</Text>
        <EmptyState type="NoData" message="Weekly & Monthly reports generation ready." />
      </ScrollableDashboard>
    </FeatureLayout>
  );
};

// =========================================================================
// 9. Timeline Screen
// =========================================================================

export const TimelineScreen: React.FC = () => {
  return (
    <FeatureLayout>
      <ScrollableDashboard>
        <Text style={styles.screenTitle}>Insight Timeline</Text>
        <EmptyState type="NoInsights" message="Historical timelines compile automatically." />
      </ScrollableDashboard>
    </FeatureLayout>
  );
};

// =========================================================================
// 10. Settings Screen
// =========================================================================

export const SettingsScreen: React.FC = () => {
  return (
    <FeatureLayout>
      <ScrollableDashboard>
        <Text style={styles.screenTitle}>Insights Settings</Text>
        <View style={styles.card}>
          <Text style={styles.titleText}>Preferences</Text>
          <Text style={styles.subText}>Toggle cross-module calculations and threshold levels.</Text>
        </View>
      </ScrollableDashboard>
    </FeatureLayout>
  );
};

const styles = StyleSheet.create({
  screenTitle: {
    color: '#FFFFFF',
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 16,
    fontFamily: 'System',
  },
  scoreText: {
    color: '#FF4081',
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  card: {
    backgroundColor: '#1E1E2F',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#2A2A40',
    padding: 16,
    marginBottom: 12,
    marginHorizontal: 16,
  },
  titleText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  valueText: {
    color: '#FF4081',
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 4,
  },
  subText: {
    color: '#8E8E9F',
    fontSize: 12,
  },
  list: {
    marginTop: 10,
  },
  itemText: {
    color: '#FFFFFF',
    fontSize: 16,
    marginBottom: 12,
    backgroundColor: '#1E1E2F',
    padding: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#2A2A40',
  },
  quickNav: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 20,
  },
  navBtn: {
    flex: 1,
    backgroundColor: '#3F51B5',
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
    marginHorizontal: 4,
  },
  navBtnText: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: 'bold',
  },
});
