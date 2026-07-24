/**
 * React Query Hooks for Nutrition Module
 */

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useAuthStore } from '../../../shared/stores/auth.store';
import { nutritionRepository } from '../repository/nutrition.repository';
import { nutritionKeys } from './queryKeys';
import {
  mapToFoodVMs,
  mapToDailyNutritionVM,
  mapToDailyNutritionVMs,
  mapToGoalVMs,
  mapToTemplateVMs,
} from '../mappers/nutrition.mapper';
import type { Food, NutritionGoal, MealType, FoodEntry } from '../types/nutrition.types';

export function useNutritionFoods(searchTerm = '') {
  const queryClient = useQueryClient();
  const userId = useAuthStore((s) => s.user?.uid);

  const query = useQuery({
    queryKey: nutritionKeys.foodSearch(searchTerm),
    queryFn: async () => {
      if (!userId) return [];
      const res = await nutritionRepository.searchFoods(userId, searchTerm);
      if (!res.success) throw res.error;
      return res.data;
    },
    enabled: !!userId,
    staleTime: 5 * 60 * 1000,
    gcTime: 15 * 60 * 1000,
  });

  const createMutation = useMutation({
    mutationFn: async (food: Omit<Food, 'id' | 'userId' | 'createdAt' | 'updatedAt'>) => {
      if (!userId) throw new Error('User authentication required');
      const res = await nutritionRepository.createUserFood(userId, food);
      if (!res.success) throw res.error;
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: nutritionKeys.foods() });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (foodId: string) => {
      if (!userId) throw new Error('User authentication required');
      const res = await nutritionRepository.deleteUserFood(userId, foodId);
      if (!res.success) throw res.error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: nutritionKeys.foods() });
    },
  });

  return {
    foodVMs: mapToFoodVMs(query.data || []),
    isLoading: query.isLoading,
    isError: query.isError,
    error: query.error,
    refetch: query.refetch,
    createUserFood: createMutation.mutateAsync,
    isCreating: createMutation.isPending,
    deleteUserFood: deleteMutation.mutateAsync,
    isDeleting: deleteMutation.isPending,
  };
}

export function useNutritionLogs(dateStr?: string) {
  const queryClient = useQueryClient();
  const userId = useAuthStore((s) => s.user?.uid);

  // Fetch log list
  const listQuery = useQuery({
    queryKey: nutritionKeys.logs(),
    queryFn: async () => {
      if (!userId) return [];
      const res = await nutritionRepository.fetchLogs(userId);
      if (!res.success) throw res.error;
      return res.data;
    },
    enabled: !!userId,
    staleTime: 5 * 60 * 1000,
    gcTime: 15 * 60 * 1000,
  });

  // Fetch log for specific date
  const dateQuery = useQuery({
    queryKey: nutritionKeys.logByDate(dateStr || ''),
    queryFn: async () => {
      if (!userId || !dateStr) return null;
      const res = await nutritionRepository.getLogByDate(userId, dateStr);
      if (!res.success) throw res.error;
      return res.data;
    },
    enabled: !!userId && !!dateStr,
    staleTime: 5 * 60 * 1000,
    gcTime: 15 * 60 * 1000,
  });

  const addFoodMutation = useMutation({
    mutationFn: async (params: { date: string; mealType: MealType; food: Food; quantity: number }) => {
      if (!userId) throw new Error('User authentication required');
      const res = await nutritionRepository.addFoodToMeal(
        userId,
        params.date,
        params.mealType,
        params.food,
        params.quantity
      );
      if (!res.success) throw res.error;
      return res.data;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: nutritionKeys.logs() });
      queryClient.invalidateQueries({ queryKey: nutritionKeys.logByDate(variables.date) });
      queryClient.invalidateQueries({ queryKey: nutritionKeys.analytics() });
    },
  });

  const removeFoodMutation = useMutation({
    mutationFn: async (params: { date: string; mealType: MealType; entryId: string }) => {
      if (!userId) throw new Error('User authentication required');
      const res = await nutritionRepository.removeFoodFromMeal(
        userId,
        params.date,
        params.mealType,
        params.entryId
      );
      if (!res.success) throw res.error;
      return res.data;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: nutritionKeys.logs() });
      queryClient.invalidateQueries({ queryKey: nutritionKeys.logByDate(variables.date) });
      queryClient.invalidateQueries({ queryKey: nutritionKeys.analytics() });
    },
  });

  const completeMutation = useMutation({
    mutationFn: async (params: { date: string; isCompleted: boolean }) => {
      if (!userId) throw new Error('User authentication required');
      const res = await nutritionRepository.completeDailyLog(userId, params.date, params.isCompleted);
      if (!res.success) throw res.error;
      return res.data;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: nutritionKeys.logs() });
      queryClient.invalidateQueries({ queryKey: nutritionKeys.logByDate(variables.date) });
    },
  });

  const refetchLogs = async () => {
    await Promise.all([listQuery.refetch(), dateQuery.refetch()]);
  };

  return {
    dailyNutritionVMs: mapToDailyNutritionVMs(listQuery.data || []),
    isLoadingList: listQuery.isLoading,
    activeDailyLogVM: dateQuery.data ? mapToDailyNutritionVM(dateQuery.data) : null,
    isLoadingDate: dateQuery.isLoading,
    isError: listQuery.isError || dateQuery.isError,
    error: listQuery.error || dateQuery.error,
    refetchLogs,
    addFoodToMeal: addFoodMutation.mutateAsync,
    isAdding: addFoodMutation.isPending,
    removeFoodFromMeal: removeFoodMutation.mutateAsync,
    isRemoving: removeFoodMutation.isPending,
    completeDailyLog: completeMutation.mutateAsync,
    isCompleting: completeMutation.isPending,
  };
}

export function useNutritionGoals() {
  const queryClient = useQueryClient();
  const userId = useAuthStore((s) => s.user?.uid);

  const query = useQuery({
    queryKey: nutritionKeys.goals(),
    queryFn: async () => {
      if (!userId) return [];
      const res = await nutritionRepository.fetchGoals(userId);
      if (!res.success) throw res.error;
      return res.data;
    },
    enabled: !!userId,
    staleTime: 5 * 60 * 1000,
    gcTime: 15 * 60 * 1000,
  });

  const saveGoalMutation = useMutation({
    mutationFn: async (goal: Omit<NutritionGoal, 'id' | 'userId' | 'createdAt' | 'updatedAt'>) => {
      if (!userId) throw new Error('User authentication required');
      const res = await nutritionRepository.saveGoal(userId, goal);
      if (!res.success) throw res.error;
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: nutritionKeys.goals() });
      queryClient.invalidateQueries({ queryKey: nutritionKeys.analytics() });
    },
  });

  const toggleGoalMutation = useMutation({
    mutationFn: async (params: { goalId: string; isActive: boolean }) => {
      if (!userId) throw new Error('User authentication required');
      const res = await nutritionRepository.toggleGoalActive(userId, params.goalId, params.isActive);
      if (!res.success) throw res.error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: nutritionKeys.goals() });
      queryClient.invalidateQueries({ queryKey: nutritionKeys.analytics() });
    },
  });

  const goals = query.data || [];
  const activeGoalVM = goals.find((g) => g.isActive) ? mapToGoalVMs(goals).find((g) => g.isActive) : null;

  return {
    goalVMs: mapToGoalVMs(goals),
    activeGoalVM,
    isLoading: query.isLoading,
    saveGoal: saveGoalMutation.mutateAsync,
    isSaving: saveGoalMutation.isPending,
    toggleGoalActive: toggleGoalMutation.mutateAsync,
    isToggling: toggleGoalMutation.isPending,
  };
}

export function useNutritionTemplates() {
  const queryClient = useQueryClient();
  const userId = useAuthStore((s) => s.user?.uid);

  const query = useQuery({
    queryKey: nutritionKeys.templates(),
    queryFn: async () => {
      if (!userId) return [];
      const res = await nutritionRepository.fetchTemplates(userId);
      if (!res.success) throw res.error;
      return res.data;
    },
    enabled: !!userId,
    staleTime: 5 * 60 * 1000,
    gcTime: 15 * 60 * 1000,
  });

  const createTemplateMutation = useMutation({
    mutationFn: async (params: { title: string; mealType: MealType; entries: FoodEntry[] }) => {
      if (!userId) throw new Error('User authentication required');
      const res = await nutritionRepository.createTemplate(userId, params.title, params.mealType, params.entries);
      if (!res.success) throw res.error;
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: nutritionKeys.templates() });
    },
  });

  const deleteTemplateMutation = useMutation({
    mutationFn: async (templateId: string) => {
      if (!userId) throw new Error('User authentication required');
      const res = await nutritionRepository.deleteTemplate(userId, templateId);
      if (!res.success) throw res.error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: nutritionKeys.templates() });
    },
  });

  return {
    templateVMs: mapToTemplateVMs(query.data || []),
    isLoading: query.isLoading,
    createTemplate: createTemplateMutation.mutateAsync,
    isCreating: createTemplateMutation.isPending,
    deleteTemplate: deleteTemplateMutation.mutateAsync,
    isDeleting: deleteTemplateMutation.isPending,
  };
}

export function useNutritionAnalytics(limitDays = 30) {
  const userId = useAuthStore((s) => s.user?.uid);

  const query = useQuery({
    queryKey: [...nutritionKeys.analytics(), { limitDays }] as const,
    queryFn: async () => {
      if (!userId) return [];
      const res = await nutritionRepository.fetchAnalyticsRecords(userId, limitDays);
      if (!res.success) throw res.error;
      return res.data;
    },
    enabled: !!userId,
    staleTime: 5 * 60 * 1000,
    gcTime: 15 * 60 * 1000,
  });

  return {
    analyticsRecords: query.data || [],
    isLoading: query.isLoading,
    isError: query.isError,
    error: query.error,
    refetch: query.refetch,
  };
}
