"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.useSleepToday = useSleepToday;
const react_query_1 = require("@tanstack/react-query");
const stores_1 = require("../../../shared/stores");
const sleep_repository_1 = require("../repository/sleep.repository");
const queryKeys_1 = require("./queryKeys");
function useSleepToday() {
    const user = (0, stores_1.useAuthStore)((state) => state.user);
    const userId = user?.uid;
    const todayStr = new Date().toISOString().split('T')[0];
    const todayQuery = (0, react_query_1.useQuery)({
        queryKey: queryKeys_1.sleepKeys.today(),
        queryFn: async () => {
            if (!userId)
                return null;
            const res = await sleep_repository_1.sleepRepository.getEntryByDate(userId, todayStr);
            if (!res.success)
                throw res.error;
            return res.data;
        },
        enabled: Boolean(userId),
        staleTime: 5 * 60 * 1000,
        gcTime: 15 * 60 * 1000,
    });
    return {
        todayEntry: todayQuery.data ?? null,
        isLoading: todayQuery.isLoading,
        isRefetching: todayQuery.isRefetching,
        isError: todayQuery.isError,
        error: todayQuery.error,
        refetch: todayQuery.refetch,
    };
}
