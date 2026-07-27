import React from 'react';
import { View, Text, ScrollView, StyleSheet, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { FullScreenLoader } from '@/shared/components/loading/FullScreenLoader';
import { ErrorStateCard } from '@/shared/components/feedback/ErrorStateCard';

export interface AnalyticsLayoutProps {
  readonly title: string;
  readonly activeTab: 'weekly' | 'monthly';
  readonly onTabChange: (tab: 'weekly' | 'monthly') => void;
  readonly isLoading?: boolean;
  readonly error?: Error | null;
  readonly onRetry?: () => void;
  readonly children: React.ReactNode;
}

export const AnalyticsLayout: React.FC<AnalyticsLayoutProps> = ({
  title,
  activeTab,
  onTabChange,
  isLoading = false,
  error = null,
  onRetry,
  children,
}) => {
  if (isLoading) {
    return <FullScreenLoader />;
  }

  return (
    <SafeAreaView style={styles.container} edges={['top', 'left', 'right']}>
      <View style={styles.header}>
        <Text style={styles.title}>{title}</Text>
        <View style={styles.tabContainer} accessible={true} accessibilityRole="tablist">
          <TouchableOpacity
            style={[styles.tab, activeTab === 'weekly' && styles.activeTab]}
            onPress={() => onTabChange('weekly')}
            accessible={true}
            accessibilityRole="tab"
            accessibilityState={{ selected: activeTab === 'weekly' }}
            accessibilityLabel="Weekly analytics view"
            hitSlop={{ top: 8, bottom: 8, left: 12, right: 12 }}
          >
            <Text
              style={[styles.tabText, activeTab === 'weekly' && styles.activeTabText]}
            >
              Weekly
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.tab, activeTab === 'monthly' && styles.activeTab]}
            onPress={() => onTabChange('monthly')}
            accessible={true}
            accessibilityRole="tab"
            accessibilityState={{ selected: activeTab === 'monthly' }}
            accessibilityLabel="Monthly analytics view"
            hitSlop={{ top: 8, bottom: 8, left: 12, right: 12 }}
          >
            <Text
              style={[styles.tabText, activeTab === 'monthly' && styles.activeTabText]}
            >
              Monthly
            </Text>
          </TouchableOpacity>
        </View>
      </View>

      {error ? (
        <View style={styles.errorContainer}>
          <ErrorStateCard
            title="Failed to Load Trends"
            message={error.message || 'Something went wrong while compiling analytics trends.'}
            onRetry={onRetry}
          />
        </View>
      ) : (
        <ScrollView
          style={styles.scroll}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          {children}
        </ScrollView>
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#09090b',
  },
  header: {
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 16,
    gap: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#18181b',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fafafa',
    letterSpacing: -0.5,
  },
  tabContainer: {
    flexDirection: 'row',
    backgroundColor: '#18181b', // zinc-800
    borderRadius: 10,
    padding: 3,
  },
  tab: {
    flex: 1,
    paddingVertical: 8,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  activeTab: {
    backgroundColor: '#27272a', // zinc-700
  },
  tabText: {
    color: '#a1a1aa',
    fontSize: 13,
    fontWeight: '600',
  },
  activeTabText: {
    color: '#fafafa',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    padding: 24,
  },
  scroll: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 40,
    gap: 20,
  },
});
