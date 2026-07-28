/**
 * Assistant Layout Container Component
 * SelfOS v2.0.0 — Batch 13B
 */

import React from 'react';
import { SafeAreaView, StyleSheet, View } from 'react-native';

export const AssistantLayout: React.FC<{ readonly children: React.ReactNode }> = ({ children }) => {
  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>{children}</View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#0F0F1A',
  },
  container: {
    flex: 1,
    paddingHorizontal: 16,
  },
});
export default AssistantLayout;
