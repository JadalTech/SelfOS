"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RoutineListScreen = void 0;
const jsx_runtime_1 = require("react/jsx-runtime");
const react_1 = require("react");
const react_native_1 = require("react-native");
const react_native_safe_area_context_1 = require("react-native-safe-area-context");
const expo_router_1 = require("expo-router");
const useRoutines_1 = require("../hooks/useRoutines");
const components_1 = require("../components");
const CATEGORY_FILTERS = [
    { label: 'All Active', value: 'all' },
    { label: 'Haircare', value: 'haircare' },
    { label: 'Skincare', value: 'skincare' },
    { label: 'Water', value: 'water' },
    { label: 'Gym', value: 'gym' },
    { label: 'Nutrition', value: 'nutrition' },
    { label: 'Meds', value: 'medication' },
    { label: 'Archived', value: 'archived' },
];
const RoutineListScreen = function RoutineListScreen() {
    const router = (0, expo_router_1.useRouter)();
    // Local state for search query, category filter, and sorting
    const [searchQuery, setSearchQuery] = (0, react_1.useState)('');
    const [selectedFilter, setSelectedFilter] = (0, react_1.useState)('all');
    const [sortBy, setSortBy] = (0, react_1.useState)('streak-desc');
    // Query configuration based on active vs archived
    const statusFilter = selectedFilter === 'archived' ? 'archived' : undefined;
    const typeFilter = selectedFilter !== 'all' && selectedFilter !== 'archived'
        ? selectedFilter
        : undefined;
    const { data: routines = [], isLoading, isRefetching, refetch, isError, error, } = (0, useRoutines_1.useRoutines)({
        status: statusFilter,
        type: typeFilter,
    });
    // Local search & sort on cached query data
    const filteredAndSortedRoutines = (0, react_1.useMemo)(() => {
        let result = [...routines];
        // Filter by search query
        if (searchQuery.trim()) {
            const q = searchQuery.toLowerCase().trim();
            result = result.filter((r) => r.title.toLowerCase().includes(q) ||
                (r.description && r.description.toLowerCase().includes(q)));
        }
        // Sort
        result.sort((a, b) => {
            if (sortBy === 'streak-desc') {
                return b.currentStreak - a.currentStreak;
            }
            if (sortBy === 'name-asc') {
                return a.title.localeCompare(b.title);
            }
            if (sortBy === 'created-desc') {
                return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
            }
            return 0;
        });
        return result;
    }, [routines, searchQuery, sortBy]);
    const handleRoutinePress = (0, react_1.useCallback)((routineId) => {
        router.push(`/(app)/routines/${routineId}`);
    }, [router]);
    const handleCreatePress = (0, react_1.useCallback)(() => {
        router.push('/(app)/routines/new');
    }, [router]);
    const renderItem = (0, react_1.useCallback)(({ item }) => ((0, jsx_runtime_1.jsx)(components_1.RoutineCard, { routine: item, onPress: handleRoutinePress })), [handleRoutinePress]);
    const keyExtractor = (0, react_1.useCallback)((item) => item.id, []);
    return ((0, jsx_runtime_1.jsxs)(react_native_safe_area_context_1.SafeAreaView, { className: "flex-1 bg-zinc-950 px-4 pt-2", children: [(0, jsx_runtime_1.jsxs)(react_native_1.View, { className: "flex-row items-center justify-between pb-3", children: [(0, jsx_runtime_1.jsxs)(react_native_1.View, { children: [(0, jsx_runtime_1.jsx)(react_native_1.Text, { className: "text-zinc-500 text-xs font-semibold uppercase tracking-wider", children: "SelfOS Foundation" }), (0, jsx_runtime_1.jsx)(react_native_1.Text, { className: "text-zinc-50 text-2xl font-extrabold tracking-tight", children: "My Routines" })] }), (0, jsx_runtime_1.jsxs)(react_native_1.TouchableOpacity, { className: "bg-emerald-500 active:bg-emerald-600 px-4 py-2.5 rounded-xl flex-row items-center gap-1 shadow-md shadow-emerald-500/20", onPress: handleCreatePress, accessibilityRole: "button", accessibilityLabel: "Create new routine", children: [(0, jsx_runtime_1.jsx)(react_native_1.Text, { className: "text-zinc-950 text-lg font-bold lead-none", children: "+" }), (0, jsx_runtime_1.jsx)(react_native_1.Text, { className: "text-zinc-950 font-bold text-sm", children: "New" })] })] }), (0, jsx_runtime_1.jsx)(react_native_1.View, { className: "mb-3", children: (0, jsx_runtime_1.jsx)(react_native_1.TextInput, { className: "bg-zinc-900 border border-zinc-800 rounded-xl px-4 py-2.5 text-zinc-100 text-sm", placeholder: "Search routines by name or notes...", placeholderTextColor: "#71717a", value: searchQuery, onChangeText: setSearchQuery, clearButtonMode: "while-editing" }) }), (0, jsx_runtime_1.jsx)(react_native_1.View, { className: "mb-3", children: (0, jsx_runtime_1.jsx)(react_native_1.FlatList, { horizontal: true, showsHorizontalScrollIndicator: false, data: CATEGORY_FILTERS, keyExtractor: (item) => item.value, contentContainerStyle: { gap: 8 }, renderItem: ({ item }) => {
                        const isSelected = selectedFilter === item.value;
                        return ((0, jsx_runtime_1.jsx)(react_native_1.TouchableOpacity, { className: `px-3 py-1.5 rounded-xl border ${isSelected
                                ? 'bg-emerald-500/10 border-emerald-500'
                                : 'bg-zinc-900 border-zinc-800'}`, onPress: () => setSelectedFilter(item.value), children: (0, jsx_runtime_1.jsx)(react_native_1.Text, { className: `text-xs font-semibold ${isSelected ? 'text-emerald-400' : 'text-zinc-400'}`, children: item.label }) }));
                    } }) }), (0, jsx_runtime_1.jsxs)(react_native_1.View, { className: "flex-row items-center justify-between pb-2 border-b border-zinc-900 mb-2", children: [(0, jsx_runtime_1.jsxs)(react_native_1.Text, { className: "text-zinc-500 text-xs font-medium", children: ["Showing ", filteredAndSortedRoutines.length, " routine(s)"] }), (0, jsx_runtime_1.jsxs)(react_native_1.View, { className: "flex-row items-center gap-2", children: [(0, jsx_runtime_1.jsx)(react_native_1.Text, { className: "text-zinc-500 text-xs", children: "Sort:" }), (0, jsx_runtime_1.jsx)(react_native_1.TouchableOpacity, { onPress: () => setSortBy((prev) => prev === 'streak-desc'
                                    ? 'name-asc'
                                    : prev === 'name-asc'
                                        ? 'created-desc'
                                        : 'streak-desc'), children: (0, jsx_runtime_1.jsx)(react_native_1.Text, { className: "text-zinc-300 text-xs font-semibold capitalize", children: sortBy === 'streak-desc'
                                        ? 'Streak 🔥'
                                        : sortBy === 'name-asc'
                                            ? 'Name A-Z'
                                            : 'Newest' }) })] })] }), isLoading ? ((0, jsx_runtime_1.jsxs)(react_native_1.View, { className: "py-2", children: [(0, jsx_runtime_1.jsx)(components_1.LoadingRoutineCard, {}), (0, jsx_runtime_1.jsx)(components_1.LoadingRoutineCard, {}), (0, jsx_runtime_1.jsx)(components_1.LoadingRoutineCard, {})] })) : isError ? ((0, jsx_runtime_1.jsxs)(react_native_1.View, { className: "flex-1 items-center justify-center p-6 gap-3", children: [(0, jsx_runtime_1.jsx)(react_native_1.Text, { className: "text-rose-500 text-base font-bold", children: "Failed to load routines" }), (0, jsx_runtime_1.jsx)(react_native_1.Text, { className: "text-zinc-400 text-xs text-center", children: error?.message }), (0, jsx_runtime_1.jsx)(react_native_1.TouchableOpacity, { className: "px-4 py-2 rounded-xl bg-zinc-800", onPress: () => void refetch(), children: (0, jsx_runtime_1.jsx)(react_native_1.Text, { className: "text-zinc-200 text-xs font-semibold", children: "Retry" }) })] })) : ((0, jsx_runtime_1.jsx)(react_native_1.FlatList, { data: filteredAndSortedRoutines, keyExtractor: keyExtractor, renderItem: renderItem, contentContainerStyle: { paddingBottom: 24 }, showsVerticalScrollIndicator: false, refreshControl: (0, jsx_runtime_1.jsx)(react_native_1.RefreshControl, { refreshing: isRefetching, onRefresh: () => void refetch(), tintColor: "#10b981" }), ListEmptyComponent: (0, jsx_runtime_1.jsx)(components_1.EmptyRoutineState, { title: searchQuery ? 'No Matching Routines' : 'No Routines Found', message: searchQuery
                        ? `No routines match "${searchQuery}". Try adjusting your search term.`
                        : 'Get started by creating your first routine foundation.', onAction: searchQuery ? () => setSearchQuery('') : handleCreatePress, actionLabel: searchQuery ? 'Clear Search' : 'Create New Routine' }) }))] }));
};
exports.RoutineListScreen = RoutineListScreen;
