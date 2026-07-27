"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = AppGroupLayout;
const jsx_runtime_1 = require("react/jsx-runtime");
const expo_router_1 = require("expo-router");
const useRequireAuth_1 = require("@/features/auth/hooks/useRequireAuth");
const components_1 = require("@/shared/components");
function AppGroupLayout() {
    const { status, isLoading } = (0, useRequireAuth_1.useRequireAuth)();
    // Block rendering protected screens until authorized
    if (isLoading || status !== 'authenticated') {
        return (0, jsx_runtime_1.jsx)(components_1.FullScreenLoader, { message: "Checking authorization..." });
    }
    return ((0, jsx_runtime_1.jsx)(expo_router_1.Stack, { screenOptions: {
            headerShown: false,
            contentStyle: { backgroundColor: '#09090b' },
        } }));
}
