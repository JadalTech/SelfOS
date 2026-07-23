"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.useHairRecommendations = useHairRecommendations;
const react_query_1 = require("@tanstack/react-query");
const stores_1 = require("@/shared/stores");
const hairAIRepository_1 = require("../repository/hairAIRepository");
const queryKeys_1 = require("../../hooks/queryKeys");
function useHairRecommendations() {
    const user = (0, stores_1.useAuthStore)((state) => state.user);
    const userId = user?.uid;
    const query = (0, react_query_1.useQuery)({
        queryKey: [...queryKeys_1.haircareKeys.ai(), 'recommendations'],
        queryFn: async () => {
            if (!userId)
                return [];
            const res = await hairAIRepository_1.hairAIRepository.getRecommendations(userId);
            if (!res.success)
                throw res.error;
            return res.data;
        },
        enabled: Boolean(userId),
        staleTime: 5 * 60 * 1000,
    });
    return {
        recommendations: query.data ?? [],
        topRecommendation: (query.data && query.data[0]) || null,
        isLoading: query.isLoading,
        isError: query.isError,
        error: query.error,
        refetch: query.refetch,
    };
}
