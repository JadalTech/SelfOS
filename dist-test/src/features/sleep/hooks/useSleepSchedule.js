"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.useSleepSchedule = useSleepSchedule;
const react_query_1 = require("@tanstack/react-query");
const stores_1 = require("../../../shared/stores");
const sleep_repository_1 = require("../repository/sleep.repository");
const queryKeys_1 = require("./queryKeys");
function useSleepSchedule() {
    const queryClient = (0, react_query_1.useQueryClient)();
    const user = (0, stores_1.useAuthStore)((state) => state.user);
    const userId = user?.uid;
    const schedulesQuery = (0, react_query_1.useQuery)({
        queryKey: queryKeys_1.sleepKeys.schedule(),
        queryFn: async () => {
            if (!userId)
                return [];
            const res = await sleep_repository_1.sleepScheduleRepository.fetchSchedules(userId);
            if (!res.success)
                throw res.error;
            return res.data;
        },
        enabled: Boolean(userId),
        staleTime: 5 * 60 * 1000,
        gcTime: 15 * 60 * 1000,
    });
    const saveScheduleMutation = (0, react_query_1.useMutation)({
        mutationFn: async (schedule) => {
            if (!userId)
                throw new Error('User not authenticated');
            const res = await sleep_repository_1.sleepScheduleRepository.saveSchedule(userId, schedule);
            if (!res.success)
                throw res.error;
            return res.data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: queryKeys_1.sleepKeys.all });
        },
    });
    const toggleScheduleActiveMutation = (0, react_query_1.useMutation)({
        mutationFn: async ({ scheduleId, isActive }) => {
            if (!userId)
                throw new Error('User not authenticated');
            const res = await sleep_repository_1.sleepScheduleRepository.toggleScheduleActive(userId, scheduleId, isActive);
            if (!res.success)
                throw res.error;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: queryKeys_1.sleepKeys.all });
        },
    });
    const activeSchedule = schedulesQuery.data?.find((s) => s.isActive) ?? null;
    return {
        schedules: schedulesQuery.data ?? [],
        activeSchedule,
        isLoading: schedulesQuery.isLoading,
        isRefetching: schedulesQuery.isRefetching,
        isError: schedulesQuery.isError,
        error: schedulesQuery.error,
        refetch: schedulesQuery.refetch,
        saveSchedule: saveScheduleMutation.mutateAsync,
        isSaving: saveScheduleMutation.isPending,
        toggleScheduleActive: toggleScheduleActiveMutation.mutateAsync,
        isToggling: toggleScheduleActiveMutation.isPending,
    };
}
