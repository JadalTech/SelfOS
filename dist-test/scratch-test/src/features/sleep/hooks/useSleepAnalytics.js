"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.useSleepAnalytics = useSleepAnalytics;
const react_query_1 = require("@tanstack/react-query");
const stores_1 = require("../../../shared/stores");
const sleep_repository_1 = require("../repository/sleep.repository");
const sleepAnalytics_service_1 = require("../services/sleepAnalytics.service");
const queryKeys_1 = require("./queryKeys");
function useSleepAnalytics() {
    const user = (0, stores_1.useAuthStore)((state) => state.user);
    const userId = user?.uid;
    // 1. Fetch entries
    const entriesQuery = (0, react_query_1.useQuery)({
        queryKey: queryKeys_1.sleepKeys.entries(),
        queryFn: async () => {
            if (!userId)
                return [];
            const res = await sleep_repository_1.sleepRepository.fetchEntries(userId);
            if (!res.success)
                throw res.error;
            return res.data;
        },
        enabled: Boolean(userId),
        staleTime: 5 * 60 * 1000,
    });
    // 2. Fetch schedules
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
    });
    // 3. Fetch goals
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
    });
    // 4. Fetch DB analytics records (FeatureAnalytics contract representation)
    const analyticsRecordsQuery = (0, react_query_1.useQuery)({
        queryKey: queryKeys_1.sleepKeys.analytics(),
        queryFn: async () => {
            if (!userId)
                return [];
            const res = await sleep_repository_1.sleepAnalyticsRepository.fetchAnalyticsRecords(userId);
            if (!res.success)
                throw res.error;
            return res.data;
        },
        enabled: Boolean(userId),
        staleTime: 5 * 60 * 1000,
        gcTime: 15 * 60 * 1000,
    });
    const entries = entriesQuery.data ?? [];
    const activeSchedule = schedulesQuery.data?.find((s) => s.isActive) ?? null;
    const activeGoals = goalsQuery.data?.filter((g) => g.isActive) ?? [];
    // Helper to generate a weekly summary for a given range
    const getWeeklySummary = (weekStartDate, weekEndDate) => {
        if (!userId || !activeSchedule)
            return null;
        return sleepAnalytics_service_1.sleepAnalyticsService.calculateWeeklySummary(userId, entries, activeSchedule, activeGoals, weekStartDate, weekEndDate);
    };
    // Helper to generate a monthly summary for a given month
    const getMonthlySummary = (year, month) => {
        if (!userId || !activeSchedule)
            return null;
        return sleepAnalytics_service_1.sleepAnalyticsService.calculateMonthlySummary(userId, entries, activeSchedule, activeGoals, year, month);
    };
    const isLoading = entriesQuery.isLoading ||
        schedulesQuery.isLoading ||
        goalsQuery.isLoading ||
        analyticsRecordsQuery.isLoading;
    return {
        analyticsRecords: analyticsRecordsQuery.data ?? [],
        getWeeklySummary,
        getMonthlySummary,
        isLoading,
        isError: entriesQuery.isError ||
            schedulesQuery.isError ||
            goalsQuery.isError ||
            analyticsRecordsQuery.isError,
        error: entriesQuery.error ||
            schedulesQuery.error ||
            goalsQuery.error ||
            analyticsRecordsQuery.error,
        refetch: async () => {
            await Promise.all([
                entriesQuery.refetch(),
                schedulesQuery.refetch(),
                goalsQuery.refetch(),
                analyticsRecordsQuery.refetch(),
            ]);
        },
    };
}
