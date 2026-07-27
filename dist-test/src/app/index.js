"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = WelcomeScreen;
const jsx_runtime_1 = require("react/jsx-runtime");
const react_1 = require("react");
const react_native_1 = require("react-native");
const react_native_safe_area_context_1 = require("react-native-safe-area-context");
const expo_router_1 = require("expo-router");
const stores_1 = require("@/shared/stores");
const components_1 = require("@/shared/components");
function WelcomeScreen() {
    const router = (0, expo_router_1.useRouter)();
    const status = (0, stores_1.useAuthStore)((state) => state.status);
    const isInitialized = (0, stores_1.useAuthStore)((state) => state.isInitialized);
    (0, react_1.useEffect)(() => {
        if (isInitialized && status === 'authenticated') {
            router.replace('/(app)');
        }
    }, [status, isInitialized, router]);
    if (!isInitialized || status === 'unknown') {
        return (0, jsx_runtime_1.jsx)(components_1.FullScreenLoader, { message: "Initializing SelfOS..." });
    }
    return ((0, jsx_runtime_1.jsxs)(react_native_safe_area_context_1.SafeAreaView, { className: "flex-1 bg-zinc-950 justify-between p-6", children: [(0, jsx_runtime_1.jsx)(react_native_1.StatusBar, { barStyle: "light-content" }), (0, jsx_runtime_1.jsx)(react_native_1.View, { className: "items-end", children: (0, jsx_runtime_1.jsx)(react_native_1.Text, { className: "text-zinc-500 text-xs font-medium tracking-widest uppercase", children: "v1.0.0" }) }), (0, jsx_runtime_1.jsxs)(react_native_1.View, { className: "flex-1 justify-center items-center px-4", children: [(0, jsx_runtime_1.jsx)(react_native_1.View, { className: "absolute w-72 h-72 bg-indigo-500/10 rounded-full blur-3xl" }), (0, jsx_runtime_1.jsxs)(react_native_1.Text, { className: "text-zinc-50 text-5xl font-extrabold tracking-tight mb-2", children: ["Self", (0, jsx_runtime_1.jsx)(react_native_1.Text, { className: "text-indigo-400", children: "OS" })] }), (0, jsx_runtime_1.jsx)(react_native_1.Text, { className: "text-zinc-400 text-base text-center max-w-[280px] leading-relaxed", children: "The intelligent operating system for your personal growth." })] }), (0, jsx_runtime_1.jsxs)(react_native_1.View, { className: "gap-4", children: [(0, jsx_runtime_1.jsxs)(react_native_1.View, { className: "bg-zinc-900 border border-zinc-800 rounded-xl p-4 items-center", children: [(0, jsx_runtime_1.jsx)(react_native_1.Text, { className: "text-zinc-300 text-sm font-semibold mb-1", children: "NativeWind Integration Active" }), (0, jsx_runtime_1.jsx)(react_native_1.Text, { className: "text-zinc-500 text-xs text-center", children: "Styles rendered using utility-first classes successfully." })] }), (0, jsx_runtime_1.jsx)(react_native_1.TouchableOpacity, { className: "bg-indigo-600 active:bg-indigo-700 py-4 rounded-xl items-center shadow-lg shadow-indigo-600/20", onPress: () => router.push('/(auth)/login'), children: (0, jsx_runtime_1.jsx)(react_native_1.Text, { className: "text-zinc-50 font-semibold text-base", children: "Get Started" }) })] })] }));
}
