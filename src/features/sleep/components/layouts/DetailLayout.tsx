import React from 'react';
import { View, Text, ScrollView, StyleSheet, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { FullScreenLoader } from '@/shared/components/loading/FullScreenLoader';
import { ErrorStateCard } from '@/shared/components/feedback/ErrorStateCard';

export interface DetailLayoutProps {
  readonly title: string;
  readonly isLoading?: boolean;
  readonly error?: Error | null;
  readonly onRetry?: () => void;
  readonly headerRight?: React.ReactNode;
  readonly children: React.ReactNode;
}

export const DetailLayout: React.FC<DetailLayoutProps> = ({
  title,
  isLoading = false,
  error = null,
  onRetry,
  headerRight,
  children,
}) => {
  const router = useRouter();

  if (isLoading) {
    return <FullScreenLoader />;
  }

  return (
    <SafeAreaView style={styles.container} edges={['top', 'left', 'right']}>
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => router.back()}
          accessible={true}
          accessibilityRole="button"
          accessibilityLabel="Back"
          accessibilityHint="Goes back to previous screen"
          hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}
          style={styles.backButton}
        >
          <Text style={styles.backText}>←</Text>
        </TouchableOpacity>
        
        <Text style={styles.title} numberOfLines={1}>
          {title}
        </Text>

        <View style={styles.headerRight}>
          {headerRight || <View style={{ width: 32 }} />}
        </View>
      </View>

      {error ? (
        <View style={styles.errorContainer}>
          <ErrorStateCard
            title="Failed to Load Details"
            message={error.message || 'The sleep entry could not be retrieved.'}
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
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingTop: 12,
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#18181b', // zinc-800
  },
  backButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#18181b',
    alignItems: 'center',
    justifyContent: 'center',
  },
  backText: {
    color: '#f4f4f5',
    fontSize: 20,
    fontWeight: 'bold',
  },
  title: {
    flex: 1,
    textAlign: 'center',
    fontSize: 18,
    fontWeight: 'bold',
    color: '#fafafa',
    marginHorizontal: 8,
  },
  headerRight: {
    minWidth: 36,
    alignItems: 'flex-end',
    justifyContent: 'center',
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
