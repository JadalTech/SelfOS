"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.FeatureHeader = void 0;
const jsx_runtime_1 = require("react/jsx-runtime");
const react_1 = __importDefault(require("react"));
const react_native_1 = require("react-native");
const expo_router_1 = require("expo-router");
exports.FeatureHeader = react_1.default.memo(function FeatureHeader({ title, subtitle, showBackButton = true, actionIcon, onAction, actionLabel, }) {
    const router = (0, expo_router_1.useRouter)();
    return ((0, jsx_runtime_1.jsxs)(react_native_1.View, { className: "flex-row items-center justify-between pb-3.5 border-b border-zinc-800/80 mb-2", children: [(0, jsx_runtime_1.jsxs)(react_native_1.View, { className: "flex-row items-center gap-3 flex-1", children: [showBackButton ? ((0, jsx_runtime_1.jsx)(react_native_1.TouchableOpacity, { onPress: () => router.back(), accessible: true, accessibilityRole: "button", accessibilityLabel: "Go back", hitSlop: { top: 12, bottom: 12, left: 12, right: 12 }, className: "w-9 h-9 rounded-xl bg-zinc-900 border border-zinc-800 items-center justify-center", children: (0, jsx_runtime_1.jsx)(react_native_1.Text, { className: "text-zinc-300 text-sm font-bold", children: "\u2190" }) })) : null, (0, jsx_runtime_1.jsxs)(react_native_1.View, { className: "flex-1 pr-1", children: [(0, jsx_runtime_1.jsx)(react_native_1.Text, { className: "text-zinc-50 text-xl font-extrabold tracking-tight leading-tight", children: title }), subtitle ? ((0, jsx_runtime_1.jsx)(react_native_1.Text, { className: "text-zinc-400 text-xs font-medium mt-0.5", children: subtitle })) : null] })] }), onAction && (actionIcon || actionLabel) ? ((0, jsx_runtime_1.jsxs)(react_native_1.TouchableOpacity, { onPress: onAction, accessible: true, accessibilityRole: "button", accessibilityLabel: actionLabel || 'Action', hitSlop: { top: 10, bottom: 10, left: 12, right: 12 }, className: "h-9 px-3 rounded-xl bg-zinc-900 border border-zinc-800 items-center justify-center flex-row gap-1.5", children: [actionIcon ? (0, jsx_runtime_1.jsx)(react_native_1.Text, { className: "text-sm", children: actionIcon }) : null, actionLabel ? ((0, jsx_runtime_1.jsx)(react_native_1.Text, { className: "text-zinc-200 text-xs font-bold", children: actionLabel })) : null] })) : null] }));
});
