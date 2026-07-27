import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useAuthStore } from '@/shared/stores';
import { sleepAIService } from '../services/sleepAI.service';
import { sleepAIRepository } from '../repository/SleepAIRepository';
import type { ProviderType } from '../providers/providerFactory';
import type { SleepChatMessage, SleepRecommendation, SleepWeeklyReview } from '../types/sleepAI.types';

/**
 * Hook to manage sleep coach chat sessions.
 */
export function useSleepCoachChat(conversationId?: string) {
  const queryClient = useQueryClient();
  const user = useAuthStore((state) => state.user);
  const userId = user?.uid;

  const chatQueryKey = ['sleep', 'chat', conversationId];

  const chatQuery = useQuery<SleepChatMessage[], Error>({
    queryKey: chatQueryKey,
    queryFn: async () => {
      if (!userId || !conversationId) return [];
      return await sleepAIService.getConversation(userId, conversationId);
    },
    enabled: Boolean(userId && conversationId),
    staleTime: 10 * 1000, // 10 seconds stale
  });

  const sendMessageMutation = useMutation({
    mutationFn: async ({
      question,
      providerType = 'heuristic',
    }: {
      question: string;
      providerType?: ProviderType;
    }) => {
      if (!userId || !conversationId) {
        throw new Error('User or Conversation session not initialized.');
      }
      const res = await sleepAIRepository.askCoach(userId, conversationId, question, providerType);
      if (!res.success) {
        throw res.error;
      }
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: chatQueryKey });
    },
  });

  return {
    messages: chatQuery.data ?? [],
    isLoading: chatQuery.isLoading,
    isError: chatQuery.isError,
    error: chatQuery.error,
    refetch: chatQuery.refetch,
    sendMessage: sendMessageMutation.mutateAsync,
    isSending: sendMessageMutation.isPending,
    sendError: sendMessageMutation.error,
  };
}

/**
 * Hook to manage and generate intelligent sleep recommendations.
 */
export function useSleepRecommendations() {
  const queryClient = useQueryClient();
  const user = useAuthStore((state) => state.user);
  const userId = user?.uid;

  const recsQueryKey = ['sleep', 'recommendations'];

  const recsQuery = useQuery<SleepRecommendation[], Error>({
    queryKey: recsQueryKey,
    queryFn: async () => {
      if (!userId) return [];
      return await sleepAIService.getLatestRecommendations(userId);
    },
    enabled: Boolean(userId),
  });

  const generateRecommendationsMutation = useMutation({
    mutationFn: async (providerType: ProviderType = 'heuristic') => {
      if (!userId) {
        throw new Error('User not authenticated.');
      }
      const res = await sleepAIRepository.generateRecommendations(userId, providerType);
      if (!res.success) {
        throw res.error;
      }
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: recsQueryKey });
    },
  });

  return {
    recommendations: recsQuery.data ?? [],
    isLoading: recsQuery.isLoading,
    isError: recsQuery.isError,
    error: recsQuery.error,
    refetch: recsQuery.refetch,
    generate: generateRecommendationsMutation.mutateAsync,
    isGenerating: generateRecommendationsMutation.isPending,
    generateError: generateRecommendationsMutation.error,
  };
}

/**
 * Hook to manage weekly sleep review reports.
 */
export function useSleepWeeklyReview() {
  const queryClient = useQueryClient();
  const user = useAuthStore((state) => state.user);
  const userId = user?.uid;

  const reviewQueryKey = ['sleep', 'weeklyReview'];

  const reviewQuery = useQuery<SleepWeeklyReview | null, Error>({
    queryKey: reviewQueryKey,
    queryFn: async () => {
      if (!userId) return null;
      return await sleepAIService.getLatestWeeklyReview(userId);
    },
    enabled: Boolean(userId),
  });

  const generateReviewMutation = useMutation({
    mutationFn: async (providerType: ProviderType = 'heuristic') => {
      if (!userId) {
        throw new Error('User not authenticated.');
      }
      const res = await sleepAIRepository.generateWeeklyReview(userId, providerType);
      if (!res.success) {
        throw res.error;
      }
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: reviewQueryKey });
    },
  });

  return {
    review: reviewQuery.data ?? null,
    isLoading: reviewQuery.isLoading,
    isError: reviewQuery.isError,
    error: reviewQuery.error,
    refetch: reviewQuery.refetch,
    generate: generateReviewMutation.mutateAsync,
    isGenerating: generateReviewMutation.isPending,
    generateError: generateReviewMutation.error,
  };
}
