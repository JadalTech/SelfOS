/**
 * Layout Components for Insights Engine Presentation Layer
 * SelfOS v1.5.0 — Batch 12B
 */

import React from 'react';
import { View, ScrollView, StyleSheet, SafeAreaView } from 'react-native';

export const FeatureLayout: React.FC<{ readonly children: React.ReactNode }> = ({ children }) => {
  return <SafeAreaView style={styles.container}>{children}</SafeAreaView>;
};

export const ScrollableDashboard: React.FC<{ readonly children: React.ReactNode }> = ({ children }) => {
  return (
    <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
      {children}
    </ScrollView>
  );
};

export const SectionContainer: React.FC<{
  readonly children: React.ReactNode;
  readonly style?: any;
}> = ({ children, style }) => {
  return <View style={[styles.section, style]}>{children}</View>;
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0F0F1A',
  },
  scrollContent: {
    padding: 16,
    paddingBottom: 40,
  },
  section: {
    marginBottom: 20,
    backgroundColor: '#1E1E2F',
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: '#2A2A40',
  },
});
