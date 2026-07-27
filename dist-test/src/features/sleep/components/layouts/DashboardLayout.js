"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DashboardLayout = void 0;
const jsx_runtime_1 = require("react/jsx-runtime");
const react_native_1 = require("react-native");
const react_native_safe_area_context_1 = require("react-native-safe-area-context");
const FullScreenLoader_1 = require("@/shared/components/loading/FullScreenLoader");
const ErrorStateCard_1 = require("@/shared/components/feedback/ErrorStateCard");
const DashboardLayout = ({ title, subtitle, isLoading = false, error = null, onRetry, headerRight, children, }) => {
    if (isLoading) {
        return (0, jsx_runtime_1.jsx)(FullScreenLoader_1.FullScreenLoader, {});
    }
    return ((0, jsx_runtime_1.jsxs)(react_native_safe_area_context_1.SafeAreaView, { style: styles.container, edges: ['top', 'left', 'right'], children: [(0, jsx_runtime_1.jsxs)(react_native_1.View, { style: styles.header, children: [(0, jsx_runtime_1.jsxs)(react_native_1.View, { style: styles.headerTitleContainer, children: [(0, jsx_runtime_1.jsx)(react_native_1.Text, { style: styles.title, children: title }), subtitle ? (0, jsx_runtime_1.jsx)(react_native_1.Text, { style: styles.subtitle, children: subtitle }) : null] }), headerRight ? (0, jsx_runtime_1.jsx)(react_native_1.View, { style: styles.headerRight, children: headerRight }) : null] }), error ? ((0, jsx_runtime_1.jsx)(react_native_1.View, { style: styles.errorContainer, children: (0, jsx_runtime_1.jsx)(ErrorStateCard_1.ErrorStateCard, { title: "Failed to Load Dashboard", message: error.message || 'Something went wrong while retrieving your sleep data.', onRetry: onRetry }) })) : ((0, jsx_runtime_1.jsx)(react_native_1.ScrollView, { style: styles.scroll, contentContainerStyle: styles.scrollContent, showsVerticalScrollIndicator: false, children: children }))] }));
};
exports.DashboardLayout = DashboardLayout;
const styles = react_native_1.StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#09090b', // zinc-950
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 20,
        paddingTop: 16,
        paddingBottom: 12,
    },
    headerTitleContainer: {
        flex: 1,
        gap: 2,
    },
    title: {
        fontSize: 28,
        fontWeight: 'bold',
        color: '#fafafa', // zinc-50
        letterSpacing: -0.5,
    },
    subtitle: {
        fontSize: 13,
        color: '#a1a1aa', // zinc-400
        fontWeight: '500',
    },
    headerRight: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
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
        paddingBottom: 36,
        gap: 24,
    },
});
