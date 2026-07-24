import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useAuthStore } from '../../../shared/stores/auth.store';
import { skinAssessmentRepository, CreateSkinAssessmentInput } from '../repository/skinAssessment.repository';
import { mapToSkinAssessmentVMs } from '../mappers';
import { skincareKeys } from './queryKeys';
import type { SkinAssessment } from '../types';

export function useSkinAssessments() {
  const queryClient = useQueryClient();
  const userId = useAuthStore((s) => s.user?.uid);

  const query = useQuery({
    queryKey: skincareKeys.assessments(),
    queryFn: async () => {
      if (!userId) return [];
      const res = await skinAssessmentRepository.fetchAssessments(userId);
      if (!res.success) throw res.error;
      return res.data;
    },
    enabled: !!userId,
    staleTime: 5 * 60 * 1000,
    gcTime: 15 * 60 * 1000,
  });

  const assessmentVMs = mapToSkinAssessmentVMs(query.data || []);
  const latestAssessmentVM = assessmentVMs.length > 0 ? assessmentVMs[0] : undefined;

  const createMutation = useMutation({
    mutationFn: async (input: CreateSkinAssessmentInput) => {
      if (!userId) throw new Error('User is not authenticated');
      const res = await skinAssessmentRepository.createAssessment(userId, input);
      if (!res.success) throw res.error;
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: skincareKeys.assessments() });
      queryClient.invalidateQueries({ queryKey: skincareKeys.dashboard() });
      queryClient.invalidateQueries({ queryKey: skincareKeys.analytics() });
    },
  });

  const updateMutation = useMutation({
    mutationFn: async ({ assessmentId, updates }: { assessmentId: string; updates: Partial<SkinAssessment> }) => {
      if (!userId) throw new Error('User is not authenticated');
      const res = await skinAssessmentRepository.updateAssessment(userId, assessmentId, updates);
      if (!res.success) throw res.error;
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: skincareKeys.assessments() });
      queryClient.invalidateQueries({ queryKey: skincareKeys.dashboard() });
      queryClient.invalidateQueries({ queryKey: skincareKeys.analytics() });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (assessmentId: string) => {
      if (!userId) throw new Error('User is not authenticated');
      const res = await skinAssessmentRepository.deleteAssessment(userId, assessmentId);
      if (!res.success) throw res.error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: skincareKeys.assessments() });
      queryClient.invalidateQueries({ queryKey: skincareKeys.dashboard() });
    },
  });

  return {
    assessments: query.data || [],
    assessmentVMs,
    latestAssessmentVM,
    isLoading: query.isLoading,
    isError: query.isError,
    error: query.error,
    refetch: query.refetch,
    createAssessment: createMutation.mutateAsync,
    isCreating: createMutation.isPending,
    updateAssessment: updateMutation.mutateAsync,
    isUpdating: updateMutation.isPending,
    deleteAssessment: deleteMutation.mutateAsync,
    isDeleting: deleteMutation.isPending,
  };
}
