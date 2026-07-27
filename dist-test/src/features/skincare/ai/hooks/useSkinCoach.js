"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.useSkinCoach = useSkinCoach;
const react_1 = require("react");
const react_query_1 = require("@tanstack/react-query");
const auth_store_1 = require("../../../../shared/stores/auth.store");
const skincare_repository_1 = require("../../repository/skincare.repository");
const skinAssessment_repository_1 = require("../../repository/skinAssessment.repository");
const skincareAI_repository_1 = require("../repository/skincareAI.repository");
const SkinAIContextBuilder_1 = require("../utils/SkinAIContextBuilder");
const queryKeys_1 = require("../../hooks/queryKeys");
function useSkinCoach(providerType = 'heuristic') {
    const userId = (0, auth_store_1.useAuthStore)((s) => s.user?.uid);
    const queryClient = (0, react_query_1.useQueryClient)();
    const [streamingText, setStreamingText] = (0, react_1.useState)('');
    const contextQuery = (0, react_query_1.useQuery)({
        queryKey: queryKeys_1.skincareKeys.ai(),
        queryFn: async () => {
            if (!userId)
                return null;
            const [assessmentsRes, routinesRes, logsRes, productsRes] = await Promise.all([
                skinAssessment_repository_1.skinAssessmentRepository.fetchAssessments(userId),
                skincare_repository_1.skincareRepository.fetchRoutines(userId),
                skincare_repository_1.skincareRepository.fetchLogs(userId, 30),
                skincare_repository_1.skincareRepository.fetchProducts(userId),
            ]);
            const assessments = assessmentsRes.success ? assessmentsRes.data : [];
            const routines = routinesRes.success ? routinesRes.data : [];
            const logs = logsRes.success ? logsRes.data : [];
            const products = productsRes.success ? productsRes.data : [];
            return SkinAIContextBuilder_1.SkinAIContextBuilder.buildContext({
                assessments,
                routines,
                logs,
                products,
            });
        },
        enabled: !!userId,
    });
    const conversationQuery = (0, react_query_1.useQuery)({
        queryKey: [...queryKeys_1.skincareKeys.ai(), 'conversation', userId],
        queryFn: async () => {
            if (!userId)
                return [];
            const res = await skincareAI_repository_1.skincareAIRepository.fetchConversation(userId);
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
                throw new Error('Skin AI context unavailable');
            setStreamingText('');
            const res = await skincareAI_repository_1.skincareAIRepository.askCoach(userId, question, context, providerType);
            if (!res.success)
                throw res.error;
            return res.data;
        },
        onSuccess: () => {
            setStreamingText('');
            queryClient.invalidateQueries({ queryKey: [...queryKeys_1.skincareKeys.ai(), 'conversation', userId] });
        },
    });
    const clearConversationMutation = (0, react_query_1.useMutation)({
        mutationFn: async () => {
            if (!userId)
                return;
            const res = await skincareAI_repository_1.skincareAIRepository.clearConversation(userId);
            if (!res.success)
                throw res.error;
        },
        onSuccess: () => {
            queryClient.setQueryData([...queryKeys_1.skincareKeys.ai(), 'conversation', userId], []);
        },
    });
    const recommendationsQuery = (0, react_query_1.useQuery)({
        queryKey: [...queryKeys_1.skincareKeys.ai(), 'recommendations', userId, providerType],
        queryFn: async () => {
            if (!userId || !contextQuery.data)
                return [];
            const res = await skincareAI_repository_1.skincareAIRepository.generateRecommendations(userId, contextQuery.data, providerType);
            return res.success ? res.data : [];
        },
        enabled: !!userId && !!contextQuery.data,
    });
    const weeklyReviewQuery = (0, react_query_1.useQuery)({
        queryKey: [...queryKeys_1.skincareKeys.ai(), 'weeklyReview', userId, providerType],
        queryFn: async () => {
            if (!userId || !contextQuery.data)
                return null;
            const res = await skincareAI_repository_1.skincareAIRepository.generateWeeklyReview(userId, contextQuery.data, providerType);
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
