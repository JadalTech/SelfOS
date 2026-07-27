"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.RetryCard = void 0;
const jsx_runtime_1 = require("react/jsx-runtime");
const react_1 = __importDefault(require("react"));
const react_native_1 = require("react-native");
exports.RetryCard = react_1.default.memo(function RetryCard({ title = 'Connection Issue', message = 'Unable to refresh metrics. Please verify your connection and try again.', onRetry, color = '#ec4899', }) {
    return ((0, jsx_runtime_1.jsxs)(react_native_1.View, { className: "bg-zinc-900 border border-zinc-800 p-5 rounded-2xl items-center text-center gap-3.5", accessible: true, accessibilityRole: "alert", accessibilityLabel: `${title}. ${message}`, children: [(0, jsx_runtime_1.jsx)(react_native_1.View, { className: "w-10 h-10 rounded-xl bg-zinc-950 items-center justify-center border border-zinc-800", children: (0, jsx_runtime_1.jsx)(react_native_1.Text, { className: "text-zinc-400 text-lg font-bold", children: "\uD83D\uDD01" }) }), (0, jsx_runtime_1.jsxs)(react_native_1.View, { className: "items-center gap-0.5", children: [(0, jsx_runtime_1.jsx)(react_native_1.Text, { className: "text-zinc-50 text-sm font-bold", children: title }), (0, jsx_runtime_1.jsx)(react_native_1.Text, { className: "text-zinc-400 text-xs text-center max-w-[240px] leading-relaxed", children: message })] }), (0, jsx_runtime_1.jsx)(react_native_1.TouchableOpacity, { activeOpacity: 0.8, onPress: onRetry, accessible: true, accessibilityRole: "button", accessibilityLabel: "Retry loading data", accessibilityHint: "Tap to retry the failed network operation", hitSlop: { top: 10, bottom: 10, left: 14, right: 14 }, className: "mt-1 px-4 py-2 rounded-xl border", style: { backgroundColor: `${color}15`, borderColor: `${color}40` }, children: (0, jsx_runtime_1.jsx)(react_native_1.Text, { className: "text-xs font-bold", style: { color }, children: "Try Again" }) })] }));
});
