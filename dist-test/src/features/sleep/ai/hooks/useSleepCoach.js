"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.useSleepCoachChat = useSleepCoachChat;
exports.useSleepRecommendations = useSleepRecommendations;
exports.useSleepWeeklyReview = useSleepWeeklyReview;
const react_query_1 = require("@tanstack/react-query");
const stores_1 = require("@/shared/stores");
const sleepAI_service_1 = require("../services/sleepAI.service");
const SleepAIRepository_1 = require("../repository/SleepAIRepository");
/**
 * Hook to manage sleep coach chat sessions.
 */
function useSleepCoachChat(conversationId) {
    const queryClient = (0, react_query_1.useQueryClient)();
    const user = (0, stores_1.useAuthStore)((state) => state.user);
    const userId = user?.uid;
    const chatQueryKey = ['sleep', 'chat', conversationId];
    const chatQuery = (0, react_query_1.useQuery)({
        queryKey: chatQueryKey,
        queryFn: async () => {
            if (!userId || !conversationId)
                return [];
            return await sleepAI_service_1.sleepAIService.getConversation(userId, conversationId);
        },
        enabled: Boolean(userId && conversationId),
        staleTime: 10 * 1000, // 10 seconds stale
    });
    const sendMessageMutation = (0, react_query_1.useMutation)({
        mutationFn: async ({ question, providerType = 'heuristic', }) => {
            if (!userId || !conversationId) {
                throw new Error('User or Conversation session not initialized.');
            }
            const res = await SleepAIRepository_1.sleepAIRepository.askCoach(userId, conversationId, question, providerType);
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
function useSleepRecommendations() {
    const queryClient = (0, react_query_1.useQueryClient)();
    const user = (0, stores_1.useAuthStore)((state) => state.user);
    const userId = user?.uid;
    const recsQueryKey = ['sleep', 'recommendations'];
    const recsQuery = (0, react_query_1.useQuery)({
        queryKey: recsQueryKey,
        queryFn: async () => {
            if (!userId)
                return [];
            return await sleepAI_service_1.sleepAIService.getLatestRecommendations(userId);
        },
        enabled: Boolean(userId),
    });
    const generateRecommendationsMutation = (0, react_query_1.useMutation)({
        mutationFn: async (providerType = 'heuristic') => {
            if (!userId) {
                throw new Error('User not authenticated.');
            }
            const res = await SleepAIRepository_1.sleepAIRepository.generateRecommendations(userId, providerType);
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
function useSleepWeeklyReview() {
    const queryClient = (0, react_query_1.useQueryClient)();
    const user = (0, stores_1.useAuthStore)((state) => state.user);
    const userId = user?.uid;
    const reviewQueryKey = ['sleep', 'weeklyReview'];
    const reviewQuery = (0, react_query_1.useQuery)({
        queryKey: reviewQueryKey,
        queryFn: async () => {
            if (!userId)
                return null;
            return await sleepAI_service_1.sleepAIService.getLatestWeeklyReview(userId);
        },
        enabled: Boolean(userId),
    });
    const generateReviewMutation = (0, react_query_1.useMutation)({
        mutationFn: async (providerType = 'heuristic') => {
            if (!userId) {
                throw new Error('User not authenticated.');
            }
            const res = await SleepAIRepository_1.sleepAIRepository.generateWeeklyReview(userId, providerType);
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
