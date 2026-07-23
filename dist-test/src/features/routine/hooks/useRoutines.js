"use strict";
/**
 * React Query Hook for Fetching Routines List
 *
 * Handles caching, loading states, and filter queries for active routines.
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.useRoutines = useRoutines;
const react_query_1 = require("@tanstack/react-query");
const routine_repository_1 = require("../repository/routine.repository");
const queryKeys_1 = require("../constants/queryKeys");
function useRoutines(options = {}) {
    const { type, status, enabled = true } = options;
    return (0, react_query_1.useQuery)({
        queryKey: queryKeys_1.routineKeys.list({ type, status }),
        queryFn: async () => {
            const result = await routine_repository_1.routineRepository.fetchRoutines({ type, status });
            if (!result.success) {
                throw result.error;
            }
            return result.data;
        },
        enabled,
        staleTime: 5 * 60 * 1000, // 5 minutes stale time matching mobile app defaults
    });
}
