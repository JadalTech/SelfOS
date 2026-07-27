import React from 'react';
import { ScrollView, View, Text, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { FullScreenLoader } from '@/shared/components/loading/FullScreenLoader';
import { ErrorStateCard } from '@/shared/components/feedback/ErrorStateCard';

export interface DashboardLayoutProps {
  readonly title: string;
  readonly subtitle?: string;
  readonly isLoading?: boolean;
  readonly error?: Error | null;
  readonly onRetry?: () => void;
  readonly headerRight?: React.ReactNode;
  readonly children: React.ReactNode;
}

export const DashboardLayout: React.FC<DashboardLayoutProps> = ({
  title,
  subtitle,
  isLoading = false,
  error = null,
  onRetry,
  headerRight,
  children,
}) => {
  if (isLoading) {
    return <FullScreenLoader />;
  }

  return (
    <SafeAreaView style={styles.container} edges={['top', 'left', 'right']}>
      <View style={styles.header}>
        <View style={styles.headerTitleContainer}>
          <Text style={styles.title}>{title}</Text>
          {subtitle ? <Text style={styles.subtitle}>{subtitle}</Text> : null}
        </View>
        {headerRight ? <View style={styles.headerRight}>{headerRight}</View> : null}
      </View>

      {error ? (
        <View style={styles.errorContainer}>
          <ErrorStateCard
            title="Failed to Load Dashboard"
            message={error.message || 'Something went wrong while retrieving your sleep data.'}
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
    backgroundColor: '#09090b', // zinc-950
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 12,
  },
  headerTitleContainer: {
    flex: 1,
    gap: 2,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#fafafa', // zinc-50
    letterSpacing: -0.5,
  },
  subtitle: {
    fontSize: 13,
    color: '#a1a1aa', // zinc-400
    fontWeight: '500',
  },
  headerRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
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
    paddingBottom: 36,
    gap: 24,
  },
});
