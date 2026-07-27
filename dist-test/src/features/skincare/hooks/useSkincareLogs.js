"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.useSkincareLogs = useSkincareLogs;
const react_query_1 = require("@tanstack/react-query");
const auth_store_1 = require("../../../shared/stores/auth.store");
const skincare_repository_1 = require("../repository/skincare.repository");
const mappers_1 = require("../mappers");
const useSkincareRoutines_1 = require("./useSkincareRoutines");
const queryKeys_1 = require("./queryKeys");
function useSkincareLogs(limitDays = 60) {
    const queryClient = (0, react_query_1.useQueryClient)();
    const userId = (0, auth_store_1.useAuthStore)((s) => s.user?.uid);
    const { routines } = (0, useSkincareRoutines_1.useSkincareRoutines)();
    const query = (0, react_query_1.useQuery)({
        queryKey: queryKeys_1.skincareKeys.logs(),
        queryFn: async () => {
            if (!userId)
                return [];
            const res = await skincare_repository_1.skincareRepository.fetchLogs(userId, limitDays);
            if (!res.success)
                throw res.error;
            return res.data;
        },
        enabled: !!userId,
    });
    const logVMs = (0, mappers_1.mapToSkincareLogVMs)(query.data || [], routines);
    const logExecutionMutation = (0, react_query_1.useMutation)({
        mutationFn: async (input) => {
            if (!userId)
                throw new Error('User is not authenticated');
            const res = await skincare_repository_1.skincareRepository.logRoutineExecution(userId, input);
            if (!res.success)
                throw res.error;
            return res.data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: queryKeys_1.skincareKeys.logs() });
            queryClient.invalidateQueries({ queryKey: queryKeys_1.skincareKeys.dashboard() });
            queryClient.invalidateQueries({ queryKey: queryKeys_1.skincareKeys.analytics() });
        },
    });
    return {
        logs: query.data || [],
        logVMs,
        isLoading: query.isLoading,
        isError: query.isError,
        error: query.error,
        refetch: query.refetch,
        logExecution: logExecutionMutation.mutateAsync,
        isLogging: logExecutionMutation.isPending,
    };
}
