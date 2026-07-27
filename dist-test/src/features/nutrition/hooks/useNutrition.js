"use strict";
/**
 * React Query Hooks for Nutrition Module
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.useNutritionFoods = useNutritionFoods;
exports.useNutritionLogs = useNutritionLogs;
exports.useNutritionGoals = useNutritionGoals;
exports.useNutritionTemplates = useNutritionTemplates;
exports.useNutritionAnalytics = useNutritionAnalytics;
const react_query_1 = require("@tanstack/react-query");
const auth_store_1 = require("../../../shared/stores/auth.store");
const nutrition_repository_1 = require("../repository/nutrition.repository");
const queryKeys_1 = require("./queryKeys");
const nutrition_mapper_1 = require("../mappers/nutrition.mapper");
function useNutritionFoods(searchTerm = '') {
    const queryClient = (0, react_query_1.useQueryClient)();
    const userId = (0, auth_store_1.useAuthStore)((s) => s.user?.uid);
    const query = (0, react_query_1.useQuery)({
        queryKey: queryKeys_1.nutritionKeys.foodSearch(searchTerm),
        queryFn: async () => {
            if (!userId)
                return [];
            const res = await nutrition_repository_1.nutritionRepository.searchFoods(userId, searchTerm);
            if (!res.success)
                throw res.error;
            return res.data;
        },
        enabled: !!userId,
        staleTime: 5 * 60 * 1000,
        gcTime: 15 * 60 * 1000,
    });
    const createMutation = (0, react_query_1.useMutation)({
        mutationFn: async (food) => {
            if (!userId)
                throw new Error('User authentication required');
            const res = await nutrition_repository_1.nutritionRepository.createUserFood(userId, food);
            if (!res.success)
                throw res.error;
            return res.data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: queryKeys_1.nutritionKeys.foods() });
        },
    });
    const deleteMutation = (0, react_query_1.useMutation)({
        mutationFn: async (foodId) => {
            if (!userId)
                throw new Error('User authentication required');
            const res = await nutrition_repository_1.nutritionRepository.deleteUserFood(userId, foodId);
            if (!res.success)
                throw res.error;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: queryKeys_1.nutritionKeys.foods() });
        },
    });
    return {
        foodVMs: (0, nutrition_mapper_1.mapToFoodVMs)(query.data || []),
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
function useNutritionLogs(dateStr) {
    const queryClient = (0, react_query_1.useQueryClient)();
    const userId = (0, auth_store_1.useAuthStore)((s) => s.user?.uid);
    // Fetch log list
    const listQuery = (0, react_query_1.useQuery)({
        queryKey: queryKeys_1.nutritionKeys.logs(),
        queryFn: async () => {
            if (!userId)
                return [];
            const res = await nutrition_repository_1.nutritionRepository.fetchLogs(userId);
            if (!res.success)
                throw res.error;
            return res.data;
        },
        enabled: !!userId,
        staleTime: 5 * 60 * 1000,
        gcTime: 15 * 60 * 1000,
    });
    // Fetch log for specific date
    const dateQuery = (0, react_query_1.useQuery)({
        queryKey: queryKeys_1.nutritionKeys.logByDate(dateStr || ''),
        queryFn: async () => {
            if (!userId || !dateStr)
                return null;
            const res = await nutrition_repository_1.nutritionRepository.getLogByDate(userId, dateStr);
            if (!res.success)
                throw res.error;
            return res.data;
        },
        enabled: !!userId && !!dateStr,
        staleTime: 5 * 60 * 1000,
        gcTime: 15 * 60 * 1000,
    });
    const addFoodMutation = (0, react_query_1.useMutation)({
        mutationFn: async (params) => {
            if (!userId)
                throw new Error('User authentication required');
            const res = await nutrition_repository_1.nutritionRepository.addFoodToMeal(userId, params.date, params.mealType, params.food, params.quantity);
            if (!res.success)
                throw res.error;
            return res.data;
        },
        onSuccess: (_, variables) => {
            queryClient.invalidateQueries({ queryKey: queryKeys_1.nutritionKeys.logs() });
            queryClient.invalidateQueries({ queryKey: queryKeys_1.nutritionKeys.logByDate(variables.date) });
            queryClient.invalidateQueries({ queryKey: queryKeys_1.nutritionKeys.analytics() });
        },
    });
    const removeFoodMutation = (0, react_query_1.useMutation)({
        mutationFn: async (params) => {
            if (!userId)
                throw new Error('User authentication required');
            const res = await nutrition_repository_1.nutritionRepository.removeFoodFromMeal(userId, params.date, params.mealType, params.entryId);
            if (!res.success)
                throw res.error;
            return res.data;
        },
        onSuccess: (_, variables) => {
            queryClient.invalidateQueries({ queryKey: queryKeys_1.nutritionKeys.logs() });
            queryClient.invalidateQueries({ queryKey: queryKeys_1.nutritionKeys.logByDate(variables.date) });
            queryClient.invalidateQueries({ queryKey: queryKeys_1.nutritionKeys.analytics() });
        },
    });
    const completeMutation = (0, react_query_1.useMutation)({
        mutationFn: async (params) => {
            if (!userId)
                throw new Error('User authentication required');
            const res = await nutrition_repository_1.nutritionRepository.completeDailyLog(userId, params.date, params.isCompleted);
            if (!res.success)
                throw res.error;
            return res.data;
        },
        onSuccess: (_, variables) => {
            queryClient.invalidateQueries({ queryKey: queryKeys_1.nutritionKeys.logs() });
            queryClient.invalidateQueries({ queryKey: queryKeys_1.nutritionKeys.logByDate(variables.date) });
        },
    });
    const refetchLogs = async () => {
        await Promise.all([listQuery.refetch(), dateQuery.refetch()]);
    };
    return {
        dailyNutritionVMs: (0, nutrition_mapper_1.mapToDailyNutritionVMs)(listQuery.data || []),
        isLoadingList: listQuery.isLoading,
        activeDailyLogVM: dateQuery.data ? (0, nutrition_mapper_1.mapToDailyNutritionVM)(dateQuery.data) : null,
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
function useNutritionGoals() {
    const queryClient = (0, react_query_1.useQueryClient)();
    const userId = (0, auth_store_1.useAuthStore)((s) => s.user?.uid);
    const query = (0, react_query_1.useQuery)({
        queryKey: queryKeys_1.nutritionKeys.goals(),
        queryFn: async () => {
            if (!userId)
                return [];
            const res = await nutrition_repository_1.nutritionRepository.fetchGoals(userId);
            if (!res.success)
                throw res.error;
            return res.data;
        },
        enabled: !!userId,
        staleTime: 5 * 60 * 1000,
        gcTime: 15 * 60 * 1000,
    });
    const saveGoalMutation = (0, react_query_1.useMutation)({
        mutationFn: async (goal) => {
            if (!userId)
                throw new Error('User authentication required');
            const res = await nutrition_repository_1.nutritionRepository.saveGoal(userId, goal);
            if (!res.success)
                throw res.error;
            return res.data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: queryKeys_1.nutritionKeys.goals() });
            queryClient.invalidateQueries({ queryKey: queryKeys_1.nutritionKeys.analytics() });
        },
    });
    const toggleGoalMutation = (0, react_query_1.useMutation)({
        mutationFn: async (params) => {
            if (!userId)
                throw new Error('User authentication required');
            const res = await nutrition_repository_1.nutritionRepository.toggleGoalActive(userId, params.goalId, params.isActive);
            if (!res.success)
                throw res.error;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: queryKeys_1.nutritionKeys.goals() });
            queryClient.invalidateQueries({ queryKey: queryKeys_1.nutritionKeys.analytics() });
        },
    });
    const goals = query.data || [];
    const activeGoalVM = goals.find((g) => g.isActive) ? (0, nutrition_mapper_1.mapToGoalVMs)(goals).find((g) => g.isActive) : null;
    return {
        goalVMs: (0, nutrition_mapper_1.mapToGoalVMs)(goals),
        activeGoalVM,
        isLoading: query.isLoading,
        saveGoal: saveGoalMutation.mutateAsync,
        isSaving: saveGoalMutation.isPending,
        toggleGoalActive: toggleGoalMutation.mutateAsync,
        isToggling: toggleGoalMutation.isPending,
    };
}
function useNutritionTemplates() {
    const queryClient = (0, react_query_1.useQueryClient)();
    const userId = (0, auth_store_1.useAuthStore)((s) => s.user?.uid);
    const query = (0, react_query_1.useQuery)({
        queryKey: queryKeys_1.nutritionKeys.templates(),
        queryFn: async () => {
            if (!userId)
                return [];
            const res = await nutrition_repository_1.nutritionRepository.fetchTemplates(userId);
            if (!res.success)
                throw res.error;
            return res.data;
        },
        enabled: !!userId,
        staleTime: 5 * 60 * 1000,
        gcTime: 15 * 60 * 1000,
    });
    const createTemplateMutation = (0, react_query_1.useMutation)({
        mutationFn: async (params) => {
            if (!userId)
                throw new Error('User authentication required');
            const res = await nutrition_repository_1.nutritionRepository.createTemplate(userId, params.title, params.mealType, params.entries);
            if (!res.success)
                throw res.error;
            return res.data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: queryKeys_1.nutritionKeys.templates() });
        },
    });
    const deleteTemplateMutation = (0, react_query_1.useMutation)({
        mutationFn: async (templateId) => {
            if (!userId)
                throw new Error('User authentication required');
            const res = await nutrition_repository_1.nutritionRepository.deleteTemplate(userId, templateId);
            if (!res.success)
                throw res.error;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: queryKeys_1.nutritionKeys.templates() });
        },
    });
    return {
        templateVMs: (0, nutrition_mapper_1.mapToTemplateVMs)(query.data || []),
        isLoading: query.isLoading,
        createTemplate: createTemplateMutation.mutateAsync,
        isCreating: createTemplateMutation.isPending,
        deleteTemplate: deleteTemplateMutation.mutateAsync,
        isDeleting: deleteTemplateMutation.isPending,
    };
}
function useNutritionAnalytics(limitDays = 30) {
    const userId = (0, auth_store_1.useAuthStore)((s) => s.user?.uid);
    const query = (0, react_query_1.useQuery)({
        queryKey: [...queryKeys_1.nutritionKeys.analytics(), { limitDays }],
        queryFn: async () => {
            if (!userId)
                return [];
            const res = await nutrition_repository_1.nutritionRepository.fetchAnalyticsRecords(userId, limitDays);
            if (!res.success)
                throw res.error;
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
