"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ErrorDashboard = void 0;
const jsx_runtime_1 = require("react/jsx-runtime");
const react_1 = __importDefault(require("react"));
const react_native_1 = require("react-native");
exports.ErrorDashboard = react_1.default.memo(function ErrorDashboard({ errorMessage = 'Unable to load dashboard metrics.', onRetry }) {
    return ((0, jsx_runtime_1.jsxs)(react_native_1.View, { className: "flex-1 items-center justify-center p-6 gap-4", children: [(0, jsx_runtime_1.jsx)(react_native_1.View, { className: "w-16 h-16 rounded-2xl bg-rose-500/10 border border-rose-500/20 items-center justify-center", children: (0, jsx_runtime_1.jsx)(react_native_1.Text, { className: "text-3xl", children: "\u26A0\uFE0F" }) }), (0, jsx_runtime_1.jsxs)(react_native_1.View, { className: "items-center gap-1", children: [(0, jsx_runtime_1.jsx)(react_native_1.Text, { className: "text-zinc-100 text-lg font-bold text-center", children: "Dashboard Sync Error" }), (0, jsx_runtime_1.jsx)(react_native_1.Text, { className: "text-zinc-400 text-xs text-center leading-relaxed max-w-xs", children: errorMessage })] }), (0, jsx_runtime_1.jsx)(react_native_1.TouchableOpacity, { className: "px-6 py-3 bg-zinc-900 border border-zinc-800 rounded-xl active:bg-zinc-800", onPress: onRetry, accessibilityRole: "button", accessibilityLabel: "Retry loading dashboard", children: (0, jsx_runtime_1.jsx)(react_native_1.Text, { className: "text-zinc-200 font-bold text-xs", children: "Retry Connection" }) })] }));
});
