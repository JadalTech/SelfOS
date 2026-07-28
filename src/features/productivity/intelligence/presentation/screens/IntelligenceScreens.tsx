/**
 * Intelligence Screen Components
 * SelfOS v3.3.0 — Batch 14D
 */

import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { LifeScoreGauge, ExecutiveSummaryCard } from '../components/Components';
import { useExecutiveDashboardViewModel } from '../viewmodels/ViewModels';

export const ExecutiveDashboardScreen: React.FC = () => {
  const { summary } = useExecutiveDashboardViewModel();

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Executive Operating Platform</Text>
      {summary ? (
        <>
          <LifeScoreGauge score={summary.lifeScore} />
          <ExecutiveSummaryCard summary={summary} />
        </>
      ) : (
        <Text style={styles.empty}>Loading executive summary...</Text>
      )}
    </View>
  );
};

export const ReviewsDashboardScreen: React.FC = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.header}>Periodic Reviews & Reports</Text>
      <Text style={styles.empty}>Weekly, Monthly & Quarterly Reviews.</Text>
    </View>
  );
};

export const ForecastDashboardScreen: React.FC = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.header}>Forecasting & Growth Projections</Text>
      <Text style={styles.empty}>AI Forecasts and Trajectory Predictions.</Text>
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
