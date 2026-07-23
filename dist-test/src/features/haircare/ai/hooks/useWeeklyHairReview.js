"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.useWeeklyHairReview = useWeeklyHairReview;
const react_query_1 = require("@tanstack/react-query");
const stores_1 = require("@/shared/stores");
const hairAIRepository_1 = require("../repository/hairAIRepository");
const queryKeys_1 = require("../../hooks/queryKeys");
function useWeeklyHairReview() {
    const user = (0, stores_1.useAuthStore)((state) => state.user);
    const userId = user?.uid;
    const query = (0, react_query_1.useQuery)({
        queryKey: [...queryKeys_1.haircareKeys.ai(), 'weekly-review'],
        queryFn: async () => {
            if (!userId)
                throw new Error('User not authenticated');
            const res = await hairAIRepository_1.hairAIRepository.getWeeklyReview(userId);
            if (!res.success)
                throw res.error;
            return res.data;
        },
        enabled: Boolean(userId),
        staleTime: 10 * 60 * 1000,
    });
    return {
        review: query.data || null,
        isLoading: query.isLoading,
        isError: query.isError,
        error: query.error,
        refetch: query.refetch,
    };
}
