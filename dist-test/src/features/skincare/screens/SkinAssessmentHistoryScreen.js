"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SkinAssessmentHistoryScreen = SkinAssessmentHistoryScreen;
const jsx_runtime_1 = require("react/jsx-runtime");
const react_1 = require("react");
const react_native_1 = require("react-native");
const expo_router_1 = require("expo-router");
const useSkinAssessments_1 = require("../hooks/useSkinAssessments");
const AssessmentCard_1 = require("../components/AssessmentCard");
const EmptyStateCard_1 = require("../../../shared/components/feedback/EmptyStateCard");
const ErrorStateCard_1 = require("../../../shared/components/feedback/ErrorStateCard");
const SkeletonLoader_1 = require("../../../shared/components/loaders/SkeletonLoader");
function SkinAssessmentHistoryScreen() {
    const router = (0, expo_router_1.useRouter)();
    const { assessmentVMs, isLoading, isError, error, refetch, deleteAssessment } = (0, useSkinAssessments_1.useSkinAssessments)();
    const [searchQuery, setSearchQuery] = (0, react_1.useState)('');
    const filtered = assessmentVMs.filter((a) => {
        if (!searchQuery.trim())
            return true;
        const q = searchQuery.toLowerCase();
        return (a.skinTypeLabel.toLowerCase().includes(q) ||
            a.topConcernsFormatted.some((c) => c.label.toLowerCase().includes(q)));
    });
    return ((0, jsx_runtime_1.jsx)(react_native_1.SafeAreaView, { className: "flex-1 bg-zinc-950", children: (0, jsx_runtime_1.jsxs)(react_native_1.View, { className: "flex-1 p-4 gap-4", children: [(0, jsx_runtime_1.jsxs)(react_native_1.View, { className: "flex-row items-center justify-between", children: [(0, jsx_runtime_1.jsxs)(react_native_1.View, { children: [(0, jsx_runtime_1.jsx)(react_native_1.Text, { className: "text-zinc-500 text-[10px] font-bold uppercase tracking-wider", children: "Condition & Progress" }), (0, jsx_runtime_1.jsx)(react_native_1.Text, { className: "text-zinc-50 text-2xl font-black tracking-tight", children: "Skin Assessments" })] }), (0, jsx_runtime_1.jsx)(react_native_1.TouchableOpacity, { activeOpacity: 0.8, onPress: () => router.push('/(app)/skincare/assessment/new'), className: "bg-pink-600 px-3.5 py-2 rounded-xl border border-pink-500/40 shadow-sm", children: (0, jsx_runtime_1.jsx)(react_native_1.Text, { className: "text-white text-xs font-bold", children: "+ New Check-In" }) })] }), (0, jsx_runtime_1.jsx)(react_native_1.TextInput, { className: "bg-zinc-900 border border-zinc-800 px-3.5 py-2 rounded-xl text-zinc-50 text-xs", placeholder: "Filter history by skin type or concern...", placeholderTextColor: "#71717a", value: searchQuery, onChangeText: setSearchQuery }), isLoading ? ((0, jsx_runtime_1.jsxs)(react_native_1.View, { className: "gap-3 mt-2", children: [(0, jsx_runtime_1.jsx)(SkeletonLoader_1.SkeletonLoader, { height: 120 }), (0, jsx_runtime_1.jsx)(SkeletonLoader_1.SkeletonLoader, { height: 120 })] })) : isError ? ((0, jsx_runtime_1.jsx)(ErrorStateCard_1.ErrorStateCard, { message: error?.message, onRetry: refetch })) : filtered.length === 0 ? ((0, jsx_runtime_1.jsx)(EmptyStateCard_1.EmptyStateCard, { icon: "\uD83E\uDE7A", title: "No Skin Assessments Logged", description: "Perform periodic skin self-assessments to track barrier health, hydration levels, and concern severity over time.", actionLabel: "+ Complete First Assessment", onAction: () => router.push('/(app)/skincare/assessment/new') })) : ((0, jsx_runtime_1.jsx)(react_native_1.FlatList, { data: filtered, keyExtractor: (item) => item.id, contentContainerStyle: { gap: 12, paddingBottom: 24 }, showsVerticalScrollIndicator: false, renderItem: ({ item }) => ((0, jsx_runtime_1.jsx)(AssessmentCard_1.AssessmentCard, { assessment: item, onDelete: () => deleteAssessment(item.id) })) }))] }) }));
}
