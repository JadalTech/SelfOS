"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SkincareRoutinesScreen = SkincareRoutinesScreen;
const jsx_runtime_1 = require("react/jsx-runtime");
const react_1 = require("react");
const react_native_1 = require("react-native");
const useSkincareRoutines_1 = require("../hooks/useSkincareRoutines");
const useSkincareProducts_1 = require("../hooks/useSkincareProducts");
const useSkincareLogs_1 = require("../hooks/useSkincareLogs");
const SkincareRoutineCard_1 = require("../components/SkincareRoutineCard");
const SkincareRoutineForm_1 = require("../components/SkincareRoutineForm");
const SkincareLogForm_1 = require("../components/SkincareLogForm");
const EmptyStateCard_1 = require("../../../shared/components/feedback/EmptyStateCard");
const ErrorStateCard_1 = require("../../../shared/components/feedback/ErrorStateCard");
const SkeletonLoader_1 = require("../../../shared/components/loaders/SkeletonLoader");
function SkincareRoutinesScreen() {
    const { routineVMs, isLoading, isError, error, refetch, createRoutine, deleteRoutine, isCreating } = (0, useSkincareRoutines_1.useSkincareRoutines)();
    const { productVMs } = (0, useSkincareProducts_1.useSkincareProducts)();
    const { logExecution, isLogging } = (0, useSkincareLogs_1.useSkincareLogs)();
    const [selectedTimeFilter, setSelectedTimeFilter] = (0, react_1.useState)('all');
    const [isFormOpen, setIsFormOpen] = (0, react_1.useState)(false);
    const [activeLoggingRoutine, setActiveLoggingRoutine] = (0, react_1.useState)(null);
    const filteredRoutines = routineVMs.filter((r) => {
        if (selectedTimeFilter === 'all')
            return true;
        return r.timeOfDay === selectedTimeFilter;
    });
    const handleCreateRoutineSubmit = async (values) => {
        await createRoutine(values);
    };
    const handleLogSubmit = async (values) => {
        await logExecution(values);
    };
    return ((0, jsx_runtime_1.jsx)(react_native_1.SafeAreaView, { className: "flex-1 bg-zinc-950", children: (0, jsx_runtime_1.jsxs)(react_native_1.View, { className: "flex-1 p-4 gap-4", children: [(0, jsx_runtime_1.jsxs)(react_native_1.View, { className: "flex-row items-center justify-between", children: [(0, jsx_runtime_1.jsxs)(react_native_1.View, { children: [(0, jsx_runtime_1.jsx)(react_native_1.Text, { className: "text-zinc-500 text-[10px] font-bold uppercase tracking-wider", children: "Regimens & Sequences" }), (0, jsx_runtime_1.jsx)(react_native_1.Text, { className: "text-zinc-50 text-2xl font-black tracking-tight", children: "Skincare Routines" })] }), (0, jsx_runtime_1.jsx)(react_native_1.TouchableOpacity, { activeOpacity: 0.8, onPress: () => setIsFormOpen(true), className: "bg-pink-600 px-3.5 py-2 rounded-xl border border-pink-500/40 shadow-sm", children: (0, jsx_runtime_1.jsx)(react_native_1.Text, { className: "text-white text-xs font-bold", children: "+ Build Routine" }) })] }), (0, jsx_runtime_1.jsx)(react_native_1.View, { className: "flex-row gap-2", children: [
                        { value: 'all', label: 'All Routines' },
                        { value: 'morning', label: '☀️ Morning' },
                        { value: 'evening', label: '🌙 Evening' },
                        { value: 'weekly-special', label: '📅 Weekly' },
                    ].map((tab) => {
                        const isSelected = selectedTimeFilter === tab.value;
                        return ((0, jsx_runtime_1.jsx)(react_native_1.TouchableOpacity, { onPress: () => setSelectedTimeFilter(tab.value), className: `px-3 py-1.5 rounded-xl border ${isSelected ? 'bg-pink-500/20 border-pink-500/50' : 'bg-zinc-900 border-zinc-800'}`, children: (0, jsx_runtime_1.jsx)(react_native_1.Text, { className: `text-xs font-semibold ${isSelected ? 'text-pink-400' : 'text-zinc-400'}`, children: tab.label }) }, tab.value));
                    }) }), isLoading ? ((0, jsx_runtime_1.jsxs)(react_native_1.View, { className: "gap-3 mt-2", children: [(0, jsx_runtime_1.jsx)(SkeletonLoader_1.SkeletonLoader, { height: 140 }), (0, jsx_runtime_1.jsx)(SkeletonLoader_1.SkeletonLoader, { height: 140 })] })) : isError ? ((0, jsx_runtime_1.jsx)(ErrorStateCard_1.ErrorStateCard, { message: error?.message, onRetry: refetch })) : filteredRoutines.length === 0 ? ((0, jsx_runtime_1.jsx)(EmptyStateCard_1.EmptyStateCard, { icon: "\u2728", title: "No Skincare Routines Built", description: "Create ordered morning, evening, or weekly special routines using active products from your vanity.", actionLabel: "+ Build Skincare Routine", onAction: () => setIsFormOpen(true) })) : ((0, jsx_runtime_1.jsx)(react_native_1.FlatList, { data: filteredRoutines, keyExtractor: (item) => item.id, contentContainerStyle: { gap: 14, paddingBottom: 24 }, showsVerticalScrollIndicator: false, renderItem: ({ item }) => ((0, jsx_runtime_1.jsx)(SkincareRoutineCard_1.SkincareRoutineCard, { routine: item, onLogExecution: () => setActiveLoggingRoutine(item), onDelete: () => deleteRoutine({ skincareRoutineId: item.id, coreRoutineId: item.routineId }) })) })), (0, jsx_runtime_1.jsx)(SkincareRoutineForm_1.SkincareRoutineForm, { visible: isFormOpen, availableProducts: productVMs, isSubmitting: isCreating, onClose: () => setIsFormOpen(false), onSubmit: handleCreateRoutineSubmit }), activeLoggingRoutine ? ((0, jsx_runtime_1.jsx)(SkincareLogForm_1.SkincareLogForm, { visible: !!activeLoggingRoutine, routine: activeLoggingRoutine, isSubmitting: isLogging, onClose: () => setActiveLoggingRoutine(null), onSubmit: handleLogSubmit })) : null] }) }));
}
