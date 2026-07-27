"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ErrorStateCard = void 0;
const jsx_runtime_1 = require("react/jsx-runtime");
const react_1 = __importDefault(require("react"));
const react_native_1 = require("react-native");
exports.ErrorStateCard = react_1.default.memo(function ErrorStateCard({ title = 'Something went wrong', message = 'Failed to load content. Please try again.', onRetry, }) {
    return ((0, jsx_runtime_1.jsxs)(react_native_1.View, { className: "bg-rose-500/10 border border-rose-500/30 p-5 rounded-2xl items-center text-center gap-2.5", accessible: true, accessibilityRole: "alert", accessibilityLabel: `${title}. ${message}`, children: [(0, jsx_runtime_1.jsx)(react_native_1.View, { className: "w-10 h-10 rounded-xl bg-rose-500/20 items-center justify-center", children: (0, jsx_runtime_1.jsx)(react_native_1.Text, { className: "text-rose-400 text-lg font-bold", children: "\u26A0\uFE0F" }) }), (0, jsx_runtime_1.jsxs)(react_native_1.View, { className: "items-center gap-0.5", children: [(0, jsx_runtime_1.jsx)(react_native_1.Text, { className: "text-rose-200 text-sm font-bold", children: title }), (0, jsx_runtime_1.jsx)(react_native_1.Text, { className: "text-rose-300/80 text-xs text-center", children: message })] }), onRetry ? ((0, jsx_runtime_1.jsx)(react_native_1.TouchableOpacity, { activeOpacity: 0.8, onPress: onRetry, accessible: true, accessibilityRole: "button", accessibilityLabel: "Retry loading data", accessibilityHint: "Tap to retry the failed network operation", hitSlop: { top: 8, bottom: 8, left: 12, right: 12 }, className: "mt-1 bg-rose-500/20 border border-rose-500/40 px-3.5 py-1.5 rounded-xl", children: (0, jsx_runtime_1.jsx)(react_native_1.Text, { className: "text-rose-300 text-xs font-bold", children: "Try Again" }) })) : null] }));
});
