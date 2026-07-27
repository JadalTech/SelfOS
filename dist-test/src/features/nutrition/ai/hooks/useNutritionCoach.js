"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.useNutritionCoach = useNutritionCoach;
const react_1 = require("react");
const react_query_1 = require("@tanstack/react-query");
const auth_store_1 = require("../../../../shared/stores/auth.store");
const nutrition_repository_1 = require("../../repository/nutrition.repository");
const nutritionAIRepository_1 = require("../repository/nutritionAIRepository");
const NutritionContextBuilder_1 = require("../utils/context/NutritionContextBuilder");
const queryKeys_1 = require("../../hooks/queryKeys");
function useNutritionCoach(providerType = 'heuristic') {
    const userId = (0, auth_store_1.useAuthStore)((s) => s.user?.uid);
    const queryClient = (0, react_query_1.useQueryClient)();
    const [streamingText, setStreamingText] = (0, react_1.useState)('');
    const contextQuery = (0, react_query_1.useQuery)({
        queryKey: [...queryKeys_1.nutritionKeys.all, 'ai', 'context', userId],
        queryFn: async () => {
            if (!userId)
                return null;
            const [logsRes, goalsRes] = await Promise.all([
                nutrition_repository_1.nutritionRepository.fetchLogs(userId, 7),
                nutrition_repository_1.nutritionRepository.fetchGoals(userId),
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
            return NutritionContextBuilder_1.NutritionContextBuilder.buildAIContext(latestLog, activeGoal, streak, weeklyAvgCalories, weeklyAdherence, []);
        },
        enabled: !!userId,
    });
    const conversationQuery = (0, react_query_1.useQuery)({
        queryKey: [...queryKeys_1.nutritionKeys.all, 'ai', 'conversation', userId],
        queryFn: async () => {
            if (!userId)
                return [];
            const res = await nutritionAIRepository_1.nutritionAIRepository.fetchConversation(userId);
            return res.success ? res.data : [];
        },
        enabled: !!userId,
    });
    const askMutation = (0, react_query_1.useMutation)({
        mutationFn: async (question) => {
            if (!userId)
                throw new Error('User authentication required');
            const context = contextQuery.data;
            if (!context)
                throw new Error('Nutrition AI context unavailable');
            setStreamingText('');
            const res = await nutritionAIRepository_1.nutritionAIRepository.askCoach(userId, question, context, providerType);
            if (!res.success)
                throw res.error;
            return res.data;
        },
        onSuccess: () => {
            setStreamingText('');
            queryClient.invalidateQueries({ queryKey: [...queryKeys_1.nutritionKeys.all, 'ai', 'conversation', userId] });
        },
    });
    const clearConversationMutation = (0, react_query_1.useMutation)({
        mutationFn: async () => {
            if (!userId)
                return;
            const res = await nutritionAIRepository_1.nutritionAIRepository.clearConversation(userId);
            if (!res.success)
                throw res.error;
        },
        onSuccess: () => {
            queryClient.setQueryData([...queryKeys_1.nutritionKeys.all, 'ai', 'conversation', userId], []);
        },
    });
    const recommendationsQuery = (0, react_query_1.useQuery)({
        queryKey: [...queryKeys_1.nutritionKeys.all, 'ai', 'recommendations', userId, providerType],
        queryFn: async () => {
            if (!userId || !contextQuery.data)
                return [];
            const res = await nutritionAIRepository_1.nutritionAIRepository.generateRecommendations(userId, contextQuery.data, providerType);
            return res.success ? res.data : [];
        },
        enabled: !!userId && !!contextQuery.data,
    });
    const weeklyReviewQuery = (0, react_query_1.useQuery)({
        queryKey: [...queryKeys_1.nutritionKeys.all, 'ai', 'weeklyReview', userId, providerType],
        queryFn: async () => {
            if (!userId || !contextQuery.data)
                return null;
            const res = await nutritionAIRepository_1.nutritionAIRepository.generateWeeklyReview(userId, contextQuery.data, providerType);
            return res.success ? res.data : null;
        },
        enabled: !!userId && !!contextQuery.data,
    });
    return {
        context: contextQuery.data || null,
        isLoadingContext: contextQuery.isLoading,
        messages: (conversationQuery.data || []),
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
