"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DashboardScreen = void 0;
const jsx_runtime_1 = require("react/jsx-runtime");
const react_1 = require("react");
const react_native_1 = require("react-native");
const react_native_safe_area_context_1 = require("react-native-safe-area-context");
const expo_router_1 = require("expo-router");
const useDashboard_1 = require("../hooks/useDashboard");
const components_1 = require("../components");
const DashboardScreen = function DashboardScreen() {
    const router = (0, expo_router_1.useRouter)();
    const { viewModel, isLoading, isRefetching, isError, error, refetch, completeRoutine, skipRoutine, isActionPending, } = (0, useDashboard_1.useDashboard)();
    const handleRoutinePress = (0, react_1.useCallback)((routineId) => {
        router.push(`/(app)/routines/${routineId}`);
    }, [router]);
    const handleViewAllRoutines = (0, react_1.useCallback)(() => {
        router.push('/(app)/routines');
    }, [router]);
    const handleCreateRoutine = (0, react_1.useCallback)(() => {
        router.push('/(app)/routines/new');
    }, [router]);
    const handleModulePress = (0, react_1.useCallback)((route) => {
        router.push(route);
    }, [router]);
    if (isLoading) {
        return ((0, jsx_runtime_1.jsx)(react_native_safe_area_context_1.SafeAreaView, { className: "flex-1 bg-zinc-950", children: (0, jsx_runtime_1.jsx)(components_1.LoadingDashboard, {}) }));
    }
    if (isError || !viewModel) {
        return ((0, jsx_runtime_1.jsx)(react_native_safe_area_context_1.SafeAreaView, { className: "flex-1 bg-zinc-950", children: (0, jsx_runtime_1.jsx)(components_1.ErrorDashboard, { errorMessage: error?.message, onRetry: () => void refetch() }) }));
    }
    const { greeting, progress, todayRoutines, topPendingRoutine, stats, weekly, recentActivities, modules, } = viewModel;
    return ((0, jsx_runtime_1.jsx)(react_native_safe_area_context_1.SafeAreaView, { className: "flex-1 bg-zinc-950", children: (0, jsx_runtime_1.jsxs)(react_native_1.ScrollView, { className: "flex-1", contentContainerStyle: { padding: 16, gap: 16 }, showsVerticalScrollIndicator: false, refreshControl: (0, jsx_runtime_1.jsx)(react_native_1.RefreshControl, { refreshing: isRefetching, onRefresh: () => void refetch(), tintColor: "#10b981" }), children: [(0, jsx_runtime_1.jsx)(components_1.DashboardHeader, { greeting: greeting }), (0, jsx_runtime_1.jsx)(components_1.TodayProgressCard, { progress: progress }), topPendingRoutine ? ((0, jsx_runtime_1.jsx)(components_1.QuickActionsBar, { topPendingRoutine: topPendingRoutine, onComplete: (id) => void completeRoutine(id), onSkip: (id) => void skipRoutine(id), isActionPending: isActionPending })) : null, (0, jsx_runtime_1.jsx)(components_1.TodayRoutinesList, { items: todayRoutines, onItemPress: handleRoutinePress, onViewAllPress: handleViewAllRoutines }), stats.activeRoutinesCount === 0 ? ((0, jsx_runtime_1.jsx)(components_1.EmptyDashboard, { onCreateRoutine: handleCreateRoutine })) : null, stats.topStreakCount > 0 ? (0, jsx_runtime_1.jsx)(components_1.StreakOverviewCard, { stats: stats }) : null, (0, jsx_runtime_1.jsx)(components_1.StatsGrid, { stats: stats }), (0, jsx_runtime_1.jsx)(components_1.WeeklyProgressCard, { weekly: weekly }), (0, jsx_runtime_1.jsx)(components_1.RecentActivityCard, { activities: recentActivities }), (0, jsx_runtime_1.jsx)(components_1.ModuleNavGrid, { modules: modules, onModulePress: handleModulePress }), (0, jsx_runtime_1.jsx)(react_native_1.View, { className: "h-6" })] }) }));
};
exports.DashboardScreen = DashboardScreen;
