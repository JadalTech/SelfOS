import { useState, useMemo } from 'react';
import { useHydrationHistory, useHydrationMutations } from '../../hooks/useHydration';
import { HydrationEntryMapper } from '../../mappers/hydration.mapper';
import type { DrinkType } from '../../types/hydration.types';

export function useHydrationHistoryViewModel() {
  const { history, isLoading, refetch } = useHydrationHistory(90);
  const { deleteEntry } = useHydrationMutations();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDrinkType, setSelectedDrinkType] = useState<DrinkType | 'all'>('all');
  const [filterPeriod, setFilterPeriod] = useState<'all' | '7days' | '30days'>('all');

  const filteredEntries = useMemo(() => {
    let result = [...history];

    // Filter by period
    if (filterPeriod !== 'all') {
      const cutoff = new Date();
      cutoff.setDate(cutoff.getDate() - (filterPeriod === '7days' ? 7 : 30));
      const cutoffStr = cutoff.toISOString().split('T')[0];
      result = result.filter((e) => e.date >= cutoffStr);
    }

    // Filter by type
    if (selectedDrinkType !== 'all') {
      result = result.filter((e) => e.drinkType === selectedDrinkType);
    }

    // Search query (notes, amount, source)
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      result = result.filter((e) => {
        return (
          (e.notes && e.notes.toLowerCase().includes(query)) ||
          e.amountML.toString().includes(query) ||
          e.source.toLowerCase().includes(query)
        );
      });
    }

    // Sort descending by timestamp
    return result.sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime());
  }, [history, searchQuery, selectedDrinkType, filterPeriod]);

  const formattedHistory = useMemo(() => {
    return HydrationEntryMapper.toVMList(filteredEntries);
  }, [filteredEntries]);

  return {
    history: formattedHistory,
    isLoading,
    searchQuery,
    setSearchQuery,
    selectedDrinkType,
    setSelectedDrinkType,
    filterPeriod,
    setFilterPeriod,
    refresh: refetch,
    deleteEntry,
  };
}
