"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Providers = Providers;
const jsx_runtime_1 = require("react/jsx-runtime");
const react_native_gesture_handler_1 = require("react-native-gesture-handler");
const react_native_safe_area_context_1 = require("react-native-safe-area-context");
const react_query_1 = require("@tanstack/react-query");
const query_1 = require("@/shared/query");
function Providers({ children }) {
    return ((0, jsx_runtime_1.jsx)(react_native_gesture_handler_1.GestureHandlerRootView, { style: { flex: 1 }, children: (0, jsx_runtime_1.jsx)(react_native_safe_area_context_1.SafeAreaProvider, { children: (0, jsx_runtime_1.jsx)(react_query_1.QueryClientProvider, { client: query_1.queryClient, children: children }) }) }));
}
