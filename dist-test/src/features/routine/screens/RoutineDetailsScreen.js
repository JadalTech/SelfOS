"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RoutineDetailsScreen = void 0;
const jsx_runtime_1 = require("react/jsx-runtime");
const react_1 = require("react");
const react_native_1 = require("react-native");
const react_native_safe_area_context_1 = require("react-native-safe-area-context");
const expo_router_1 = require("expo-router");
const useRoutine_1 = require("../hooks/useRoutine");
const useRoutineMutations_1 = require("../hooks/useRoutineMutations");
const completion_1 = require("../engine/completion");
const RoutineStatusBadge_1 = require("../components/RoutineStatusBadge");
const components_1 = require("@/shared/components");
const TYPE_ICONS = {
    haircare: '💇‍♂️',
    skincare: '🧴',
    water: '💧',
    nutrition: '🥗',
    gym: '🏋️‍♂️',
    sleep: '😴',
    medication: '💊',
    custom: '🎯',
};
const RoutineDetailsScreen = function RoutineDetailsScreen() {
    const router = (0, expo_router_1.useRouter)();
    const { id } = (0, expo_router_1.useLocalSearchParams)();
    const routineId = id ?? '';
    const { routine, logs, isLoading, isError, error } = (0, useRoutine_1.useRoutine)(routineId);
    const completeMutation = (0, useRoutineMutations_1.useCompleteRoutine)();
    const skipMutation = (0, useRoutineMutations_1.useSkipRoutine)();
    const undoMutation = (0, useRoutineMutations_1.useUndoCompletion)();
    const [activeActionId, setActiveActionId] = (0, react_1.useState)(null);
    const todayStr = (0, react_1.useMemo)(() => new Date().toISOString().split('T')[0], []);
    // Compute status for today
    const todayStatus = (0, react_1.useMemo)(() => {
        if (!routine)
            return 'pending';
        return (0, completion_1.getRoutineStatusForDate)(routine, logs, todayStr);
    }, [routine, logs, todayStr]);
    // Compute completion rate over the last 30 days
    const completionStats = (0, react_1.useMemo)(() => {
        if (!routine)
            return { completed: 0, scheduled: 0, rate: 0 };
        const end = new Date();
        const start = new Date();
        start.setDate(start.getDate() - 30);
        const startStr = start.toISOString().split('T')[0];
        const endStr = end.toISOString().split('T')[0];
        return (0, completion_1.calculateCompletionRate)(routine, logs, startStr, endStr);
    }, [routine, logs]);
    if (isLoading) {
        return (0, jsx_runtime_1.jsx)(components_1.FullScreenLoader, { message: "Loading routine details..." });
    }
    if (isError || !routine) {
        return ((0, jsx_runtime_1.jsxs)(react_native_safe_area_context_1.SafeAreaView, { className: "flex-1 bg-zinc-950 items-center justify-center p-6 gap-4", children: [(0, jsx_runtime_1.jsx)(react_native_1.Text, { className: "text-rose-500 font-bold text-lg", children: "Routine Not Found" }), (0, jsx_runtime_1.jsx)(react_native_1.Text, { className: "text-zinc-400 text-xs text-center", children: error?.message ?? 'The requested routine does not exist.' }), (0, jsx_runtime_1.jsx)(react_native_1.TouchableOpacity, { className: "px-5 py-2.5 bg-zinc-900 border border-zinc-800 rounded-xl", onPress: () => router.back(), children: (0, jsx_runtime_1.jsx)(react_native_1.Text, { className: "text-zinc-200 font-semibold text-xs", children: "Go Back" }) })] }));
    }
    const icon = TYPE_ICONS[routine.type] ?? '🎯';
    const handleComplete = async () => {
        setActiveActionId('complete');
        try {
            await completeMutation.mutateAsync({
                routineId,
                dateStr: todayStr,
            });
        }
        catch (err) {
            const msg = err instanceof Error ? err.message : 'Failed to complete routine';
            react_native_1.Alert.alert('Completion Error', msg);
        }
        finally {
            setActiveActionId(null);
        }
    };
    const handleSkip = async () => {
        setActiveActionId('skip');
        try {
            await skipMutation.mutateAsync({
                routineId,
                dateStr: todayStr,
            });
        }
        catch (err) {
            const msg = err instanceof Error ? err.message : 'Failed to skip routine';
            react_native_1.Alert.alert('Skip Error', msg);
        }
        finally {
            setActiveActionId(null);
        }
    };
    const handleUndo = async (logId) => {
        setActiveActionId(logId);
        try {
            await undoMutation.mutateAsync({
                routineId,
                logId,
            });
        }
        catch (err) {
            const msg = err instanceof Error ? err.message : 'Failed to undo log';
            react_native_1.Alert.alert('Undo Error', msg);
        }
        finally {
            setActiveActionId(null);
        }
    };
    return ((0, jsx_runtime_1.jsxs)(react_native_safe_area_context_1.SafeAreaView, { className: "flex-1 bg-zinc-950", children: [(0, jsx_runtime_1.jsxs)(react_native_1.View, { className: "flex-row items-center justify-between px-4 py-3 border-b border-zinc-900", children: [(0, jsx_runtime_1.jsx)(react_native_1.TouchableOpacity, { className: "px-3 py-1.5 rounded-xl bg-zinc-900 border border-zinc-800", onPress: () => router.back(), accessibilityRole: "button", accessibilityLabel: "Go back to list", children: (0, jsx_runtime_1.jsx)(react_native_1.Text, { className: "text-zinc-300 font-semibold text-xs", children: "\u2190 Back" }) }), (0, jsx_runtime_1.jsx)(react_native_1.Text, { className: "text-zinc-100 font-extrabold text-base numberOfLines={1}", children: "Routine Overview" }), (0, jsx_runtime_1.jsx)(react_native_1.TouchableOpacity, { className: "px-3 py-1.5 rounded-xl bg-zinc-900 border border-zinc-800", onPress: () => router.push(`/(app)/routines/${routineId}/edit`), accessibilityRole: "button", accessibilityLabel: "Edit routine", children: (0, jsx_runtime_1.jsx)(react_native_1.Text, { className: "text-emerald-400 font-semibold text-xs", children: "Edit" }) })] }), (0, jsx_runtime_1.jsxs)(react_native_1.ScrollView, { className: "flex-1", contentContainerStyle: { padding: 16, gap: 16 }, showsVerticalScrollIndicator: false, children: [(0, jsx_runtime_1.jsxs)(react_native_1.View, { className: "bg-zinc-900/90 border border-zinc-800/80 rounded-2xl p-5 gap-3", children: [(0, jsx_runtime_1.jsxs)(react_native_1.View, { className: "flex-row items-center justify-between", children: [(0, jsx_runtime_1.jsxs)(react_native_1.View, { className: "flex-row items-center gap-3", children: [(0, jsx_runtime_1.jsx)(react_native_1.View, { className: "w-12 h-12 rounded-2xl bg-zinc-800 items-center justify-center border border-zinc-700/60", children: (0, jsx_runtime_1.jsx)(react_native_1.Text, { className: "text-2xl", children: icon }) }), (0, jsx_runtime_1.jsxs)(react_native_1.View, { className: "flex-1 pr-2", children: [(0, jsx_runtime_1.jsx)(react_native_1.Text, { className: "text-zinc-100 text-xl font-extrabold tracking-tight", children: routine.title }), (0, jsx_runtime_1.jsxs)(react_native_1.Text, { className: "text-zinc-400 text-xs font-medium capitalize", children: [routine.type, " \u2022 ", routine.schedule.frequency] })] })] }), (0, jsx_runtime_1.jsx)(RoutineStatusBadge_1.RoutineStatusBadge, { status: todayStatus, size: "md" })] }), routine.description ? ((0, jsx_runtime_1.jsx)(react_native_1.Text, { className: "text-zinc-300 text-sm font-normal leading-relaxed pt-1", children: routine.description })) : null] }), (0, jsx_runtime_1.jsxs)(react_native_1.View, { className: "bg-zinc-900/90 border border-zinc-800/80 rounded-2xl p-4 gap-3", children: [(0, jsx_runtime_1.jsxs)(react_native_1.Text, { className: "text-zinc-400 text-xs font-semibold uppercase tracking-wider", children: ["Today's Log (", todayStr, ")"] }), (0, jsx_runtime_1.jsxs)(react_native_1.View, { className: "flex-row gap-3", children: [(0, jsx_runtime_1.jsx)(react_native_1.TouchableOpacity, { className: `flex-1 py-3.5 rounded-xl items-center justify-center border ${todayStatus === 'completed'
                                            ? 'bg-emerald-950/60 border-emerald-800/80'
                                            : 'bg-emerald-500 active:bg-emerald-600 border-emerald-400'}`, onPress: handleComplete, disabled: activeActionId !== null, accessibilityRole: "button", accessibilityLabel: "Mark routine as completed today", children: activeActionId === 'complete' ? ((0, jsx_runtime_1.jsx)(components_1.InlineLoader, { label: "Saving...", color: "#09090b" })) : ((0, jsx_runtime_1.jsx)(react_native_1.Text, { className: `font-extrabold text-sm ${todayStatus === 'completed' ? 'text-emerald-400' : 'text-zinc-950'}`, children: todayStatus === 'completed' ? '✓ Completed Today' : 'Mark Completed' })) }), (0, jsx_runtime_1.jsx)(react_native_1.TouchableOpacity, { className: `px-5 py-3.5 rounded-xl items-center justify-center border ${todayStatus === 'skipped'
                                            ? 'bg-amber-950/60 border-amber-800/80'
                                            : 'bg-zinc-800 active:bg-zinc-700 border-zinc-700'}`, onPress: handleSkip, disabled: activeActionId !== null, accessibilityRole: "button", accessibilityLabel: "Skip routine today", children: activeActionId === 'skip' ? ((0, jsx_runtime_1.jsx)(components_1.InlineLoader, { label: "...", color: "#f59e0b" })) : ((0, jsx_runtime_1.jsx)(react_native_1.Text, { className: `font-semibold text-sm ${todayStatus === 'skipped' ? 'text-amber-400' : 'text-zinc-300'}`, children: "Skip" })) })] })] }), (0, jsx_runtime_1.jsxs)(react_native_1.View, { className: "flex-row gap-3", children: [(0, jsx_runtime_1.jsxs)(react_native_1.View, { className: "flex-1 bg-zinc-900/90 border border-zinc-800/80 rounded-2xl p-4 gap-1", children: [(0, jsx_runtime_1.jsx)(react_native_1.Text, { className: "text-zinc-400 text-xs font-semibold uppercase tracking-wider", children: "Current Streak" }), (0, jsx_runtime_1.jsxs)(react_native_1.View, { className: "flex-row items-baseline gap-1", children: [(0, jsx_runtime_1.jsxs)(react_native_1.Text, { className: "text-amber-500 text-2xl font-black", children: ["\uD83D\uDD25 ", routine.currentStreak] }), (0, jsx_runtime_1.jsx)(react_native_1.Text, { className: "text-zinc-400 text-xs font-medium", children: "days" })] }), (0, jsx_runtime_1.jsxs)(react_native_1.Text, { className: "text-zinc-500 text-[10px] mt-1", children: ["Longest: ", routine.longestStreak, " days"] })] }), (0, jsx_runtime_1.jsxs)(react_native_1.View, { className: "flex-1 bg-zinc-900/90 border border-zinc-800/80 rounded-2xl p-4 gap-1", children: [(0, jsx_runtime_1.jsx)(react_native_1.Text, { className: "text-zinc-400 text-xs font-semibold uppercase tracking-wider", children: "30-Day Rate" }), (0, jsx_runtime_1.jsx)(react_native_1.View, { className: "flex-row items-baseline gap-1", children: (0, jsx_runtime_1.jsxs)(react_native_1.Text, { className: "text-emerald-400 text-2xl font-black", children: [Math.round(completionStats.rate), "%"] }) }), (0, jsx_runtime_1.jsxs)(react_native_1.Text, { className: "text-zinc-500 text-[10px] mt-1", children: [completionStats.completed, " of ", completionStats.scheduled, " scheduled days"] })] })] }), (0, jsx_runtime_1.jsxs)(react_native_1.View, { className: "bg-zinc-900/90 border border-zinc-800/80 rounded-2xl p-4 gap-3", children: [(0, jsx_runtime_1.jsxs)(react_native_1.View, { className: "flex-row items-center justify-between border-b border-zinc-800/80 pb-2", children: [(0, jsx_runtime_1.jsx)(react_native_1.Text, { className: "text-zinc-400 text-xs font-semibold uppercase tracking-wider", children: "Completion History" }), (0, jsx_runtime_1.jsxs)(react_native_1.Text, { className: "text-zinc-500 text-xs font-medium", children: [logs.length, " record(s)"] })] }), logs.length === 0 ? ((0, jsx_runtime_1.jsx)(react_native_1.Text, { className: "text-zinc-500 text-xs py-4 text-center", children: "No completion history logged yet." })) : ((0, jsx_runtime_1.jsx)(react_native_1.View, { className: "gap-2.5", children: logs.map((log) => ((0, jsx_runtime_1.jsxs)(react_native_1.View, { className: "flex-row items-center justify-between bg-zinc-950/60 border border-zinc-800/60 p-3 rounded-xl", children: [(0, jsx_runtime_1.jsxs)(react_native_1.View, { className: "gap-0.5", children: [(0, jsx_runtime_1.jsx)(react_native_1.Text, { className: "text-zinc-200 text-sm font-semibold", children: log.date }), (0, jsx_runtime_1.jsxs)(react_native_1.Text, { className: "text-zinc-500 text-xs", children: ["Logged at ", log.time] })] }), (0, jsx_runtime_1.jsxs)(react_native_1.View, { className: "flex-row items-center gap-3", children: [(0, jsx_runtime_1.jsx)(RoutineStatusBadge_1.RoutineStatusBadge, { status: log.status, size: "sm" }), (0, jsx_runtime_1.jsx)(react_native_1.TouchableOpacity, { className: "px-2.5 py-1 rounded-lg bg-zinc-800 active:bg-zinc-700", onPress: () => void handleUndo(log.id), disabled: activeActionId !== null, accessibilityRole: "button", accessibilityLabel: `Undo completion log for ${log.date}`, children: activeActionId === log.id ? ((0, jsx_runtime_1.jsx)(components_1.InlineLoader, { label: "", color: "#ef4444" })) : ((0, jsx_runtime_1.jsx)(react_native_1.Text, { className: "text-rose-400 text-xs font-medium", children: "Undo" })) })] })] }, log.id))) }))] })] })] }));
};
exports.RoutineDetailsScreen = RoutineDetailsScreen;
