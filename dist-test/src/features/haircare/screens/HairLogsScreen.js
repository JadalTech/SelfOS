"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.HairLogsScreen = void 0;
const jsx_runtime_1 = require("react/jsx-runtime");
const react_1 = require("react");
const react_native_1 = require("react-native");
const react_native_safe_area_context_1 = require("react-native-safe-area-context");
const expo_router_1 = require("expo-router");
const useHairLogs_1 = require("../hooks/useHairLogs");
const useHairRoutines_1 = require("../hooks/useHairRoutines");
const useHairProducts_1 = require("../hooks/useHairProducts");
const routine_1 = require("@/features/routine");
const logs_mapper_1 = require("../mappers/logs.mapper");
const components_1 = require("../components");
const HairLogsScreen = function HairLogsScreen() {
    const router = (0, expo_router_1.useRouter)();
    const { logs, isLoading, isRefetching, isError, error, refetch } = (0, useHairLogs_1.useHairLogs)();
    const { hairRoutines } = (0, useHairRoutines_1.useHairRoutines)();
    const { products } = (0, useHairProducts_1.useHairProducts)();
    const coreRoutinesState = (0, routine_1.useRoutines)({ type: 'haircare' });
    const coreRoutines = (0, react_1.useMemo)(() => coreRoutinesState.data ?? [], [coreRoutinesState.data]);
    const logVMs = (0, logs_mapper_1.mapToHairLogVMs)(logs, hairRoutines, coreRoutines, products);
    if (isLoading) {
        return ((0, jsx_runtime_1.jsx)(react_native_safe_area_context_1.SafeAreaView, { className: "flex-1 bg-zinc-950", children: (0, jsx_runtime_1.jsx)(components_1.LoadingHaircare, {}) }));
    }
    if (isError) {
        return ((0, jsx_runtime_1.jsx)(react_native_safe_area_context_1.SafeAreaView, { className: "flex-1 bg-zinc-950", children: (0, jsx_runtime_1.jsx)(components_1.ErrorHaircare, { errorMessage: error?.message, onRetry: () => void refetch() }) }));
    }
    return ((0, jsx_runtime_1.jsx)(react_native_safe_area_context_1.SafeAreaView, { className: "flex-1 bg-zinc-950", children: (0, jsx_runtime_1.jsxs)(react_native_1.ScrollView, { className: "flex-1", contentContainerStyle: { padding: 16, gap: 16 }, refreshControl: (0, jsx_runtime_1.jsx)(react_native_1.RefreshControl, { refreshing: isRefetching, onRefresh: () => void refetch(), tintColor: "#f59e0b" }), children: [(0, jsx_runtime_1.jsx)(react_native_1.View, { className: "flex-row items-center justify-between", children: (0, jsx_runtime_1.jsxs)(react_native_1.View, { children: [(0, jsx_runtime_1.jsx)(react_native_1.TouchableOpacity, { onPress: () => router.back(), accessibilityRole: "button", children: (0, jsx_runtime_1.jsx)(react_native_1.Text, { className: "text-amber-400 text-xs font-semibold mb-1", children: "\u2190 Back to Haircare" }) }), (0, jsx_runtime_1.jsx)(react_native_1.Text, { className: "text-zinc-50 text-2xl font-extrabold", children: "Wash Log History" })] }) }), logVMs.length === 0 ? ((0, jsx_runtime_1.jsx)(components_1.EmptyHaircare, { title: "No Wash Logs Found", message: "Your completed wash days and treatment executions will be archived here." })) : ((0, jsx_runtime_1.jsx)(react_native_1.View, { className: "gap-3", children: logVMs.map((log) => ((0, jsx_runtime_1.jsx)(components_1.HairLogCard, { log: log }, log.id))) }))] }) }));
};
exports.HairLogsScreen = HairLogsScreen;
