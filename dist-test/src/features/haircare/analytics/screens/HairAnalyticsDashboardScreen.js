"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.HairAnalyticsDashboardScreen = void 0;
const jsx_runtime_1 = require("react/jsx-runtime");
const react_native_1 = require("react-native");
const react_native_safe_area_context_1 = require("react-native-safe-area-context");
const expo_router_1 = require("expo-router");
const useHairAnalytics_1 = require("../hooks/useHairAnalytics");
const InsightCard_1 = require("../components/InsightCard");
const CompletionBarChart_1 = require("../components/CompletionBarChart");
const ConditionTrendChart_1 = require("../components/ConditionTrendChart");
const ProductUsageChart_1 = require("../components/ProductUsageChart");
const components_1 = require("../../components");
const HairAnalyticsDashboardScreen = function HairAnalyticsDashboardScreen() {
    const router = (0, expo_router_1.useRouter)();
    const { viewModel, isLoading, isRefetching, isError, error, refetch } = (0, useHairAnalytics_1.useHairAnalytics)();
    if (isLoading) {
        return ((0, jsx_runtime_1.jsx)(react_native_safe_area_context_1.SafeAreaView, { className: "flex-1 bg-zinc-950", children: (0, jsx_runtime_1.jsx)(components_1.LoadingHaircare, {}) }));
    }
    if (isError) {
        return ((0, jsx_runtime_1.jsx)(react_native_safe_area_context_1.SafeAreaView, { className: "flex-1 bg-zinc-950", children: (0, jsx_runtime_1.jsx)(components_1.ErrorHaircare, { errorMessage: error?.message, onRetry: () => void refetch() }) }));
    }
    return ((0, jsx_runtime_1.jsx)(react_native_safe_area_context_1.SafeAreaView, { className: "flex-1 bg-zinc-950", children: (0, jsx_runtime_1.jsxs)(react_native_1.ScrollView, { className: "flex-1", contentContainerStyle: { padding: 16, gap: 16 }, refreshControl: (0, jsx_runtime_1.jsx)(react_native_1.RefreshControl, { refreshing: isRefetching, onRefresh: () => void refetch(), tintColor: "#f59e0b" }), children: [(0, jsx_runtime_1.jsxs)(react_native_1.View, { className: "flex-row items-center justify-between", children: [(0, jsx_runtime_1.jsxs)(react_native_1.View, { children: [(0, jsx_runtime_1.jsx)(react_native_1.TouchableOpacity, { onPress: () => router.back(), accessibilityRole: "button", children: (0, jsx_runtime_1.jsx)(react_native_1.Text, { className: "text-amber-400 text-xs font-semibold mb-1", children: "\u2190 Back to Haircare" }) }), (0, jsx_runtime_1.jsx)(react_native_1.Text, { className: "text-zinc-50 text-2xl font-extrabold", children: "Haircare Analytics" })] }), (0, jsx_runtime_1.jsx)(react_native_1.View, { className: "bg-zinc-900 border border-zinc-800 px-3 py-1.5 rounded-xl", children: (0, jsx_runtime_1.jsx)(react_native_1.Text, { className: "text-amber-400 text-xs font-bold", children: "Live Data" }) })] }), (0, jsx_runtime_1.jsxs)(react_native_1.View, { className: "gap-2", children: [(0, jsx_runtime_1.jsx)(react_native_1.Text, { className: "text-zinc-400 text-xs font-semibold uppercase tracking-wider", children: "Milestones & Key Metrics" }), (0, jsx_runtime_1.jsx)(react_native_1.View, { className: "flex-row flex-wrap gap-3", children: viewModel.insights.map((card) => ((0, jsx_runtime_1.jsx)(InsightCard_1.InsightCard, { card: card }, card.id))) })] }), (0, jsx_runtime_1.jsx)(CompletionBarChart_1.CompletionBarChart, { weekly: viewModel.weekly }), (0, jsx_runtime_1.jsx)(ConditionTrendChart_1.ConditionTrendChart, { trend: viewModel.conditionTrend }), (0, jsx_runtime_1.jsx)(ProductUsageChart_1.ProductUsageChart, { productUsage: viewModel.productUsage })] }) }));
};
exports.HairAnalyticsDashboardScreen = HairAnalyticsDashboardScreen;
