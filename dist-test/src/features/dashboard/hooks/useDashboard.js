"use strict";
/**
 * Custom Aggregation Hook: useDashboard
 *
 * Coordinates data fetching from feature repositories, user auth store,
 * and delegates processing to pure dashboard mappers.
 * Contains ZERO business rules and ZERO Firestore SDK calls.
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.useDashboard = useDashboard;
const react_1 = require("react");
const stores_1 = require("@/shared/stores");
const routine_1 = require("@/features/routine");
const react_query_1 = require("@tanstack/react-query");
const dashboardMapper_1 = require("../utils/dashboardMapper");
const queryKeys_1 = require("../constants/queryKeys");
function useDashboard() {
    const user = (0, stores_1.useAuthStore)((state) => state.user);
    // 1. Query Active Routines List
    const routinesQuery = (0, routine_1.useRoutines)({ status: 'active' });
    // Extract active routine IDs to query recent completion logs
    const routines = (0, react_1.useMemo)(() => routinesQuery.data ?? [], [routinesQuery.data]);
    const routineIdsKey = (0, react_1.useMemo)(() => routines.map((r) => r.id).sort().join(','), [routines]);
    // 2. Query Recent Completion Logs for Active Routines
    const logsQuery = (0, react_query_1.useQuery)({
        queryKey: [...queryKeys_1.dashboardKeys.all, 'logs', routineIdsKey],
        queryFn: async () => {
            if (routines.length === 0)
                return [];
            // Fetch logs across all active routines in parallel
            const logPromises = routines.map((r) => routine_1.routineRepository.fetchRoutineLogs(r.id));
            const results = await Promise.all(logPromises);
            const allLogs = [];
            for (const res of results) {
                if (res.success) {
                    allLogs.push(...res.data);
                }
            }
            return allLogs;
        },
        enabled: routines.length > 0,
        staleTime: 5 * 60 * 1000,
    });
    const logs = (0, react_1.useMemo)(() => logsQuery.data ?? [], [logsQuery.data]);
    // 3. Delegate View Model Construction to Pure Mapper
    const viewModel = (0, react_1.useMemo)(() => {
        if (routinesQuery.isLoading)
            return null;
        return (0, dashboardMapper_1.buildDashboardViewModel)(user, routines, logs);
    }, [user, routines, logs, routinesQuery.isLoading]);
    // 4. Quick Action Mutations
    const completeMutation = (0, routine_1.useCompleteRoutine)();
    const skipMutation = (0, routine_1.useSkipRoutine)();
    const handleComplete = (0, react_1.useCallback)(async (routineId, dateStr) => {
        const targetDate = dateStr || new Date().toISOString().split('T')[0];
        await completeMutation.mutateAsync({ routineId, dateStr: targetDate });
    }, [completeMutation]);
    const handleSkip = (0, react_1.useCallback)(async (routineId, dateStr) => {
        const targetDate = dateStr || new Date().toISOString().split('T')[0];
        await skipMutation.mutateAsync({ routineId, dateStr: targetDate });
    }, [skipMutation]);
    const refetch = (0, react_1.useCallback)(async () => {
        await Promise.all([routinesQuery.refetch(), logsQuery.refetch()]);
    }, [routinesQuery, logsQuery]);
    return {
        viewModel,
        isLoading: routinesQuery.isLoading,
        isRefetching: routinesQuery.isRefetching || logsQuery.isRefetching,
        isError: routinesQuery.isError || logsQuery.isError,
        error: routinesQuery.error || logsQuery.error,
        refetch,
        completeRoutine: handleComplete,
        skipRoutine: handleSkip,
        isActionPending: completeMutation.isPending || skipMutation.isPending,
    };
}
