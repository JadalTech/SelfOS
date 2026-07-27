"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SleepHistoryScreen = void 0;
const jsx_runtime_1 = require("react/jsx-runtime");
const react_1 = require("react");
const react_native_1 = require("react-native");
const expo_router_1 = require("expo-router");
const useSleepEntries_1 = require("../hooks/useSleepEntries");
const DetailLayout_1 = require("../components/layouts/DetailLayout");
const sleep_mapper_1 = require("../mappers/sleep.mapper");
const SummaryCard_1 = require("@/shared/components/cards/SummaryCard");
const EmptyStateCard_1 = require("@/shared/components/feedback/EmptyStateCard");
const SleepHistoryScreen = () => {
    const router = (0, expo_router_1.useRouter)();
    const { entries, isLoading, isError, error, refetch } = (0, useSleepEntries_1.useSleepEntries)();
    const [activeFilter, setActiveFilter] = (0, react_1.useState)('all');
    const filteredEntries = (0, react_1.useMemo)(() => {
        const mapped = entries.map(sleep_mapper_1.mapToSleepEntryVM);
        if (activeFilter === 'all')
            return mapped;
        return mapped.filter((e) => e.sleepSource === activeFilter);
    }, [entries, activeFilter]);
    const handleEntryPress = (0, react_1.useCallback)((id) => {
        router.push(`/sleep/${id}`);
    }, [router]);
    const handleLogPress = (0, react_1.useCallback)(() => {
        router.push('/sleep/log');
    }, [router]);
    const renderItem = (0, react_1.useCallback)(({ item }) => {
        const metrics = [
            { label: 'Duration', value: item.durationLabel, color: '#818cf8' },
            { label: 'Quality', value: `${item.qualityRating}/10`, color: '#a78bfa' },
            {
                label: 'Recovery',
                value: item.recoveryLabel ?? 'N/A',
                progress: item.recoveryScore ? item.recoveryScore / 100 : undefined,
                color: item.statusColor,
            },
        ];
        const footerText = `${item.bedtimeFormatted} - ${item.wakeTimeFormatted} • ${item.sleepSource.toUpperCase()}${item.notes ? ` • "${item.notes.substring(0, 40)}${item.notes.length > 40 ? '...' : ''}"` : ''}`;
        return ((0, jsx_runtime_1.jsx)(react_native_1.TouchableOpacity, { onPress: () => handleEntryPress(item.id), activeOpacity: 0.8, accessible: true, accessibilityRole: "button", accessibilityLabel: `Sleep log for ${item.formattedDate}. Duration: ${item.durationLabel}. Tap to view details.`, style: styles.cardWrapper, children: (0, jsx_runtime_1.jsx)(SummaryCard_1.SummaryCard, { title: item.formattedDate, metrics: metrics, footerText: footerText }) }));
    }, [handleEntryPress]);
    return ((0, jsx_runtime_1.jsxs)(DetailLayout_1.DetailLayout, { title: "Sleep History", isLoading: isLoading, error: isError ? error : null, onRetry: refetch, headerRight: (0, jsx_runtime_1.jsx)(react_native_1.TouchableOpacity, { onPress: handleLogPress, accessible: true, accessibilityRole: "button", accessibilityLabel: "Add New Sleep Entry", hitSlop: { top: 8, bottom: 8, left: 12, right: 12 }, children: (0, jsx_runtime_1.jsx)(react_native_1.Text, { style: styles.addText, children: "+ Log" }) }), children: [(0, jsx_runtime_1.jsx)(react_native_1.View, { style: styles.filterBar, accessible: true, accessibilityRole: "tablist", children: ['all', 'manual', 'wearable', 'imported'].map((filter) => ((0, jsx_runtime_1.jsx)(react_native_1.TouchableOpacity, { style: [styles.filterChip, activeFilter === filter && styles.activeChip], onPress: () => setActiveFilter(filter), accessible: true, accessibilityRole: "tab", accessibilityState: { selected: activeFilter === filter }, hitSlop: { top: 8, bottom: 8, left: 8, right: 8 }, children: (0, jsx_runtime_1.jsx)(react_native_1.Text, { style: [styles.chipText, activeFilter === filter && styles.activeChipText], children: filter.toUpperCase() }) }, filter))) }), filteredEntries.length === 0 ? ((0, jsx_runtime_1.jsx)(react_native_1.View, { style: styles.emptyContainer, children: (0, jsx_runtime_1.jsx)(EmptyStateCard_1.EmptyStateCard, { icon: "\uD83D\uDCC5", title: "No Sleep Logs", description: activeFilter === 'all'
                        ? "You haven't recorded any sleep entries yet."
                        : `No sleep entries logged via ${activeFilter} source.`, actionLabel: activeFilter === 'all' ? 'Log First Night' : undefined, onAction: activeFilter === 'all' ? handleLogPress : undefined, accentColor: "#6366f1" }) })) : ((0, jsx_runtime_1.jsx)(react_native_1.FlatList, { data: filteredEntries, keyExtractor: (item) => item.id, renderItem: renderItem, contentContainerStyle: styles.listContent, initialNumToRender: 10, maxToRenderPerBatch: 10, windowSize: 5, scrollEnabled: false }))] }));
};
exports.SleepHistoryScreen = SleepHistoryScreen;
const styles = react_native_1.StyleSheet.create({
    addText: {
        color: '#6366f1',
        fontSize: 14,
        fontWeight: 'bold',
    },
    filterBar: {
        flexDirection: 'row',
        backgroundColor: '#18181b',
        borderRadius: 12,
        padding: 4,
        gap: 4,
    },
    filterChip: {
        flex: 1,
        paddingVertical: 8,
        borderRadius: 8,
        alignItems: 'center',
        justifyContent: 'center',
    },
    activeChip: {
        backgroundColor: '#27272a',
    },
    chipText: {
        color: '#a1a1aa',
        fontSize: 10,
        fontWeight: '700',
        letterSpacing: 0.5,
    },
    activeChipText: {
        color: '#fafafa',
    },
    emptyContainer: {
        paddingVertical: 40,
    },
    listContent: {
        gap: 16,
    },
    cardWrapper: {
        marginBottom: 4,
    },
});
