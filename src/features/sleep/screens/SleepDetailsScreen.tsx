import React, { useMemo, useCallback } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { useSleepEntries } from '../hooks/useSleepEntries';
import { useSleepSchedule } from '../hooks/useSleepSchedule';
import { DetailLayout } from '../components/layouts/DetailLayout';
import { mapToSleepEntryVM } from '../mappers/sleep.mapper';
import * as SleepEngine from '../engine/sleepEngine';
import { MetricCard } from '@/shared/components/cards/MetricCard';
import { ProgressCard } from '@/shared/components/cards/ProgressCard';

export interface SleepDetailsScreenProps {
  readonly entryId: string;
}

export const SleepDetailsScreen: React.FC<SleepDetailsScreenProps> = ({ entryId }) => {
  const router = useRouter();

  // Load hooks
  const { entries, isLoading: isEntriesLoading, deleteEntry, isDeleting } = useSleepEntries();
  const { activeSchedule, isLoading: isScheduleLoading } = useSleepSchedule();

  const isLoading = isEntriesLoading || isScheduleLoading;

  // Resolve target entry & compute custom VM
  const entry = useMemo(() => {
    return entries.find((e) => e.id === entryId) || null;
  }, [entries, entryId]);

  const viewModel = useMemo(() => {
    if (!entry) return null;
    return mapToSleepEntryVM(entry);
  }, [entry]);

  // Determine schedule deviations
  const deviations = useMemo(() => {
    if (!entry || !activeSchedule) return null;
    const { targetBedtime, targetWakeTime } = SleepEngine.getTargetBedtimeAndWakeTime(entry.date, activeSchedule);
    const actualBedtimeStr = SleepEngine.getTimeStringFromDate(entry.bedtime);
    const actualWakeTimeStr = SleepEngine.getTimeStringFromDate(entry.wakeTime);

    const bedDiff = SleepEngine.calculateTimeDifferenceMinutes(actualBedtimeStr, targetBedtime);
    const wakeDiff = SleepEngine.calculateTimeDifferenceMinutes(actualWakeTimeStr, targetWakeTime);

    const formatDeviation = (diff: number) => {
      if (diff === 0) return 'On Time';
      if (diff > 0) return `${diff}m deviation`;
      return `${Math.abs(diff)}m early`;
    };

    return {
      bedtimeDeviation: formatDeviation(bedDiff),
      wakeTimeDeviation: formatDeviation(wakeDiff),
      targetBedtime,
      targetWakeTime,
    };
  }, [entry, activeSchedule]);

  // Edit / Delete actions
  const handleEditPress = useCallback(() => {
    router.push(`/sleep/log?id=${entryId}`);
  }, [router, entryId]);

  const handleDeletePress = useCallback(() => {
    Alert.alert(
      'Delete Sleep Entry',
      'Are you sure you want to remove this sleep log? This action cannot be undone.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            try {
              await deleteEntry(entryId);
              router.back();
            } catch {
              Alert.alert('Error', 'Failed to delete sleep entry.');
            }
          },
        },
      ]
    );
  }, [deleteEntry, entryId, router]);

  if (!isLoading && !viewModel) {
    return (
      <DetailLayout title="Sleep Details" isLoading={false}>
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>Sleep log entry not found.</Text>
        </View>
      </DetailLayout>
    );
  }

  // Calculate local recovery mapping
  const recoveryScore = viewModel?.recoveryScore ?? 0;
  let statusColor = '#fbbf24';
  let statusLabel = 'Fair';
  if (recoveryScore >= 90) {
    statusColor = '#10b981';
    statusLabel = 'Optimal';
  } else if (recoveryScore >= 70) {
    statusColor = '#34d399';
    statusLabel = 'Good';
  } else if (recoveryScore < 50) {
    statusColor = '#f87171';
    statusLabel = 'Poor';
  }

  return (
    <DetailLayout
      title={viewModel?.formattedDate ?? 'Sleep Details'}
      isLoading={isLoading || isDeleting}
      headerRight={
        <TouchableOpacity
          onPress={handleEditPress}
          accessible={true}
          accessibilityRole="button"
          accessibilityLabel="Edit Sleep Entry"
          hitSlop={{ top: 8, bottom: 8, left: 12, right: 12 }}
        >
          <Text style={styles.editText}>Edit</Text>
        </TouchableOpacity>
      }
    >
      {/* Prominent Recovery Summary */}
      {recoveryScore > 0 && (
        <ProgressCard
          title="Recovery Rating"
          value={`${recoveryScore}%`}
          progress={recoveryScore / 100}
          type="circular"
          activeColor={statusColor}
          subLabel={`${statusLabel} Biological Recovery`}
        />
      )}

      {/* Main Sleep Times Section */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Sleep Times</Text>
        <View style={styles.grid}>
          <MetricCard
            label="Bedtime"
            value={viewModel?.bedtimeFormatted ?? 'N/A'}
            subLabel={deviations ? `Target: ${deviations.targetBedtime} (${deviations.bedtimeDeviation})` : 'No target'}
            icon="🌙"
            color="#818cf8"
          />
          <MetricCard
            label="Wake-up Time"
            value={viewModel?.wakeTimeFormatted ?? 'N/A'}
            subLabel={deviations ? `Target: ${deviations.targetWakeTime} (${deviations.wakeTimeDeviation})` : 'No target'}
            icon="☀️"
            color="#fbbf24"
          />
        </View>
      </View>

      {/* Sleep Architecture Metrics */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Sleep Stats</Text>
        <View style={styles.grid}>
          <MetricCard
            label="Total Duration"
            value={viewModel?.durationLabel ?? '0h 0m'}
            subLabel="Time in bed"
            icon="⏳"
            color="#818cf8"
          />
          <MetricCard
            label="Efficiency"
            value={viewModel?.sleepEfficiencyLabel ?? 'N/A'}
            subLabel={viewModel?.awakeDurationLabel ? `${viewModel.awakeDurationLabel} awake` : 'No awake stats'}
            icon="📈"
            color="#34d399"
          />
        </View>
        <View style={styles.grid}>
          <MetricCard
            label="Sleep Latency"
            value={viewModel?.sleepLatencyLabel ?? 'N/A'}
            subLabel="Time to fall asleep"
            icon="⏱️"
            color="#a78bfa"
          />
          <MetricCard
            label="Source"
            value={viewModel?.sleepSource.toUpperCase() ?? 'MANUAL'}
            subLabel={viewModel?.timezone ? `Timezone: ${viewModel.timezone}` : 'Local Time'}
            icon="📱"
            color="#a1a1aa"
          />
        </View>
      </View>

      {/* Notes / Journal Section */}
      {viewModel?.notes && (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Sleep Journal / Notes</Text>
          <View style={styles.notesContainer}>
            <Text style={styles.notesText}>{viewModel.notes}</Text>
          </View>
        </View>
      )}

      {/* Tags */}
      {viewModel?.tags && viewModel.tags.length > 0 && (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Tags</Text>
          <View style={styles.tagGrid}>
            {viewModel.tags.map((tag) => (
              <View key={tag} style={styles.tagChip}>
                <Text style={styles.tagText}>#{tag}</Text>
              </View>
            ))}
          </View>
        </View>
      )}

      {/* Dangerous Action Button (Delete) */}
      <TouchableOpacity
        style={styles.deleteBtn}
        onPress={handleDeletePress}
        accessible={true}
        accessibilityRole="button"
        accessibilityLabel="Delete Sleep Entry"
        accessibilityHint="Permanently removes this sleep log"
        hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
      >
        <Text style={styles.deleteBtnText}>Delete Sleep Entry</Text>
      </TouchableOpacity>
    </DetailLayout>
  );
};

const styles = StyleSheet.create({
  editText: {
    color: '#6366f1',
    fontSize: 14,
    fontWeight: 'bold',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 60,
  },
  errorText: {
    color: '#ef4444',
    fontSize: 14,
    fontWeight: 'bold',
  },
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
  notesContainer: {
    backgroundColor: '#18181b',
    borderWidth: 1,
    borderColor: '#27272a',
    padding: 16,
    borderRadius: 16,
  },
  notesText: {
    color: '#f4f4f5',
    fontSize: 13,
    lineHeight: 20,
    fontWeight: '500',
  },
  tagGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  tagChip: {
    backgroundColor: '#312e81',
    borderWidth: 1,
    borderColor: '#4338ca',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 10,
  },
  tagText: {
    color: '#c7d2fe',
    fontSize: 11,
    fontWeight: '700',
  },
  deleteBtn: {
    marginTop: 12,
    height: 50,
    backgroundColor: 'rgba(244, 63, 94, 0.1)',
    borderWidth: 1,
    borderColor: 'rgba(244, 63, 94, 0.3)',
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  deleteBtnText: {
    color: '#f43f5e',
    fontSize: 14,
    fontWeight: 'bold',
  },
});
