import React, { useState, useMemo, useCallback } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useSleepAnalytics } from '../hooks/useSleepAnalytics';
import { useSleepEntries } from '../hooks/useSleepEntries';
import { AnalyticsLayout } from '../components/layouts/AnalyticsLayout';
import { LineTrendChart } from '@/shared/components/charts/LineTrendChart';
import { MetricCard } from '@/shared/components/cards/MetricCard';

export const SleepRecoveryInsightsScreen: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'weekly' | 'monthly'>('weekly');
  const { getWeeklySummary, getMonthlySummary, isLoading: isAnalyticsLoading, isError: isAnalyticsError, error: analyticsError, refetch: refetchAnalytics } = useSleepAnalytics();
  const { entries, isLoading: isEntriesLoading, isError: isEntriesError, error: entriesError, refetch: refetchEntries } = useSleepEntries();

  const isLoading = isAnalyticsLoading || isEntriesLoading;
  const isError = isAnalyticsError || isEntriesError;
  const error = analyticsError || entriesError;

  const handleRefetch = useCallback(async () => {
    await Promise.all([refetchAnalytics(), refetchEntries()]);
  }, [refetchAnalytics, refetchEntries]);

  // Get date strings for weekly summary
  const range = useMemo(() => {
    const end = new Date();
    const start = new Date();
    start.setDate(end.getDate() - 6);

    const format = (d: Date) => d.toISOString().split('T')[0];
    return { start: format(start), end: format(end) };
  }, []);

  // Retrieve summaries
  const weeklySummary = useMemo(() => {
    return getWeeklySummary(range.start, range.end);
  }, [getWeeklySummary, range]);

  const monthlySummary = useMemo(() => {
    const today = new Date();
    return getMonthlySummary(today.getFullYear(), today.getMonth() + 1);
  }, [getMonthlySummary]);

  // Construct charts data
  const { durationPoints, qualityPoints, recoveryPoints } = useMemo(() => {
    // Sort entries chronologically for charts
    const sorted = [...entries].sort((a, b) => a.date.localeCompare(b.date));
    const limit = activeTab === 'weekly' ? 7 : 30;
    const recent = sorted.slice(-limit);

    const durationPoints = recent.map((e) => ({
      label: e.date.substring(5), // MM-DD format
      value: Math.round((e.durationMinutes / 60) * 10) / 10, // convert to hours
    }));

    const qualityPoints = recent.map((e) => ({
      label: e.date.substring(5),
      value: e.quality.rating,
    }));

    const recoveryPoints = recent
      .filter((e) => e.recoveryScore !== undefined)
      .map((e) => ({
        label: e.date.substring(5),
        value: e.recoveryScore!,
      }));

    return { durationPoints, qualityPoints, recoveryPoints };
  }, [entries, activeTab]);

  // Compute roll-up averages for dashboard tiles
  const stats = useMemo(() => {
    if (activeTab === 'weekly' && weeklySummary) {
      return {
        avgDuration: `${(weeklySummary.averageDurationMinutes / 60).toFixed(1)} hrs`,
        avgQuality: `${weeklySummary.averageQualityScore.toFixed(1)}/10`,
        avgRecovery: weeklySummary.averageRecoveryScore > 0 ? `${weeklySummary.averageRecoveryScore}%` : 'N/A',
        consistency: `${weeklySummary.consistencyScore}%`,
      };
    }
    if (activeTab === 'monthly' && monthlySummary) {
      return {
        avgDuration: `${(monthlySummary.averageDurationMinutes / 60).toFixed(1)} hrs`,
        avgQuality: `${monthlySummary.averageQualityScore.toFixed(1)}/10`,
        avgRecovery: monthlySummary.averageRecoveryScore > 0 ? `${monthlySummary.averageRecoveryScore}%` : 'N/A',
        consistency: `${monthlySummary.consistencyScore}%`,
      };
    }
    return {
      avgDuration: '0.0 hrs',
      avgQuality: '0.0/10',
      avgRecovery: 'N/A',
      consistency: '0%',
    };
  }, [weeklySummary, monthlySummary, activeTab]);

  return (
    <AnalyticsLayout
      title="Sleep Insights"
      activeTab={activeTab}
      onTabChange={setActiveTab}
      isLoading={isLoading}
      error={isError ? error : null}
      onRetry={handleRefetch}
    >
      {/* Average summary tiles */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Rolling Averages ({activeTab})</Text>
        <View style={styles.grid}>
          <MetricCard
            label="Avg Duration"
            value={stats.avgDuration}
            subLabel="Sleep time"
            icon="⏳"
            color="#818cf8"
          />
          <MetricCard
            label="Avg Quality"
            value={stats.avgQuality}
            subLabel="Perceived rating"
            icon="✨"
            color="#a78bfa"
          />
        </View>
        <View style={styles.grid}>
          <MetricCard
            label="Avg Recovery"
            value={stats.avgRecovery}
            subLabel="Biological charge"
            icon="🔋"
            color="#10b981"
          />
          <MetricCard
            label="Consistency"
            value={stats.consistency}
            subLabel="Schedule deviation"
            icon="🔄"
            color="#fb923c"
          />
        </View>
      </View>

      {/* Sleep Duration Trend Chart */}
      <View style={styles.chartContainer}>
        <LineTrendChart
          title="Sleep Duration (hours)"
          data={durationPoints}
          color="#6366f1"
          unit="h"
          height={140}
        />
      </View>

      {/* Sleep Quality Trend Chart */}
      <View style={styles.chartContainer}>
        <LineTrendChart
          title="Perceived Sleep Quality"
          data={qualityPoints}
          color="#a78bfa"
          unit=""
          height={140}
        />
      </View>

      {/* Recovery Score Trend Chart */}
      {recoveryPoints.length > 0 && (
        <View style={styles.chartContainer}>
          <LineTrendChart
            title="Recovery Score (%)"
            data={recoveryPoints}
            color="#10b981"
            unit="%"
            height={140}
          />
        </View>
      )}
    </AnalyticsLayout>
  );
};

const styles = StyleSheet.create({
  section: {
    gap: 12,
  },
  sectionTitle: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#a1a1aa',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  grid: {
    flexDirection: 'row',
    gap: 16,
  },
  chartContainer: {
    marginTop: 4,
  },
});
