import React, { useState, useMemo, useCallback } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { useSleepEntries } from '../hooks/useSleepEntries';
import { DetailLayout } from '../components/layouts/DetailLayout';
import { mapToSleepEntryVM } from '../mappers/sleep.mapper';
import { SummaryCard } from '@/shared/components/cards/SummaryCard';
import { EmptyStateCard } from '@/shared/components/feedback/EmptyStateCard';

export const SleepHistoryScreen: React.FC = () => {
  const router = useRouter();
  const { entries, isLoading, isError, error, refetch } = useSleepEntries();
  const [activeFilter, setActiveFilter] = useState<'all' | 'manual' | 'wearable' | 'imported'>('all');

  const filteredEntries = useMemo(() => {
    const mapped = entries.map(mapToSleepEntryVM);
    if (activeFilter === 'all') return mapped;
    return mapped.filter((e) => e.sleepSource === activeFilter);
  }, [entries, activeFilter]);

  const handleEntryPress = useCallback((id: string) => {
    router.push(`/sleep/${id}`);
  }, [router]);

  const handleLogPress = useCallback(() => {
    router.push('/sleep/log');
  }, [router]);

  const renderItem = useCallback(({ item }: { item: any }) => {
    const metrics = [
      { label: 'Duration', value: item.durationLabel, color: '#818cf8' },
      { label: 'Quality', value: `${item.qualityRating}/10`, color: '#a78bfa' },
      {
        label: 'Recovery',
        value: item.recoveryLabel ?? 'N/A',
        progress: item.recoveryScore ? item.recoveryScore / 100 : undefined,
        color: item.statusColor,
      },
    ];

    const footerText = `${item.bedtimeFormatted} - ${item.wakeTimeFormatted} • ${item.sleepSource.toUpperCase()}${
      item.notes ? ` • "${item.notes.substring(0, 40)}${item.notes.length > 40 ? '...' : ''}"` : ''
    }`;

    return (
      <TouchableOpacity
        onPress={() => handleEntryPress(item.id)}
        activeOpacity={0.8}
        accessible={true}
        accessibilityRole="button"
        accessibilityLabel={`Sleep log for ${item.formattedDate}. Duration: ${item.durationLabel}. Tap to view details.`}
        style={styles.cardWrapper}
      >
        <SummaryCard
          title={item.formattedDate}
          metrics={metrics}
          footerText={footerText}
        />
      </TouchableOpacity>
    );
  }, [handleEntryPress]);

  return (
    <DetailLayout
      title="Sleep History"
      isLoading={isLoading}
      error={isError ? error : null}
      onRetry={refetch}
      headerRight={
        <TouchableOpacity
          onPress={handleLogPress}
          accessible={true}
          accessibilityRole="button"
          accessibilityLabel="Add New Sleep Entry"
          hitSlop={{ top: 8, bottom: 8, left: 12, right: 12 }}
        >
          <Text style={styles.addText}>+ Log</Text>
        </TouchableOpacity>
      }
    >
      {/* Filter Chip Bar */}
      <View style={styles.filterBar} accessible={true} accessibilityRole="tablist">
        {(['all', 'manual', 'wearable', 'imported'] as const).map((filter) => (
          <TouchableOpacity
            key={filter}
            style={[styles.filterChip, activeFilter === filter && styles.activeChip]}
            onPress={() => setActiveFilter(filter)}
            accessible={true}
            accessibilityRole="tab"
            accessibilityState={{ selected: activeFilter === filter }}
            hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
          >
            <Text style={[styles.chipText, activeFilter === filter && styles.activeChipText]}>
              {filter.toUpperCase()}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Sleep Entries List */}
      {filteredEntries.length === 0 ? (
        <View style={styles.emptyContainer}>
          <EmptyStateCard
            icon="📅"
            title="No Sleep Logs"
            description={
              activeFilter === 'all'
                ? "You haven't recorded any sleep entries yet."
                : `No sleep entries logged via ${activeFilter} source.`
            }
            actionLabel={activeFilter === 'all' ? 'Log First Night' : undefined}
            onAction={activeFilter === 'all' ? handleLogPress : undefined}
            accentColor="#6366f1"
          />
        </View>
      ) : (
        <FlatList
          data={filteredEntries}
          keyExtractor={(item) => item.id}
          renderItem={renderItem}
          contentContainerStyle={styles.listContent}
          initialNumToRender={10}
          maxToRenderPerBatch={10}
          windowSize={5}
          scrollEnabled={false} // nested inside DetailLayout scroll view
        />
      )}
    </DetailLayout>
  );
};

const styles = StyleSheet.create({
  addText: {
    color: '#6366f1',
    fontSize: 14,
    fontWeight: 'bold',
  },
  filterBar: {
    flexDirection: 'row',
    backgroundColor: '#18181b',
    borderRadius: 12,
    padding: 4,
    gap: 4,
  },
  filterChip: {
    flex: 1,
    paddingVertical: 8,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  activeChip: {
    backgroundColor: '#27272a',
  },
  chipText: {
    color: '#a1a1aa',
    fontSize: 10,
    fontWeight: '700',
    letterSpacing: 0.5,
  },
  activeChipText: {
    color: '#fafafa',
  },
  emptyContainer: {
    paddingVertical: 40,
  },
  listContent: {
    gap: 16,
  },
  cardWrapper: {
    marginBottom: 4,
  },
});
