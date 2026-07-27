"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = RootLayout;
const jsx_runtime_1 = require("react/jsx-runtime");
const expo_router_1 = require("expo-router");
const providers_1 = require("@/shared/providers");
const errors_1 = require("@/shared/errors");
const useAuthState_1 = require("@/features/auth/hooks/useAuthState");
require("../../global.css");
function RootLayout() {
    // Mount the singleton Auth State Listener once at the root level
    (0, useAuthState_1.useAuthState)();
    return ((0, jsx_runtime_1.jsx)(providers_1.Providers, { children: (0, jsx_runtime_1.jsx)(errors_1.ErrorBoundary, { children: (0, jsx_runtime_1.jsx)(expo_router_1.Stack, { screenOptions: {
                    headerShown: false,
                    contentStyle: { backgroundColor: "#09090b" },
                } }) }) }));
}
