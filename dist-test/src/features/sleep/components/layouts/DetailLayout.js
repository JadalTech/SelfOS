"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DetailLayout = void 0;
const jsx_runtime_1 = require("react/jsx-runtime");
const react_native_1 = require("react-native");
const react_native_safe_area_context_1 = require("react-native-safe-area-context");
const expo_router_1 = require("expo-router");
const FullScreenLoader_1 = require("@/shared/components/loading/FullScreenLoader");
const ErrorStateCard_1 = require("@/shared/components/feedback/ErrorStateCard");
const DetailLayout = ({ title, isLoading = false, error = null, onRetry, headerRight, children, }) => {
    const router = (0, expo_router_1.useRouter)();
    if (isLoading) {
        return (0, jsx_runtime_1.jsx)(FullScreenLoader_1.FullScreenLoader, {});
    }
    return ((0, jsx_runtime_1.jsxs)(react_native_safe_area_context_1.SafeAreaView, { style: styles.container, edges: ['top', 'left', 'right'], children: [(0, jsx_runtime_1.jsxs)(react_native_1.View, { style: styles.header, children: [(0, jsx_runtime_1.jsx)(react_native_1.TouchableOpacity, { onPress: () => router.back(), accessible: true, accessibilityRole: "button", accessibilityLabel: "Back", accessibilityHint: "Goes back to previous screen", hitSlop: { top: 12, bottom: 12, left: 12, right: 12 }, style: styles.backButton, children: (0, jsx_runtime_1.jsx)(react_native_1.Text, { style: styles.backText, children: "\u2190" }) }), (0, jsx_runtime_1.jsx)(react_native_1.Text, { style: styles.title, numberOfLines: 1, children: title }), (0, jsx_runtime_1.jsx)(react_native_1.View, { style: styles.headerRight, children: headerRight || (0, jsx_runtime_1.jsx)(react_native_1.View, { style: { width: 32 } }) })] }), error ? ((0, jsx_runtime_1.jsx)(react_native_1.View, { style: styles.errorContainer, children: (0, jsx_runtime_1.jsx)(ErrorStateCard_1.ErrorStateCard, { title: "Failed to Load Details", message: error.message || 'The sleep entry could not be retrieved.', onRetry: onRetry }) })) : ((0, jsx_runtime_1.jsx)(react_native_1.ScrollView, { style: styles.scroll, contentContainerStyle: styles.scrollContent, showsVerticalScrollIndicator: false, children: children }))] }));
};
exports.DetailLayout = DetailLayout;
const styles = react_native_1.StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#09090b',
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 16,
        paddingTop: 12,
        paddingBottom: 12,
        borderBottomWidth: 1,
        borderBottomColor: '#18181b', // zinc-800
    },
    backButton: {
        width: 36,
        height: 36,
        borderRadius: 18,
        backgroundColor: '#18181b',
        alignItems: 'center',
        justifyContent: 'center',
    },
    backText: {
        color: '#f4f4f5',
        fontSize: 20,
        fontWeight: 'bold',
    },
    title: {
        flex: 1,
        textAlign: 'center',
        fontSize: 18,
        fontWeight: 'bold',
        color: '#fafafa',
        marginHorizontal: 8,
    },
    headerRight: {
        minWidth: 36,
        alignItems: 'flex-end',
        justifyContent: 'center',
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
