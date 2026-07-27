"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.HairConditionHistoryScreen = void 0;
const jsx_runtime_1 = require("react/jsx-runtime");
const react_1 = require("react");
const react_native_1 = require("react-native");
const react_native_safe_area_context_1 = require("react-native-safe-area-context");
const expo_router_1 = require("expo-router");
const useHairConditions_1 = require("../hooks/useHairConditions");
const useDeleteHairCondition_1 = require("../hooks/useDeleteHairCondition");
const condition_mapper_1 = require("../mappers/condition.mapper");
const components_1 = require("../components");
const SCALP_FILTER_OPTIONS = [
    { label: 'All Scalps', value: 'all' },
    { label: 'Dry', value: 'dry' },
    { label: 'Normal', value: 'normal' },
    { label: 'Oily', value: 'oily' },
    { label: 'Combo', value: 'combination' },
    { label: 'Sensitive', value: 'sensitive' },
];
const HairConditionHistoryScreen = function HairConditionHistoryScreen() {
    const router = (0, expo_router_1.useRouter)();
    const { conditions, isLoading, isRefetching, isError, error, refetch } = (0, useHairConditions_1.useHairConditions)();
    const { deleteCondition } = (0, useDeleteHairCondition_1.useDeleteHairCondition)();
    // Search & Filter State
    const [searchQuery, setSearchQuery] = (0, react_1.useState)('');
    const [selectedScalp, setSelectedScalp] = (0, react_1.useState)('all');
    const [dateSort, setDateSort] = (0, react_1.useState)('newest');
    const conditionVMs = (0, react_1.useMemo)(() => (0, condition_mapper_1.mapToHairConditionVMs)(conditions), [conditions]);
    const filteredVMs = (0, react_1.useMemo)(() => {
        return (0, condition_mapper_1.filterConditionVMs)(conditionVMs, {
            searchKeyword: searchQuery,
            scalpType: selectedScalp,
            dateSort,
        });
    }, [conditionVMs, searchQuery, selectedScalp, dateSort]);
    const handleCreateNew = (0, react_1.useCallback)(() => {
        router.push('/(app)/haircare/condition/new');
    }, [router]);
    const handleEdit = (0, react_1.useCallback)((condition) => {
        router.push(`/(app)/haircare/condition/${condition.id}/edit`);
    }, [router]);
    const handleDelete = (0, react_1.useCallback)(async (condition) => {
        await deleteCondition(condition.id);
    }, [deleteCondition]);
    if (isLoading) {
        return ((0, jsx_runtime_1.jsx)(react_native_safe_area_context_1.SafeAreaView, { className: "flex-1 bg-zinc-950", children: (0, jsx_runtime_1.jsx)(components_1.LoadingHaircare, {}) }));
    }
    if (isError) {
        return ((0, jsx_runtime_1.jsx)(react_native_safe_area_context_1.SafeAreaView, { className: "flex-1 bg-zinc-950", children: (0, jsx_runtime_1.jsx)(components_1.ErrorHaircare, { errorMessage: error?.message, onRetry: () => void refetch() }) }));
    }
    return ((0, jsx_runtime_1.jsx)(react_native_safe_area_context_1.SafeAreaView, { className: "flex-1 bg-zinc-950", children: (0, jsx_runtime_1.jsxs)(react_native_1.ScrollView, { className: "flex-1", contentContainerStyle: { padding: 16, gap: 16 }, refreshControl: (0, jsx_runtime_1.jsx)(react_native_1.RefreshControl, { refreshing: isRefetching, onRefresh: () => void refetch(), tintColor: "#f59e0b" }), children: [(0, jsx_runtime_1.jsxs)(react_native_1.View, { className: "flex-row items-center justify-between", children: [(0, jsx_runtime_1.jsxs)(react_native_1.View, { children: [(0, jsx_runtime_1.jsx)(react_native_1.TouchableOpacity, { onPress: () => router.back(), accessibilityRole: "button", children: (0, jsx_runtime_1.jsx)(react_native_1.Text, { className: "text-amber-400 text-xs font-semibold mb-1", children: "\u2190 Back to Haircare" }) }), (0, jsx_runtime_1.jsx)(react_native_1.Text, { className: "text-zinc-50 text-2xl font-extrabold", children: "Health Assessments" })] }), (0, jsx_runtime_1.jsx)(react_native_1.TouchableOpacity, { className: "bg-amber-500 active:bg-amber-600 px-4 py-2.5 rounded-xl shadow-sm", onPress: handleCreateNew, accessibilityRole: "button", children: (0, jsx_runtime_1.jsx)(react_native_1.Text, { className: "text-zinc-950 font-extrabold text-xs", children: "+ New Log" }) })] }), (0, jsx_runtime_1.jsx)(react_native_1.View, { className: "gap-1", children: (0, jsx_runtime_1.jsx)(react_native_1.TextInput, { className: "bg-zinc-900 border border-zinc-800 text-zinc-100 p-3 rounded-xl text-xs font-medium focus:border-amber-500", placeholder: "\uD83D\uDD0D Search notes, scalp type, or dates...", placeholderTextColor: "#71717a", value: searchQuery, onChangeText: setSearchQuery }) }), (0, jsx_runtime_1.jsxs)(react_native_1.View, { className: "flex-row items-center justify-between", children: [(0, jsx_runtime_1.jsx)(react_native_1.ScrollView, { horizontal: true, showsHorizontalScrollIndicator: false, contentContainerStyle: { gap: 6 }, children: SCALP_FILTER_OPTIONS.map((opt) => {
                                const isSelected = selectedScalp === opt.value;
                                return ((0, jsx_runtime_1.jsx)(react_native_1.TouchableOpacity, { className: `px-3 py-1.5 rounded-xl border ${isSelected
                                        ? 'bg-amber-500/20 border-amber-500'
                                        : 'bg-zinc-900 border-zinc-800'}`, onPress: () => setSelectedScalp(opt.value), children: (0, jsx_runtime_1.jsx)(react_native_1.Text, { className: `text-xs font-bold ${isSelected ? 'text-amber-400' : 'text-zinc-400'}`, children: opt.label }) }, opt.value));
                            }) }), (0, jsx_runtime_1.jsx)(react_native_1.TouchableOpacity, { className: "bg-zinc-900 border border-zinc-800 px-2.5 py-1.5 rounded-xl ml-2", onPress: () => setDateSort((prev) => (prev === 'newest' ? 'oldest' : 'newest')), children: (0, jsx_runtime_1.jsx)(react_native_1.Text, { className: "text-amber-400 text-xs font-bold", children: dateSort === 'newest' ? '↓ Newest' : '↑ Oldest' }) })] }), filteredVMs.length === 0 ? ((0, jsx_runtime_1.jsx)(components_1.EmptyConditionState, { onNewAssessmentPress: handleCreateNew })) : ((0, jsx_runtime_1.jsx)(react_native_1.View, { className: "gap-3", children: filteredVMs.map((condition) => ((0, jsx_runtime_1.jsx)(components_1.ConditionCard, { condition: condition, onEdit: handleEdit, onDelete: handleDelete }, condition.id))) }))] }) }));
};
exports.HairConditionHistoryScreen = HairConditionHistoryScreen;
