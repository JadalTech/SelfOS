"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.SleepDashboardScreen = void 0;
const jsx_runtime_1 = require("react/jsx-runtime");
const react_1 = require("react");
const react_native_1 = require("react-native");
const expo_router_1 = require("expo-router");
const useSleepToday_1 = require("../hooks/useSleepToday");
const useSleepEntries_1 = require("../hooks/useSleepEntries");
const useSleepSchedule_1 = require("../hooks/useSleepSchedule");
const useSleepGoals_1 = require("../hooks/useSleepGoals");
const useSleepRecovery_1 = require("../hooks/useSleepRecovery");
const DashboardLayout_1 = require("../components/layouts/DashboardLayout");
const sleep_mapper_1 = require("../mappers/sleep.mapper");
const SleepEngine = __importStar(require("../engine/sleepEngine"));
const MetricCard_1 = require("@/shared/components/cards/MetricCard");
const ProgressCard_1 = require("@/shared/components/cards/ProgressCard");
const EmptyStateCard_1 = require("@/shared/components/feedback/EmptyStateCard");
const SleepDashboardScreen = () => {
    const router = (0, expo_router_1.useRouter)();
    // Load domain states via React Query hooks
    const { isLoading: isTodayLoading, refetch: refetchToday } = (0, useSleepToday_1.useSleepToday)();
    const { entries, isLoading: isEntriesLoading, refetch: refetchEntries } = (0, useSleepEntries_1.useSleepEntries)();
    const { activeSchedule, isLoading: isScheduleLoading, refetch: refetchSchedule } = (0, useSleepSchedule_1.useSleepSchedule)();
    const { activeGoals, isLoading: isGoalsLoading, refetch: refetchGoals } = (0, useSleepGoals_1.useSleepGoals)();
    const { recovery, isLoading: isRecoveryLoading, refetch: refetchRecovery } = (0, useSleepRecovery_1.useSleepRecovery)();
    const isLoading = isTodayLoading || isEntriesLoading || isScheduleLoading || isGoalsLoading || isRecoveryLoading;
    const handleRefetchAll = (0, react_1.useCallback)(async () => {
        await Promise.all([
            refetchToday(),
            refetchEntries(),
            refetchSchedule(),
            refetchGoals(),
            refetchRecovery(),
        ]);
    }, [refetchToday, refetchEntries, refetchSchedule, refetchGoals, refetchRecovery]);
    // Compute metrics & map ViewModel inside useMemo
    const viewModel = (0, react_1.useMemo)(() => {
        if (isLoading)
            return null;
        const targetMinutes = activeSchedule?.targetDurationMinutes || 480;
        const streak = SleepEngine.calculateSleepStreaks(entries, targetMinutes);
        const debt = SleepEngine.calculateSleepDebt(entries, targetMinutes);
        // Consistency score (last 7 entries)
        const recentEntries = entries.slice(0, 7);
        const consistency = activeSchedule ? SleepEngine.calculateScheduleConsistency(recentEntries, activeSchedule) : 100;
        // Goal progress (latest entry)
        let goalProgress = 0;
        const latest = entries[0];
        if (latest && activeGoals.length > 0 && activeSchedule) {
            goalProgress = SleepEngine.calculateGoalCompletionPercentage(latest, activeGoals, activeSchedule, consistency);
        }
        return (0, sleep_mapper_1.buildSleepDashboardVM)(latest || null, activeSchedule, recovery, streak, debt, consistency, goalProgress);
    }, [isLoading, entries, activeSchedule, activeGoals, recovery]);
    // Navigation callbacks
    const handleLogPress = (0, react_1.useCallback)(() => {
        router.push('/sleep/log');
    }, [router]);
    const handleHistoryPress = (0, react_1.useCallback)(() => {
        router.push('/sleep/history');
    }, [router]);
    const handleSchedulePress = (0, react_1.useCallback)(() => {
        router.push('/sleep/schedule');
    }, [router]);
    const handleGoalsPress = (0, react_1.useCallback)(() => {
        router.push('/sleep/goals');
    }, [router]);
    const handleInsightsPress = (0, react_1.useCallback)(() => {
        router.push('/sleep/insights');
    }, [router]);
    if (!isLoading && !viewModel) {
        return ((0, jsx_runtime_1.jsx)(DashboardLayout_1.DashboardLayout, { title: "Sleep", isLoading: false, children: (0, jsx_runtime_1.jsx)(EmptyStateCard_1.EmptyStateCard, { icon: "\uD83C\uDF19", title: "Setup Sleep Module", description: "Establish your Sleep schedule and log your first night's rest to compute recovery scores.", actionLabel: "Log Sleep Now", onAction: handleLogPress, accentColor: "#6366f1" }) }));
    }
    const recoveryValue = viewModel?.recovery?.recoveryScore ?? 0;
    const recoveryStatusLabel = viewModel?.recovery?.statusLabel ?? 'No Data';
    const recoveryColor = viewModel?.recovery?.statusColor ?? '#a1a1aa';
    return ((0, jsx_runtime_1.jsxs)(DashboardLayout_1.DashboardLayout, { title: "Sleep", subtitle: "Sleep tracking & biological recovery", isLoading: isLoading, onRetry: handleRefetchAll, headerRight: (0, jsx_runtime_1.jsx)(react_native_1.TouchableOpacity, { style: styles.quickLogBtn, onPress: handleLogPress, accessible: true, accessibilityRole: "button", accessibilityLabel: "Log Sleep Entry", hitSlop: { top: 8, bottom: 8, left: 12, right: 12 }, children: (0, jsx_runtime_1.jsx)(react_native_1.Text, { style: styles.quickLogBtnText, children: "+ Log Night" }) }), children: [(0, jsx_runtime_1.jsx)(react_native_1.View, { style: styles.recoverySection, children: (0, jsx_runtime_1.jsx)(ProgressCard_1.ProgressCard, { title: "Daily Recovery", value: recoveryValue > 0 ? `${recoveryValue}%` : 'N/A', progress: recoveryValue / 100, type: "circular", activeColor: recoveryColor, subLabel: recoveryValue > 0 ? `${recoveryStatusLabel} Recovery` : 'No Log Today' }) }), (0, jsx_runtime_1.jsxs)(react_native_1.View, { style: styles.metricGrid, children: [(0, jsx_runtime_1.jsx)(MetricCard_1.MetricCard, { label: "Last Sleep", value: viewModel?.latestEntry?.durationLabel ?? 'None', subLabel: viewModel?.latestEntry?.formattedDate ?? 'No log', icon: "\u23F3", color: "#818cf8" }), (0, jsx_runtime_1.jsx)(MetricCard_1.MetricCard, { label: "Quality", value: viewModel?.latestEntry?.qualityRating ? `${viewModel.latestEntry.qualityRating}/10` : 'None', subLabel: viewModel?.latestEntry?.qualityLabel ?? 'No quality', icon: "\u2728", color: "#a78bfa" })] }), (0, jsx_runtime_1.jsxs)(react_native_1.View, { style: styles.metricGrid, children: [(0, jsx_runtime_1.jsx)(MetricCard_1.MetricCard, { label: "Sleep Debt", value: viewModel?.sleepDebtLabel ?? '0.0 hrs', subLabel: viewModel?.sleepDebtMinutes && viewModel.sleepDebtMinutes > 0 ? 'Accumulated debt' : 'Sleep surplus', icon: "\u2696\uFE0F", color: "#f43f5e" }), (0, jsx_runtime_1.jsx)(MetricCard_1.MetricCard, { label: "Log Streak", value: viewModel?.streakLabel ?? '0 days', subLabel: "Consecutive target nights", icon: "\uD83D\uDD25", color: "#fb923c" })] }), (0, jsx_runtime_1.jsx)(react_native_1.View, { style: styles.section, children: (0, jsx_runtime_1.jsx)(ProgressCard_1.ProgressCard, { title: "Schedule Consistency", value: `${viewModel?.weeklyConsistencyPercent ?? 0}%`, progress: (viewModel?.weeklyConsistencyPercent ?? 0) / 100, type: "linear", activeColor: "#818cf8", subLabel: "Target schedule alignment" }) }), (0, jsx_runtime_1.jsx)(react_native_1.View, { style: styles.section, children: (0, jsx_runtime_1.jsx)(ProgressCard_1.ProgressCard, { title: "Goal Completion", value: `${viewModel?.goalProgressPercent ?? 0}%`, progress: (viewModel?.goalProgressPercent ?? 0) / 100, type: "linear", activeColor: "#10b981", subLabel: "Sleep goal parameters satisfied" }) }), (0, jsx_runtime_1.jsxs)(react_native_1.View, { style: styles.navRow, children: [(0, jsx_runtime_1.jsxs)(react_native_1.TouchableOpacity, { style: styles.navBtn, onPress: handleHistoryPress, accessible: true, accessibilityRole: "button", accessibilityLabel: "View Sleep History Logs", accessibilityHint: "Opens your past sleep entries", hitSlop: { top: 4, bottom: 4, left: 4, right: 4 }, children: [(0, jsx_runtime_1.jsx)(react_native_1.Text, { style: styles.navBtnIcon, children: "\uD83D\uDCCA" }), (0, jsx_runtime_1.jsx)(react_native_1.Text, { style: styles.navBtnText, children: "History Logs" })] }), (0, jsx_runtime_1.jsxs)(react_native_1.TouchableOpacity, { style: styles.navBtn, onPress: handleSchedulePress, accessible: true, accessibilityRole: "button", accessibilityLabel: "Configure Sleep Schedule", accessibilityHint: "Opens your bedtime and wake time settings", hitSlop: { top: 4, bottom: 4, left: 4, right: 4 }, children: [(0, jsx_runtime_1.jsx)(react_native_1.Text, { style: styles.navBtnIcon, children: "\uD83D\uDCC5" }), (0, jsx_runtime_1.jsx)(react_native_1.Text, { style: styles.navBtnText, children: "Schedule Settings" })] })] }), (0, jsx_runtime_1.jsxs)(react_native_1.View, { style: styles.navRow, children: [(0, jsx_runtime_1.jsxs)(react_native_1.TouchableOpacity, { style: styles.navBtn, onPress: handleGoalsPress, accessible: true, accessibilityRole: "button", accessibilityLabel: "Manage Sleep Goals", accessibilityHint: "Opens your sleep goal targets", hitSlop: { top: 4, bottom: 4, left: 4, right: 4 }, children: [(0, jsx_runtime_1.jsx)(react_native_1.Text, { style: styles.navBtnIcon, children: "\uD83C\uDFAF" }), (0, jsx_runtime_1.jsx)(react_native_1.Text, { style: styles.navBtnText, children: "Sleep Goals" })] }), (0, jsx_runtime_1.jsxs)(react_native_1.TouchableOpacity, { style: styles.navBtn, onPress: handleInsightsPress, accessible: true, accessibilityRole: "button", accessibilityLabel: "View Sleep Insights and Trends", accessibilityHint: "Opens charts and analytics for your sleep", hitSlop: { top: 4, bottom: 4, left: 4, right: 4 }, children: [(0, jsx_runtime_1.jsx)(react_native_1.Text, { style: styles.navBtnIcon, children: "\uD83D\uDCA1" }), (0, jsx_runtime_1.jsx)(react_native_1.Text, { style: styles.navBtnText, children: "Insights & Trends" })] })] })] }));
};
exports.SleepDashboardScreen = SleepDashboardScreen;
const styles = react_native_1.StyleSheet.create({
    quickLogBtn: {
        backgroundColor: '#6366f1',
        paddingHorizontal: 14,
        paddingVertical: 8,
        borderRadius: 10,
    },
    quickLogBtnText: {
        color: '#ffffff',
        fontSize: 12,
        fontWeight: 'bold',
    },
    recoverySection: {
        marginVertical: 4,
    },
    metricGrid: {
        flexDirection: 'row',
        gap: 16,
    },
    section: {
        gap: 12,
    },
    navRow: {
        flexDirection: 'row',
        gap: 16,
    },
    navBtn: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#18181b',
        borderWidth: 1,
        borderColor: '#27272a',
        padding: 16,
        borderRadius: 16,
        gap: 12,
    },
    navBtnIcon: {
        fontSize: 20,
    },
    navBtnText: {
        color: '#fafafa',
        fontSize: 14,
        fontWeight: 'bold',
    },
});
