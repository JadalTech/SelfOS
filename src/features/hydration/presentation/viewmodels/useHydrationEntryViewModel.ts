import { useMemo } from 'react';
import { useHydrationMutations, useHydrationToday } from '../../hooks/useHydration';
import { HydrationEntryMapper } from '../../mappers/hydration.mapper';
import type { DrinkType, DrinkTemperature, HydrationSource } from '../../types/hydration.types';

export function useHydrationEntryViewModel(entryId?: string) {
  const { entries, isLoading, refresh } = useHydrationToday();
  const { createEntry, updateEntry, deleteEntry } = useHydrationMutations();

  const selectedEntry = useMemo(() => {
    if (!entryId) return null;
    const entry = entries.find((e) => e.id === entryId);
    return entry ? HydrationEntryMapper.toVM(entry) : null;
  }, [entries, entryId]);

  const handleSave = async (data: {
    amountML: number;
    drinkType: DrinkType;
    temperature: DrinkTemperature;
    source: HydrationSource;
    notes?: string;
    date: string;
    time: string;
  }) => {
    const timestamp = new Date(`${data.date}T${data.time}:00`);
    if (entryId) {
      await updateEntry({
        entryId,
        updates: { ...data, timestamp },
      });
    } else {
      await createEntry({
        ...data,
        timestamp,
      });
    }
    refresh();
  };

  const handleDelete = async () => {
    if (entryId) {
      await deleteEntry(entryId);
      refresh();
    }
  };

  return {
    entry: selectedEntry,
    isLoading,
    saveEntry: handleSave,
    deleteEntry: handleDelete,
  };
}
