import React from 'react';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { useHydrationEntryViewModel } from '../viewmodels/useHydrationEntryViewModel';
import { FeatureLayout } from '../layouts/FeatureLayout';
import { HydrationEntryForm } from '../forms/HydrationEntryForm';
import { LoadingState } from '../components';

export interface HydrationEntryFormScreenProps {
  readonly mode: 'new' | 'edit';
}

export const HydrationEntryFormScreen: React.FC<HydrationEntryFormScreenProps> = React.memo(function HydrationEntryFormScreen({
  mode,
}) {
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id?: string }>();
  const { entry, saveEntry, isLoading } = useHydrationEntryViewModel(id);

  if (isLoading && mode === 'edit') return <LoadingState />;

  const handleSave = async (data: any) => {
    await saveEntry(data);
    router.back();
  };

  return (
    <FeatureLayout title={mode === 'new' ? 'Log Drink' : 'Edit Drink'} showBackButton={true}>
      <HydrationEntryForm
        initialValues={entry ? {
          amountML: entry.amountML,
          drinkType: entry.drinkType,
          temperature: entry.temperature,
          notes: entry.notes,
          date: entry.date,
          time: entry.time,
        } : undefined}
        onSave={handleSave}
      />
    </FeatureLayout>
  );
});
export default HydrationEntryFormScreen;
