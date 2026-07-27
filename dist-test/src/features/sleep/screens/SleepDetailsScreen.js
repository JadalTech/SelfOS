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
exports.SleepDetailsScreen = void 0;
const jsx_runtime_1 = require("react/jsx-runtime");
const react_1 = require("react");
const react_native_1 = require("react-native");
const expo_router_1 = require("expo-router");
const useSleepEntries_1 = require("../hooks/useSleepEntries");
const useSleepSchedule_1 = require("../hooks/useSleepSchedule");
const DetailLayout_1 = require("../components/layouts/DetailLayout");
const sleep_mapper_1 = require("../mappers/sleep.mapper");
const SleepEngine = __importStar(require("../engine/sleepEngine"));
const MetricCard_1 = require("@/shared/components/cards/MetricCard");
const ProgressCard_1 = require("@/shared/components/cards/ProgressCard");
const SleepDetailsScreen = ({ entryId }) => {
    const router = (0, expo_router_1.useRouter)();
    // Load hooks
    const { entries, isLoading: isEntriesLoading, deleteEntry, isDeleting } = (0, useSleepEntries_1.useSleepEntries)();
    const { activeSchedule, isLoading: isScheduleLoading } = (0, useSleepSchedule_1.useSleepSchedule)();
    const isLoading = isEntriesLoading || isScheduleLoading;
    // Resolve target entry & compute custom VM
    const entry = (0, react_1.useMemo)(() => {
        return entries.find((e) => e.id === entryId) || null;
    }, [entries, entryId]);
    const viewModel = (0, react_1.useMemo)(() => {
        if (!entry)
            return null;
        return (0, sleep_mapper_1.mapToSleepEntryVM)(entry);
    }, [entry]);
    // Determine schedule deviations
    const deviations = (0, react_1.useMemo)(() => {
        if (!entry || !activeSchedule)
            return null;
        const { targetBedtime, targetWakeTime } = SleepEngine.getTargetBedtimeAndWakeTime(entry.date, activeSchedule);
        const actualBedtimeStr = SleepEngine.getTimeStringFromDate(entry.bedtime);
        const actualWakeTimeStr = SleepEngine.getTimeStringFromDate(entry.wakeTime);
        const bedDiff = SleepEngine.calculateTimeDifferenceMinutes(actualBedtimeStr, targetBedtime);
        const wakeDiff = SleepEngine.calculateTimeDifferenceMinutes(actualWakeTimeStr, targetWakeTime);
        const formatDeviation = (diff) => {
            if (diff === 0)
                return 'On Time';
            if (diff > 0)
                return `${diff}m deviation`;
            return `${Math.abs(diff)}m early`;
        };
        return {
            bedtimeDeviation: formatDeviation(bedDiff),
            wakeTimeDeviation: formatDeviation(wakeDiff),
            targetBedtime,
            targetWakeTime,
        };
    }, [entry, activeSchedule]);
    // Edit / Delete actions
    const handleEditPress = (0, react_1.useCallback)(() => {
        router.push(`/sleep/log?id=${entryId}`);
    }, [router, entryId]);
    const handleDeletePress = (0, react_1.useCallback)(() => {
        react_native_1.Alert.alert('Delete Sleep Entry', 'Are you sure you want to remove this sleep log? This action cannot be undone.', [
            { text: 'Cancel', style: 'cancel' },
            {
                text: 'Delete',
                style: 'destructive',
                onPress: async () => {
                    try {
                        await deleteEntry(entryId);
                        router.back();
                    }
                    catch {
                        react_native_1.Alert.alert('Error', 'Failed to delete sleep entry.');
                    }
                },
            },
        ]);
    }, [deleteEntry, entryId, router]);
    if (!isLoading && !viewModel) {
        return ((0, jsx_runtime_1.jsx)(DetailLayout_1.DetailLayout, { title: "Sleep Details", isLoading: false, children: (0, jsx_runtime_1.jsx)(react_native_1.View, { style: styles.errorContainer, children: (0, jsx_runtime_1.jsx)(react_native_1.Text, { style: styles.errorText, children: "Sleep log entry not found." }) }) }));
    }
    // Calculate local recovery mapping
    const recoveryScore = viewModel?.recoveryScore ?? 0;
    let statusColor = '#fbbf24';
    let statusLabel = 'Fair';
    if (recoveryScore >= 90) {
        statusColor = '#10b981';
        statusLabel = 'Optimal';
    }
    else if (recoveryScore >= 70) {
        statusColor = '#34d399';
        statusLabel = 'Good';
    }
    else if (recoveryScore < 50) {
        statusColor = '#f87171';
        statusLabel = 'Poor';
    }
    return ((0, jsx_runtime_1.jsxs)(DetailLayout_1.DetailLayout, { title: viewModel?.formattedDate ?? 'Sleep Details', isLoading: isLoading || isDeleting, headerRight: (0, jsx_runtime_1.jsx)(react_native_1.TouchableOpacity, { onPress: handleEditPress, accessible: true, accessibilityRole: "button", accessibilityLabel: "Edit Sleep Entry", hitSlop: { top: 8, bottom: 8, left: 12, right: 12 }, children: (0, jsx_runtime_1.jsx)(react_native_1.Text, { style: styles.editText, children: "Edit" }) }), children: [recoveryScore > 0 && ((0, jsx_runtime_1.jsx)(ProgressCard_1.ProgressCard, { title: "Recovery Rating", value: `${recoveryScore}%`, progress: recoveryScore / 100, type: "circular", activeColor: statusColor, subLabel: `${statusLabel} Biological Recovery` })), (0, jsx_runtime_1.jsxs)(react_native_1.View, { style: styles.section, children: [(0, jsx_runtime_1.jsx)(react_native_1.Text, { style: styles.sectionTitle, children: "Sleep Times" }), (0, jsx_runtime_1.jsxs)(react_native_1.View, { style: styles.grid, children: [(0, jsx_runtime_1.jsx)(MetricCard_1.MetricCard, { label: "Bedtime", value: viewModel?.bedtimeFormatted ?? 'N/A', subLabel: deviations ? `Target: ${deviations.targetBedtime} (${deviations.bedtimeDeviation})` : 'No target', icon: "\uD83C\uDF19", color: "#818cf8" }), (0, jsx_runtime_1.jsx)(MetricCard_1.MetricCard, { label: "Wake-up Time", value: viewModel?.wakeTimeFormatted ?? 'N/A', subLabel: deviations ? `Target: ${deviations.targetWakeTime} (${deviations.wakeTimeDeviation})` : 'No target', icon: "\u2600\uFE0F", color: "#fbbf24" })] })] }), (0, jsx_runtime_1.jsxs)(react_native_1.View, { style: styles.section, children: [(0, jsx_runtime_1.jsx)(react_native_1.Text, { style: styles.sectionTitle, children: "Sleep Stats" }), (0, jsx_runtime_1.jsxs)(react_native_1.View, { style: styles.grid, children: [(0, jsx_runtime_1.jsx)(MetricCard_1.MetricCard, { label: "Total Duration", value: viewModel?.durationLabel ?? '0h 0m', subLabel: "Time in bed", icon: "\u23F3", color: "#818cf8" }), (0, jsx_runtime_1.jsx)(MetricCard_1.MetricCard, { label: "Efficiency", value: viewModel?.sleepEfficiencyLabel ?? 'N/A', subLabel: viewModel?.awakeDurationLabel ? `${viewModel.awakeDurationLabel} awake` : 'No awake stats', icon: "\uD83D\uDCC8", color: "#34d399" })] }), (0, jsx_runtime_1.jsxs)(react_native_1.View, { style: styles.grid, children: [(0, jsx_runtime_1.jsx)(MetricCard_1.MetricCard, { label: "Sleep Latency", value: viewModel?.sleepLatencyLabel ?? 'N/A', subLabel: "Time to fall asleep", icon: "\u23F1\uFE0F", color: "#a78bfa" }), (0, jsx_runtime_1.jsx)(MetricCard_1.MetricCard, { label: "Source", value: viewModel?.sleepSource.toUpperCase() ?? 'MANUAL', subLabel: viewModel?.timezone ? `Timezone: ${viewModel.timezone}` : 'Local Time', icon: "\uD83D\uDCF1", color: "#a1a1aa" })] })] }), viewModel?.notes && ((0, jsx_runtime_1.jsxs)(react_native_1.View, { style: styles.section, children: [(0, jsx_runtime_1.jsx)(react_native_1.Text, { style: styles.sectionTitle, children: "Sleep Journal / Notes" }), (0, jsx_runtime_1.jsx)(react_native_1.View, { style: styles.notesContainer, children: (0, jsx_runtime_1.jsx)(react_native_1.Text, { style: styles.notesText, children: viewModel.notes }) })] })), viewModel?.tags && viewModel.tags.length > 0 && ((0, jsx_runtime_1.jsxs)(react_native_1.View, { style: styles.section, children: [(0, jsx_runtime_1.jsx)(react_native_1.Text, { style: styles.sectionTitle, children: "Tags" }), (0, jsx_runtime_1.jsx)(react_native_1.View, { style: styles.tagGrid, children: viewModel.tags.map((tag) => ((0, jsx_runtime_1.jsx)(react_native_1.View, { style: styles.tagChip, children: (0, jsx_runtime_1.jsxs)(react_native_1.Text, { style: styles.tagText, children: ["#", tag] }) }, tag))) })] })), (0, jsx_runtime_1.jsx)(react_native_1.TouchableOpacity, { style: styles.deleteBtn, onPress: handleDeletePress, accessible: true, accessibilityRole: "button", accessibilityLabel: "Delete Sleep Entry", accessibilityHint: "Permanently removes this sleep log", hitSlop: { top: 8, bottom: 8, left: 8, right: 8 }, children: (0, jsx_runtime_1.jsx)(react_native_1.Text, { style: styles.deleteBtnText, children: "Delete Sleep Entry" }) })] }));
};
exports.SleepDetailsScreen = SleepDetailsScreen;
const styles = react_native_1.StyleSheet.create({
    editText: {
        color: '#6366f1',
        fontSize: 14,
        fontWeight: 'bold',
    },
    errorContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        paddingVertical: 60,
    },
    errorText: {
        color: '#ef4444',
        fontSize: 14,
        fontWeight: 'bold',
    },
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
    notesContainer: {
        backgroundColor: '#18181b',
        borderWidth: 1,
        borderColor: '#27272a',
        padding: 16,
        borderRadius: 16,
    },
    notesText: {
        color: '#f4f4f5',
        fontSize: 13,
        lineHeight: 20,
        fontWeight: '500',
    },
    tagGrid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 8,
    },
    tagChip: {
        backgroundColor: '#312e81',
        borderWidth: 1,
        borderColor: '#4338ca',
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 10,
    },
    tagText: {
        color: '#c7d2fe',
        fontSize: 11,
        fontWeight: '700',
    },
    deleteBtn: {
        marginTop: 12,
        height: 50,
        backgroundColor: 'rgba(244, 63, 94, 0.1)',
        borderWidth: 1,
        borderColor: 'rgba(244, 63, 94, 0.3)',
        borderRadius: 14,
        alignItems: 'center',
        justifyContent: 'center',
    },
    deleteBtnText: {
        color: '#f43f5e',
        fontSize: 14,
        fontWeight: 'bold',
    },
});
