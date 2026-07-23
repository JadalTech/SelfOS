import { useMemo } from 'react';
import { useHairPhotos } from './useHairPhotos';
import { mapToHairPhotoVMs, groupPhotosByMonth } from '../mappers/photos.mapper';

export function useHairTimeline() {
  const { photos, isLoading, isRefetching, isError, error, refetch } = useHairPhotos();

  const photoVMs = useMemo(() => mapToHairPhotoVMs(photos), [photos]);
  const monthGroups = useMemo(() => groupPhotosByMonth(photoVMs), [photoVMs]);
  const latestPhoto = useMemo(() => photoVMs[0] || null, [photoVMs]);

  return {
    photos: photoVMs,
    monthGroups,
    latestPhoto,
    totalPhotosCount: photoVMs.length,
    isLoading,
    isRefetching,
    isError,
    error,
    refetch,
  };
}
