"use strict";
/**
 * React Query Hook for Fetching Single Routine Details & Logs
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.useRoutine = useRoutine;
const react_query_1 = require("@tanstack/react-query");
const routine_repository_1 = require("../repository/routine.repository");
const queryKeys_1 = require("../constants/queryKeys");
function useRoutine(routineId) {
    const routineQuery = (0, react_query_1.useQuery)({
        queryKey: queryKeys_1.routineKeys.detail(routineId),
        queryFn: async () => {
            const result = await routine_repository_1.routineRepository.fetchRoutine(routineId);
            if (!result.success) {
                throw result.error;
            }
            return result.data;
        },
        enabled: Boolean(routineId),
    });
    const logsQuery = (0, react_query_1.useQuery)({
        queryKey: queryKeys_1.routineKeys.logs(routineId),
        queryFn: async () => {
            const result = await routine_repository_1.routineRepository.fetchRoutineLogs(routineId);
            if (!result.success) {
                throw result.error;
            }
            return result.data;
        },
        enabled: Boolean(routineId),
    });
    return {
        routine: routineQuery.data ?? null,
        logs: logsQuery.data ?? [],
        isLoading: routineQuery.isLoading || logsQuery.isLoading,
        isError: routineQuery.isError || logsQuery.isError,
        error: routineQuery.error || logsQuery.error,
        refetch: async () => {
            await Promise.all([routineQuery.refetch(), logsQuery.refetch()]);
        },
    };
}
