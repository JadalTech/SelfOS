import { useQuery } from '@tanstack/react-query';
import { useAuthStore } from '../../../shared/stores/auth.store';
import { skincareRepository } from '../repository/skincare.repository';
import { skinAssessmentRepository } from '../repository/skinAssessment.repository';
import { skinPhotoRepository } from '../repository/skinPhoto.repository';
import { buildSkincareDashboardVM } from '../mappers';
import { skincareKeys } from './queryKeys';

export function useSkincareDashboard() {
  const userId = useAuthStore((s) => s.user?.uid);

  const query = useQuery({
    queryKey: skincareKeys.dashboard(),
    queryFn: async () => {
      if (!userId) return null;

      const [productsRes, routinesRes, logsRes, assessmentsRes, photosRes] = await Promise.all([
        skincareRepository.fetchProducts(userId),
        skincareRepository.fetchRoutines(userId),
        skincareRepository.fetchLogs(userId, 30),
        skinAssessmentRepository.fetchAssessments(userId),
        skinPhotoRepository.fetchPhotos(userId),
      ]);

      const products = productsRes.success ? productsRes.data : [];
      const routines = routinesRes.success ? routinesRes.data : [];
      const logs = logsRes.success ? logsRes.data : [];
      const assessments = assessmentsRes.success ? assessmentsRes.data : [];
      const photos = photosRes.success ? photosRes.data : [];

      return buildSkincareDashboardVM({
        products,
        routines,
        logs,
        assessments,
        photos,
      });
    },
    enabled: !!userId,
  });

  return {
    dashboardVM: query.data || null,
    isLoading: query.isLoading,
    isError: query.isError,
    error: query.error,
    refetch: query.refetch,
  };
}
