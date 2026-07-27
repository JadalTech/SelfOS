import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useAuthStore } from '../../../shared/stores';
import { sleepRepository } from '../repository/sleep.repository';
import type { SleepEntry } from '../types/sleep.types';
import { sleepKeys } from './queryKeys';

export function useSleepEntries() {
  const queryClient = useQueryClient();
  const user = useAuthStore((state) => state.user);
  const userId = user?.uid;

  const entriesQuery = useQuery<SleepEntry[], Error>({
    queryKey: sleepKeys.entries(),
    queryFn: async () => {
      if (!userId) return [];
      const res = await sleepRepository.fetchEntries(userId);
      if (!res.success) throw res.error;
      return res.data;
    },
    enabled: Boolean(userId),
    staleTime: 5 * 60 * 1000,
    gcTime: 15 * 60 * 1000,
  });

  const saveEntryMutation = useMutation({
    mutationFn: async (input: Omit<SleepEntry, 'id' | 'userId' | 'createdAt' | 'updatedAt'> & { id?: string }) => {
      if (!userId) throw new Error('User not authenticated');
      const res = await sleepRepository.saveEntry(userId, input);
      if (!res.success) throw res.error;
      return res.data;
    },
    onMutate: async (newEntryInput) => {
      await queryClient.cancelQueries({ queryKey: sleepKeys.entries() });
      const previousEntries = queryClient.getQueryData<SleepEntry[]>(sleepKeys.entries());

      if (previousEntries) {
        const tempEntry: SleepEntry = {
          ...newEntryInput,
          id: newEntryInput.id || newEntryInput.date || `temp_${Date.now()}`,
          userId: userId || '',
          createdAt: new Date(),
          updatedAt: new Date(),
        } as SleepEntry;
        queryClient.setQueryData<SleepEntry[]>(
          sleepKeys.entries(),
          [tempEntry, ...previousEntries.filter((e) => e.date !== tempEntry.date)]
        );
      }

      return { previousEntries };
    },
    onError: (_err, _newEntry, context) => {
      if (context?.previousEntries) {
        queryClient.setQueryData(sleepKeys.entries(), context.previousEntries);
      }
    },
    onSuccess: () => {
      // Invalidate all sleep queries to ensure sync
      queryClient.invalidateQueries({ queryKey: sleepKeys.all });
    },
  });

  const deleteEntryMutation = useMutation({
    mutationFn: async (entryId: string) => {
      if (!userId) throw new Error('User not authenticated');
      const res = await sleepRepository.deleteEntry(userId, entryId);
      if (!res.success) throw res.error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: sleepKeys.all });
    },
  });

  return {
    entries: entriesQuery.data ?? [],
    isLoading: entriesQuery.isLoading,
    isRefetching: entriesQuery.isRefetching,
    isError: entriesQuery.isError,
    error: entriesQuery.error,
    refetch: entriesQuery.refetch,
    saveEntry: saveEntryMutation.mutateAsync,
    isSaving: saveEntryMutation.isPending,
    deleteEntry: deleteEntryMutation.mutateAsync,
    isDeleting: deleteEntryMutation.isPending,
  };
}
