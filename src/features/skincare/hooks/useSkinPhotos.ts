import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useAuthStore } from '../../../shared/stores/auth.store';
import { skinPhotoRepository, UploadSkinPhotoInput } from '../repository/skinPhoto.repository';
import { mapToProgressPhotoVMs, groupPhotosByMonth } from '../mappers';
import { skincareKeys } from './queryKeys';
import type { ProgressPhoto } from '../types';

export function useSkinPhotos() {
  const queryClient = useQueryClient();
  const userId = useAuthStore((s) => s.user?.uid);

  const query = useQuery({
    queryKey: skincareKeys.photos(),
    queryFn: async () => {
      if (!userId) return [];
      const res = await skinPhotoRepository.fetchPhotos(userId);
      if (!res.success) throw res.error;
      return res.data;
    },
    enabled: !!userId,
  });

  const photoVMs = mapToProgressPhotoVMs(query.data || []);
  const monthlyTimelineGroups = groupPhotosByMonth(photoVMs);

  const uploadMutation = useMutation({
    mutationFn: async (input: UploadSkinPhotoInput) => {
      if (!userId) throw new Error('User is not authenticated');
      const res = await skinPhotoRepository.uploadPhoto(userId, input);
      if (!res.success) throw res.error;
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: skincareKeys.photos() });
      queryClient.invalidateQueries({ queryKey: skincareKeys.dashboard() });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (photoId: string) => {
      if (!userId) throw new Error('User is not authenticated');
      const targetPhoto = query.data?.find((p: ProgressPhoto) => p.id === photoId);
      const res = await skinPhotoRepository.deletePhoto(userId, photoId, targetPhoto?.storagePath || '');
      if (!res.success) throw res.error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: skincareKeys.photos() });
      queryClient.invalidateQueries({ queryKey: skincareKeys.dashboard() });
    },
  });

  return {
    photos: query.data || [],
    photoVMs,
    monthlyTimelineGroups,
    isLoading: query.isLoading,
    isError: query.isError,
    error: query.error,
    refetch: query.refetch,
    uploadPhoto: uploadMutation.mutateAsync,
    isUploading: uploadMutation.isPending,
    deletePhoto: deleteMutation.mutateAsync,
    isDeleting: deleteMutation.isPending,
  };
}
