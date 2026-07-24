"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.useSkinCoach = useSkinCoach;
const react_query_1 = require("@tanstack/react-query");
const auth_store_1 = require("../../../../shared/stores/auth.store");
const skincare_repository_1 = require("../../repository/skincare.repository");
const skinAssessment_repository_1 = require("../../repository/skinAssessment.repository");
const skincareAI_repository_1 = require("../repository/skincareAI.repository");
const SkinAIContextBuilder_1 = require("../utils/SkinAIContextBuilder");
const queryKeys_1 = require("../../hooks/queryKeys");
function useSkinCoach() {
    const userId = (0, auth_store_1.useAuthStore)((s) => s.user?.uid);
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
    const askMutation = (0, react_query_1.useMutation)({
        mutationFn: async (question) => {
            const context = contextQuery.data;
            if (!context)
                throw new Error('Skin AI context unavailable');
            const res = await skincareAI_repository_1.skincareAIRepository.askCoach(question, context);
            if (!res.success)
                throw res.error;
            return res.data;
        },
    });
    const recommendationsQuery = (0, react_query_1.useQuery)({
        queryKey: [...queryKeys_1.skincareKeys.ai(), 'recommendations'],
        queryFn: async () => {
            const context = contextQuery.data;
            if (!context)
                return [];
            const res = await skincareAI_repository_1.skincareAIRepository.getRecommendations(context);
            if (!res.success)
                throw res.error;
            return res.data;
        },
        enabled: !!contextQuery.data,
    });
    const weeklyReviewQuery = (0, react_query_1.useQuery)({
        queryKey: [...queryKeys_1.skincareKeys.ai(), 'weeklyReview'],
        queryFn: async () => {
            const context = contextQuery.data;
            if (!context)
                return null;
            const res = await skincareAI_repository_1.skincareAIRepository.getWeeklyReview(context);
            if (!res.success)
                throw res.error;
            return res.data;
        },
        enabled: !!contextQuery.data,
    });
    return {
        context: contextQuery.data || null,
        isLoadingContext: contextQuery.isLoading,
        askCoach: askMutation.mutateAsync,
        isAsking: askMutation.isPending,
        recommendations: recommendationsQuery.data || [],
        isLoadingRecommendations: recommendationsQuery.isLoading,
        weeklyReview: weeklyReviewQuery.data || null,
        isLoadingWeeklyReview: weeklyReviewQuery.isLoading,
    };
}
