import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useAuthStore } from '@/shared/stores';
import { hairPhotoRepository } from '../repository/hairPhoto.repository';
import { haircareKeys } from './queryKeys';

export function useDeleteHairPhoto() {
  const queryClient = useQueryClient();
  const user = useAuthStore((state) => state.user);
  const userId = user?.uid;

  const deleteMutation = useMutation({
    mutationFn: async ({ photoId, storagePath }: { photoId: string; storagePath: string }) => {
      if (!userId) throw new Error('User not authenticated');
      const res = await hairPhotoRepository.deletePhoto(userId, photoId, storagePath);
      if (!res.success) throw res.error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: haircareKeys.photos() });
      queryClient.invalidateQueries({ queryKey: haircareKeys.all });
    },
  });

  return {
    deletePhoto: deleteMutation.mutateAsync,
    isDeleting: deleteMutation.isPending,
    isError: deleteMutation.isError,
    error: deleteMutation.error,
  };
}
