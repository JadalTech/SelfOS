/**
 * React Query Hooks for Hydration Module
 * SelfOS v1.4.0 — Batch 11A
 */

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useAuthStore } from '../../../shared/stores/auth.store';
import { hydrationRepository } from '../repository/hydration.repository';
import { hydrationKeys } from './queryKeys';
import { HYDRATION_DEFAULT_TARGET_ML } from '../constants/hydration.constants';
import {
  generateDaySummary,
  calculateStreak,
} from '../engine/hydrationEngine';
import { buildDailySummaries } from '../analytics/hydrationAnalytics';
import type {
  HydrationEntry,
  HydrationGoal,
} from '../types/hydration.types';

// ---------------------------------------------------------------------------
// Today's Entries
// ---------------------------------------------------------------------------

function getTodayDateStr(): string {
  return new Date().toISOString().split('T')[0];
}

export function useHydrationToday() {
  const queryClient = useQueryClient();
  const userId = useAuthStore((s) => s.user?.uid);
  const todayStr = getTodayDateStr();

  const entriesQuery = useQuery({
    queryKey: hydrationKeys.today(),
    queryFn: async () => {
      if (!userId) return [];
      const res = await hydrationRepository.getEntriesForDate(userId, todayStr);
      if (!res.success) throw res.error;
      return res.data;
    },
    enabled: !!userId,
    staleTime: 30 * 1000, // 30 seconds — hydration data changes frequently
    gcTime: 5 * 60 * 1000,
  });

  const goalQuery = useQuery({
    queryKey: hydrationKeys.goal(),
    queryFn: async () => {
      if (!userId) return null;
      const res = await hydrationRepository.getGoal(userId);
      if (!res.success) throw res.error;
      return res.data;
    },
    enabled: !!userId,
    staleTime: 5 * 60 * 1000,
    gcTime: 15 * 60 * 1000,
  });

  const entries = entriesQuery.data ?? [];
  const goal = goalQuery.data;
  const goalML = goal?.dailyTargetML ?? HYDRATION_DEFAULT_TARGET_ML;

  // Build summaries for streak calculation
  const summary = generateDaySummary(todayStr, entries, goalML, 0);

  return {
    entries,
    goal,
    summary,
    isLoading: entriesQuery.isLoading || goalQuery.isLoading,
    isError: entriesQuery.isError || goalQuery.isError,
    error: entriesQuery.error || goalQuery.error,
    refresh: () => {
      queryClient.invalidateQueries({ queryKey: hydrationKeys.today() });
      queryClient.invalidateQueries({ queryKey: hydrationKeys.goal() });
    },
  };
}

// ---------------------------------------------------------------------------
// History (date range)
// ---------------------------------------------------------------------------

export function useHydrationHistory(days = 30) {
  const userId = useAuthStore((s) => s.user?.uid);

  const query = useQuery({
    queryKey: hydrationKeys.history(days),
    queryFn: async () => {
      if (!userId) return [];
      const endDate = new Date().toISOString().split('T')[0];
      const start = new Date();
      start.setDate(start.getDate() - days);
      const startDate = start.toISOString().split('T')[0];
      const res = await hydrationRepository.getEntriesForRange(
        userId,
        startDate,
        endDate
      );
      if (!res.success) throw res.error;
      return res.data;
    },
    enabled: !!userId,
    staleTime: 5 * 60 * 1000,
    gcTime: 15 * 60 * 1000,
  });

  return {
    history: query.data ?? [],
    isLoading: query.isLoading,
    isError: query.isError,
    error: query.error,
    refetch: query.refetch,
  };
}

// ---------------------------------------------------------------------------
// Goal
// ---------------------------------------------------------------------------

export function useHydrationGoal() {
  const queryClient = useQueryClient();
  const userId = useAuthStore((s) => s.user?.uid);

  const query = useQuery({
    queryKey: hydrationKeys.goal(),
    queryFn: async () => {
      if (!userId) return null;
      const res = await hydrationRepository.getGoal(userId);
      if (!res.success) throw res.error;
      return res.data;
    },
    enabled: !!userId,
    staleTime: 5 * 60 * 1000,
    gcTime: 15 * 60 * 1000,
  });

  const saveMutation = useMutation({
    mutationFn: async (
      goal: Omit<HydrationGoal, 'id' | 'userId' | 'createdAt' | 'updatedAt'>
    ) => {
      if (!userId) throw new Error('User authentication required');
      const res = await hydrationRepository.saveGoal(userId, goal);
      if (!res.success) throw res.error;
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: hydrationKeys.goal() });
      queryClient.invalidateQueries({ queryKey: hydrationKeys.today() });
      queryClient.invalidateQueries({ queryKey: hydrationKeys.summary() });
    },
  });

  return {
    goal: query.data ?? null,
    isLoading: query.isLoading,
    isError: query.isError,
    error: query.error,
    refetch: query.refetch,
    saveGoal: saveMutation.mutateAsync,
    isSaving: saveMutation.isPending,
  };
}

// ---------------------------------------------------------------------------
// CRUD Mutations
// ---------------------------------------------------------------------------

export function useHydrationMutations() {
  const queryClient = useQueryClient();
  const userId = useAuthStore((s) => s.user?.uid);

  const createMutation = useMutation({
    mutationFn: async (
      entry: Omit<HydrationEntry, 'id' | 'userId' | 'createdAt' | 'updatedAt'>
    ) => {
      if (!userId) throw new Error('User authentication required');
      const res = await hydrationRepository.createEntry(userId, entry);
      if (!res.success) throw res.error;
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: hydrationKeys.all });
    },
  });

  const updateMutation = useMutation({
    mutationFn: async ({
      entryId,
      updates,
    }: {
      entryId: string;
      updates: Partial<Omit<HydrationEntry, 'id' | 'userId' | 'createdAt'>>;
    }) => {
      if (!userId) throw new Error('User authentication required');
      const res = await hydrationRepository.updateEntry(
        userId,
        entryId,
        updates
      );
      if (!res.success) throw res.error;
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: hydrationKeys.all });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (entryId: string) => {
      if (!userId) throw new Error('User authentication required');
      const res = await hydrationRepository.deleteEntry(userId, entryId);
      if (!res.success) throw res.error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: hydrationKeys.all });
    },
  });

  return {
    createEntry: createMutation.mutateAsync,
    isCreating: createMutation.isPending,
    updateEntry: updateMutation.mutateAsync,
    isUpdating: updateMutation.isPending,
    deleteEntry: deleteMutation.mutateAsync,
    isDeleting: deleteMutation.isPending,
  };
}

// ---------------------------------------------------------------------------
// Analytics
// ---------------------------------------------------------------------------

export function useHydrationAnalytics() {
  const userId = useAuthStore((s) => s.user?.uid);

  const query = useQuery({
    queryKey: hydrationKeys.analytics(),
    queryFn: async () => {
      if (!userId) return [];
      const res = await hydrationRepository.fetchHydrationAnalytics(userId);
      if (!res.success) throw res.error;
      return res.data;
    },
    enabled: !!userId,
    staleTime: 5 * 60 * 1000,
    gcTime: 15 * 60 * 1000,
  });

  return {
    analytics: query.data ?? [],
    isLoading: query.isLoading,
    isError: query.isError,
    error: query.error,
    refetch: query.refetch,
  };
}

// ---------------------------------------------------------------------------
// Unified Hook (Composite)
// ---------------------------------------------------------------------------

export function useHydration() {
  const today = useHydrationToday();
  const historyData = useHydrationHistory();
  const goalData = useHydrationGoal();
  const mutations = useHydrationMutations();

  return {
    // Today's data
    today: today.summary,
    todayEntries: today.entries,

    // History
    history: historyData.history,

    // Goal
    goal: goalData.goal,

    // Summary (alias for today)
    summary: today.summary,

    // Loading state
    loading:
      today.isLoading || historyData.isLoading || goalData.isLoading,

    // Refresh
    refresh: () => {
      today.refresh();
      historyData.refetch();
      goalData.refetch();
    },

    // CRUD
    createEntry: mutations.createEntry,
    updateEntry: mutations.updateEntry,
    deleteEntry: mutations.deleteEntry,
    saveGoal: goalData.saveGoal,

    // Mutation states
    isCreating: mutations.isCreating,
    isUpdating: mutations.isUpdating,
    isDeleting: mutations.isDeleting,
    isSavingGoal: goalData.isSaving,
  };
}
