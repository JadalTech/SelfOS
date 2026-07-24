import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useAuthStore } from '../../../../shared/stores/auth.store';
import { nutritionRepository } from '../../repository/nutrition.repository';
import { nutritionAIRepository } from '../repository/nutritionAIRepository';
import { NutritionContextBuilder } from '../utils/context/NutritionContextBuilder';
import { nutritionKeys } from '../../hooks/queryKeys';
import type { ProviderType } from '../providers/providerFactory';
import type { NutritionChatMessage } from '../types/nutritionAI.types';

export function useNutritionCoach(providerType: ProviderType = 'heuristic') {
  const userId = useAuthStore((s) => s.user?.uid);
  const queryClient = useQueryClient();
  const [streamingText, setStreamingText] = useState<string>('');

  const contextQuery = useQuery({
    queryKey: [...nutritionKeys.all, 'ai', 'context', userId] as const,
    queryFn: async () => {
      if (!userId) return null;

      const [logsRes, goalsRes] = await Promise.all([
        nutritionRepository.fetchLogs(userId, 7),
        nutritionRepository.fetchGoals(userId),
      ]);

      const logs = logsRes.success ? logsRes.data : [];
      const goals = goalsRes.success ? goalsRes.data : [];
      const activeGoal = goals.find((g) => g.isActive) || null;
      const latestLog = logs[0] || null;

      // Extract streak & averages deterministically
      const streak = logs.length; 
      const weeklyAvgCalories = logs.length > 0 
        ? Math.round(logs.reduce((acc, log) => acc + log.totalNutrition.calories, 0) / logs.length)
        : 2000;
      
      const weeklyAdherence = logs.length > 0
        ? logs.filter((log) => log.isCompleted).length
        : 5;

      return NutritionContextBuilder.buildAIContext(
        latestLog,
        activeGoal,
        streak,
        weeklyAvgCalories,
        weeklyAdherence,
        []
      );
    },
    enabled: !!userId,
  });

  const conversationQuery = useQuery({
    queryKey: [...nutritionKeys.all, 'ai', 'conversation', userId] as const,
    queryFn: async () => {
      if (!userId) return [];
      const res = await nutritionAIRepository.fetchConversation(userId);
      return res.success ? res.data : [];
    },
    enabled: !!userId,
  });

  const askMutation = useMutation({
    mutationFn: async (question: string) => {
      if (!userId) throw new Error('User authentication required');
      const context = contextQuery.data;
      if (!context) throw new Error('Nutrition AI context unavailable');

      setStreamingText('');

      const res = await nutritionAIRepository.askCoach(userId, question, context, providerType);
      if (!res.success) throw res.error;
      return res.data;
    },
    onSuccess: () => {
      setStreamingText('');
      queryClient.invalidateQueries({ queryKey: [...nutritionKeys.all, 'ai', 'conversation', userId] });
    },
  });

  const clearConversationMutation = useMutation({
    mutationFn: async () => {
      if (!userId) return;
      const res = await nutritionAIRepository.clearConversation(userId);
      if (!res.success) throw res.error;
    },
    onSuccess: () => {
      queryClient.setQueryData([...nutritionKeys.all, 'ai', 'conversation', userId], []);
    },
  });

  const recommendationsQuery = useQuery({
    queryKey: [...nutritionKeys.all, 'ai', 'recommendations', userId, providerType] as const,
    queryFn: async () => {
      if (!userId || !contextQuery.data) return [];
      const res = await nutritionAIRepository.generateRecommendations(userId, contextQuery.data, providerType);
      return res.success ? res.data : [];
    },
    enabled: !!userId && !!contextQuery.data,
  });

  const weeklyReviewQuery = useQuery({
    queryKey: [...nutritionKeys.all, 'ai', 'weeklyReview', userId, providerType] as const,
    queryFn: async () => {
      if (!userId || !contextQuery.data) return null;
      const res = await nutritionAIRepository.generateWeeklyReview(userId, contextQuery.data, providerType);
      return res.success ? res.data : null;
    },
    enabled: !!userId && !!contextQuery.data,
  });

  return {
    context: contextQuery.data || null,
    isLoadingContext: contextQuery.isLoading,
    messages: (conversationQuery.data || []) as NutritionChatMessage[],
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
