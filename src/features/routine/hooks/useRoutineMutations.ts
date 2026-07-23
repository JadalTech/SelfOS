/**
 * React Query Mutation Hooks for Routine Operations
 *
 * Manages cache invalidations and async mutation workflows for routines & logs.
 */

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { routineRepository } from '../repository/routine.repository';
import { routineKeys } from '../constants/queryKeys';
import type { RoutineFormValues } from '../validation/routine.validation';

export function useCreateRoutine() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (formValues: RoutineFormValues) => {
      const result = await routineRepository.createRoutine(formValues);
      if (!result.success) {
        throw result.error;
      }
      return result.data;
    },
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: routineKeys.all });
    },
  });
}

export function useUpdateRoutine() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      routineId,
      formValues,
    }: {
      routineId: string;
      formValues: Partial<RoutineFormValues>;
    }) => {
      const result = await routineRepository.updateRoutine(routineId, formValues);
      if (!result.success) {
        throw result.error;
      }
    },
    onSuccess: (_, variables) => {
      void queryClient.invalidateQueries({ queryKey: routineKeys.detail(variables.routineId) });
      void queryClient.invalidateQueries({ queryKey: routineKeys.lists() });
    },
  });
}

export function useArchiveRoutine() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (routineId: string) => {
      const result = await routineRepository.archiveRoutine(routineId);
      if (!result.success) {
        throw result.error;
      }
    },
    onSuccess: (_, routineId) => {
      void queryClient.invalidateQueries({ queryKey: routineKeys.detail(routineId) });
      void queryClient.invalidateQueries({ queryKey: routineKeys.lists() });
    },
  });
}

export function useRestoreRoutine() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (routineId: string) => {
      const result = await routineRepository.restoreRoutine(routineId);
      if (!result.success) {
        throw result.error;
      }
    },
    onSuccess: (_, routineId) => {
      void queryClient.invalidateQueries({ queryKey: routineKeys.detail(routineId) });
      void queryClient.invalidateQueries({ queryKey: routineKeys.lists() });
    },
  });
}

export function useCompleteRoutine() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      routineId,
      dateStr,
      payload,
    }: {
      routineId: string;
      dateStr: string;
      payload?: Record<string, unknown>;
    }) => {
      const result = await routineRepository.completeRoutine(routineId, dateStr, payload);
      if (!result.success) {
        throw result.error;
      }
      return result.data;
    },
    onSuccess: (_, variables) => {
      void queryClient.invalidateQueries({ queryKey: routineKeys.logs(variables.routineId) });
      void queryClient.invalidateQueries({ queryKey: routineKeys.detail(variables.routineId) });
      void queryClient.invalidateQueries({ queryKey: routineKeys.lists() });
    },
  });
}

export function useSkipRoutine() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      routineId,
      dateStr,
      payload,
    }: {
      routineId: string;
      dateStr: string;
      payload?: Record<string, unknown>;
    }) => {
      const result = await routineRepository.skipRoutine(routineId, dateStr, payload);
      if (!result.success) {
        throw result.error;
      }
      return result.data;
    },
    onSuccess: (_, variables) => {
      void queryClient.invalidateQueries({ queryKey: routineKeys.logs(variables.routineId) });
      void queryClient.invalidateQueries({ queryKey: routineKeys.detail(variables.routineId) });
      void queryClient.invalidateQueries({ queryKey: routineKeys.lists() });
    },
  });
}

export function useUndoCompletion() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ routineId, logId }: { routineId: string; logId: string }) => {
      const result = await routineRepository.undoCompletion(routineId, logId);
      if (!result.success) {
        throw result.error;
      }
    },
    onSuccess: (_, variables) => {
      void queryClient.invalidateQueries({ queryKey: routineKeys.logs(variables.routineId) });
      void queryClient.invalidateQueries({ queryKey: routineKeys.detail(variables.routineId) });
      void queryClient.invalidateQueries({ queryKey: routineKeys.lists() });
    },
  });
}
