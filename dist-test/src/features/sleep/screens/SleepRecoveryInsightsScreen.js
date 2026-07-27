"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SleepRecoveryInsightsScreen = void 0;
const jsx_runtime_1 = require("react/jsx-runtime");
const react_1 = require("react");
const react_native_1 = require("react-native");
const useSleepAnalytics_1 = require("../hooks/useSleepAnalytics");
const useSleepEntries_1 = require("../hooks/useSleepEntries");
const AnalyticsLayout_1 = require("../components/layouts/AnalyticsLayout");
const LineTrendChart_1 = require("@/shared/components/charts/LineTrendChart");
const MetricCard_1 = require("@/shared/components/cards/MetricCard");
const SleepRecoveryInsightsScreen = () => {
    const [activeTab, setActiveTab] = (0, react_1.useState)('weekly');
    const { getWeeklySummary, getMonthlySummary, isLoading: isAnalyticsLoading, isError: isAnalyticsError, error: analyticsError, refetch: refetchAnalytics } = (0, useSleepAnalytics_1.useSleepAnalytics)();
    const { entries, isLoading: isEntriesLoading, isError: isEntriesError, error: entriesError, refetch: refetchEntries } = (0, useSleepEntries_1.useSleepEntries)();
    const isLoading = isAnalyticsLoading || isEntriesLoading;
    const isError = isAnalyticsError || isEntriesError;
    const error = analyticsError || entriesError;
    const handleRefetch = (0, react_1.useCallback)(async () => {
        await Promise.all([refetchAnalytics(), refetchEntries()]);
    }, [refetchAnalytics, refetchEntries]);
    // Get date strings for weekly summary
    const range = (0, react_1.useMemo)(() => {
        const end = new Date();
        const start = new Date();
        start.setDate(end.getDate() - 6);
        const format = (d) => d.toISOString().split('T')[0];
        return { start: format(start), end: format(end) };
    }, []);
    // Retrieve summaries
    const weeklySummary = (0, react_1.useMemo)(() => {
        return getWeeklySummary(range.start, range.end);
    }, [getWeeklySummary, range]);
    const monthlySummary = (0, react_1.useMemo)(() => {
        const today = new Date();
        return getMonthlySummary(today.getFullYear(), today.getMonth() + 1);
    }, [getMonthlySummary]);
    // Construct charts data
    const { durationPoints, qualityPoints, recoveryPoints } = (0, react_1.useMemo)(() => {
        // Sort entries chronologically for charts
        const sorted = [...entries].sort((a, b) => a.date.localeCompare(b.date));
        const limit = activeTab === 'weekly' ? 7 : 30;
        const recent = sorted.slice(-limit);
        const durationPoints = recent.map((e) => ({
            label: e.date.substring(5), // MM-DD format
            value: Math.round((e.durationMinutes / 60) * 10) / 10, // convert to hours
        }));
        const qualityPoints = recent.map((e) => ({
            label: e.date.substring(5),
            value: e.quality.rating,
        }));
        const recoveryPoints = recent
            .filter((e) => e.recoveryScore !== undefined)
            .map((e) => ({
            label: e.date.substring(5),
            value: e.recoveryScore,
        }));
        return { durationPoints, qualityPoints, recoveryPoints };
    }, [entries, activeTab]);
    // Compute roll-up averages for dashboard tiles
    const stats = (0, react_1.useMemo)(() => {
        if (activeTab === 'weekly' && weeklySummary) {
            return {
                avgDuration: `${(weeklySummary.averageDurationMinutes / 60).toFixed(1)} hrs`,
                avgQuality: `${weeklySummary.averageQualityScore.toFixed(1)}/10`,
                avgRecovery: weeklySummary.averageRecoveryScore > 0 ? `${weeklySummary.averageRecoveryScore}%` : 'N/A',
                consistency: `${weeklySummary.consistencyScore}%`,
            };
        }
        if (activeTab === 'monthly' && monthlySummary) {
            return {
                avgDuration: `${(monthlySummary.averageDurationMinutes / 60).toFixed(1)} hrs`,
                avgQuality: `${monthlySummary.averageQualityScore.toFixed(1)}/10`,
                avgRecovery: monthlySummary.averageRecoveryScore > 0 ? `${monthlySummary.averageRecoveryScore}%` : 'N/A',
                consistency: `${monthlySummary.consistencyScore}%`,
            };
        }
        return {
            avgDuration: '0.0 hrs',
            avgQuality: '0.0/10',
            avgRecovery: 'N/A',
            consistency: '0%',
        };
    }, [weeklySummary, monthlySummary, activeTab]);
    return ((0, jsx_runtime_1.jsxs)(AnalyticsLayout_1.AnalyticsLayout, { title: "Sleep Insights", activeTab: activeTab, onTabChange: setActiveTab, isLoading: isLoading, error: isError ? error : null, onRetry: handleRefetch, children: [(0, jsx_runtime_1.jsxs)(react_native_1.View, { style: styles.section, children: [(0, jsx_runtime_1.jsxs)(react_native_1.Text, { style: styles.sectionTitle, children: ["Rolling Averages (", activeTab, ")"] }), (0, jsx_runtime_1.jsxs)(react_native_1.View, { style: styles.grid, children: [(0, jsx_runtime_1.jsx)(MetricCard_1.MetricCard, { label: "Avg Duration", value: stats.avgDuration, subLabel: "Sleep time", icon: "\u23F3", color: "#818cf8" }), (0, jsx_runtime_1.jsx)(MetricCard_1.MetricCard, { label: "Avg Quality", value: stats.avgQuality, subLabel: "Perceived rating", icon: "\u2728", color: "#a78bfa" })] }), (0, jsx_runtime_1.jsxs)(react_native_1.View, { style: styles.grid, children: [(0, jsx_runtime_1.jsx)(MetricCard_1.MetricCard, { label: "Avg Recovery", value: stats.avgRecovery, subLabel: "Biological charge", icon: "\uD83D\uDD0B", color: "#10b981" }), (0, jsx_runtime_1.jsx)(MetricCard_1.MetricCard, { label: "Consistency", value: stats.consistency, subLabel: "Schedule deviation", icon: "\uD83D\uDD04", color: "#fb923c" })] })] }), (0, jsx_runtime_1.jsx)(react_native_1.View, { style: styles.chartContainer, children: (0, jsx_runtime_1.jsx)(LineTrendChart_1.LineTrendChart, { title: "Sleep Duration (hours)", data: durationPoints, color: "#6366f1", unit: "h", height: 140 }) }), (0, jsx_runtime_1.jsx)(react_native_1.View, { style: styles.chartContainer, children: (0, jsx_runtime_1.jsx)(LineTrendChart_1.LineTrendChart, { title: "Perceived Sleep Quality", data: qualityPoints, color: "#a78bfa", unit: "", height: 140 }) }), recoveryPoints.length > 0 && ((0, jsx_runtime_1.jsx)(react_native_1.View, { style: styles.chartContainer, children: (0, jsx_runtime_1.jsx)(LineTrendChart_1.LineTrendChart, { title: "Recovery Score (%)", data: recoveryPoints, color: "#10b981", unit: "%", height: 140 }) }))] }));
};
exports.SleepRecoveryInsightsScreen = SleepRecoveryInsightsScreen;
const styles = react_native_1.StyleSheet.create({
    section: {
        gap: 12,
    },
    sectionTitle: {
        fontSize: 12,
        fontWeight: 'bold',
        color: '#a1a1aa',
        textTransform: 'uppercase',
        letterSpacing: 0.5,
    },
    grid: {
        flexDirection: 'row',
        gap: 16,
    },
    chartContainer: {
        marginTop: 4,
    },
});
