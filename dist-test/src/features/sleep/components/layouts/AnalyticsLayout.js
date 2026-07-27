"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AnalyticsLayout = void 0;
const jsx_runtime_1 = require("react/jsx-runtime");
const react_native_1 = require("react-native");
const react_native_safe_area_context_1 = require("react-native-safe-area-context");
const FullScreenLoader_1 = require("@/shared/components/loading/FullScreenLoader");
const ErrorStateCard_1 = require("@/shared/components/feedback/ErrorStateCard");
const AnalyticsLayout = ({ title, activeTab, onTabChange, isLoading = false, error = null, onRetry, children, }) => {
    if (isLoading) {
        return (0, jsx_runtime_1.jsx)(FullScreenLoader_1.FullScreenLoader, {});
    }
    return ((0, jsx_runtime_1.jsxs)(react_native_safe_area_context_1.SafeAreaView, { style: styles.container, edges: ['top', 'left', 'right'], children: [(0, jsx_runtime_1.jsxs)(react_native_1.View, { style: styles.header, children: [(0, jsx_runtime_1.jsx)(react_native_1.Text, { style: styles.title, children: title }), (0, jsx_runtime_1.jsxs)(react_native_1.View, { style: styles.tabContainer, accessible: true, accessibilityRole: "tablist", children: [(0, jsx_runtime_1.jsx)(react_native_1.TouchableOpacity, { style: [styles.tab, activeTab === 'weekly' && styles.activeTab], onPress: () => onTabChange('weekly'), accessible: true, accessibilityRole: "tab", accessibilityState: { selected: activeTab === 'weekly' }, accessibilityLabel: "Weekly analytics view", hitSlop: { top: 8, bottom: 8, left: 12, right: 12 }, children: (0, jsx_runtime_1.jsx)(react_native_1.Text, { style: [styles.tabText, activeTab === 'weekly' && styles.activeTabText], children: "Weekly" }) }), (0, jsx_runtime_1.jsx)(react_native_1.TouchableOpacity, { style: [styles.tab, activeTab === 'monthly' && styles.activeTab], onPress: () => onTabChange('monthly'), accessible: true, accessibilityRole: "tab", accessibilityState: { selected: activeTab === 'monthly' }, accessibilityLabel: "Monthly analytics view", hitSlop: { top: 8, bottom: 8, left: 12, right: 12 }, children: (0, jsx_runtime_1.jsx)(react_native_1.Text, { style: [styles.tabText, activeTab === 'monthly' && styles.activeTabText], children: "Monthly" }) })] })] }), error ? ((0, jsx_runtime_1.jsx)(react_native_1.View, { style: styles.errorContainer, children: (0, jsx_runtime_1.jsx)(ErrorStateCard_1.ErrorStateCard, { title: "Failed to Load Trends", message: error.message || 'Something went wrong while compiling analytics trends.', onRetry: onRetry }) })) : ((0, jsx_runtime_1.jsx)(react_native_1.ScrollView, { style: styles.scroll, contentContainerStyle: styles.scrollContent, showsVerticalScrollIndicator: false, children: children }))] }));
};
exports.AnalyticsLayout = AnalyticsLayout;
const styles = react_native_1.StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#09090b',
    },
    header: {
        paddingHorizontal: 20,
        paddingTop: 16,
        paddingBottom: 16,
        gap: 16,
        borderBottomWidth: 1,
        borderBottomColor: '#18181b',
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#fafafa',
        letterSpacing: -0.5,
    },
    tabContainer: {
        flexDirection: 'row',
        backgroundColor: '#18181b', // zinc-800
        borderRadius: 10,
        padding: 3,
    },
    tab: {
        flex: 1,
        paddingVertical: 8,
        borderRadius: 8,
        alignItems: 'center',
        justifyContent: 'center',
    },
    activeTab: {
        backgroundColor: '#27272a', // zinc-700
    },
    tabText: {
        color: '#a1a1aa',
        fontSize: 13,
        fontWeight: '600',
    },
    activeTabText: {
        color: '#fafafa',
    },
    errorContainer: {
        flex: 1,
        justifyContent: 'center',
        padding: 24,
    },
    scroll: {
        flex: 1,
    },
    scrollContent: {
        paddingHorizontal: 20,
        paddingTop: 20,
        paddingBottom: 40,
        gap: 20,
    },
});
