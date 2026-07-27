"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.StatTile = void 0;
const jsx_runtime_1 = require("react/jsx-runtime");
const react_1 = __importDefault(require("react"));
const react_native_1 = require("react-native");
exports.StatTile = react_1.default.memo(function StatTile({ label, value, icon, trend, badgeColor = '#ec4899', onPress, }) {
    const content = ((0, jsx_runtime_1.jsxs)(react_native_1.View, { className: "bg-zinc-900 border border-zinc-800 p-3.5 rounded-2xl flex-1 min-w-[130px] justify-between shadow-sm", children: [(0, jsx_runtime_1.jsxs)(react_native_1.View, { className: "flex-row items-center justify-between mb-1", children: [(0, jsx_runtime_1.jsx)(react_native_1.Text, { className: "text-zinc-400 text-xs font-medium", children: label }), icon ? (0, jsx_runtime_1.jsx)(react_native_1.Text, { className: "text-base", children: icon }) : null] }), (0, jsx_runtime_1.jsxs)(react_native_1.View, { className: "flex-row items-baseline justify-between mt-1", children: [(0, jsx_runtime_1.jsx)(react_native_1.Text, { className: "text-zinc-50 text-xl font-bold", children: value }), trend ? ((0, jsx_runtime_1.jsx)(react_native_1.Text, { className: "text-xs font-semibold", style: { color: badgeColor }, children: trend })) : null] })] }));
    if (onPress) {
        return ((0, jsx_runtime_1.jsx)(react_native_1.TouchableOpacity, { activeOpacity: 0.8, onPress: onPress, className: "flex-1", accessible: true, accessibilityRole: "button", accessibilityLabel: `${label}: ${value}`, accessibilityHint: `Tap to open ${label} details`, hitSlop: { top: 8, bottom: 8, left: 8, right: 8 }, children: content }));
    }
    return ((0, jsx_runtime_1.jsx)(react_native_1.View, { accessible: true, accessibilityRole: "text", accessibilityLabel: `${label}: ${value}`, className: "flex-1", children: content }));
});
