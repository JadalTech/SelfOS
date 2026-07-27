"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SkincareLogsScreen = SkincareLogsScreen;
const jsx_runtime_1 = require("react/jsx-runtime");
const react_native_1 = require("react-native");
const useSkincareLogs_1 = require("../hooks/useSkincareLogs");
const SkincareLogCard_1 = require("../components/SkincareLogCard");
const EmptyStateCard_1 = require("../../../shared/components/feedback/EmptyStateCard");
const ErrorStateCard_1 = require("../../../shared/components/feedback/ErrorStateCard");
const SkeletonLoader_1 = require("../../../shared/components/loaders/SkeletonLoader");
function SkincareLogsScreen() {
    const { logVMs, isLoading, isError, error, refetch } = (0, useSkincareLogs_1.useSkincareLogs)();
    return ((0, jsx_runtime_1.jsx)(react_native_1.SafeAreaView, { className: "flex-1 bg-zinc-950", children: (0, jsx_runtime_1.jsxs)(react_native_1.View, { className: "flex-1 p-4 gap-4", children: [(0, jsx_runtime_1.jsxs)(react_native_1.View, { children: [(0, jsx_runtime_1.jsx)(react_native_1.Text, { className: "text-zinc-500 text-[10px] font-bold uppercase tracking-wider", children: "Audit Trail & History" }), (0, jsx_runtime_1.jsx)(react_native_1.Text, { className: "text-zinc-50 text-2xl font-black tracking-tight", children: "Execution Logs" })] }), isLoading ? ((0, jsx_runtime_1.jsxs)(react_native_1.View, { className: "gap-3 mt-2", children: [(0, jsx_runtime_1.jsx)(SkeletonLoader_1.SkeletonLoader, { height: 90 }), (0, jsx_runtime_1.jsx)(SkeletonLoader_1.SkeletonLoader, { height: 90 }), (0, jsx_runtime_1.jsx)(SkeletonLoader_1.SkeletonLoader, { height: 90 })] })) : isError ? ((0, jsx_runtime_1.jsx)(ErrorStateCard_1.ErrorStateCard, { message: error?.message, onRetry: refetch })) : logVMs.length === 0 ? ((0, jsx_runtime_1.jsx)(EmptyStateCard_1.EmptyStateCard, { icon: "\uD83D\uDCDD", title: "No Execution Logs Yet", description: "Complete morning or evening routines to build your skincare compliance history." })) : ((0, jsx_runtime_1.jsx)(react_native_1.FlatList, { data: logVMs, keyExtractor: (item) => item.id, contentContainerStyle: { gap: 10, paddingBottom: 24 }, showsVerticalScrollIndicator: false, refreshControl: (0, jsx_runtime_1.jsx)(react_native_1.RefreshControl, { refreshing: isLoading, onRefresh: refetch, tintColor: "#ec4899" }), renderItem: ({ item }) => (0, jsx_runtime_1.jsx)(SkincareLogCard_1.SkincareLogCard, { log: item }) }))] }) }));
}
