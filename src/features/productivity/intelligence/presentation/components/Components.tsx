/**
 * Presentation Components for Intelligence & Executive Dashboard
 * SelfOS v3.3.0 — Batch 14D
 */

import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import type { ExecutiveSummary, Forecast, WeeklyReview } from '../../domain/intelligence.types';

export const LifeScoreGauge: React.FC<{ readonly score: number }> = ({ score }) => {
  return (
    <View style={styles.gaugeContainer}>
      <Text style={styles.gaugeTitle}>Executive Life Score</Text>
      <Text style={styles.gaugeScore}>{score}</Text>
      <Text style={styles.gaugeSub}>/ 100 Optimal Platform Health</Text>
    </View>
  );
};

export const ExecutiveSummaryCard: React.FC<{ readonly summary: ExecutiveSummary }> = ({ summary }) => {
  return (
    <View style={styles.card}>
      <Text style={styles.cardHeader}>Executive Operating Summary</Text>
      <Text style={styles.cardText}>{summary.weeklyReviewSummary}</Text>
      <Text style={styles.metaText}>Forecast: {summary.forecastSummary}</Text>
    </View>
  );
};

export const ForecastWidget: React.FC<{ readonly forecast: Forecast }> = ({ forecast }) => {
  return (
    <View style={styles.widgetCard}>
      <Text style={styles.widgetTitle}>{forecast.title}</Text>
      <Text style={styles.widgetValue}>{forecast.predictedValue} Days</Text>
      <Text style={styles.metaText}>Confidence: {forecast.confidence.score}% | Risk: {forecast.burnoutRisk}</Text>
    </View>
  );
};

export const ReviewSummaryCard: React.FC<{ readonly review: WeeklyReview }> = ({ review }) => {
  return (
    <View style={styles.card}>
      <Text style={styles.cardHeader}>{review.title}</Text>
      <Text style={styles.cardText}>{review.description}</Text>
      <Text style={styles.metaText}>Achievements: {review.achievements.length}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  gaugeContainer: {
    backgroundColor: '#1E1E2F',
    borderRadius: 16,
    padding: 20,
    alignItems: 'center',
    marginVertical: 8,
    borderWidth: 2,
    borderColor: '#FF4081',
  },
  gaugeTitle: {
    color: '#8E8E9F',
    fontSize: 13,
    fontWeight: 'bold',
  },
  gaugeScore: {
    color: '#FFFFFF',
    fontSize: 48,
    fontWeight: 'bold',
    marginVertical: 4,
  },
  gaugeSub: {
    color: '#FF4081',
    fontSize: 12,
  },
  card: {
    backgroundColor: '#1E1E2F',
    borderRadius: 12,
    padding: 14,
    marginVertical: 4,
    borderWidth: 1,
    borderColor: '#2A2A40',
  },
  cardHeader: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  cardText: {
    color: '#CCCCCC',
    fontSize: 13,
    marginBottom: 6,
  },
  metaText: {
    color: '#8E8E9F',
    fontSize: 12,
  },
  widgetCard: {
    backgroundColor: '#1E1E2F',
    borderRadius: 12,
    padding: 14,
    marginVertical: 6,
    borderWidth: 1,
    borderColor: '#3F51B5',
  },
  widgetTitle: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: 'bold',
  },
  widgetValue: {
    color: '#FF4081',
    fontSize: 24,
    fontWeight: 'bold',
    marginVertical: 4,
  },
});
