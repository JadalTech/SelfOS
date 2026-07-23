import { useQuery } from '@tanstack/react-query';
import { useAuthStore } from '@/shared/stores';
import { hairPhotoRepository } from '../repository/hairPhoto.repository';
import type { HairPhoto } from '../types';
import { haircareKeys } from './queryKeys';

export function useHairPhotos() {
  const user = useAuthStore((state) => state.user);
  const userId = user?.uid;

  const photosQuery = useQuery<HairPhoto[], Error>({
    queryKey: haircareKeys.photos(),
    queryFn: async () => {
      if (!userId) return [];
      const res = await hairPhotoRepository.fetchPhotos(userId);
      if (!res.success) throw res.error;
      return res.data;
    },
    enabled: Boolean(userId),
    staleTime: 5 * 60 * 1000,
  });

  return {
    photos: photosQuery.data ?? [],
    isLoading: photosQuery.isLoading,
    isRefetching: photosQuery.isRefetching,
    isError: photosQuery.isError,
    error: photosQuery.error,
    refetch: photosQuery.refetch,
  };
}
