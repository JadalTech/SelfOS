import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useAuthStore } from '../../../../shared/stores/auth.store';
import { skincareRepository } from '../../repository/skincare.repository';
import { skinAssessmentRepository } from '../../repository/skinAssessment.repository';
import { skincareAIRepository } from '../repository/skincareAI.repository';
import { SkinAIContextBuilder } from '../utils/SkinAIContextBuilder';
import { skincareKeys } from '../../hooks/queryKeys';
import type { ProviderType } from '../providers/providerFactory';
import type { SkinChatMessage } from '../types/ai.types';

export function useSkinCoach(providerType: ProviderType = 'heuristic') {
  const userId = useAuthStore((s) => s.user?.uid);
  const queryClient = useQueryClient();
  const [streamingText, setStreamingText] = useState<string>('');

  const contextQuery = useQuery({
    queryKey: skincareKeys.ai(),
    queryFn: async () => {
      if (!userId) return null;

      const [assessmentsRes, routinesRes, logsRes, productsRes] = await Promise.all([
        skinAssessmentRepository.fetchAssessments(userId),
        skincareRepository.fetchRoutines(userId),
        skincareRepository.fetchLogs(userId, 30),
        skincareRepository.fetchProducts(userId),
      ]);

      const assessments = assessmentsRes.success ? assessmentsRes.data : [];
      const routines = routinesRes.success ? routinesRes.data : [];
      const logs = logsRes.success ? logsRes.data : [];
      const products = productsRes.success ? productsRes.data : [];

      return SkinAIContextBuilder.buildContext({
        assessments,
        routines,
        logs,
        products,
      });
    },
    enabled: !!userId,
  });

  const conversationQuery = useQuery({
    queryKey: [...skincareKeys.ai(), 'conversation', userId] as const,
    queryFn: async () => {
      if (!userId) return [];
      const res = await skincareAIRepository.fetchConversation(userId);
      return res.success ? res.data : [];
    },
    enabled: !!userId,
  });

  const askMutation = useMutation({
    mutationFn: async (question: string) => {
      if (!userId) throw new Error('User authentication required');
      const context = contextQuery.data;
      if (!context) throw new Error('Skin AI context unavailable');

      setStreamingText('');

      const res = await skincareAIRepository.askCoach(userId, question, context, providerType);
      if (!res.success) throw res.error;
      return res.data;
    },
    onSuccess: () => {
      setStreamingText('');
      queryClient.invalidateQueries({ queryKey: [...skincareKeys.ai(), 'conversation', userId] });
    },
  });

  const clearConversationMutation = useMutation({
    mutationFn: async () => {
      if (!userId) return;
      const res = await skincareAIRepository.clearConversation(userId);
      if (!res.success) throw res.error;
    },
    onSuccess: () => {
      queryClient.setQueryData([...skincareKeys.ai(), 'conversation', userId], []);
    },
  });

  const recommendationsQuery = useQuery({
    queryKey: [...skincareKeys.ai(), 'recommendations', userId, providerType] as const,
    queryFn: async () => {
      if (!userId || !contextQuery.data) return [];
      const res = await skincareAIRepository.generateRecommendations(userId, contextQuery.data, providerType);
      return res.success ? res.data : [];
    },
    enabled: !!userId && !!contextQuery.data,
  });

  const weeklyReviewQuery = useQuery({
    queryKey: [...skincareKeys.ai(), 'weeklyReview', userId, providerType] as const,
    queryFn: async () => {
      if (!userId || !contextQuery.data) return null;
      const res = await skincareAIRepository.generateWeeklyReview(userId, contextQuery.data, providerType);
      return res.success ? res.data : null;
    },
    enabled: !!userId && !!contextQuery.data,
  });

  return {
    context: contextQuery.data || null,
    isLoadingContext: contextQuery.isLoading,
    messages: (conversationQuery.data || []) as SkinChatMessage[],
    isLoadingMessages: conversationQuery.isLoading,
    askCoach: askMutation.mutateAsync,
    isAsking: askMutation.isPending,
    streamingText,
    clearConversation: clearConversationMutation.mutateAsync,
    isClearing: clearConversationMutation.isPending,
    recommendations: recommendationsQuery.data || [],
    isLoadingRecommendations: recommendationsQuery.isLoading,
    weeklyReview: weeklyReviewQuery.data || null,
    isLoadingWeeklyReview: weeklyReviewQuery.isLoading,
    refetchRecommendations: recommendationsQuery.refetch,
    refetchWeeklyReview: weeklyReviewQuery.refetch,
  };
}
