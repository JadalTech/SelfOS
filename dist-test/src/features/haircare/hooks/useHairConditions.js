"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.useHairConditions = useHairConditions;
const react_query_1 = require("@tanstack/react-query");
const stores_1 = require("@/shared/stores");
const hairCondition_repository_1 = require("../repository/hairCondition.repository");
const queryKeys_1 = require("./queryKeys");
function useHairConditions() {
    const user = (0, stores_1.useAuthStore)((state) => state.user);
    const userId = user?.uid;
    const conditionsQuery = (0, react_query_1.useQuery)({
        queryKey: queryKeys_1.haircareKeys.conditions(),
        queryFn: async () => {
            if (!userId)
                return [];
            const res = await hairCondition_repository_1.hairConditionRepository.fetchConditions(userId);
            if (!res.success)
                throw res.error;
            return res.data;
        },
        enabled: Boolean(userId),
        staleTime: 5 * 60 * 1000,
    });
    return {
        conditions: conditionsQuery.data ?? [],
        isLoading: conditionsQuery.isLoading,
        isRefetching: conditionsQuery.isRefetching,
        isError: conditionsQuery.isError,
        error: conditionsQuery.error,
        refetch: conditionsQuery.refetch,
    };
}
