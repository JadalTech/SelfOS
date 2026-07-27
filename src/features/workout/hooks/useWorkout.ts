/**
 * React Query Hooks for Workout Module
 */

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useAuthStore } from '../../../shared/stores/auth.store';
import { workoutRepository } from '../repository/workout.repository';
import { workoutKeys } from './queryKeys';
import { useActiveWorkoutStore } from '../stores/activeWorkout.store';
import {
  mapToExerciseVM,
  mapToWorkoutPlanVM,
  mapToWorkoutSessionVM,
  mapToWorkoutTemplateVM,
  mapToPersonalRecordVM,
} from '../mappers/workout.mapper';
import type {
  Exercise,
  WorkoutPlan,
  WorkoutTemplate,
  WorkoutSession,
} from '../types/workout.types';

export function useWorkoutExercises(searchTerm = '') {
  const queryClient = useQueryClient();
  const userId = useAuthStore((s) => s.user?.uid);

  const query = useQuery({
    queryKey: workoutKeys.exercises(searchTerm),
    queryFn: async () => {
      if (!userId) return [];
      const res = await workoutRepository.searchExercises(userId, searchTerm);
      if (!res.success) throw res.error;
      return res.data;
    },
    enabled: !!userId,
    staleTime: 5 * 60 * 1000,
    gcTime: 15 * 60 * 1000,
  });

  const createMutation = useMutation({
    mutationFn: async (exercise: Omit<Exercise, 'id' | 'userId' | 'createdAt' | 'updatedAt' | 'source'>) => {
      if (!userId) throw new Error('User authentication required');
      const res = await workoutRepository.createUserExercise(userId, exercise);
      if (!res.success) throw res.error;
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: workoutKeys.all });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (exerciseId: string) => {
      if (!userId) throw new Error('User authentication required');
      const res = await workoutRepository.deleteUserExercise(userId, exerciseId);
      if (!res.success) throw res.error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: workoutKeys.all });
    },
  });

  return {
    exercisesVM: (query.data || []).map(mapToExerciseVM),
    rawExercises: query.data || [],
    isLoading: query.isLoading,
    isError: query.isError,
    error: query.error,
    refetch: query.refetch,
    createUserExercise: createMutation.mutateAsync,
    isCreating: createMutation.isPending,
    deleteUserExercise: deleteMutation.mutateAsync,
    isDeleting: deleteMutation.isPending,
  };
}

export function useWorkoutPlans() {
  const queryClient = useQueryClient();
  const userId = useAuthStore((s) => s.user?.uid);

  const query = useQuery({
    queryKey: workoutKeys.plans(),
    queryFn: async () => {
      if (!userId) return [];
      const res = await workoutRepository.fetchPlans(userId);
      if (!res.success) throw res.error;
      return res.data;
    },
    enabled: !!userId,
    staleTime: 5 * 60 * 1000,
    gcTime: 15 * 60 * 1000,
  });

  const saveMutation = useMutation({
    mutationFn: async (plan: Omit<WorkoutPlan, 'id' | 'userId' | 'createdAt' | 'updatedAt'> & { id?: string }) => {
      if (!userId) throw new Error('User authentication required');
      const res = await workoutRepository.savePlan(userId, plan);
      if (!res.success) throw res.error;
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: workoutKeys.plans() });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (planId: string) => {
      if (!userId) throw new Error('User authentication required');
      const res = await workoutRepository.deletePlan(userId, planId);
      if (!res.success) throw res.error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: workoutKeys.plans() });
    },
  });

  return {
    plansVM: (query.data || []).map(mapToWorkoutPlanVM),
    rawPlans: query.data || [],
    isLoading: query.isLoading,
    isError: query.isError,
    error: query.error,
    refetch: query.refetch,
    savePlan: saveMutation.mutateAsync,
    isSaving: saveMutation.isPending,
    deletePlan: deleteMutation.mutateAsync,
    isDeleting: deleteMutation.isPending,
  };
}

export function useWorkoutTemplates() {
  const queryClient = useQueryClient();
  const userId = useAuthStore((s) => s.user?.uid);

  const query = useQuery({
    queryKey: workoutKeys.templates(),
    queryFn: async () => {
      if (!userId) return [];
      const res = await workoutRepository.fetchTemplates(userId);
      if (!res.success) throw res.error;
      return res.data;
    },
    enabled: !!userId,
    staleTime: 5 * 60 * 1000,
    gcTime: 15 * 60 * 1000,
  });

  const createMutation = useMutation({
    mutationFn: async (template: Omit<WorkoutTemplate, 'id' | 'userId' | 'createdAt' | 'updatedAt'>) => {
      if (!userId) throw new Error('User authentication required');
      const res = await workoutRepository.createTemplate(userId, template);
      if (!res.success) throw res.error;
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: workoutKeys.templates() });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (templateId: string) => {
      if (!userId) throw new Error('User authentication required');
      const res = await workoutRepository.deleteTemplate(userId, templateId);
      if (!res.success) throw res.error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: workoutKeys.templates() });
    },
  });

  return {
    templatesVM: (query.data || []).map(mapToWorkoutTemplateVM),
    rawTemplates: query.data || [],
    isLoading: query.isLoading,
    isError: query.isError,
    error: query.error,
    refetch: query.refetch,
    createTemplate: createMutation.mutateAsync,
    isCreating: createMutation.isPending,
    deleteTemplate: deleteMutation.mutateAsync,
    isDeleting: deleteMutation.isPending,
  };
}

export function useWorkoutHistory(limitCount = 50) {
  const queryClient = useQueryClient();
  const userId = useAuthStore((s) => s.user?.uid);

  const query = useQuery({
    queryKey: workoutKeys.history(),
    queryFn: async () => {
      if (!userId) return [];
      const res = await workoutRepository.fetchHistory(userId, limitCount);
      if (!res.success) throw res.error;
      return res.data;
    },
    enabled: !!userId,
    staleTime: 5 * 60 * 1000,
    gcTime: 15 * 60 * 1000,
  });

  const deleteMutation = useMutation({
    mutationFn: async (sessionId: string) => {
      if (!userId) throw new Error('User authentication required');
      const res = await workoutRepository.deleteSession(userId, sessionId);
      if (!res.success) throw res.error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: workoutKeys.history() });
      queryClient.invalidateQueries({ queryKey: workoutKeys.analytics() });
    },
  });

  return {
    historyVM: (query.data || []).map(mapToWorkoutSessionVM),
    rawHistory: query.data || [],
    isLoading: query.isLoading,
    isError: query.isError,
    error: query.error,
    refetch: query.refetch,
    deleteSession: deleteMutation.mutateAsync,
    isDeleting: deleteMutation.isPending,
  };
}

export function usePersonalRecords() {
  const queryClient = useQueryClient();
  const userId = useAuthStore((s) => s.user?.uid);

  const query = useQuery({
    queryKey: workoutKeys.personalRecords(),
    queryFn: async () => {
      if (!userId) return [];
      const res = await workoutRepository.fetchPersonalRecords(userId);
      if (!res.success) throw res.error;
      return res.data;
    },
    enabled: !!userId,
    staleTime: 5 * 60 * 1000,
    gcTime: 15 * 60 * 1000,
  });

  const deleteMutation = useMutation({
    mutationFn: async (recordId: string) => {
      if (!userId) throw new Error('User authentication required');
      const res = await workoutRepository.deletePersonalRecord(userId, recordId);
      if (!res.success) throw res.error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: workoutKeys.personalRecords() });
    },
  });

  return {
    personalRecordsVM: (query.data || []).map(mapToPersonalRecordVM),
    rawPersonalRecords: query.data || [],
    isLoading: query.isLoading,
    isError: query.isError,
    error: query.error,
    refetch: query.refetch,
    deletePersonalRecord: deleteMutation.mutateAsync,
    isDeleting: deleteMutation.isPending,
  };
}

export function useWorkoutAnalytics() {
  const userId = useAuthStore((s) => s.user?.uid);

  const query = useQuery({
    queryKey: workoutKeys.analytics(),
    queryFn: async () => {
      if (!userId) return [];
      const res = await workoutRepository.fetchWorkoutAnalytics(userId);
      if (!res.success) throw res.error;
      return res.data;
    },
    enabled: !!userId,
    staleTime: 5 * 60 * 1000,
    gcTime: 15 * 60 * 1000,
  });

  return {
    analytics: query.data || [],
    isLoading: query.isLoading,
    isError: query.isError,
    error: query.error,
    refetch: query.refetch,
  };
}

export function useWorkoutSession() {
  const queryClient = useQueryClient();
  const userId = useAuthStore((s) => s.user?.uid);

  const store = useActiveWorkoutStore();

  const saveMutation = useMutation({
    mutationFn: async (session: WorkoutSession) => {
      if (!userId) throw new Error('User authentication required');
      const res = await workoutRepository.saveSession(userId, session);
      if (!res.success) throw res.error;
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: workoutKeys.history() });
      queryClient.invalidateQueries({ queryKey: workoutKeys.analytics() });
      queryClient.invalidateQueries({ queryKey: workoutKeys.personalRecords() });
    },
  });

  const startSession = async (
    name: string,
    options?: { templateId?: string; planId?: string; exercises?: any[] }
  ) => {
    if (!userId) throw new Error('User authentication required');
    await store.startSession(userId, name, options);
  };

  const finishSession = async () => {
    const session = await store.finishSession();
    if (session) {
      await saveMutation.mutateAsync(session);
    }
  };

  return {
    activeSession: store.activeSession,
    activeSessionVM: store.activeSession ? mapToWorkoutSessionVM(store.activeSession) : null,
    isTracking: store.isTracking,
    isPaused: store.isPaused,
    isHydrated: store.isHydrated,
    startSession,
    pauseSession: store.pauseSession,
    resumeSession: store.resumeSession,
    incrementDuration: store.incrementDuration,
    updateNotes: store.updateNotes,
    addExerciseToSession: store.addExerciseToSession,
    removeExerciseFromSession: store.removeExerciseFromSession,
    addSetToExercise: store.addSetToExercise,
    removeSetFromExercise: store.removeSetFromExercise,
    updateSetMetrics: store.updateSetMetrics,
    completeSet: store.completeSet,
    finishSession,
    abandonSession: store.abandonSession,
    hydrateStore: store.hydrateStore,
    isSaving: saveMutation.isPending,
  };
}
