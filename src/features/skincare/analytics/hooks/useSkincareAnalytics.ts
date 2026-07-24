import { useQuery } from '@tanstack/react-query';
import { useAuthStore } from '../../../../shared/stores/auth.store';
import { skincareRepository } from '../../repository/skincare.repository';
import { skinAssessmentRepository } from '../../repository/skinAssessment.repository';
import { skincareKeys } from '../../hooks/queryKeys';
import { buildSkincareAnalyticsVM } from '../utils/skincareAnalytics';

export function useSkincareAnalytics() {
  const userId = useAuthStore((s) => s.user?.uid);

  const query = useQuery({
    queryKey: skincareKeys.analytics(),
    queryFn: async () => {
      if (!userId) return null;

      const [assessmentsRes, logsRes, routinesRes, productsRes] = await Promise.all([
        skinAssessmentRepository.fetchAssessments(userId),
        skincareRepository.fetchLogs(userId, 60),
        skincareRepository.fetchRoutines(userId),
        skincareRepository.fetchProducts(userId),
      ]);

      const assessments = assessmentsRes.success ? assessmentsRes.data : [];
      const logs = logsRes.success ? logsRes.data : [];
      const routines = routinesRes.success ? routinesRes.data : [];
      const products = productsRes.success ? productsRes.data : [];

      return buildSkincareAnalyticsVM({
        assessments,
        logs,
        routines,
        products,
      });
    },
    enabled: !!userId,
  });

  return {
    analyticsVM: query.data || null,
    isLoading: query.isLoading,
    isError: query.isError,
    error: query.error,
    refetch: query.refetch,
  };
}
