"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.FormLayout = void 0;
const jsx_runtime_1 = require("react/jsx-runtime");
const react_native_1 = require("react-native");
const react_native_safe_area_context_1 = require("react-native-safe-area-context");
const expo_router_1 = require("expo-router");
const InlineLoader_1 = require("@/shared/components/loading/InlineLoader");
const FormLayout = ({ title, isSubmitting = false, isValid = true, onSubmit, submitLabel = 'Save', children, }) => {
    const router = (0, expo_router_1.useRouter)();
    return ((0, jsx_runtime_1.jsx)(react_native_safe_area_context_1.SafeAreaView, { style: styles.container, edges: ['top', 'left', 'right', 'bottom'], children: (0, jsx_runtime_1.jsxs)(react_native_1.KeyboardAvoidingView, { behavior: react_native_1.Platform.OS === 'ios' ? 'padding' : undefined, style: styles.keyboardAvoid, children: [(0, jsx_runtime_1.jsxs)(react_native_1.View, { style: styles.header, children: [(0, jsx_runtime_1.jsx)(react_native_1.TouchableOpacity, { onPress: () => router.back(), disabled: isSubmitting, accessible: true, accessibilityRole: "button", accessibilityLabel: "Cancel", hitSlop: { top: 12, bottom: 12, left: 12, right: 12 }, style: styles.cancelButton, children: (0, jsx_runtime_1.jsx)(react_native_1.Text, { style: styles.cancelText, children: "Cancel" }) }), (0, jsx_runtime_1.jsx)(react_native_1.Text, { style: styles.title, numberOfLines: 1, children: title }), (0, jsx_runtime_1.jsx)(react_native_1.View, { style: styles.placeholder })] }), (0, jsx_runtime_1.jsx)(react_native_1.ScrollView, { style: styles.scroll, contentContainerStyle: styles.scrollContent, keyboardShouldPersistTaps: "handled", showsVerticalScrollIndicator: false, children: children }), (0, jsx_runtime_1.jsx)(react_native_1.View, { style: styles.footer, children: (0, jsx_runtime_1.jsx)(react_native_1.TouchableOpacity, { activeOpacity: 0.8, onPress: onSubmit, disabled: isSubmitting || !isValid, accessible: true, accessibilityRole: "button", accessibilityLabel: submitLabel, style: [
                            styles.submitButton,
                            (!isValid || isSubmitting) && styles.submitButtonDisabled,
                        ], children: isSubmitting ? ((0, jsx_runtime_1.jsx)(InlineLoader_1.InlineLoader, { color: "#09090b" })) : ((0, jsx_runtime_1.jsx)(react_native_1.Text, { style: styles.submitText, children: submitLabel })) }) })] }) }));
};
exports.FormLayout = FormLayout;
const styles = react_native_1.StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#09090b',
    },
    keyboardAvoid: {
        flex: 1,
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 16,
        paddingTop: 12,
        paddingBottom: 12,
        borderBottomWidth: 1,
        borderBottomColor: '#18181b',
    },
    cancelButton: {
        paddingVertical: 6,
        paddingHorizontal: 12,
    },
    cancelText: {
        color: '#a1a1aa',
        fontSize: 14,
        fontWeight: '600',
    },
    title: {
        flex: 1,
        textAlign: 'center',
        fontSize: 16,
        fontWeight: 'bold',
        color: '#fafafa',
    },
    placeholder: {
        width: 60, // approximate balanced offset for cancel button text width
    },
    scroll: {
        flex: 1,
    },
    scrollContent: {
        paddingHorizontal: 20,
        paddingTop: 24,
        paddingBottom: 40,
        gap: 24,
    },
    footer: {
        paddingHorizontal: 20,
        paddingVertical: 16,
        borderTopWidth: 1,
        borderTopColor: '#18181b',
        backgroundColor: '#09090b',
    },
    submitButton: {
        height: 50,
        backgroundColor: '#6366f1', // indigo-500
        borderRadius: 14,
        alignItems: 'center',
        justifyContent: 'center',
    },
    submitButtonDisabled: {
        backgroundColor: '#27272a', // zinc-800
        opacity: 0.6,
    },
    submitText: {
        color: '#ffffff',
        fontSize: 15,
        fontWeight: 'bold',
    },
});
