import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useAuthStore } from '../../../shared/stores/auth.store';
import { skinReminderRepository, CreateSkinReminderInput } from '../repository/skinReminder.repository';
import { skincareKeys } from './queryKeys';
import type { SkinReminder } from '../types';

export function useSkinReminders() {
  const queryClient = useQueryClient();
  const userId = useAuthStore((s) => s.user?.uid);

  const query = useQuery({
    queryKey: skincareKeys.reminders(),
    queryFn: async () => {
      if (!userId) return [];
      const res = await skinReminderRepository.fetchReminders(userId);
      if (!res.success) throw res.error;
      return res.data;
    },
    enabled: !!userId,
  });

  const createMutation = useMutation({
    mutationFn: async (input: CreateSkinReminderInput) => {
      if (!userId) throw new Error('User is not authenticated');
      const res = await skinReminderRepository.createReminder(userId, input);
      if (!res.success) throw res.error;
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: skincareKeys.reminders() });
    },
  });

  const updateMutation = useMutation({
    mutationFn: async ({ reminderId, updates }: { reminderId: string; updates: Partial<SkinReminder> }) => {
      if (!userId) throw new Error('User is not authenticated');
      const res = await skinReminderRepository.updateReminder(userId, reminderId, updates);
      if (!res.success) throw res.error;
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: skincareKeys.reminders() });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (reminderId: string) => {
      if (!userId) throw new Error('User is not authenticated');
      const res = await skinReminderRepository.deleteReminder(userId, reminderId);
      if (!res.success) throw res.error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: skincareKeys.reminders() });
    },
  });

  return {
    reminders: query.data || [],
    isLoading: query.isLoading,
    isError: query.isError,
    error: query.error,
    refetch: query.refetch,
    createReminder: createMutation.mutateAsync,
    isCreating: createMutation.isPending,
    updateReminder: updateMutation.mutateAsync,
    isUpdating: updateMutation.isPending,
    deleteReminder: deleteMutation.mutateAsync,
    isDeleting: deleteMutation.isPending,
  };
}
