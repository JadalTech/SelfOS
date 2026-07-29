/**
 * Routine React Query Custom Hooks
 */

import {
  useQuery,
  useMutation,
  useQueryClient,
  type UseQueryResult,
  type UseMutationResult,
} from '@tanstack/react-query';
import { useAuth } from '@/shared/hooks/useAuth';
import {
  routineRepository,
  type Routine,
  type RoutineType,
  type RoutineStatus,
  type CreateRoutinePayload,
  type UpdateRoutinePayload,
} from '@/features/routine';
import { routineKeys } from '@/shared/react-query/queryKeys';
import type { AppError } from '@/shared/errors';

/**
 * Custom hook to fetch a list of routines for the active user.
 */
export function useRoutineList(filters?: {
  type?: RoutineType;
  status?: RoutineStatus;
}): UseQueryResult<Routine[], AppError> {
  const { user } = useAuth();
  const uid = user?.uid;

  return useQuery({
    queryKey: routineKeys.lists(uid ?? ''),
    queryFn: async (): Promise<Routine[]> => {
      if (!uid) return [];
      const result = await routineRepository.listRoutines(uid, filters);
      if (!result.success) {
        throw result.error;
      }
      return result.data;
    },
    enabled: Boolean(uid),
  });
}

/**
 * Custom hook to fetch a single routine by ID.
 */
export function useRoutine(id: string): UseQueryResult<Routine | null, AppError> {
  const { user } = useAuth();
  const uid = user?.uid;

  return useQuery({
    queryKey: routineKeys.detail(uid ?? '', id),
    queryFn: async (): Promise<Routine | null> => {
      if (!uid || !id) return null;
      const result = await routineRepository.getRoutine(uid, id);
      if (!result.success) {
        throw result.error;
      }
      return result.data;
    },
    enabled: Boolean(uid && id),
  });
}

/**
 * Custom hook to create a new routine.
 */
export function useCreateRoutine(): UseMutationResult<Routine, AppError, CreateRoutinePayload> {
  const { user } = useAuth();
  const uid = user?.uid;
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (payload: CreateRoutinePayload): Promise<Routine> => {
      if (!uid) throw new Error('Unauthenticated user.');
      const result = await routineRepository.createRoutine(uid, payload);
      if (!result.success) throw result.error;
      return result.data;
    },
    onSuccess: () => {
      if (uid) {
        queryClient.invalidateQueries({ queryKey: routineKeys.lists(uid) });
      }
    },
  });
}

/**
 * Custom hook to update an existing routine.
 */
export function useUpdateRoutine(): UseMutationResult<
  Routine,
  AppError,
  { id: string; data: UpdateRoutinePayload }
> {
  const { user } = useAuth();
  const uid = user?.uid;
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, data }): Promise<Routine> => {
      if (!uid) throw new Error('Unauthenticated user.');
      const result = await routineRepository.updateRoutine(uid, id, data);
      if (!result.success) throw result.error;
      return result.data;
    },
    onSuccess: (_, variables) => {
      if (uid) {
        queryClient.invalidateQueries({ queryKey: routineKeys.lists(uid) });
        queryClient.invalidateQueries({ queryKey: routineKeys.detail(uid, variables.id) });
      }
    },
  });
}

/**
 * Custom hook to archive a routine (soft delete).
 */
export function useArchiveRoutine(): UseMutationResult<void, AppError, string> {
  const { user } = useAuth();
  const uid = user?.uid;
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (routineId: string): Promise<void> => {
      if (!uid) throw new Error('Unauthenticated user.');
      const result = await routineRepository.archiveRoutine(uid, routineId);
      if (!result.success) throw result.error;
    },
    onSuccess: (_, routineId) => {
      if (uid) {
        queryClient.invalidateQueries({ queryKey: routineKeys.lists(uid) });
        queryClient.invalidateQueries({ queryKey: routineKeys.detail(uid, routineId) });
      }
    },
  });
}

/**
 * Custom hook to hard-delete a routine.
 */
export function useDeleteRoutine(): UseMutationResult<void, AppError, string> {
  const { user } = useAuth();
  const uid = user?.uid;
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (routineId: string): Promise<void> => {
      if (!uid) throw new Error('Unauthenticated user.');
      const result = await routineRepository.deleteRoutine(uid, routineId);
      if (!result.success) throw result.error;
    },
    onSuccess: (_, routineId) => {
      if (uid) {
        queryClient.invalidateQueries({ queryKey: routineKeys.lists(uid) });
        queryClient.removeQueries({ queryKey: routineKeys.detail(uid, routineId) });
      }
    },
  });
}
