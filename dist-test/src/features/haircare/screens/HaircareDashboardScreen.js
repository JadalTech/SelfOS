"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.HaircareDashboardScreen = void 0;
const jsx_runtime_1 = require("react/jsx-runtime");
const react_1 = require("react");
const react_native_1 = require("react-native");
const react_native_safe_area_context_1 = require("react-native-safe-area-context");
const expo_router_1 = require("expo-router");
const useHaircareDashboard_1 = require("../hooks/useHaircareDashboard");
const useHairProducts_1 = require("../hooks/useHairProducts");
const useHairTimeline_1 = require("../hooks/useHairTimeline");
const useLatestHairCondition_1 = require("../hooks/useLatestHairCondition");
const analytics_1 = require("../analytics");
const ai_1 = require("../ai");
const products_mapper_1 = require("../mappers/products.mapper");
const components_1 = require("../components");
const HaircareDashboardScreen = function HaircareDashboardScreen() {
    const router = (0, expo_router_1.useRouter)();
    const { viewModel, isLoading, isRefetching, isError, error, refetch, logExecution, isActionPending, } = (0, useHaircareDashboard_1.useHaircareDashboard)();
    const { products } = (0, useHairProducts_1.useHairProducts)();
    const { latestPhoto, totalPhotosCount } = (0, useHairTimeline_1.useHairTimeline)();
    const { latestCondition } = (0, useLatestHairCondition_1.useLatestHairCondition)();
    const { viewModel: analyticsVM } = (0, analytics_1.useHairAnalytics)();
    const { topRecommendation } = (0, ai_1.useHairRecommendations)();
    const [selectedRoutineForLog, setSelectedRoutineForLog] = (0, react_1.useState)(null);
    const handleOpenProducts = (0, react_1.useCallback)(() => {
        router.push('/(app)/haircare/products');
    }, [router]);
    const handleOpenRoutines = (0, react_1.useCallback)(() => {
        router.push('/(app)/haircare/routines');
    }, [router]);
    const handleOpenTimeline = (0, react_1.useCallback)(() => {
        router.push('/(app)/haircare/timeline');
    }, [router]);
    const handleOpenConditionHistory = (0, react_1.useCallback)(() => {
        router.push('/(app)/haircare/condition');
    }, [router]);
    const handleNewAssessment = (0, react_1.useCallback)(() => {
        router.push('/(app)/haircare/condition/new');
    }, [router]);
    const handleOpenAnalytics = (0, react_1.useCallback)(() => {
        router.push('/(app)/haircare/analytics');
    }, [router]);
    const handleOpenCoach = (0, react_1.useCallback)(() => {
        router.push('/(app)/haircare/coach');
    }, [router]);
    const handleOpenLogs = (0, react_1.useCallback)(() => {
        router.push('/(app)/haircare/logs');
    }, [router]);
    const handleLogRoutinePress = (0, react_1.useCallback)((routineId) => {
        setSelectedRoutineForLog(routineId);
    }, []);
    const handleCloseLogModal = (0, react_1.useCallback)(() => {
        setSelectedRoutineForLog(null);
    }, []);
    if (isLoading) {
        return ((0, jsx_runtime_1.jsx)(react_native_safe_area_context_1.SafeAreaView, { className: "flex-1 bg-zinc-950", children: (0, jsx_runtime_1.jsx)(components_1.LoadingHaircare, {}) }));
    }
    if (isError || !viewModel) {
        return ((0, jsx_runtime_1.jsx)(react_native_safe_area_context_1.SafeAreaView, { className: "flex-1 bg-zinc-950", children: (0, jsx_runtime_1.jsx)(components_1.ErrorHaircare, { errorMessage: error?.message, onRetry: () => void refetch() }) }));
    }
    const { upcomingWashDay, activeRoutines, favoriteProducts, recentLogs, activeProductsCount, completedWashDaysCount, } = viewModel;
    const targetRoutineForLog = activeRoutines.find((r) => r.id === selectedRoutineForLog);
    return ((0, jsx_runtime_1.jsxs)(react_native_safe_area_context_1.SafeAreaView, { className: "flex-1 bg-zinc-950", children: [(0, jsx_runtime_1.jsxs)(react_native_1.ScrollView, { className: "flex-1", contentContainerStyle: { padding: 16, gap: 16 }, showsVerticalScrollIndicator: false, refreshControl: (0, jsx_runtime_1.jsx)(react_native_1.RefreshControl, { refreshing: isRefetching, onRefresh: () => void refetch(), tintColor: "#f59e0b" }), children: [(0, jsx_runtime_1.jsx)(components_1.HaircareHeader, { activeProductsCount: activeProductsCount, completedWashDaysCount: completedWashDaysCount, photosCount: totalPhotosCount, onOpenProducts: handleOpenProducts, onOpenRoutines: handleOpenRoutines, onOpenTimeline: handleOpenTimeline, onOpenAnalytics: handleOpenAnalytics, onOpenCoach: handleOpenCoach }), (0, jsx_runtime_1.jsx)(ai_1.AICoachCard, { topRecommendation: topRecommendation, onOpenCoach: handleOpenCoach }), (0, jsx_runtime_1.jsx)(analytics_1.AnalyticsSummaryWidget, { analytics: analyticsVM, onOpenAnalytics: handleOpenAnalytics }), (0, jsx_runtime_1.jsx)(components_1.ConditionSummaryCard, { latestCondition: latestCondition, onOpenHistory: handleOpenConditionHistory, onNewAssessment: handleNewAssessment }), (0, jsx_runtime_1.jsxs)(react_native_1.View, { className: "gap-2 bg-zinc-900 border border-zinc-800 p-4 rounded-2xl", children: [(0, jsx_runtime_1.jsxs)(react_native_1.View, { className: "flex-row items-center justify-between", children: [(0, jsx_runtime_1.jsx)(react_native_1.Text, { className: "text-zinc-400 text-xs font-semibold uppercase tracking-wider", children: "Hair Growth Timeline" }), (0, jsx_runtime_1.jsx)(react_native_1.TouchableOpacity, { onPress: handleOpenTimeline, accessibilityRole: "button", children: (0, jsx_runtime_1.jsxs)(react_native_1.Text, { className: "text-amber-400 text-xs font-semibold", children: ["View Gallery (", totalPhotosCount, ") \u2192"] }) })] }), latestPhoto ? ((0, jsx_runtime_1.jsx)(react_native_1.View, { className: "w-40 pt-1", children: (0, jsx_runtime_1.jsx)(components_1.PhotoCard, { photo: latestPhoto, onPress: handleOpenTimeline }) })) : ((0, jsx_runtime_1.jsx)(react_native_1.TouchableOpacity, { className: "bg-zinc-950 border border-dashed border-zinc-800 p-3 rounded-xl items-center", onPress: handleOpenTimeline, children: (0, jsx_runtime_1.jsx)(react_native_1.Text, { className: "text-amber-400 text-xs font-bold", children: "+ Upload First Progress Photo" }) }))] }), upcomingWashDay ? ((0, jsx_runtime_1.jsxs)(react_native_1.View, { className: "gap-2", children: [(0, jsx_runtime_1.jsx)(react_native_1.Text, { className: "text-zinc-400 text-xs font-semibold uppercase tracking-wider", children: "Up Next Wash Day" }), (0, jsx_runtime_1.jsx)(components_1.HairRoutineCard, { routine: upcomingWashDay, onLogPress: handleLogRoutinePress })] })) : null, (0, jsx_runtime_1.jsxs)(react_native_1.View, { className: "gap-3", children: [(0, jsx_runtime_1.jsxs)(react_native_1.View, { className: "flex-row items-center justify-between", children: [(0, jsx_runtime_1.jsxs)(react_native_1.Text, { className: "text-zinc-400 text-xs font-semibold uppercase tracking-wider", children: ["Hair Routines (", activeRoutines.length, ")"] }), (0, jsx_runtime_1.jsx)(react_native_1.TouchableOpacity, { onPress: handleOpenRoutines, accessibilityRole: "button", children: (0, jsx_runtime_1.jsx)(react_native_1.Text, { className: "text-amber-400 text-xs font-semibold", children: "Manage Routines \u2192" }) })] }), activeRoutines.length === 0 ? ((0, jsx_runtime_1.jsx)(components_1.EmptyHaircare, { title: "No Hair Routines Yet", message: "Create your first wash day or deep conditioning schedule to start tracking.", actionLabel: "+ Create Hair Routine", onAction: handleOpenRoutines })) : ((0, jsx_runtime_1.jsx)(react_native_1.View, { className: "gap-3", children: activeRoutines.map((routine) => ((0, jsx_runtime_1.jsx)(components_1.HairRoutineCard, { routine: routine, onLogPress: handleLogRoutinePress }, routine.id))) }))] }), favoriteProducts.length > 0 ? ((0, jsx_runtime_1.jsxs)(react_native_1.View, { className: "gap-3", children: [(0, jsx_runtime_1.jsxs)(react_native_1.View, { className: "flex-row items-center justify-between", children: [(0, jsx_runtime_1.jsxs)(react_native_1.Text, { className: "text-zinc-400 text-xs font-semibold uppercase tracking-wider", children: ["Favorite Products (", favoriteProducts.length, ")"] }), (0, jsx_runtime_1.jsx)(react_native_1.TouchableOpacity, { onPress: handleOpenProducts, accessibilityRole: "button", children: (0, jsx_runtime_1.jsx)(react_native_1.Text, { className: "text-amber-400 text-xs font-semibold", children: "Products Catalog \u2192" }) })] }), (0, jsx_runtime_1.jsx)(react_native_1.View, { className: "gap-2", children: favoriteProducts.map((product) => ((0, jsx_runtime_1.jsx)(components_1.ProductCard, { product: product }, product.id))) })] })) : null, (0, jsx_runtime_1.jsxs)(react_native_1.View, { className: "gap-3", children: [(0, jsx_runtime_1.jsxs)(react_native_1.View, { className: "flex-row items-center justify-between", children: [(0, jsx_runtime_1.jsxs)(react_native_1.Text, { className: "text-zinc-400 text-xs font-semibold uppercase tracking-wider", children: ["Recent Wash Logs (", recentLogs.length, ")"] }), (0, jsx_runtime_1.jsx)(react_native_1.TouchableOpacity, { onPress: handleOpenLogs, accessibilityRole: "button", children: (0, jsx_runtime_1.jsx)(react_native_1.Text, { className: "text-amber-400 text-xs font-semibold", children: "View Log History \u2192" }) })] }), recentLogs.length === 0 ? ((0, jsx_runtime_1.jsx)(react_native_1.Text, { className: "text-zinc-500 text-xs py-3 text-center", children: "No wash day logs recorded yet." })) : ((0, jsx_runtime_1.jsx)(react_native_1.View, { className: "gap-2", children: recentLogs.map((log) => ((0, jsx_runtime_1.jsx)(components_1.HairLogCard, { log: log }, log.id))) }))] })] }), (0, jsx_runtime_1.jsx)(react_native_1.Modal, { visible: Boolean(selectedRoutineForLog), animationType: "slide", transparent: true, onRequestClose: handleCloseLogModal, children: (0, jsx_runtime_1.jsx)(react_native_1.View, { className: "flex-1 bg-black/80 justify-end p-4", children: targetRoutineForLog ? ((0, jsx_runtime_1.jsxs)(react_native_1.View, { className: "gap-2", children: [(0, jsx_runtime_1.jsx)(react_native_1.TouchableOpacity, { className: "self-end p-2 bg-zinc-800 rounded-full", onPress: handleCloseLogModal, children: (0, jsx_runtime_1.jsx)(react_native_1.Text, { className: "text-zinc-400 text-xs font-bold", children: "\u2715 Close" }) }), (0, jsx_runtime_1.jsx)(components_1.HairLogForm, { routine: targetRoutineForLog, availableProducts: (0, products_mapper_1.mapToHairProductVMs)(products), isSubmitting: isActionPending, onSubmit: async (vals) => {
                                    await logExecution({
                                        hairRoutineId: targetRoutineForLog.id,
                                        coreRoutineId: targetRoutineForLog.routineId,
                                        dateStr: new Date().toISOString().split('T')[0],
                                        appliedProductIds: vals.appliedProductIds,
                                        notes: vals.notes,
                                    });
                                    handleCloseLogModal();
                                } })] })) : null }) })] }));
};
exports.HaircareDashboardScreen = HaircareDashboardScreen;
