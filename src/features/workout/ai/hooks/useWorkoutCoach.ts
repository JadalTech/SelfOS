/**
 * React Query Hooks for Workout AI Coach
 */

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useAuthStore } from '../../../../shared/stores/auth.store';
import { useWorkoutPlans, useWorkoutHistory, usePersonalRecords } from '../../hooks/useWorkout';
import { workoutAIRepository } from '../repository/WorkoutAIRepository';
import { WorkoutContextBuilder } from '../utils/context/WorkoutContextBuilder';
import { workoutKeys } from '../../hooks/queryKeys';
import type { ProviderType } from '../providers/providerFactory';
import type { WorkoutChatMessage } from '../types/workoutAI.types';

export function useWorkoutCoach(providerType: ProviderType = 'heuristic') {
  const userId = useAuthStore((s) => s.user?.uid);
  const queryClient = useQueryClient();

  // Load deterministic context data from other Workout hooks
  const { rawPlans, isLoading: plansLoading } = useWorkoutPlans();
  const { rawHistory, isLoading: historyLoading } = useWorkoutHistory(10);
  const { rawPersonalRecords, isLoading: prsLoading } = usePersonalRecords();

  const isBaseDataLoading = plansLoading || historyLoading || prsLoading;

  // 1. Build context query
  const contextQuery = useQuery({
    queryKey: [...workoutKeys.all, 'ai', 'context', userId] as const,
    queryFn: () => {
      if (!userId) return null;

      const activePlan = rawPlans.find((p) => p.isActive) || null;
      return WorkoutContextBuilder.buildAIContext(
        activePlan,
        rawHistory,
        rawPersonalRecords
      );
    },
    enabled: !!userId && !isBaseDataLoading,
  });

  // 2. Conversation query
  const conversationQuery = useQuery({
    queryKey: [...workoutKeys.all, 'ai', 'conversation', userId] as const,
    queryFn: async () => {
      if (!userId) return [];
      const res = await workoutAIRepository.fetchConversation(userId);
      return res.success ? res.data : [];
    },
    enabled: !!userId,
  });

  // 3. Ask Coach Mutation
  const askMutation = useMutation({
    mutationFn: async (question: string) => {
      if (!userId) throw new Error('User authentication required');
      const context = contextQuery.data;
      if (!context) throw new Error('Workout AI context unavailable');

      const res = await workoutAIRepository.askCoach(userId, question, context, providerType);
      if (!res.success) throw res.error;
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [...workoutKeys.all, 'ai', 'conversation', userId] });
    },
  });

  // 4. Clear Conversation Mutation
  const clearConversationMutation = useMutation({
    mutationFn: async () => {
      if (!userId) return;
      const res = await workoutAIRepository.clearConversation(userId);
      if (!res.success) throw res.error;
    },
    onSuccess: () => {
      queryClient.setQueryData([...workoutKeys.all, 'ai', 'conversation', userId], []);
    },
  });

  // 5. Recommendations Query
  const recommendationsQuery = useQuery({
    queryKey: [...workoutKeys.all, 'ai', 'recommendations', userId, providerType] as const,
    queryFn: async () => {
      if (!userId || !contextQuery.data) return [];
      const res = await workoutAIRepository.generateRecommendations(userId, contextQuery.data, providerType);
      return res.success ? res.data : [];
    },
    enabled: !!userId && !!contextQuery.data,
  });

  // 6. Weekly Review Query
  const weeklyReviewQuery = useQuery({
    queryKey: [...workoutKeys.all, 'ai', 'weeklyReview', userId, providerType] as const,
    queryFn: async () => {
      if (!userId || !contextQuery.data) return null;
      const res = await workoutAIRepository.generateWeeklyReview(userId, contextQuery.data, providerType);
      return res.success ? res.data : null;
    },
    enabled: !!userId && !!contextQuery.data,
  });

  return {
    context: contextQuery.data || null,
    isLoadingContext: contextQuery.isLoading || isBaseDataLoading,
    messages: (conversationQuery.data || []) as WorkoutChatMessage[],
    isLoadingMessages: conversationQuery.isLoading,
    askCoach: askMutation.mutateAsync,
    isAsking: askMutation.isPending,
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
