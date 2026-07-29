/**
 * User Profile React Query Custom Hooks
 */

import { useQuery, useMutation, useQueryClient, type UseQueryResult, type UseMutationResult } from '@tanstack/react-query';
import { useAuth } from '@/shared/hooks/useAuth';
import { userRepository, type UserProfile, type UpdateUserProfilePayload } from '@/features/user';
import { userKeys } from '@/shared/react-query/queryKeys';
import type { AppError } from '@/shared/errors';

/**
 * Custom hook to fetch and cache the active UserProfile.
 */
export function useUserProfile(): UseQueryResult<UserProfile | null, AppError> {
  const { user } = useAuth();
  const uid = user?.uid;

  return useQuery({
    queryKey: userKeys.profile(uid ?? ''),
    queryFn: async (): Promise<UserProfile | null> => {
      if (!uid) return null;
      const result = await userRepository.ensureProfileExists(
        uid,
        user?.email ?? '',
        user?.displayName,
        user?.photoURL,
      );

      if (!result.success) {
        throw result.error;
      }

      return result.data;
    },
    enabled: Boolean(uid),
  });
}

/**
 * Custom hook to mutate/update the active UserProfile.
 */
export function useUpdateProfile(): UseMutationResult<UserProfile, AppError, UpdateUserProfilePayload> {
  const { user } = useAuth();
  const uid = user?.uid;
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (payload: UpdateUserProfilePayload): Promise<UserProfile> => {
      if (!uid) {
        throw new Error('Cannot update profile: User is unauthenticated.');
      }

      const result = await userRepository.updateProfile(uid, payload);
      if (!result.success) {
        throw result.error;
      }

      return result.data;
    },

    onSuccess: (updatedProfile) => {
      if (uid) {
        // Update query cache immediately
        queryClient.setQueryData(userKeys.profile(uid), updatedProfile);
      }
    },
  });
}
