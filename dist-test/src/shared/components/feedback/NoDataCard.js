"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.NoDataCard = void 0;
const jsx_runtime_1 = require("react/jsx-runtime");
const react_1 = __importDefault(require("react"));
const react_native_1 = require("react-native");
exports.NoDataCard = react_1.default.memo(function NoDataCard({ title, description, icon = '📂', actionLabel, onAction, color = '#ec4899', }) {
    return ((0, jsx_runtime_1.jsxs)(react_native_1.View, { className: "bg-zinc-900 border border-zinc-800 p-5 rounded-2xl items-center text-center gap-3", accessible: true, accessibilityRole: "summary", accessibilityLabel: `${title}. ${description}`, children: [(0, jsx_runtime_1.jsx)(react_native_1.Text, { className: "text-3xl", children: icon }), (0, jsx_runtime_1.jsxs)(react_native_1.View, { className: "items-center gap-0.5", children: [(0, jsx_runtime_1.jsx)(react_native_1.Text, { className: "text-zinc-50 text-sm font-bold text-center", children: title }), (0, jsx_runtime_1.jsx)(react_native_1.Text, { className: "text-zinc-400 text-xs text-center max-w-[240px] leading-relaxed", children: description })] }), actionLabel && onAction ? ((0, jsx_runtime_1.jsx)(react_native_1.TouchableOpacity, { activeOpacity: 0.8, onPress: onAction, accessible: true, accessibilityRole: "button", accessibilityLabel: actionLabel, accessibilityHint: `Tap to ${actionLabel.toLowerCase()}`, hitSlop: { top: 8, bottom: 8, left: 12, right: 12 }, className: "mt-1 px-3.5 py-1.5 rounded-xl border", style: { backgroundColor: `${color}15`, borderColor: `${color}30` }, children: (0, jsx_runtime_1.jsx)(react_native_1.Text, { className: "text-xs font-bold", style: { color }, children: actionLabel }) })) : null] }));
});
