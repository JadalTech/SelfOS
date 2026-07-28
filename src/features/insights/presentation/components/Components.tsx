/**
 * Reusable Components and Visual Variants for Insights
 * SelfOS v1.5.0 — Batch 12B
 */

import React from 'react';
import { View, Text, StyleSheet, ActivityIndicator, Pressable } from 'react-native';

export type ComponentVariant = 'compact' | 'default' | 'expanded' | 'dashboard' | 'fullscreen';

// =========================================================================
// 1. Unified Section Header
// =========================================================================

export const SectionHeader: React.FC<{
  readonly title: string;
  readonly onActionPress?: () => void;
  readonly actionLabel?: string;
}> = ({ title, onActionPress, actionLabel = 'See All' }) => {
  return (
    <View style={styles.headerRow}>
      <Text style={styles.headerTitle}>{title}</Text>
      {onActionPress && (
        <Pressable
          onPress={onActionPress}
          accessibilityRole="button"
          accessibilityLabel={actionLabel}
          style={styles.actionButton}
        >
          <Text style={styles.actionText}>{actionLabel}</Text>
        </Pressable>
      )}
    </View>
  );
};

// =========================================================================
// 2. Generic Card Container with Variant Controls
// =========================================================================

export const CardContainer: React.FC<{
  readonly children: React.ReactNode;
  readonly variant?: ComponentVariant;
}> = ({ children, variant = 'default' }) => {
  const padding = variant === 'compact' ? 8 : variant === 'expanded' ? 20 : 16;
  return <View style={[styles.card, { padding }]}>{children}</View>;
};

// =========================================================================
// 3. Loading State with virtual skeletons
// =========================================================================

export const LoadingState: React.FC = () => {
  return (
    <View style={styles.center} accessibilityLabel="Loading insights">
      <ActivityIndicator size="large" color="#FF4081" />
      <Text style={styles.subText}>Compiling Unified Health Intelligence...</Text>
    </View>
  );
};

// =========================================================================
// 4. Skeleton Card for lazy views
// =========================================================================

export const SkeletonCard: React.FC = () => {
  return (
    <View style={styles.skeleton}>
      <View style={styles.skeletonLine} />
      <View style={[styles.skeletonLine, { width: '60%' }]} />
    </View>
  );
};

// =========================================================================
// 5. Offline Notification Banner
// =========================================================================

export const OfflineState: React.FC<{ readonly onRetry?: () => void }> = ({ onRetry }) => {
  return (
    <View style={styles.center} accessibilityLabel="Offline mode active">
      <Text style={styles.title}>You are Offline</Text>
      <Text style={styles.subText}>Displaying cached intelligence report.</Text>
      {onRetry && (
        <Pressable style={styles.btn} onPress={onRetry} accessibilityRole="button">
          <Text style={styles.btnText}>Retry Connection</Text>
        </Pressable>
      )}
    </View>
  );
};

// =========================================================================
// 6. Multi-Variant Empty State
// =========================================================================

export type EmptyStateVariant =
  | 'NoData'
  | 'NoInsights'
  | 'NoRecommendations'
  | 'NoPredictions'
  | 'Offline'
  | 'PartialAnalytics';

export const EmptyState: React.FC<{
  readonly type?: EmptyStateVariant;
  readonly message?: string;
}> = ({ type = 'NoData', message }) => {
  const defaultMessages: Record<EmptyStateVariant, string> = {
    NoData: 'No health entries registered yet.',
    NoInsights: 'Check back later for dynamic cross-module recommendations.',
    NoRecommendations: 'All wellness indicators are operating within targets.',
    NoPredictions: 'Insufficient streak log data to forecast projections.',
    Offline: 'Unable to connect to server. Retrying background caches.',
    PartialAnalytics: 'Some features are still missing data logs. Calculation rebalanced.',
  };

  return (
    <View style={styles.center} accessibilityLabel={message || defaultMessages[type]}>
      <Text style={styles.subText}>{message || defaultMessages[type]}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#1E1E2F',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#2A2A40',
    marginBottom: 12,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  headerTitle: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: 'bold',
    fontFamily: 'System',
  },
  actionButton: {
    paddingVertical: 4,
    paddingHorizontal: 8,
  },
  actionText: {
    color: '#FF4081',
    fontSize: 14,
    fontWeight: '600',
  },
  center: {
    padding: 30,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  subText: {
    color: '#8E8E9F',
    fontSize: 14,
    textAlign: 'center',
  },
  btn: {
    marginTop: 12,
    backgroundColor: '#FF4081',
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 8,
  },
  btnText: {
    color: '#FFFFFF',
    fontWeight: '600',
  },
  skeleton: {
    backgroundColor: '#1E1E2F',
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
    height: 80,
    justifyContent: 'center',
  },
  skeletonLine: {
    backgroundColor: '#2A2A40',
    height: 12,
    borderRadius: 6,
    marginBottom: 8,
    width: '90%',
  },
});
