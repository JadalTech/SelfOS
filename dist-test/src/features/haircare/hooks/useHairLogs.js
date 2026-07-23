"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.useHairLogs = useHairLogs;
const react_query_1 = require("@tanstack/react-query");
const stores_1 = require("@/shared/stores");
const haircare_repository_1 = require("../repository/haircare.repository");
const queryKeys_1 = require("./queryKeys");
const routine_1 = require("@/features/routine");
function useHairLogs() {
    const queryClient = (0, react_query_1.useQueryClient)();
    const user = (0, stores_1.useAuthStore)((state) => state.user);
    const userId = user?.uid;
    const logsQuery = (0, react_query_1.useQuery)({
        queryKey: queryKeys_1.haircareKeys.logs(),
        queryFn: async () => {
            if (!userId)
                return [];
            const res = await haircare_repository_1.haircareRepository.fetchHairLogs(userId, 50);
            if (!res.success)
                throw res.error;
            return res.data;
        },
        enabled: Boolean(userId),
        staleTime: 5 * 60 * 1000,
    });
    const logExecutionMutation = (0, react_query_1.useMutation)({
        mutationFn: async (input) => {
            if (!userId)
                throw new Error('User not authenticated');
            const res = await haircare_repository_1.haircareRepository.logHaircareExecution(userId, input);
            if (!res.success)
                throw res.error;
            return res.data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: queryKeys_1.haircareKeys.all });
            queryClient.invalidateQueries({ queryKey: routine_1.routineKeys.all });
        },
    });
    return {
        logs: logsQuery.data ?? [],
        isLoading: logsQuery.isLoading,
        isRefetching: logsQuery.isRefetching,
        isError: logsQuery.isError,
        error: logsQuery.error,
        refetch: logsQuery.refetch,
        logExecution: logExecutionMutation.mutateAsync,
        isMutating: logExecutionMutation.isPending,
    };
}
