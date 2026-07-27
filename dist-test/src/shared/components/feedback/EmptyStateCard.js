"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.EmptyStateCard = void 0;
const jsx_runtime_1 = require("react/jsx-runtime");
const react_1 = __importDefault(require("react"));
const react_native_1 = require("react-native");
exports.EmptyStateCard = react_1.default.memo(function EmptyStateCard({ icon = '📋', title, description, actionLabel, onAction, accentColor = '#ec4899', }) {
    return ((0, jsx_runtime_1.jsxs)(react_native_1.View, { className: "bg-zinc-900 border border-zinc-800/80 p-6 rounded-2xl items-center text-center gap-3", accessible: true, accessibilityRole: "summary", accessibilityLabel: `${title}. ${description}`, children: [(0, jsx_runtime_1.jsx)(react_native_1.View, { className: "w-14 h-14 rounded-2xl items-center justify-center border", style: { backgroundColor: `${accentColor}15`, borderColor: `${accentColor}30` }, children: (0, jsx_runtime_1.jsx)(react_native_1.Text, { className: "text-2xl", children: icon }) }), (0, jsx_runtime_1.jsxs)(react_native_1.View, { className: "items-center gap-1", children: [(0, jsx_runtime_1.jsx)(react_native_1.Text, { className: "text-zinc-100 text-base font-bold text-center", children: title }), (0, jsx_runtime_1.jsx)(react_native_1.Text, { className: "text-zinc-400 text-xs text-center max-w-[260px] leading-relaxed", children: description })] }), actionLabel && onAction ? ((0, jsx_runtime_1.jsx)(react_native_1.TouchableOpacity, { activeOpacity: 0.8, onPress: onAction, accessible: true, accessibilityRole: "button", accessibilityLabel: actionLabel, accessibilityHint: `Tap to ${actionLabel.toLowerCase()}`, hitSlop: { top: 8, bottom: 8, left: 12, right: 12 }, className: "mt-2 px-4 py-2.5 rounded-xl font-semibold text-xs border", style: { backgroundColor: `${accentColor}20`, borderColor: `${accentColor}40` }, children: (0, jsx_runtime_1.jsx)(react_native_1.Text, { className: "text-xs font-bold", style: { color: accentColor }, children: actionLabel }) })) : null] }));
});
