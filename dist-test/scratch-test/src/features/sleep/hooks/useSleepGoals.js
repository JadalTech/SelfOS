"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.useSleepGoals = useSleepGoals;
const react_query_1 = require("@tanstack/react-query");
const stores_1 = require("../../../shared/stores");
const sleep_repository_1 = require("../repository/sleep.repository");
const queryKeys_1 = require("./queryKeys");
function useSleepGoals() {
    const queryClient = (0, react_query_1.useQueryClient)();
    const user = (0, stores_1.useAuthStore)((state) => state.user);
    const userId = user?.uid;
    const goalsQuery = (0, react_query_1.useQuery)({
        queryKey: queryKeys_1.sleepKeys.goals(),
        queryFn: async () => {
            if (!userId)
                return [];
            const res = await sleep_repository_1.sleepGoalRepository.fetchGoals(userId);
            if (!res.success)
                throw res.error;
            return res.data;
        },
        enabled: Boolean(userId),
        staleTime: 5 * 60 * 1000,
        gcTime: 15 * 60 * 1000,
    });
    const saveGoalMutation = (0, react_query_1.useMutation)({
        mutationFn: async (goal) => {
            if (!userId)
                throw new Error('User not authenticated');
            const res = await sleep_repository_1.sleepGoalRepository.saveGoal(userId, goal);
            if (!res.success)
                throw res.error;
            return res.data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: queryKeys_1.sleepKeys.all });
        },
    });
    const toggleGoalActiveMutation = (0, react_query_1.useMutation)({
        mutationFn: async ({ goalId, isActive }) => {
            if (!userId)
                throw new Error('User not authenticated');
            const res = await sleep_repository_1.sleepGoalRepository.toggleGoalActive(userId, goalId, isActive);
            if (!res.success)
                throw res.error;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: queryKeys_1.sleepKeys.all });
        },
    });
    const activeGoals = goalsQuery.data?.filter((g) => g.isActive) ?? [];
    return {
        goals: goalsQuery.data ?? [],
        activeGoals,
        isLoading: goalsQuery.isLoading,
        isRefetching: goalsQuery.isRefetching,
        isError: goalsQuery.isError,
        error: goalsQuery.error,
        refetch: goalsQuery.refetch,
        saveGoal: saveGoalMutation.mutateAsync,
        isSaving: saveGoalMutation.isPending,
        toggleGoalActive: toggleGoalActiveMutation.mutateAsync,
        isToggling: toggleGoalActiveMutation.isPending,
    };
}
