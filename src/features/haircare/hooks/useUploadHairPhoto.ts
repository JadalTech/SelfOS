import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useAuthStore } from '@/shared/stores';
import { hairPhotoRepository, UploadPhotoInput } from '../repository/hairPhoto.repository';
import { haircareKeys } from './queryKeys';

export function useUploadHairPhoto() {
  const queryClient = useQueryClient();
  const user = useAuthStore((state) => state.user);
  const userId = user?.uid;

  const uploadMutation = useMutation({
    mutationFn: async (input: UploadPhotoInput) => {
      if (!userId) throw new Error('User not authenticated');
      const res = await hairPhotoRepository.uploadPhoto(userId, input);
      if (!res.success) throw res.error;
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: haircareKeys.photos() });
      queryClient.invalidateQueries({ queryKey: haircareKeys.all });
    },
  });

  return {
    uploadPhoto: uploadMutation.mutateAsync,
    isUploading: uploadMutation.isPending,
    isError: uploadMutation.isError,
    error: uploadMutation.error,
  };
}
